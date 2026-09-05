import React, { useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import API from '../services/api';
import { 
  translateServiceName, 
  translateDepartment, 
  translateField, 
  serviceTranslationsMr 
} from '../locales/translations';
import { 
  CheckCircle2, ShieldCheck, ArrowRight, Lock, 
  FileText, Building2, AlertTriangle, Edit3, UserCheck, Calendar, MapPin
} from 'lucide-react';
import FirebaseService from '../services/firebaseDb';

const sectionTranslationsMr = {
  'Personal Identity Details': 'वैयक्तिक व ओळख तपशील',
  'Academic & Qualification Metrics': 'शैक्षणिक व पात्रता निकष',
  'Income & Community Validation': 'उत्पन्न व सामाजिक प्रवर्ग पडताळणी',
  'Residential & Contact Information': 'रहिवासी व संपर्क तपशील',
  'Service Specific Details': 'योजना-विशिष्ट तपशील',
  'Applicant Identification': 'अर्जदार ओळख',
  'Academic Information': 'शैक्षणिक माहिती',
  'Income Verification': 'उत्पन्न पडताळणी'
};

const translateSection = (title, lang) => {
  if (lang === 'mr' && sectionTranslationsMr[title]) {
    return sectionTranslationsMr[title];
  }
  return title;
};

const ApplicationReviewPage = () => {
  const { serviceId } = useParams();
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const preparedData = location.state?.preparedData;
  const updatedFormData = location.state?.updatedFormData || {};

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const rawService = preparedData?.service || {
    serviceId: serviceId || 'SRV-FGB-01',
    serviceName: 'First-Generation Graduate Benefit',
    department: 'Department of Higher Education'
  };

  const sName = translateServiceName(rawService.serviceId, rawService.serviceName, language);
  const sDept = translateDepartment(rawService.serviceId, rawService.department, language);

  const autoFillSections = preparedData?.autoFillSections || [];

  const handleFinalSubmission = async () => {
    setSubmitting(true);
    setError('');
    try {
      const activeServiceId = rawService.serviceId || 'SRV-FGB-01';
      const res = await API.post('/application/submit', {
        serviceId: activeServiceId,
        applicantData: updatedFormData
      });

      if (res.data.success) {
        // Asynchronously persist to Firebase Firestore Database (brototype-79697)
        FirebaseService.saveApplication({
          id: res.data.application?.applicationId || `APP-${Date.now()}`,
          serviceId: activeServiceId,
          serviceName: rawService.serviceName,
          department: rawService.department,
          citizenId: user?.id || 'demo_citizen',
          citizenName: user?.name || 'Thanga Prabu N',
          applicantData: updatedFormData,
          status: 'Submitted',
          submittedAt: new Date().toISOString()
        }).catch(e => console.warn('Firebase async sync:', e));

        sessionStorage.removeItem(`civic_inputs_${activeServiceId}`);
        navigate(`/application-success/${res.data.application.applicationId}`, {
          state: { application: res.data.application, mockResponse: res.data.mockResponse }
        });
      }
    } catch (err) {
      console.error('Final submission failed:', err);
      setError(err.response?.data?.message || (language === 'mr' ? 'अर्ज सादरीकरण अयशस्वी झाले.' : 'Application submission failed.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold font-mono bg-gov-100 text-gov-800 px-2.5 py-0.5 rounded uppercase">
              {language === 'mr' ? 'नागरिक पुनरावलोकन व पुष्टीकरण' : 'Citizen Review & Confirmation'}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              {language === 'mr' ? 'आपल्या अर्जाची पडताळणी करा' : 'Review Your Application'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'mr'
                ? 'विभागीय प्रणालीकडे पाठवण्यापूर्वी कृपया सर्व माहिती काळजीपूर्वक तपासा.'
                : 'Please review all submitted information before dispatching to the department portal.'}
            </p>
          </div>

          <span className="text-xs font-mono bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
            {sName}
          </span>
        </div>

        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-600 p-3 rounded text-xs text-rose-800 font-medium">
            {error}
          </div>
        )}

        {/* Populated Summary Review Sections - Service Specific */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <UserCheck className="w-4 h-4 text-gov-700" />
              <span>{language === 'mr' ? 'अर्जाचा सारांश आणि डेटा तपशील' : 'Application Summary & Data Payload'}</span>
            </h3>
            <button
              onClick={() => navigate(-1)}
              className="text-xs text-gov-700 hover:text-gov-800 flex items-center space-x-1 font-bold bg-gov-50 px-3 py-1 rounded-lg border border-gov-200"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'माहिती संपादित करा' : 'Edit Information'}</span>
            </button>
          </div>

          {autoFillSections.length > 0 ? (
            autoFillSections.map((sec, sIdx) => (
              <div key={sIdx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-1.5">
                  {translateSection(sec.sectionTitle, language)}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {sec.fields.map((fld) => (
                    <div key={fld.key} className={`bg-white p-3 rounded-lg border border-slate-200 space-y-0.5 ${fld.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">{translateField(fld.label, language)}:</span>
                      <span className="font-bold text-slate-900 text-xs break-words">
                        {String(updatedFormData[fld.key] || (language === 'mr' ? 'माहिती दिलेली नाही' : 'Not Specified'))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(updatedFormData).map(([k, v]) => (
                <div key={k} className="bg-white p-3 rounded-lg border border-slate-200 space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{translateField(k, language)}:</span>
                  <span className="font-bold text-slate-900 text-xs">{String(v)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legal Declaration */}
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs space-y-2 text-amber-950">
          <div className="flex items-center space-x-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>{language === 'mr' ? 'नागरिक कायदेशीर हमीपत्र व पडताळणी अधिकृतीकरण' : 'Citizen Legal Declaration & Verification Authorization'}</span>
          </div>
          <p className="text-[11px] text-amber-900 leading-relaxed">
            {language === 'mr' 
              ? <>मी याद्वारे घोषित करतो/करते की वर दिलेली सर्व माहिती माझ्या माहितीनुसार खरी व बिनचूक आहे. मी या पडताळलेल्या नोंदी अधिकृत शासकीय प्रक्रियेसाठी <strong>{sDept}</strong> कडे सादर करण्यास संमती देत आहे.</>
              : <>I hereby declare that all details provided above are true to the best of my knowledge. I consent to submission of these verified records to <strong>{rawService.department}</strong> for official processing.</>}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
          >
            {language === 'mr' ? 'माहिती संपादित करा' : 'Edit Information'}
          </button>

          <button
            onClick={handleFinalSubmission}
            disabled={submitting}
            className="px-8 py-3.5 bg-gov-700 hover:bg-gov-800 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md transition-all disabled:opacity-50"
          >
            {submitting ? (
              <span>{language === 'mr' ? 'अर्ज सादर होत आहे...' : 'Submitting Application...'}</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{language === 'mr' ? 'पुष्टी करा व सादर करा' : 'Confirm & Submit'}</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

export default ApplicationReviewPage;
