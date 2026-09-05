import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import AiAssistantWidget from '../components/AiAssistantWidget';
import { useLanguage } from '../context/LanguageContext';
import { serviceTranslationsMr } from '../locales/translations';
import LanguageSwitcher from '../components/LanguageSwitcher';
import StatusBadge from '../components/StatusBadge';
import { 
  GraduationCap, Award, FileText, Building, Sparkles, 
  ArrowRight, ShieldCheck, CheckCircle2, Clock, ChevronRight, UserCheck, AlertTriangle, ArrowLeftRight, Cpu, HeartPulse
} from 'lucide-react';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { t, language } = useLanguage();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await API.get('/applications');
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error('Failed to load dashboard applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const displayName = profile?.fullName || user?.name || 'Thanga Prabu N';

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Welcome Banner - Requirement 8 */}
      <div className="bg-gradient-to-r from-gov-900 via-gov-800 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-gov-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-400/30">
              {language === 'mr' ? 'नागरिक डिजिटल डॅशबोर्ड' : 'Citizen Digital Dashboard'}
            </span>

            {/* In-Banner Quick Language Switcher */}
            <div className="inline-flex items-center bg-white/10 px-2 py-0.5 rounded-lg border border-white/20">
              <span className="text-[11px] text-amber-300 mr-2 font-bold">🌐 {language === 'mr' ? 'भाषा:' : 'Language:'}</span>
              <LanguageSwitcher variant="pills" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            {language === 'mr' ? `पुन्हा स्वागत आहे, ${displayName} 👋` : `Welcome, ${displayName} 👋`}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
            {language === 'mr'
              ? 'डिजिटल सरकारी सेवा शोधा, पात्रता तपासा, संमती व्यवस्थापित करा आणि सर्व संलग्न विभागांमधील अर्जांचा मागोवा घ्या.'
              : 'Orchestrate digital government services, discover eligibility, manage consents, and track applications across connected department APIs.'}
          </p>
        </div>

        {/* Profile Completion Indicator */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 w-full md:w-auto min-w-[220px]">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-200">{t('profileCompletion', 'Profile Completion:')}</span>
            <span className="text-amber-300 font-bold">{profile?.completionPercentage || 88}%</span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${profile?.completionPercentage || 88}%` }}
            ></div>
          </div>
          <div className="mt-2 text-right">
            <Link to="/profile" className="text-[11px] text-amber-300 hover:underline font-semibold flex items-center justify-end space-x-1">
              <span>{t('completeProfile', 'Complete Profile')}</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main AI Box */}
      <AiAssistantWidget embedded={true} />

      {/* Service Category Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            {language === 'mr' ? 'शासकीय सेवा वर्गवारी' : 'Government Service Categories'}
          </h3>
          <Link to="/services" className="text-xs font-bold text-gov-700 hover:underline flex items-center space-x-1">
            <span>{language === 'mr' ? 'सर्व १२ सेवा पहा' : 'View All 12 Services'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <Link
            to="/services?category=education"
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-gov-500 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-gov-100 text-gov-700 flex items-center justify-center mb-3 group-hover:bg-gov-700 group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-gov-700">🎓 {t('catEducation', 'Education & Counselling')}</h4>
            <p className="text-xs text-slate-500 mt-1">{t('catEducationDesc', 'First-gen benefits, admissions cut-off matrix')}</p>
          </Link>

          <Link
            to="/services?category=scholarship"
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-500 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3 group-hover:bg-indigo-700 group-hover:text-white transition-colors">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-700">💰 {t('catScholarship', 'Scholarships & Grants')}</h4>
            <p className="text-xs text-slate-500 mt-1">{t('catScholarshipDesc', 'Post-matric financial aid & welfare grants')}</p>
          </Link>

          <Link
            to="/services?category=certificates"
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-amber-500 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-3 group-hover:bg-amber-700 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-800">📄 {t('catCertificates', 'Certificates & Domicile')}</h4>
            <p className="text-xs text-slate-500 mt-1">{t('catCertificatesDesc', 'Income, Caste, Community & Nativity certs')}</p>
          </Link>

          <Link
            to="/services?category=skilling"
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-cyan-500 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center mb-3 group-hover:bg-cyan-700 group-hover:text-white transition-colors">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-cyan-800">💻 {t('catSkilling', 'Youth Upskilling & IT')}</h4>
            <p className="text-xs text-slate-500 mt-1">{t('catSkillingDesc', 'Naan Mudhalvan, technical certifications')}</p>
          </Link>

          <Link
            to="/services?category=health"
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-rose-500 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center mb-3 group-hover:bg-rose-700 group-hover:text-white transition-colors">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-rose-800">🩺 {t('catHealth', 'Health & Welfare')}</h4>
            <p className="text-xs text-slate-500 mt-1">{t('catHealthDesc', 'CMCHIS / Ayushman cashless treatment')}</p>
          </Link>

          <Link
            to="/services"
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-purple-500 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:bg-purple-700 group-hover:text-white transition-colors">
              <Building className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-purple-700">🏛 {t('catAllServices', 'All 12 Government Services')}</h4>
            <p className="text-xs text-slate-500 mt-1">{t('catAllServicesDesc', 'Explore agriculture, housing, startups & more')}</p>
          </Link>

        </div>
      </div>

      {/* Recent Applications & Data Interoperability Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Applications Table Preview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{t('unifiedTracking', 'Unified Application Tracking')}</h3>
              <p className="text-xs text-slate-500">{t('liveStatusAcross', 'Live status across connected government departments')}</p>
            </div>
            <Link to="/my-applications" className="text-xs font-bold text-gov-700 hover:underline flex items-center space-x-1">
              <span>{t('viewAll', 'View All')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">{t('appId', 'Application ID')}</th>
                  <th className="py-2.5 px-3">{t('serviceNameHeader', 'Service Name')}</th>
                  <th className="py-2.5 px-3">{t('appliedDate', 'Applied Date')}</th>
                  <th className="py-2.5 px-3">{t('statusHeader', 'Status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.slice(0, 4).map((app) => {
                  const srvTitle = (language === 'mr' && serviceTranslationsMr[app.serviceId]?.name) || app.serviceName;
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-gov-700">{app.applicationId}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{srvTitle}</td>
                      <td className="py-3 px-3 text-slate-500">{new Date(app.appliedDate).toLocaleDateString()}</td>
                      <td className="py-3 px-3">
                        <StatusBadge status={app.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Action & Interoperability Card */}
        <div className="bg-gradient-to-br from-slate-900 to-gov-900 text-white rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ArrowLeftRight className="w-4 h-4" />
              <span>{t('interopLayer', 'Interoperability Layer')}</span>
            </div>
            <h4 className="text-base font-bold text-white">{t('crossServiceExchange', 'Cross-Service Data Exchange')}</h4>
            <p className="text-slate-300 text-xs mt-1 leading-relaxed">
              {t('crossServiceDesc', 'CivicBridge AI automatically detects reusable information from your Income and Education verifications to eliminate redundant form filing.')}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <Link
              to="/interoperability"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center space-x-2 transition-colors shadow-sm"
            >
              <span>{t('launchVisualMapper', 'Launch Data Mapper Visualizer')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/consent"
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-slate-200 font-semibold rounded-lg text-xs flex items-center justify-center space-x-2 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('manageMyConsents', 'Manage My Consents')}</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
