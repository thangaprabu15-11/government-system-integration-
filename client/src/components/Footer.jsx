import React from 'react';
import { ShieldCheck, Info, HeartHandshake } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      {/* Demo Mode Notice Banner */}
      <div className="bg-slate-950 border-b border-slate-800/80 py-3 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2 text-amber-400 font-medium">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>{language === 'mr' ? 'प्रोटोटाइप डेमो मोड:' : 'PROTOTYPE DEMO MODE:'}</strong>{' '}
            {t('footerNotice', 'Government integrations shown in this prototype use simulated APIs for demonstration purposes.')}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-base">
              <span>CivicBridge AI</span>
              <span className="bg-gov-600 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">GovTech v2.4</span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed text-xs">
              {t('footerDesc', 'An AI-powered citizen-facing orchestration and interoperability layer that connects existing digital government platforms through standardized data exchange, intelligent service discovery, rule-based eligibility evaluation, consent management, form auto-fill, and unified tracking.')}
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              {t('footerUnchanged', 'Existing government systems remain unchanged. Integration layer operates over secure APIs.')}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              {t('footerFeatures', 'Key Features')}
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>{t('footerFeat1', 'AI Service Intent Discovery')}</li>
              <li>{t('footerFeat2', 'Data Interoperability Mapper')}</li>
              <li>{t('footerFeat3', 'Rule-Based Eligibility Engine')}</li>
              <li>{t('footerFeat4', 'Citizen Consent Manager')}</li>
              <li>{t('footerFeat5', 'Unified Application Tracking')}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              {t('footerDemoCreds', 'Demo Credentials')}
            </h4>
            <div className="space-y-2 text-slate-400 font-mono text-[11px]">
              <div className="bg-slate-800/80 p-2 rounded border border-slate-700">
                <span className="text-gov-300 font-bold block">{t('footerCitizenLogin', 'Citizen Login')}</span>
                <span>demo@civicbridge.ai</span> / <span>Demo@123</span>
              </div>
              <div className="bg-slate-800/80 p-2 rounded border border-slate-700">
                <span className="text-purple-300 font-bold block">{t('footerAdminLogin', 'Admin Login')}</span>
                <span>admin@civicbridge.ai</span> / <span>Admin@123</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} {t('footerRights', 'CivicBridge AI. Digital India Service Orchestration Platform. All rights reserved.')}
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-slate-300 cursor-pointer">{t('footerPrivacy', 'Privacy Policy')}</span>
            <span className="hover:text-slate-300 cursor-pointer">{t('footerSecurity', 'Security Architecture')}</span>
            <span className="hover:text-slate-300 cursor-pointer">{t('footerApiDocs', 'API Documentation')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
