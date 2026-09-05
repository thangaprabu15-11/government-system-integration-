import React from 'react';
import { ShieldCheck, Cpu, Database, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const GovHeader = () => {
  const { t, language } = useLanguage();

  return (
    <div className="bg-gov-900 text-white border-b border-gov-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col md:flex-row items-center justify-between text-xs sm:text-sm gap-2">
        
        {/* Left emblem & title */}
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center font-bold text-amber-300 text-xs shrink-0">
            🇮🇳
          </div>
          <div>
            <span className="font-semibold tracking-wide text-slate-100">{t('govGrid', 'GOVERNMENT DIGITAL INTEROPERABILITY GRID')}</span>
            <span className="hidden sm:inline text-slate-400 mx-2">|</span>
            <span className="hidden sm:inline text-amber-300 font-medium">{t('orchestrationLayer', 'Unified Citizen Service Orchestration Layer')}</span>
          </div>
        </div>

        {/* Right side: Language Switcher and System Status */}
        <div className="flex items-center space-x-3 text-xs">
          
          {/* Prominent Language Switcher */}
          <div className="flex items-center space-x-1 bg-slate-800/90 border border-slate-700 px-2 py-1 rounded-lg">
            <Globe className="w-3.5 h-3.5 text-amber-300 mr-1" />
            <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">
              {language === 'mr' ? 'भाषा:' : 'Language:'}
            </span>
            <LanguageSwitcher variant="pills" />
          </div>

          <div className="hidden lg:flex items-center space-x-1.5 text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-500/30 font-mono text-[11px]" title="Firebase Firestore Project: brototype-79697">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>🔥 Firebase DB: brototype-79697</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono">{t('interopOnline', 'ONLINE')}</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default GovHeader;
