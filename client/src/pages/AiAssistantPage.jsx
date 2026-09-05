import React from 'react';
import AiAssistantWidget from '../components/AiAssistantWidget';
import { useLanguage } from '../context/LanguageContext';

const AiAssistantPage = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {language === 'mr' ? 'सिव्हिकब्रिज एआय बुद्धिमान सहाय्यक' : 'CivicBridge AI Intelligent Assistant'}
        </h1>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          {language === 'mr'
            ? 'आपल्या शासकीय सेवेची आवश्यकता साध्या सोप्या भाषेत सांगा. एआय इंजिन जुळणाऱ्या सेवा शोधेल, प्राथमिक पात्रता तपासेल आणि अर्ज भरण्यास मार्गदर्शन करेल.'
            : 'State your government service need in plain English. The AI intent engine will discover matching services, evaluate preliminary eligibility rules, and guide auto-filling.'}
        </p>
      </div>

      <AiAssistantWidget embedded={false} />
    </div>
  );
};

export default AiAssistantPage;
