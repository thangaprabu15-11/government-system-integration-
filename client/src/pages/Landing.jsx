import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Sparkles, ShieldCheck, ArrowLeftRight, CheckCircle2, 
  ArrowRight, Cpu, FileText, Database, Lock, Users, Layers, Award
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import DataMapperVisualizer from '../components/DataMapperVisualizer';

const Landing = () => {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-16 py-8">
      
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-6">
        <div className="inline-flex items-center space-x-2 bg-gov-100 text-gov-800 border border-gov-300 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-2xs">
          <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>{t('heroBadge', 'GovTech Interoperability & Service Orchestration Architecture')}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          {t('heroTitle1', 'One Citizen. Many Services.')}<br />
          <span className="bg-gradient-to-r from-gov-700 via-indigo-700 to-gov-900 bg-clip-text text-transparent">
            {t('heroTitle2', 'One Intelligent Connection.')}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {t('heroDesc', 'CivicBridge AI connects existing digital government platforms through secure interoperability, intelligent service discovery, standardized data exchange, consent management, and application automation.')}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 bg-gov-700 hover:bg-gov-800 text-white rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-md transition-all transform hover:-translate-y-0.5"
          >
            <span>{t('getStarted', 'Get Started')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/interoperability"
            className="w-full sm:w-auto px-8 py-3.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-2xs transition-all"
          >
            <ArrowLeftRight className="w-4 h-4 text-amber-600" />
            <span>{t('seeHowItWorks', 'See How It Works (Visual Mapper)')}</span>
          </Link>
        </div>

        {/* System Highlights Pill Bar */}
        <div className="pt-8 border-t border-slate-200/80 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-700">
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-center space-x-2">
            <Lock className="w-4 h-4 text-gov-600" />
            <span>{t('feature1', 'Existing Systems Unchanged')}</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t('feature2', 'Explicit Citizen Consent')}</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-center space-x-2">
            <ArrowLeftRight className="w-4 h-4 text-amber-600" />
            <span>{t('feature3', 'Data Standardization')}</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-center space-x-2">
            <Cpu className="w-4 h-4 text-purple-600" />
            <span>{t('feature4', 'Rule-Based Eligibility')}</span>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE DIAGRAM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl border border-slate-800 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-widest font-bold">
              {language === 'mr' ? 'प्रणाली संरचना (System Architecture)' : 'System Architecture'}
            </span>
            <h2 className="text-2xl font-bold">
              {language === 'mr' ? 'आंतरकार्यक्षमता आणि समन्वय स्तर कार्यप्रवाह' : 'Interoperability & Orchestration Layer Flow'}
            </h2>
            <p className="text-slate-400 text-xs">
              {language === 'mr'
                ? 'विद्यमान शासकीय प्लॅटफॉर्म बदलण्याची गरज नाही. सिव्हिकब्रिज एआय एकात्मिक मध्यस्थ व समन्वय स्तर म्हणून कार्य करते.'
                : 'Existing government platforms remain unchanged. CivicBridge AI acts as the intelligent orchestration layer.'}
            </p>
          </div>

          {/* Visual Architecture Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center pt-4">
            
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative">
              <div className="w-8 h-8 rounded-full bg-gov-600 text-white font-bold flex items-center justify-center mx-auto mb-2 text-xs">1</div>
              <h4 className="font-bold text-sm text-slate-100">
                {language === 'mr' ? 'नागरिकांची मागणी' : 'Citizen Intent'}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                {language === 'mr' ? 'साध्या सोप्या भाषेत शासकीय मागणी' : 'Natural language request in plain English'}
              </p>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-2 text-xs">2</div>
              <h4 className="font-bold text-sm text-slate-100">
                {language === 'mr' ? 'सिव्हिकब्रिज एआय स्तर' : 'CivicBridge AI Layer'}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                {language === 'mr' ? 'मागणी विश्लेषण व नियमाधारित पात्रता पडताळणी' : 'Intent matching & rule-based eligibility evaluation'}
              </p>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center mx-auto mb-2 text-xs">3</div>
              <h4 className="font-bold text-sm text-slate-100">
                {language === 'mr' ? 'आंतरकार्यक्षमता व मॅपिंग' : 'Interoperability & Mapping'}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                {language === 'mr' ? 'अधिकृत डेटा देवाणघेवाण आणि मानकीकरण' : 'Authorized data exchange & standardization'}
              </p>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto mb-2 text-xs">4</div>
              <h4 className="font-bold text-sm text-slate-100">
                {language === 'mr' ? 'शासकीय एपीआय सादर' : 'Government API Submission'}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                {language === 'mr' ? 'विभागीय शासकीय सेवा एपीआय कडे सुरक्षित पाठवणे' : 'Dispatched to mock government service APIs'}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5 STEPS "HOW IT WORKS" SECTION - Requirement 37 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            {language === 'mr' ? 'सिव्हिकब्रिज एआय कसे कार्य करते' : 'How CivicBridge AI Works'}
          </h2>
          <p className="text-slate-600 text-sm">
            {language === 'mr'
              ? 'नैसर्गिक भाषेतील शोधापासून ते अर्ज पुष्टीकरणापर्यंतची ५ सोपी व पारदर्शक पावले.'
              : 'Five seamless steps from natural language discovery to application confirmation.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-mono font-bold text-gov-600 bg-gov-50 px-2 py-0.5 rounded">
              {language === 'mr' ? 'पायरी १' : 'STEP 1'}
            </span>
            <h4 className="font-bold text-sm text-slate-900">
              {language === 'mr' ? 'आपली आवश्यकता सांगा' : 'Tell Us What You Need'}
            </h4>
            <p className="text-xs text-slate-500">
              {language === 'mr' ? 'नागरिक साध्या भाषेत सेवेची मागणी करतो.' : 'Citizen asks for a service in natural language.'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {language === 'mr' ? 'पायरी २' : 'STEP 2'}
            </span>
            <h4 className="font-bold text-sm text-slate-900">
              {language === 'mr' ? 'एआय मागणी समजून घेते' : 'AI Understands Intent'}
            </h4>
            <p className="text-xs text-slate-500">
              {language === 'mr' ? 'सेवा सूची आणि सरकारी नियमांशी जुळवणी करते.' : 'Matches request against Service Catalogue & rules.'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              {language === 'mr' ? 'पायरी ३' : 'STEP 3'}
            </span>
            <h4 className="font-bold text-sm text-slate-900">
              {language === 'mr' ? 'डेटा जोडा आणि पडताळा' : 'Connect & Verify Data'}
            </h4>
            <p className="text-xs text-slate-500">
              {language === 'mr' ? 'नागरिकांच्या संमतीने थेट अधिकृत डेटा मिळवते.' : 'Fetches authorized data with citizen consent.'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
              {language === 'mr' ? 'पायरी ४' : 'STEP 4'}
            </span>
            <h4 className="font-bold text-sm text-slate-900">
              {language === 'mr' ? 'मानकीकरण आणि स्वयं-भरती' : 'Standardize & Auto-Fill'}
            </h4>
            <p className="text-xs text-slate-500">
              {language === 'mr' ? 'डेटा प्रमाणित करून अर्ज आपोआप भरला जातो.' : 'Standardizes data and prepares application form.'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              {language === 'mr' ? 'पायरी ५' : 'STEP 5'}
            </span>
            <h4 className="font-bold text-sm text-slate-900">
              {language === 'mr' ? 'पुष्टी करा आणि ट्रॅक करा' : 'Confirm & Track'}
            </h4>
            <p className="text-xs text-slate-500">
              {language === 'mr' ? 'नागरिक पडताळणी करतो, सादर करतो आणि पोचपावती ट्रॅक करतो.' : 'Citizen reviews, confirms, submits & tracks ID.'}
            </p>
          </div>

        </div>
      </section>

      {/* EMBEDDED DEMO VISUALIZER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DataMapperVisualizer />
      </section>

    </div>
  );
};

export default Landing;
