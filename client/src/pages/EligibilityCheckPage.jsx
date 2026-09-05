import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  translateServiceName, 
  translateDepartment, 
  translateField 
} from '../locales/translations';
import { 
  ShieldCheck, CheckCircle2, XCircle, AlertTriangle, 
  ArrowRight, RefreshCw, Cpu, Layers, UserCheck, Building2, MapPin, Calendar, Lock, Edit3, X, Check, HelpCircle, Sparkles, AlertCircle
} from 'lucide-react';

const EligibilityCheckPage = () => {
  const { id } = useParams();
  const { profile, user } = useAuth();
  const { language, t } = useLanguage();
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Requirement States: 'PENDING' | 'IN_PROGRESS' | 'REVIEWING' | 'VERIFYING' | 'VERIFIED' | 'INVALID'
  const [requirementsState, setRequirementsState] = useState('PENDING');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewScreen, setIsReviewScreen] = useState(false);
  const [formInputs, setFormInputs] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [verificationFeedback, setVerificationFeedback] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check local persistent storage first
    const savedLocal = localStorage.getItem(`civic_verified_${id}`);
    let initialInputs = {};
    let isLocallyVerified = false;

    if (savedLocal) {
      try {
        const parsed = JSON.parse(savedLocal);
        initialInputs = parsed.inputs || {};
        isLocallyVerified = !!parsed.verified;
      } catch (e) {
        console.warn('Storage parse warning:', e);
      }
    } else {
      const savedSession = sessionStorage.getItem(`civic_inputs_${id}`);
      if (savedSession) {
        try {
          initialInputs = JSON.parse(savedSession);
        } catch (e) {}
      }
    }

    setFormInputs(initialInputs);
    if (isLocallyVerified) {
      setRequirementsState('VERIFIED');
    }
    checkEligibility(initialInputs);
  }, [id]);

  const checkEligibility = async (customInputs = {}) => {
    try {
      const res = await API.post(`/eligibility/check/${id}`, {
        providedInputs: customInputs
      });

      if (res.data.success) {
        const evalData = res.data.evaluation;
        setEvaluation(evalData);

        // Pre-fill default inputs for any unset fields
        setFormInputs(prev => {
          const next = { ...prev };
          (evalData.pendingQuestions || []).forEach(q => {
            if (next[q.key] === undefined && q.defaultValue) {
              next[q.key] = q.defaultValue;
            }
          });
          return next;
        });

        // Determine state
        if (evalData.requirementsVerified || res.data.persistedDraft?.requirementsVerified) {
          setRequirementsState('VERIFIED');
          // Update localStorage
          localStorage.setItem(`civic_verified_${id}`, JSON.stringify({
            verified: true,
            inputs: { ...(res.data.persistedDraft?.verifiedInputs || {}), ...customInputs }
          }));
        } else if (evalData.hasPendingRequirements) {
          setRequirementsState('PENDING');
        }
      }
    } catch (err) {
      console.error('Failed to check eligibility:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key, value) => {
    setFormInputs(prev => ({ ...prev, [key]: value }));
    if (formErrors[key]) {
      setFormErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  // Step A: User fills fields and clicks [Save Information] -> Opens Review Screen
  const handleSaveInformation = (e) => {
    e.preventDefault();
    const errors = {};
    const questions = (evaluation?.pendingQuestions || []).concat(evaluation?.completedQuestions || []);

    questions.forEach(q => {
      const val = formInputs[q.key];
      if (q.required && (val === undefined || val === null || String(val).trim() === '')) {
        errors[q.key] = `${q.label} is required.`;
      } else if (q.type === 'number' && val !== undefined && val !== '') {
        const num = Number(val);
        if (isNaN(num)) {
          errors[q.key] = `${q.label} must be a valid number.`;
        } else if (q.min !== undefined && num < q.min) {
          errors[q.key] = `${q.label} must be at least ${q.min}.`;
        } else if (q.max !== undefined && num > q.max) {
          errors[q.key] = `${q.label} cannot exceed ${q.max}.`;
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Save current inputs to session & state
    sessionStorage.setItem(`civic_inputs_${id}`, JSON.stringify(formInputs));
    setIsReviewScreen(true);
  };

  // Step B: User clicks [Verify Information] -> runs verification with loading state
  const handleVerifyInformation = async () => {
    setRequirementsState('VERIFYING');
    setIsModalOpen(false);
    setIsReviewScreen(false);

    try {
      // Simulate verification latency
      await new Promise(r => setTimeout(r, 600));

      const res = await API.post(`/eligibility/verify/${id}`, {
        providedInputs: formInputs
      });

      if (res.data.success && res.data.requirementsVerified) {
        setEvaluation(res.data.evaluation);
        setRequirementsState('VERIFIED');
        setVerificationFeedback({
          type: 'SUCCESS',
          message: 'All required information has been successfully verified.'
        });

        // Persist permanently in localStorage and sessionStorage
        localStorage.setItem(`civic_verified_${id}`, JSON.stringify({
          verified: true,
          inputs: formInputs
        }));
        sessionStorage.setItem(`civic_inputs_${id}`, JSON.stringify(formInputs));
      } else {
        setRequirementsState('INVALID');
        setVerificationFeedback({
          type: 'ERROR',
          missing: res.data.missingFields || [],
          invalid: res.data.invalidFields || []
        });
      }
    } catch (err) {
      console.error('Verification error:', err);
      const data = err.response?.data;
      setRequirementsState('INVALID');
      setVerificationFeedback({
        type: 'ERROR',
        missing: data?.missingFields || ['Required fields incomplete'],
        invalid: data?.invalidFields || []
      });
    }
  };

  if (loading && !evaluation) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 max-w-xl mx-auto my-12 shadow-sm">
        <RefreshCw className="w-8 h-8 text-gov-600 animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-800">
          {language === 'mr' ? 'सेवा-विशिष्ट नियम व अटी तपासत आहे...' : 'Evaluating Service-Specific Rules...'}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'mr' ? 'विभागीय निकषांनुसार नागरिकांची माहिती तपासली जात आहे.' : 'Checking citizen baseline against department criteria.'}
        </p>
      </div>
    );
  }

  if (!evaluation) return null;

  const isVerified = requirementsState === 'VERIFIED';
  const isVerifying = requirementsState === 'VERIFYING';

  const sName = translateServiceName(id, evaluation.serviceName, language);
  const sDept = translateDepartment(id, evaluation.department, language);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      
      {/* Header Evaluation Status */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-gov-700 uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>{language === 'mr' ? 'सेवा-विशिष्ट नियम व आवश्यकता मूल्यमापन' : 'Service-Specific Rule & Requirement Evaluation'}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{sName}</h1>
            <p className="text-xs text-slate-500">{sDept}</p>
          </div>

          <div className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 border ${
            isVerified
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
              : isVerifying
              ? 'bg-indigo-100 text-indigo-900 border-indigo-300 animate-pulse'
              : 'bg-amber-100 text-amber-900 border-amber-300'
          }`}>
            {isVerified ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{language === 'mr' ? '✓ सर्व आवश्यकता पडताळल्या' : '✓ REQUIREMENTS VERIFIED'}</span>
              </>
            ) : isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                <span>{language === 'mr' ? '🔄 आवश्यकता पडताळणी सुरू आहे...' : '🔄 VERIFYING REQUIREMENTS...'}</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{language === 'mr' ? '⚠ प्रलंबित आवश्यकता' : '⚠ PENDING REQUIREMENTS'}</span>
              </>
            )}
          </div>
        </div>

        {/* Prototype Summary Reason */}
        <div className={`p-4 rounded-xl text-xs font-medium border ${
          isVerified
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
            : 'bg-amber-50 text-amber-900 border-amber-200'
        }`}>
          <div className="flex items-start space-x-2">
            <span className="text-sm">{isVerified ? '✓' : '💡'}</span>
            <div>
              <strong>{language === 'mr' ? 'स्थिती:' : 'Status:'}</strong> {isVerified 
                ? (language === 'mr' ? 'या सेवेसाठी आवश्यक सर्व माहिती सादर करण्यात आली असून ती पडताळली गेली आहे. आपण आता संमती व डेटा जोडणीकडे पुढे जाऊ शकता.' : 'All required information for this service has been provided and verified. You can now continue to the consent and data connection step.')
                : evaluation.summaryReason}
            </div>
          </div>
        </div>
      </div>

      {/* 1. VERIFYING LOADING OVERLAY (Requirement 1 & 5) */}
      {isVerifying && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm p-8 text-center space-y-3 animate-fadeIn">
          <RefreshCw className="w-10 h-10 text-gov-600 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-slate-900">
            {language === 'mr' ? 'आपल्या माहितीची पडताळणी सुरू आहे...' : 'Verifying your information...'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {language === 'mr' 
              ? `${sName} विभागाच्या निकषांनुसार सादर केलेल्या माहितीची खात्री केली जात आहे.`
              : `Validating provided requirements against ${evaluation.serviceName} department criteria.`}
          </p>
        </div>
      )}

      {/* 2. INVALID / INCOMPLETE FEEDBACK BOX (Requirement 8) */}
      {requirementsState === 'INVALID' && verificationFeedback && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 space-y-3 animate-fadeIn">
          <div className="flex items-center space-x-2 text-rose-900 font-bold text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>{language === 'mr' ? '⚠ पडताळणी अपूर्ण' : '⚠ Verification Incomplete'}</span>
          </div>
          <p className="text-xs text-rose-800">
            {language === 'mr' 
              ? 'काही आवश्यक रकाने अपूर्ण आहेत किंवा दुरुस्ती आवश्यक आहे:'
              : 'Some required fields are missing or need correction:'}
          </p>
          <ul className="list-disc list-inside text-xs text-rose-900 font-medium space-y-1">
            {(verificationFeedback.missing || []).map((m, i) => (
              <li key={i}>{language === 'mr' ? 'अपूर्ण:' : 'Missing:'} <strong>{translateField(m, language)}</strong></li>
            ))}
            {(verificationFeedback.invalid || []).map((inv, i) => (
              <li key={i}>{language === 'mr' ? 'अवैध:' : 'Invalid:'} <strong>{translateField(inv, language)}</strong></li>
            ))}
          </ul>
          <div className="pt-2">
            <button
              onClick={() => { setIsModalOpen(true); setIsReviewScreen(false); }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              {language === 'mr' ? 'अपूर्ण माहिती भरा' : 'Fix Missing Information'}
            </button>
          </div>
        </div>
      )}

      {/* 3. VERIFIED SUMMARY BREAKDOWN (Requirement 2 & 12) */}
      {isVerified ? (
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
          
          <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
            <div>
              <span className="text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded uppercase">
                {language === 'mr' ? 'पडताळणी पूर्ण झाली' : 'Verification Complete'}
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 mt-1">
                {language === 'mr' ? '✓ सर्व आवश्यकता पडताळल्या' : '✓ Requirements Verified'}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'mr' 
                  ? 'या सेवेसाठी आवश्यक सर्व माहिती यशस्वीरीत्या पडताळली आणि जतन केली गेली आहे.'
                  : 'All required service-specific information has been verified and saved.'}
              </p>
            </div>
            
            <button
              onClick={() => { setIsModalOpen(true); setIsReviewScreen(false); }}
              className="text-xs font-bold text-gov-700 hover:text-gov-800 bg-gov-50 border border-gov-200 px-3 py-1.5 rounded-lg flex items-center space-x-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'तपशील संपादित करा' : 'Edit Details'}</span>
            </button>
          </div>

          {/* Grouped Completed Information */}
          <div className="space-y-4">
            {(evaluation.verificationSummaryGroups || []).map((grp, gIdx) => (
              <div key={gIdx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-200 pb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{grp.groupTitle}</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {grp.fields.map((fld) => (
                    <div key={fld.key} className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{translateField(fld.label, language)}:</span>
                      <span className="font-bold text-slate-900 text-xs break-words">{String(fld.value)}</span>
                      <span className="text-[9px] text-emerald-700 font-medium block">
                        {language === 'mr' ? '✓ पडताळणी झाली' : '✓ Verified'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Status & Next Step */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="font-bold text-xs text-emerald-950 block">
                {language === 'mr' ? 'स्थिती: ✓ डेटा जोडणीसाठी सज्ज' : 'Status: ✓ Ready for Data Connection'}
              </span>
              <p className="text-[11px] text-emerald-800">
                {language === 'mr' 
                  ? 'आपण आता संमती पाइपलाइनद्वारे अधिकृत डेटा मिळवण्यासाठी पुढे जाऊ शकता.'
                  : 'You can now proceed to authorize external data retrieval via the consent pipeline.'}
              </p>
            </div>

            <Link
              to={`/consent-auth?serviceId=${id}`}
              className="px-6 py-3 bg-gov-700 hover:bg-gov-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition-all shrink-0"
            >
              <span>{language === 'mr' ? 'संमती व डेटा जोडणीकडे पुढे जा' : 'Continue to Consent & Data Connect'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      ) : !isVerifying && (
        /* 4. PENDING REQUIREMENTS STATE */
        <div className="space-y-6">
          
          {/* Available Information (Verified Profile) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  {language === 'mr' 
                    ? 'उपलब्ध नागरिक प्रोफाईल माहिती (पडताळलेले अभिलेख)' 
                    : 'Available Citizen Profile Information (Verified Records)'}
                </span>
              </h3>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                {language === 'mr' ? '✓ पडताळणी झाली' : '✓ Verified'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {(evaluation.availableFields || []).map((f, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{translateField(f.label, language)}</span>
                  <div className="font-bold text-slate-900">{f.value}</div>
                  <span className="text-[10px] text-emerald-700 font-medium block">✓ {f.source}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Missing Questions Box */}
          <div className="bg-white rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>
                    {language === 'mr'
                      ? `प्रलंबित आवश्यकता (${evaluation.pendingQuestions.length} अपूर्ण)`
                      : `Pending Requirements (${evaluation.pendingQuestions.length} Missing)`}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'mr' 
                    ? 'पुढे जाण्यापूर्वी खालील सेवा-विशिष्ट माहिती भरणे आवश्यक आहे.'
                    : 'The following service-specific information is required before proceeding.'}
                </p>
              </div>

              <button
                onClick={() => { setIsModalOpen(true); setIsReviewScreen(false); }}
                className="px-4 py-2 bg-gov-700 hover:bg-gov-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{language === 'mr' ? 'अपूर्ण माहिती भरा' : 'Complete Missing Information'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {evaluation.pendingQuestions.map((q, idx) => (
                <div key={idx} className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-xl flex items-start justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-amber-700 font-bold">⚠ {translateField(q.label, language)}</span>
                      <span className="text-[10px] font-mono bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                        {language === 'mr' ? 'आवश्यक' : 'Required'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{q.helperText}</p>
                  </div>
                  <span className="text-xs font-semibold text-amber-800 shrink-0 ml-2">
                    {language === 'mr' ? 'कृती आवश्यक' : 'Action Needed'}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-amber-100/70 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-center justify-between">
              <span>
                {language === 'mr' 
                  ? <>या सेवा आवश्यकता पूर्ण करण्यासाठी <strong>[अपूर्ण माहिती भरा]</strong> वर क्लिक करा.</>
                  : <>Click <strong>[Complete Missing Information]</strong> to provide these service requirements.</>}
              </span>
              <button
                onClick={() => { setIsModalOpen(true); setIsReviewScreen(false); }}
                className="font-bold underline text-gov-800 hover:text-gov-900"
              >
                {language === 'mr' ? 'तपशील भरा →' : 'Provide Details →'}
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2">
            <Link
              to={`/services/${id}`}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold"
            >
              {language === 'mr' ? '← सेवेच्या तपशीलाकडे परत जा' : 'Back to Service Details'}
            </Link>

            <button
              onClick={() => { setIsModalOpen(true); setIsReviewScreen(false); }}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm transition-all"
            >
              <span>{language === 'mr' ? 'पुढे जाण्यासाठी आवश्यकता पूर्ण करा' : 'Complete Requirements to Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* 5. INTERACTIVE MODAL & VERIFICATION SCREEN (Requirements 6, 7 & 8) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold font-mono bg-gov-100 text-gov-800 px-2.5 py-0.5 rounded uppercase">
                  {language === 'mr'
                    ? (isReviewScreen ? 'टप्पा २: माहितीचे पुनरावलोकन' : 'टप्पा १: आवश्यक माहितीचा अर्ज')
                    : (isReviewScreen ? 'Step 2: Review Information' : 'Step 1: Requirements Form')}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {language === 'mr'
                    ? (isReviewScreen ? 'कृपया भरलेल्या माहितीचे पुनरावलोकन करा' : 'अपूर्ण माहिती भरा')
                    : (isReviewScreen ? 'Please Review Your Provided Details' : 'Complete Missing Information')}
                </h3>
                <p className="text-xs text-slate-500">{language === 'mr' ? 'योजना:' : 'Service:'} {sName}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SCREEN 1: Input Form */}
            {!isReviewScreen ? (
              <form onSubmit={handleSaveInformation} className="space-y-4 text-xs">
                {(evaluation.pendingQuestions || []).concat(evaluation.completedQuestions || []).map((q) => (
                  <div key={q.key} className="space-y-1">
                    <label className="block font-bold text-slate-700 text-[11px]">
                      {translateField(q.label, language)} {q.required && <span className="text-rose-600">*</span>}
                    </label>
                    
                    {q.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={formInputs[q.key] || ''}
                        onChange={(e) => handleInputChange(q.key, e.target.value)}
                        placeholder={q.placeholder}
                        className={`w-full p-2.5 rounded-lg border font-medium text-slate-900 transition-colors ${
                          formErrors[q.key] ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 bg-slate-50 focus:bg-white focus:border-gov-500'
                        }`}
                      />
                    ) : q.type === 'select' ? (
                      <select
                        value={formInputs[q.key] || ''}
                        onChange={(e) => handleInputChange(q.key, e.target.value)}
                        className={`w-full p-2.5 rounded-lg border font-medium text-slate-900 transition-colors ${
                          formErrors[q.key] ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 bg-slate-50 focus:bg-white focus:border-gov-500'
                        }`}
                      >
                        <option value="">-- {q.placeholder || (language === 'mr' ? 'पर्याय निवडा' : 'Select Option')} --</option>
                        {(q.options || []).map((opt, i) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={q.type || 'text'}
                        value={formInputs[q.key] || ''}
                        onChange={(e) => handleInputChange(q.key, e.target.value)}
                        placeholder={q.placeholder}
                        className={`w-full p-2.5 rounded-lg border font-medium text-slate-900 transition-colors ${
                          formErrors[q.key] ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 bg-slate-50 focus:bg-white focus:border-gov-500'
                        }`}
                      />
                    )}

                    {formErrors[q.key] ? (
                      <span className="text-[10px] text-rose-600 font-semibold block">{formErrors[q.key]}</span>
                    ) : (
                      <span className="text-[10px] text-slate-400 block">{q.helperText}</span>
                    )}
                  </div>
                ))}

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                  >
                    {language === 'mr' ? 'रद्द करा' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gov-700 hover:bg-gov-800 text-white rounded-xl font-bold shadow-sm transition-all"
                  >
                    {language === 'mr' ? 'माहिती जतन करा →' : 'Save Information →'}
                  </button>
                </div>
              </form>
            ) : (
              /* SCREEN 2: Verification Review Screen (Requirement 6) */
              <div className="space-y-4 text-xs">
                <p className="text-slate-600">
                  {language === 'mr' 
                    ? 'प्रणाली पडताळणी चालवण्यापूर्वी कृपया खालील भरलेल्या माहितीचे पुनरावलोकन करा:'
                    : 'Please review the entered information below before running system verification:'}
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  {(evaluation.pendingQuestions || []).concat(evaluation.completedQuestions || []).map((q) => (
                    <div key={q.key} className="border-b border-slate-200 pb-2 last:border-b-0 space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{translateField(q.label, language)}:</span>
                      <span className="font-bold text-slate-900 text-xs break-words">
                        {String(formInputs[q.key] || (language === 'mr' ? 'माहिती दिलेली नाही' : 'Not Provided'))}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsReviewScreen(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center space-x-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{language === 'mr' ? 'माहिती संपादित करा' : 'Edit Information'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleVerifyInformation}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm transition-all flex items-center space-x-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{language === 'mr' ? 'माहिती पडताळा' : 'Verify Information'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default EligibilityCheckPage;
