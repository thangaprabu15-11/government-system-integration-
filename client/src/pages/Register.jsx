import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Building2, Lock, Mail, User, ArrowRight, Globe, Check } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { t, language, changeLanguage, openLanguageModal, checkAndPromptPreLogin } = useLanguage();
  const navigate = useNavigate();

  // Prompt modal before user creates account
  useEffect(() => {
    checkAndPromptPreLogin();
  }, []);

  const fillNewCitizenDemo = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setName('Priya Sharma');
    setEmail(`priya.sharma${randomNum}@civicbridge.ai`);
    setPassword('Priya@123');
    setRole('citizen');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await register(name, email, password, role);
      if (res && res.user && res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.response?.data?.message || err.message || (language === 'mr' ? 'नोंदणी अयशस्वी झाली.' : 'Registration failed.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden p-8 space-y-5">
        
        {/* Step 0: Language Selector Prompt Before Creating Account */}
        <div className="bg-gradient-to-r from-gov-50 via-slate-50 to-amber-50 p-3.5 rounded-xl border border-gov-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <Globe className="w-4 h-4 text-gov-700" />
              <span className="text-xs font-bold text-slate-800">
                {language === 'mr' ? 'पसंतीची भाषा निवडा:' : 'Select Preferred Language:'}
              </span>
            </div>
            <button
              type="button"
              onClick={openLanguageModal}
              className="text-[11px] text-gov-700 hover:text-gov-800 font-bold underline"
            >
              {language === 'mr' ? 'पॉपअप उघडा' : 'Open Modal'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => changeLanguage('en')}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                language === 'en'
                  ? 'bg-gov-700 text-white shadow-sm ring-1 ring-gov-700'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>🇬🇧 English</span>
              {language === 'en' && <Check className="w-3 h-3 stroke-[3]" />}
            </button>

            <button
              type="button"
              onClick={() => changeLanguage('mr')}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                language === 'mr'
                  ? 'bg-gov-700 text-white shadow-sm ring-1 ring-gov-700'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>🇮🇳 मराठी</span>
              {language === 'mr' && <Check className="w-3 h-3 stroke-[3]" />}
            </button>
          </div>
        </div>

        <div className="text-center space-y-2 pt-1">
          <div className="w-12 h-12 rounded-xl bg-gov-700 text-white flex items-center justify-center mx-auto font-bold shadow-sm">
            <Building2 className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('registerCitizenTitle', 'Create Citizen Account')}
          </h2>
          <p className="text-xs text-slate-500">
            {t('registerCitizenSub', 'Access Unified Digital Government Services')}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-600 p-3.5 rounded-lg text-xs text-rose-800 space-y-1.5">
            <div className="font-semibold">{error}</div>
            {error.includes('already exists') && (
              <div className="pt-1">
                <Link to="/login" className="inline-flex items-center text-gov-700 font-bold hover:underline">
                  <span>{language === 'mr' ? 'या ईमेलने थेट प्रवेश करा (लॉग इन)' : 'Sign in with this email instead'}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Quick Demo Citizen Test Button */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
          <div className="text-[11px] text-slate-600 font-medium">
            {language === 'mr' ? 'चाचणीसाठी नवीन नागरिक माहिती:' : 'Quick registration test:'}
          </div>
          <button
            type="button"
            onClick={fillNewCitizenDemo}
            className="py-1 px-2.5 bg-white hover:bg-gov-50 border border-slate-300 hover:border-gov-400 rounded-md text-[11px] font-bold text-gov-700 transition-colors shadow-2xs"
          >
            {language === 'mr' ? 'एका क्लिकवर माहिती भरा' : '⚡ Auto-Fill New Citizen'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('fullName', 'Full Name')}
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Thanga Prabu N"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-gov-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('emailAddress', 'Email Address')}
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-gov-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('password', 'Password')}
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-gov-600 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('userRole', 'User Role')}
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-gov-600 focus:bg-white focus:outline-none"
            >
              <option value="citizen">{t('standardCitizen', 'Citizen (Standard User)')}</option>
              <option value="admin">{t('adminOfficial', 'Administrator (Government Official)')}</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gov-700 hover:bg-gov-800 text-white rounded-lg text-sm font-bold flex items-center justify-center space-x-2 transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? <span>{t('creatingAccount', 'Creating Account...')}</span> : (
              <>
                <span>{t('createAccount', 'Register Account')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-1">
          {t('alreadyRegistered', 'Already registered?')}{' '}
          <Link to="/login" className="text-gov-700 font-bold hover:underline">
            {t('signInHere', 'Sign in here')}
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
