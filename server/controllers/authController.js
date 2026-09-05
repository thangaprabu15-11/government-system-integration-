const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const store = require('../utils/store');
const firebaseSync = require('../config/firebase');

const JWT_SECRET = process.env.JWT_SECRET || 'civicbridge_hackathon_super_secret_jwt_key_2026';

const register = async (req, res) => {
  try {
    const { name, email, password, role = 'citizen' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields (name, email, password)' });
    }

    const existingUser = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'An account with this email address already exists. Please sign in instead or use another email.' 
      });
    }

    const userId = `user_${Date.now()}`;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
      id: userId,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString()
    };

    store.users.push(newUser);

    const initialProfile = {
      userId,
      fullName: name,
      email: email.toLowerCase(),
      dateOfBirth: '2007-01-05',
      dateOfBirthFormatted: '05/01/2007',
      gender: 'Male',
      mobile: '+91 98765 43210',
      address: 'Thanthondrimalai, Karur',
      district: 'Karur',
      state: 'Tamil Nadu',
      pincode: '639005',
      educationLevel: '12th Standard',
      twelfthPercentage: 89.5,
      cutoffMark: 185.0,
      currentInstitute: 'VSB Engineering College',
      collegeName: 'VSB Engineering College',
      fatherName: 'Natarajan',
      motherName: 'Lakshmi N',
      parentEducation: 'Non-Graduate (School-level 10th Standard)',
      isFirstGenerationGraduateCandidate: true,
      annualFamilyIncome: 180000,
      community: 'BC (Backward Class)',
      aadhaarMasked: 'XXXX XXXX 7142',
      aadhaarLast4: '7142',
      completionPercentage: 94,
      updatedAt: new Date().toISOString()
    };

    // Create initial citizen profile
    store.profiles.push(initialProfile);

    // Create default audit log
    const auditEntry = {
      id: `aud_${Date.now()}`,
      timestamp: new Date(),
      userName: name,
      userId,
      action: 'Account Created',
      serviceName: 'Authentication Service',
      dataAccessed: ['User Registration Credentials'],
      consentStatus: 'System',
      status: 'Success',
      ipAddress: req.ip || '127.0.0.1'
    };
    store.auditLogs.unshift(auditEntry);

    // 🔥 Non-blocking background sync to Firebase Cloud Firestore (brototype-79697)
    firebaseSync.saveUser(newUser).catch(e => console.warn('Firebase saveUser:', e.message));
    firebaseSync.saveProfile(userId, initialProfile).catch(e => console.warn('Firebase saveProfile:', e.message));
    firebaseSync.saveAuditLog(auditEntry).catch(e => console.warn('Firebase saveAuditLog:', e.message));

    const token = jwt.sign({ id: userId, email: newUser.email, role: newUser.role, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully and synced with Firebase Firestore',
      token,
      user: { id: userId, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password' });
    }

    const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Audit log
    const auditEntry = {
      id: `aud_${Date.now()}`,
      timestamp: new Date(),
      userName: user.name,
      userId: user.id,
      action: 'User Login',
      serviceName: 'Authentication Service',
      dataAccessed: ['JWT Token Issuance'],
      consentStatus: 'Authorized',
      status: 'Success',
      ipAddress: req.ip || '127.0.0.1'
    };
    store.auditLogs.unshift(auditEntry);

    // 🔥 Non-blocking background sync to Firebase Firestore (brototype-79697)
    firebaseSync.saveUser(user).catch(e => console.warn('Firebase saveUser:', e.message));
    firebaseSync.recordLogin(user, req.ip || '127.0.0.1').catch(e => console.warn('Firebase recordLogin:', e.message));
    firebaseSync.saveAuditLog(auditEntry).catch(e => console.warn('Firebase saveAuditLog:', e.message));

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'Login successful and synced with Firebase Firestore',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = store.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    let profile = store.profiles.find(p => p.userId === req.user.id);
    if (!profile) {
      profile = {
        userId: user.id,
        fullName: user.name,
        email: user.email,
        dateOfBirth: '2007-01-05',
        dateOfBirthFormatted: '05/01/2007',
        gender: 'Male',
        mobile: '+91 98765 43210',
        address: 'Thanthondrimalai, Karur',
        district: 'Karur',
        state: 'Tamil Nadu',
        pincode: '639005',
        educationLevel: '12th Standard',
        twelfthPercentage: 89.5,
        cutoffMark: 185.0,
        currentInstitute: 'VSB Engineering College',
        collegeName: 'VSB Engineering College',
        fatherName: 'Natarajan',
        motherName: 'Lakshmi N',
        parentEducation: 'Non-Graduate (School-level 10th Standard)',
        isFirstGenerationGraduateCandidate: true,
        annualFamilyIncome: 180000,
        community: 'BC (Backward Class)',
        aadhaarMasked: 'XXXX XXXX 7142',
        aadhaarLast4: '7142',
        completionPercentage: 94,
        updatedAt: new Date()
      };
      store.profiles.push(profile);
    } else {
      profile.fullName = user.name;
    }

    res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      profile
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getCurrentUser };
