import React from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  translateServiceName, 
  translateDepartment 
} from '../locales/translations';
import { 
  CheckCircle2, FileText, ArrowRight, ShieldCheck, 
  Building2, ExternalLink, LayoutDashboard, UserCheck, Calendar, Check
} from 'lucide-react';

const ApplicationSuccessPage = () => {
  const { applicationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const appData = location.state?.application;
  const mockResponse = location.state?.mockResponse;

  const applicantName = appData?.applicantData?.fullName || 'Thanga Prabu N';
  const rawServiceName = appData?.serviceName || 'First-Generation Graduate Benefit';
  const rawDepartmentName = appData?.department || 'Department of Higher Education';
  const serviceId = appData?.serviceId || 'SRV-FGB-01';

  const sName = translateServiceName(serviceId, rawServiceName, language);
  const sDept = translateDepartment(serviceId, rawDepartmentName, language);

  const formattedDate = new Date().toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-2xl mx-auto my-12 px-4">
      
      {/* Success Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-8 text-center space-y-6">
        
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <Check className="w-10 h-10 text-emerald-600" />
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full uppercase tracking-wider">
            {language === 'mr' ? '✓ अर्ज यशस्वीरीत्या सादर केला गेला' : '✓ Application Submitted Successfully'}
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
            {language === 'mr' ? 'अर्ज प्राप्त झाला' : 'Application Received'}
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {language === 'mr'
              ? 'आपला अर्ज संबंधित शासकीय विभागाच्या प्रणालीमध्ये प्राप्त झाला असून अधिकृतपणे नोंदवला गेला आहे.'
              : 'Your application has been received and registered with the department verification system.'}
          </p>
        </div>

        {/* Application Credentials Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-slate-500 font-medium">
              {language === 'mr' ? 'अर्ज क्रमांक:' : 'Application ID:'}
            </span>
            <span className="font-mono font-extrabold text-gov-800 text-sm bg-gov-100 px-3 py-1 rounded border border-gov-300">
              {applicationId || 'CIV-FGB-2026-001'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">
              {language === 'mr' ? 'योजनेचे नाव:' : 'Service Name:'}
            </span>
            <span className="font-bold text-slate-900">{sName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">
              {language === 'mr' ? 'अर्जदाराचे नाव:' : 'Applicant Name:'}
            </span>
            <span className="font-bold text-slate-900">{applicantName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">
              {language === 'mr' ? 'संबंधित विभाग:' : 'Target Department:'}
            </span>
            <span className="font-medium text-slate-700">{sDept}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">
              {language === 'mr' ? 'सादर केल्याची वेळ:' : 'Submission Timestamp:'}
            </span>
            <span className="text-slate-700 font-mono">{formattedDate}</span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 pt-2.5">
            <span className="text-slate-500 font-medium">
              {language === 'mr' ? 'सद्यस्थिती:' : 'Current Status:'}
            </span>
            <span className="bg-amber-100 text-amber-900 font-mono font-bold px-2.5 py-0.5 rounded text-[11px]">
              {language === 'mr' ? 'सादर केले / छाननी सुरू' : 'Submitted / Under Review'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/my-applications"
            className="w-full sm:w-auto px-8 py-3 bg-gov-700 hover:bg-gov-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>{language === 'mr' ? 'माझे अर्ज पहा' : 'Go to My Applications'}</span>
          </Link>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{language === 'mr' ? 'मुख्य नियंत्रण कक्षाकडे परत जा' : 'Return to Dashboard'}</span>
          </Link>
        </div>

      </div>

    </div>
  );
};

export default ApplicationSuccessPage;

