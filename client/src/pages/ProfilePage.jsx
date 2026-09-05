import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import API from '../services/api';
import { 
  User, Mail, Phone, MapPin, GraduationCap, DollarSign, 
  Users, Award, CheckCircle2, Save, Sparkles, Building
} from 'lucide-react';
import FirebaseService from '../services/firebaseDb';

const ProfilePage = () => {
  const { profile, checkLoggedInUser } = useAuth();
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || 'Thanga Prabu N',
    email: profile?.email || 'demo@civicbridge.ai',
    phone: profile?.mobile || profile?.phone || '+91 98765 43210',
    aadhaarNumber: profile?.aadhaarMasked || 'XXXX XXXX 7142',
    address: profile?.address || 'Thanthondrimalai, Karur',
    district: profile?.district || 'Karur',
    state: profile?.state || 'Tamil Nadu',
    collegeName: profile?.collegeName || profile?.currentInstitute || 'VSB Engineering College',
    annualIncome: profile?.annualFamilyIncome || profile?.annualIncome || 180000,
    communityCategory: profile?.community || 'BC',
    firstGenerationGraduate: profile?.firstGenerationGraduate ?? true,
    hscRollNumber: profile?.hscRollNumber || 'HSC-2025-98765',
    hscMarks: profile?.hscMarks || 537,
    cutoffMark: profile?.cutoffMark || 185.0,
    diplomaHolder: profile?.diplomaHolder ?? false
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await API.put('/profile', formData);
      if (res.data.success) {
        // Also persist to Firebase Firestore Database (brototype-79697)
        FirebaseService.syncProfile(profile?.userId || 'user_citizen_001', formData)
          .catch(e => console.warn('Firebase async profile sync:', e));

        setMessage(language === 'mr' ? 'प्रोफाईल यशस्वीरीत्या अद्ययावत केले गेले!' : 'Profile updated successfully!');
        await checkLoggedInUser();
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setMessage(language === 'mr' ? 'प्रोफाईल अद्ययावत करण्यात अडचण आली.' : 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const initials = (formData.fullName || 'TP')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      
      {/* Profile Header & Completion Indicator */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gov-700 text-white font-bold text-xl flex items-center justify-center shadow-md">
              {initials}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{formData.fullName}</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                  {language === 'mr' ? 'पडताळलेली ओळख' : 'Verified Identity'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {language === 'mr' ? 'आधार क्रमांक (गुप्त):' : 'Aadhaar (Masked):'} {formData.aadhaarNumber}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl min-w-[200px] text-xs space-y-1">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-600">{language === 'mr' ? 'नागरिक प्रोफाईल पूर्णता:' : 'Profile Completion:'}</span>
              <span className="text-gov-700 font-bold">{profile?.completionPercentage || 88}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gov-700 h-full rounded-full transition-all"
                style={{ width: `${profile?.completionPercentage || 88}%` }}
              ></div>
            </div>
          </div>
        </div>

        {message && (
          <div className="bg-emerald-50 border-l-4 border-emerald-600 p-3 rounded text-xs text-emerald-800 font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Personal & Identity */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <User className="w-4 h-4 text-gov-600" />
              <span>{language === 'mr' ? 'वैयक्तिक व संपर्क तपशील' : 'Personal & Contact Data'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{language === 'mr' ? 'पूर्ण नाव' : 'Full Name'}</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{language === 'mr' ? 'ईमेल' : 'Email'}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{language === 'mr' ? 'मोबाईल क्रमांक' : 'Phone'}</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{language === 'mr' ? 'आधार क्रमांक (गुप्त)' : 'Aadhaar (Masked)'}</label>
                <input
                  type="text"
                  name="aadhaarNumber"
                  disabled
                  value={formData.aadhaarNumber}
                  className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-lg text-slate-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Education & Academic Metrics */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>{language === 'mr' ? 'शैक्षणिक आणि कट-ऑफ तपशील' : 'Educational & Cut-off Details'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{language === 'mr' ? 'बारावी (HSC) बैठक क्रमांक' : 'HSC Roll Number'}</label>
                <input
                  type="text"
                  name="hscRollNumber"
                  value={formData.hscRollNumber}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{language === 'mr' ? 'बारावी एकूण गुण (६०० पैकी)' : 'HSC Total Marks (out of 600)'}</label>
                <input
                  type="number"
                  name="hscMarks"
                  value={formData.hscMarks}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{language === 'mr' ? 'कट-ऑफ गुण (TNEA)' : 'TNEA Cut-off Mark'}</label>
                <input
                  type="number"
                  step="0.1"
                  name="cutoffMark"
                  value={formData.cutoffMark}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-gov-700 font-bold"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 pt-2 text-xs">
              <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-800">
                <input
                  type="checkbox"
                  name="firstGenerationGraduate"
                  checked={formData.firstGenerationGraduate}
                  onChange={handleChange}
                  className="w-4 h-4 text-gov-600 rounded border-slate-300 focus:ring-gov-600"
                />
                <span>{language === 'mr' ? 'कुटुंबातील प्रथम पदवीधर उमेदवार' : 'First Generation Graduate Candidate in Family'}</span>
              </label>
            </div>
          </div>

          {/* Section 3: Revenue & Income Verification */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>{language === 'mr' ? 'उत्पन्न व सामाजिक प्रवर्ग तपशील' : 'Income & Community Status'}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{language === 'mr' ? 'वार्षिक कौटुंबिक उत्पन्न (₹)' : 'Annual Family Income (₹)'}</label>
                <input
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{language === 'mr' ? 'सामाजिक प्रवर्ग' : 'Community Category'}</label>
                <select
                  name="communityCategory"
                  value={formData.communityCategory}
                  onChange={handleChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="OC">{language === 'mr' ? 'खुला प्रवर्ग (Open Category)' : 'OC (Open Category)'}</option>
                  <option value="BC">{language === 'mr' ? 'मागास प्रवर्ग (Backward Class)' : 'BC (Backward Class)'}</option>
                  <option value="MBC">{language === 'mr' ? 'विशेष मागास प्रवर्ग (MBC)' : 'MBC (Most Backward Class)'}</option>
                  <option value="SC">{language === 'mr' ? 'अनुसूचित जाती (SC)' : 'SC (Scheduled Caste)'}</option>
                  <option value="ST">{language === 'mr' ? 'अनुसूचित जमाती (ST)' : 'ST (Scheduled Tribe)'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gov-700 hover:bg-gov-800 text-white rounded-xl font-bold text-xs flex items-center space-x-2 shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>
                {saving 
                  ? (language === 'mr' ? 'प्रोफाईल जतन होत आहे...' : 'Saving Profile...') 
                  : (language === 'mr' ? 'बदल जतन करा' : 'Save Profile Updates')}
              </span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default ProfilePage;
