import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Check, Building2, ArrowRight, X } from 'lucide-react';

const LanguageSelectModal = () => {
  const { language, changeLanguage, showLanguageModal, closeLanguageModal, t } = useLanguage();
  const [tempLang, setTempLang] = useState(language);

  useEffect(() => {
    setTempLang(language);
  }, [language]);

  if (!showLanguageModal) return null;

  const handleConfirm = () => {
    changeLanguage(tempLang);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden space-y-6 p-6 sm:p-8 relative">
        
        {/* Optional dismiss button */}
        <button
          onClick={closeLanguageModal}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Dismiss / बंद करा"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with National Emblem styling */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gov-700 text-white flex items-center justify-center mx-auto shadow-md border-2 border-amber-400/50">
            <Globe className="w-7 h-7 text-amber-300 animate-pulse" />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-gov-800 font-bold bg-gov-100 px-3 py-1 rounded-full inline-block">
            {tempLang === 'mr' ? 'शासकीय सेवा पोर्टल' : 'Government Service Portal'}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {tempLang === 'mr' ? 'पसंतीची भाषा निवडा' : 'Select Preferred Language'}
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            {tempLang === 'mr'
              ? 'लॉग इन करण्यापूर्वी कृपया आपली भाषा निवडा (मराठी किंवा English).'
              : 'Please select your preferred language before signing in or creating an account.'}
          </p>
        </div>

        {/* Language Selection Cards */}
        <div className="space-y-3 pt-1">
          
          {/* English Option */}
          <button
            type="button"
            onClick={() => setTempLang('en')}
            className={`w-full text-left p-4 rounded-xl border-2 flex items-center justify-between transition-all cursor-pointer ${
              tempLang === 'en'
                ? 'border-gov-600 bg-gov-50/60 shadow-sm ring-2 ring-gov-600/20'
                : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <span className="text-3xl">🇬🇧</span>
              <div>
                <div className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <span>English</span>
                  <span className="text-[10px] font-mono bg-gov-100 text-gov-800 px-2 py-0.5 rounded font-bold">
                    Official
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Government Service Orchestration & Interoperability
                </p>
              </div>
            </div>

            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
              tempLang === 'en'
                ? 'bg-gov-700 border-gov-700 text-white shadow-xs'
                : 'border-slate-300 text-transparent'
            }`}>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </button>

          {/* Marathi Option */}
          <button
            type="button"
            onClick={() => setTempLang('mr')}
            className={`w-full text-left p-4 rounded-xl border-2 flex items-center justify-between transition-all cursor-pointer ${
              tempLang === 'mr'
                ? 'border-gov-600 bg-gov-50/60 shadow-sm ring-2 ring-gov-600/20'
                : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <span className="text-3xl">🇮🇳</span>
              <div>
                <div className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <span>मराठी (Marathi)</span>
                  <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                    स्थानिक भाषा
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  शासकीय योजना, अर्ज, डेटा संमती आणि थेट पडताळणी
                </p>
              </div>
            </div>

            <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
              tempLang === 'mr'
                ? 'bg-gov-700 border-gov-700 text-white shadow-xs'
                : 'border-slate-300 text-transparent'
            }`}>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </button>

        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3.5 bg-gov-700 hover:bg-gov-800 text-white rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <span>{tempLang === 'mr' ? 'निवड निश्चित करा आणि पुढे जा' : 'Confirm & Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default LanguageSelectModal;
