import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { 
  Building2, Cpu, LayoutDashboard, Sparkles, FolderOpen, FileText, 
  ShieldCheck, Activity, LogOut, User, Menu, X, ArrowLeftRight, ActivityIcon, Globe
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t, openLanguageModal, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo & Platform Title */}
          <div className="flex items-center">
            <Link to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/'} className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-lg bg-gov-700 text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-gov-800 transition-colors">
                <Building2 className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight">{t('appName', 'CivicBridge')}</span>
                  <span className="bg-gradient-to-r from-gov-600 to-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide">AI</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  {t('appSub', 'Service Orchestration & Interoperability Layer')}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 ml-8">
              {user && (location.pathname.startsWith('/admin') || user.role === 'admin') ? (
                <>
                  <Link to="/admin" className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-colors ${isActive('/admin') ? 'bg-purple-50 text-purple-800 border border-purple-200' : 'text-slate-600 hover:text-purple-700 hover:bg-slate-50'}`}>
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{t('overview', 'Overview')}</span>
                  </Link>

                  <Link to="/admin/api-monitoring" className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-colors ${isActive('/admin/api-monitoring') ? 'bg-purple-50 text-purple-800 border border-purple-200' : 'text-slate-600 hover:text-purple-700 hover:bg-slate-50'}`}>
                    <ActivityIcon className="w-4 h-4" />
                    <span>{t('apiHealthLogs', 'API Health & Logs')}</span>
                  </Link>

                  <Link to="/admin/audit-logs" className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-colors ${isActive('/admin/audit-logs') ? 'bg-purple-50 text-purple-800 border border-purple-200' : 'text-slate-600 hover:text-purple-700 hover:bg-slate-50'}`}>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t('auditTrail', 'Audit Trail')}</span>
                  </Link>

                  <Link to="/interoperability" className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-colors ${isActive('/interoperability') ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'text-slate-600 hover:text-amber-700 hover:bg-slate-50'}`}>
                    <ArrowLeftRight className="w-4 h-4 text-amber-600" />
                    <span>{t('visualMapper', 'Visual Mapper')}</span>
                  </Link>
                </>
              ) : user ? (
                <>
                  <Link to="/dashboard" className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-colors ${isActive('/dashboard') ? 'bg-gov-50 text-gov-700 border border-gov-200' : 'text-slate-600 hover:text-gov-700 hover:bg-slate-50'}`}>
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{t('dashboard', 'Dashboard')}</span>
                  </Link>

                  <Link to="/ai-assistant" className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-colors ${isActive('/ai-assistant') ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'}`}>
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span>{t('aiAssistant', 'AI Assistant')}</span>
                  </Link>

                  <Link to="/services" className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-colors ${isActive('/services') ? 'bg-gov-50 text-gov-700 border border-gov-200' : 'text-slate-600 hover:text-gov-700 hover:bg-slate-50'}`}>
                    <FolderOpen className="w-4 h-4" />
                    <span>{t('services', 'Services')}</span>
                  </Link>

                  <Link to="/interoperability" className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-colors ${isActive('/interoperability') ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'text-slate-600 hover:text-amber-700 hover:bg-slate-50'}`}>
                    <ArrowLeftRight className="w-4 h-4 text-amber-600" />
                    <span>{t('dataMapping', 'Data Mapping')}</span>
                  </Link>

                  <Link to="/my-applications" className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-colors ${isActive('/my-applications') ? 'bg-gov-50 text-gov-700 border border-gov-200' : 'text-slate-600 hover:text-gov-700 hover:bg-slate-50'}`}>
                    <FileText className="w-4 h-4" />
                    <span>{t('myApplications', 'My Applications')}</span>
                  </Link>

                  <Link to="/consent" className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-colors ${isActive('/consent') ? 'bg-gov-50 text-gov-700 border border-gov-200' : 'text-slate-600 hover:text-gov-700 hover:bg-slate-50'}`}>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t('consent', 'Consent')}</span>
                  </Link>

                  <Link to="/profile" className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition-colors ${isActive('/profile') ? 'bg-gov-50 text-gov-700 border border-gov-200' : 'text-slate-600 hover:text-gov-700 hover:bg-slate-50'}`}>
                    <User className="w-4 h-4" />
                    <span>{t('profile', 'Profile')}</span>
                  </Link>
                </>
              ) : null}
            </div>
          </div>

          {/* Right Action & User Profile Dropdown */}
          <div className="hidden lg:flex items-center space-x-3">
            
            {/* Language Switcher Button */}
            <LanguageSwitcher />

            {user ? (
              <div className="flex items-center space-x-3">
                
                {/* Quick Portal Switcher Button */}
                {location.pathname.startsWith('/admin') ? (
                  <Link
                    to="/dashboard"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gov-50 text-gov-800 hover:bg-gov-100 border border-gov-200 flex items-center space-x-1.5 transition-colors shadow-2xs"
                    title="Switch to Citizen Service Portal"
                  >
                    <User className="w-3.5 h-3.5 text-gov-700" />
                    <span>{t('citizenPortal', 'Citizen Portal')}</span>
                  </Link>
                ) : (
                  <Link
                    to="/admin"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 flex items-center space-x-1.5 transition-colors shadow-2xs"
                    title="Open GovTech Admin Command Center"
                  >
                    <Activity className="w-3.5 h-3.5 text-purple-700" />
                    <span>{t('adminCenter', 'Admin Center')}</span>
                  </Link>
                )}

                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800 flex items-center justify-end space-x-1">
                    <span>{user.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${location.pathname.startsWith('/admin') ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {location.pathname.startsWith('/admin')
                        ? (language === 'mr' ? 'प्रशासक' : 'ADMIN VIEW')
                        : (language === 'mr' ? 'नागरिक' : 'CITIZEN')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title={t('signOut', 'Sign Out')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-gov-700 hover:bg-gov-50 transition-colors"
                >
                  {t('signIn', 'Sign In')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-gov-700 text-white hover:bg-gov-800 shadow-sm transition-colors"
                >
                  {t('createAccount', 'Create Account')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-md focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-slate-50 px-4 pt-2 pb-4 space-y-1">
          {user && (location.pathname.startsWith('/admin') || user.role === 'admin') ? (
            <>
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-200">{t('overview', 'Admin Dashboard')}</Link>
              <Link to="/admin/api-monitoring" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-200">{t('apiHealthLogs', 'API Health & Logs')}</Link>
              <Link to="/admin/audit-logs" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-200">{t('auditTrail', 'Audit Logs')}</Link>
              <Link to="/interoperability" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-amber-800 hover:bg-amber-100">{t('visualMapper', 'Data Mapping')}</Link>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-gov-800 bg-gov-50">{t('citizenPortal', 'Switch to Citizen Portal')}</Link>
            </>
          ) : user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-200">{t('dashboard', 'Dashboard')}</Link>
              <Link to="/ai-assistant" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-indigo-700 hover:bg-indigo-50">{t('aiAssistant', 'AI Assistant')}</Link>
              <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-200">{t('services', 'Service Catalogue')}</Link>
              <Link to="/interoperability" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-amber-800 hover:bg-amber-100">{t('dataMapping', 'Data Interoperability')}</Link>
              <Link to="/my-applications" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-200">{t('myApplications', 'My Applications')}</Link>
              <Link to="/consent" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-200">{t('consent', 'Consent History')}</Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-200">{t('profile', 'My Profile')}</Link>
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-purple-800 bg-purple-50">{t('adminCenter', 'Admin Center')}</Link>
            </>
          ) : null}

          {user ? (
            <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>{t('signOut', 'Sign Out')} ({user.name})</span>
            </button>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center px-4 py-2 rounded-md text-sm font-medium text-gov-700 border border-gov-300">{t('signIn', 'Sign In')}</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block text-center px-4 py-2 rounded-md text-sm font-medium bg-gov-700 text-white">{t('createAccount', 'Create Account')}</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
