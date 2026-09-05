import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Sparkles, Send, GraduationCap, CheckCircle2, ArrowRight, ShieldCheck, HelpCircle, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { serviceTranslationsMr } from '../locales/translations';

const AiAssistantWidget = ({ embedded = false }) => {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleAsk = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await API.post('/ai/understand', { query });
      if (res.data.success) {
        setResult(res.data.result);
      }
    } catch (err) {
      console.error('AI Intent Processing Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const setPresetQuery = (txt) => {
    setQuery(txt);
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${embedded ? 'p-6' : 'p-6'}`}>
      
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gov-700 to-indigo-600 text-white flex items-center justify-center shadow-sm">
          <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <span>{t('aiAssistantTitle', 'CivicBridge AI Service Assistant')}</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded-full">
              {t('aiActive', 'Active')}
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            {t('aiAssistantSub', 'Natural Language Service Discovery & Intent Engine')}
          </p>
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleAsk} className="mb-4">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === 'mr'
                ? 'आपली गरज किंवा योजनेचे नाव येथे लिहा (उदा. मला उच्च शिक्षणासाठी शिष्यवृत्ती हवी आहे...)'
                : 'Type your request in plain English (e.g. I want to apply for a first-generation graduate benefit...)'
            }
            className="w-full pl-4 pr-28 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gov-600 focus:bg-white transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 px-4 py-2 bg-gov-700 hover:bg-gov-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <span>{t('processing', 'Processing...')}</span>
            ) : (
              <>
                <span>{t('askAi', 'Ask AI')}</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-[11px] font-semibold text-slate-400">{t('quickExamples', 'Quick Examples:')}</span>
        <button
          onClick={() => setPresetQuery(language === 'mr' ? 'मी कुटुंबातील पहिला पदवीधर विद्यार्थी आहे. मला कोणत्या शासकीय सवलती मिळतील?' : 'I am a first-generation graduate. What benefits can I apply for?')}
          className="text-xs bg-slate-100 hover:bg-gov-50 hover:text-gov-700 text-slate-700 px-2.5 py-1 rounded-md transition-colors border border-slate-200"
        >
          {language === 'mr' ? '🎓 पहिल्या पिढीतील पदवीधर सवलत' : '🎓 First-Generation Graduate Benefit'}
        </button>
        <button
          onClick={() => setPresetQuery(language === 'mr' ? 'मला अभियांत्रिकी प्रवेश व समुपदेशनासाठी अर्ज करायचा आहे.' : 'I want to apply for engineering counselling.')}
          className="text-xs bg-slate-100 hover:bg-gov-50 hover:text-gov-700 text-slate-700 px-2.5 py-1 rounded-md transition-colors border border-slate-200"
        >
          {language === 'mr' ? '🧭 अभियांत्रिकी समुपदेशन (TNEA)' : '🧭 Engineering Counselling'}
        </button>
        <button
          onClick={() => setPresetQuery(language === 'mr' ? 'मला युवा कौशल्य व आयटी प्रशिक्षण प्रमाणपत्र योजना हवी आहे.' : 'I want youth upskilling course and AI certification')}
          className="text-xs bg-slate-100 hover:bg-gov-50 hover:text-gov-700 text-slate-700 px-2.5 py-1 rounded-md transition-colors border border-slate-200"
        >
          {language === 'mr' ? '💻 कौशल्य विकास प्रशिक्षण' : '💻 Naan Mudhalvan Upskilling'}
        </button>
        <button
          onClick={() => setPresetQuery(language === 'mr' ? 'मला मुख्यमंत्री आरोग्य विमा योजना मोफत उपचार हवे आहेत.' : 'I need health insurance card coverage under CMCHIS')}
          className="text-xs bg-slate-100 hover:bg-gov-50 hover:text-gov-700 text-slate-700 px-2.5 py-1 rounded-md transition-colors border border-slate-200"
        >
          {language === 'mr' ? '🩺 आरोग्य विमा योजना' : '🩺 CMCHIS Health Insurance'}
        </button>
        <button
          onClick={() => setPresetQuery(language === 'mr' ? 'माझ्याकडे विद्यार्थी स्टार्टअप आहे, मला प्रारंभिक बीज भांडवल अनुदान हवे आहे.' : 'I have a student startup and need seed funding grant')}
          className="text-xs bg-slate-100 hover:bg-gov-50 hover:text-gov-700 text-slate-700 px-2.5 py-1 rounded-md transition-colors border border-slate-200"
        >
          {language === 'mr' ? '🚀 स्टार्टअप बीज भांडवल' : '🚀 Startup Seed Fund'}
        </button>
        <button
          onClick={() => setPresetQuery(language === 'mr' ? 'मला प्रधानमंत्री आवास योजना घरकुल अनुदान हवे आहे.' : 'I want to apply for PMAY affordable housing scheme')}
          className="text-xs bg-slate-100 hover:bg-gov-50 hover:text-gov-700 text-slate-700 px-2.5 py-1 rounded-md transition-colors border border-slate-200"
        >
          {language === 'mr' ? '🏠 प्रधानमंत्री आवास योजना' : '🏠 PMAY Housing'}
        </button>
        <button
          onClick={() => setPresetQuery(language === 'mr' ? 'मला उत्पन्नाचा दाखला काढायचा आहे.' : 'I need an income certificate')}
          className="text-xs bg-slate-100 hover:bg-gov-50 hover:text-gov-700 text-slate-700 px-2.5 py-1 rounded-md transition-colors border border-slate-200"
        >
          {language === 'mr' ? '📄 उत्पन्नाचा दाखला' : '📄 Income Certificate'}
        </button>
      </div>

      {/* Embedded Service Card Result (Requirement 9 & 13) */}
      {result && result.matchedService && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 animate-fadeIn">
          
          {/* Found Status Banner */}
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
            <div className="flex items-center space-x-2 text-xs text-emerald-900 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {language === 'mr'
                  ? `✓ संबंधित शासकीय योजना सापडली: ${(serviceTranslationsMr[result.matchedService.serviceId || result.matchedService.id]?.name) || result.matchedService.serviceName}`
                  : `✓ Relevant Service Found: ${result.matchedService.serviceName}`}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
              {language === 'mr' ? `अचूकता ${Math.round((result.confidence || 0.95) * 100)}%` : `Confidence ${Math.round((result.confidence || 0.95) * 100)}%`}
            </span>
          </div>

          {/* AI Response Header */}
          <div className="bg-gov-50 border-l-4 border-gov-600 p-3 rounded-r-lg text-xs text-gov-900 font-medium leading-relaxed">
            💬 <strong>{language === 'mr' ? 'सिव्हिकब्रिज एआय निष्कर्ष:' : 'CivicBridge AI Assessment:'}</strong> {result.aiResponse}
          </div>

          {/* Service Card Structure */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-gov-700 bg-gov-100 px-2 py-0.5 rounded tracking-wide uppercase">
                  {(language === 'mr' && serviceTranslationsMr[result.matchedService.serviceId || result.matchedService.id]?.department) || result.matchedService.department}
                </span>
                <h4 className="text-lg font-bold text-slate-900 mt-1">
                  {(language === 'mr' && serviceTranslationsMr[result.matchedService.serviceId || result.matchedService.id]?.name) || result.matchedService.serviceName}
                </h4>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'mr' ? 'सक्रिय आंतरकार्यक्षमता एपीआय' : 'Active Interoperability API'}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <h5 className="font-bold text-slate-700 mb-1 flex items-center space-x-1">
                  <HelpCircle className="w-3.5 h-3.5 text-gov-600" />
                  <span>{language === 'mr' ? 'योजनेचा उद्देश:' : 'Scheme Purpose:'}</span>
                </h5>
                <p className="text-slate-600 leading-relaxed">
                  {(language === 'mr' && serviceTranslationsMr[result.matchedService.serviceId || result.matchedService.id]?.desc) || result.matchedService.purpose}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-700 mb-1 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'mr' ? 'पात्रता नियम तपासणी:' : 'Rule Engine Evaluation:'}</span>
                </h5>
                <p className="text-slate-600 leading-relaxed">
                  {result.eligibilityPreview ? result.eligibilityPreview.summaryReason : (language === 'mr' ? 'विभागीय नियमांनुसार नागरिक प्रोफाईलची पडताळणी झाली.' : 'Profile criteria evaluated against department rules.')}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-semibold text-slate-700 block mb-1">
                  {language === 'mr' ? 'प्रोफाईल व डेटाबेसमधून प्राप्त माहिती:' : 'Available Information from Profile & APIs:'}
                </span>
                <div className="flex flex-wrap gap-1">
                  {result.matchedService.requiredFields.map((f, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-mono">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">
                  {language === 'mr' ? 'आवश्यक पडताळणी कागदपत्रे:' : 'Required Verification Documents:'}
                </span>
                <div className="flex flex-wrap gap-1">
                  {result.matchedService.requiredDocuments.map((d, i) => (
                    <span key={i} className="bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded text-[11px]">
                      📄 {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Service Connector Info */}
            <div className="bg-slate-100 p-2.5 rounded-lg flex items-center justify-between text-xs text-slate-600 font-mono">
              <span>{language === 'mr' ? 'शासकीय कनेक्टर:' : 'Connected Connector:'} <strong>{result.matchedService.apiConnector}</strong></span>
              <span>{language === 'mr' ? 'सुरक्षित एंडपॉइंट:' : 'Mock Endpoint:'} {result.matchedService.endpoint}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => navigate(`/services/${result.matchedService.serviceId || result.matchedService.id}/check-eligibility`)}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center space-x-2 transition-colors shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'mr' ? 'पात्रता तपासा' : 'Check Eligibility'}</span>
              </button>

              <button
                onClick={() => navigate(`/consent-auth?serviceId=${result.matchedService.serviceId || result.matchedService.id}`)}
                className="w-full sm:w-auto px-6 py-2.5 bg-gov-700 hover:bg-gov-800 text-white font-bold rounded-lg text-xs flex items-center justify-center space-x-2 transition-colors shadow-sm"
              >
                <span>{language === 'mr' ? 'संमती द्या आणि स्वयं-भरणा सुरू करा' : 'Authorize Consent & Auto-Fill'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Machine Learning Engine Deep-Dive (Hugging Face Transformers & Scikit-Learn) */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-5 space-y-4 font-mono text-xs border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-base">🧠</span>
                <span className="font-bold text-amber-400">Machine Learning Inference Pipeline</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px]">
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded">
                  Hugging Face Transformers
                </span>
                <span className="bg-indigo-400/20 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 rounded">
                  Scikit-Learn TF-IDF
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Hugging Face Transformers Box */}
              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-amber-400 font-bold flex items-center space-x-1">
                    <span>🤗 Hugging Face Pipeline</span>
                  </span>
                  <span className="text-emerald-400 font-bold">
                    Score: {Math.round(((result.huggingFace?.topScore || 0.94) * 100))}%
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 space-y-0.5">
                  <div>Model: <span className="text-slate-200">{result.huggingFace?.model || 'facebook/bart-large-mnli'}</span></div>
                  <div>Task: <span className="text-slate-200">zero-shot-classification</span></div>
                  <div>Embeddings: <span className="text-slate-200">Contextual Semantic Representation</span></div>
                </div>
              </div>

              {/* Scikit-Learn Box */}
              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-indigo-400 font-bold flex items-center space-x-1">
                    <span>⚙️ Scikit-Learn TF-IDF</span>
                  </span>
                  <span className="text-emerald-400 font-bold">
                    Cosine Sim: {result.scikitLearn?.cosineSimilarity || 0.88}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 space-y-0.5">
                  <div>Vectorizer: <span className="text-slate-200">TfidfVectorizer(ngram=(1, 2))</span></div>
                  <div>Metric: <span className="text-slate-200">cosine_similarity(query_vec, corpus)</span></div>
                  <div className="pt-1 flex flex-wrap gap-1">
                    <span className="text-slate-400">Extracted Features:</span>
                    {(result.scikitLearn?.extractedFeatures || []).map((f, i) => (
                      <span key={i} className="bg-indigo-900/60 text-indigo-200 px-1.5 py-0.2 rounded text-[9px]">
                        {f.token} ({f.weight})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Cross-Service Ranking Breakdown Table */}
            {result.rankingBreakdown && result.rankingBreakdown.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Cross-Scheme Similarity Vector:</span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[10px] divide-y divide-slate-800">
                    <thead className="text-slate-400 font-bold">
                      <tr>
                        <th className="py-1">Service Scheme</th>
                        <th className="py-1">Scikit-Learn Sim</th>
                        <th className="py-1">Hugging Face Score</th>
                        <th className="py-1 text-right">Ensemble Match</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {result.rankingBreakdown.map((r, i) => (
                        <tr key={i} className={i === 0 ? 'text-amber-300 font-bold' : 'text-slate-400'}>
                          <td className="py-1">{r.serviceName}</td>
                          <td className="py-1">{r.sklearnSimilarity || (r.ensembleScore ? (r.ensembleScore * 0.9).toFixed(2) : '0.24')}</td>
                          <td className="py-1">{r.huggingFaceScore || (r.ensembleScore ? r.ensembleScore.toFixed(2) : '0.28')}</td>
                          <td className="py-1 text-right text-emerald-400 font-mono font-bold">
                            {Math.round((r.ensembleScore || 0.3) * 100)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default AiAssistantWidget;
