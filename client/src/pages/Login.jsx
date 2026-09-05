import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Building2, Lock, Mail, ArrowRight, ShieldCheck, Key, UserCheck, Globe, Check } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t, language, changeLanguage, openLanguageModal, checkAndPromptPreLogin } = useLanguage();
  const navigate = useNavigate();

  // Prompt modal before user login
  useEffect(() => {
    checkAndPromptPreLogin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || (language === 'mr' ? 'प्रमाणीकरण अयशस्वी. कृपया तपशील तपासा.' : 'Failed to authenticate. Please check credentials.'));
    } finally {
      setLoading(false);
    }
  };

  const fillCitizenDemo = () => {
    setEmail('demo@civicbridge.ai');
    setPassword('Demo@123');
  };

  const fillAdminDemo = () => {
    setEmail('admin@civicbridge.ai');
    setPassword('Admin@123');
  };

  return (
    <div className="max-w-md mx-auto my-8 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden p-8 space-y-5">
        
        {/* Step 0: Language Selector Prompt Before Login */}
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
            {t('welcomeBack', 'Sign In to CivicBridge AI')}
          </h2>
          <p className="text-xs text-slate-500">
            {t('authSubtitle', 'Authorized Government Service Orchestration Access')}
          </p>
        </div>

        {/* Quick Demo Pre-fill Buttons */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
            {t('quickDemoCredentials', 'Quick One-Click Demo Credentials')}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillCitizenDemo}
              className="px-3 py-2 bg-gov-50 hover:bg-gov-100 text-gov-800 border border-gov-200 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-gov-600" />
              <span>{t('demoCitizen', 'Demo Citizen')}</span>
            </button>
            <button
              type="button"
              onClick={fillAdminDemo}
              className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-purple-600" />
              <span>{t('demoAdmin', 'Demo Admin')}</span>
            </button>
          </div>
        </div>

        {/* Firebase Cloud Sync Indicator */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 flex items-center justify-between text-[11px] text-amber-900">
          <div className="flex items-center space-x-1.5 font-medium">
            <span>🔥</span>
            <span>Firebase Firestore: <strong>brototype-79697</strong></span>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300">
            ✓ Connected
          </span>
        </div>

        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-600 p-3 rounded text-xs text-rose-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="demo@civicbridge.ai"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gov-700 hover:bg-gov-800 text-white rounded-lg text-sm font-bold flex items-center justify-center space-x-2 transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? <span>{t('signingIn', 'Signing In...')}</span> : (
              <>
                <span>{t('signIn', 'Sign In')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-1">
          {t('dontHaveAccount', "Don't have an account?")}{' '}
          <Link to="/register" className="text-gov-700 font-bold hover:underline">
            {t('registerHere', 'Register here')}
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
