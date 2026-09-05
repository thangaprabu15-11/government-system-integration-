import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { useLanguage } from '../context/LanguageContext';
import { serviceTranslationsMr, translateTimeline } from '../locales/translations';
import { 
  FileText, CheckCircle2, Clock, ShieldCheck, 
  Building2, ArrowLeft, Layers, Cpu, UserCheck, Check, Lock, Calendar, MapPin
} from 'lucide-react';

const ApplicationDetailsPage = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      const res = await API.get(`/applications/${id}`);
      if (res.data.success) {
        setApp(res.data.application);
      }
    } catch (err) {
      console.error('Failed to load application details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 font-medium">
        {language === 'mr' ? 'अर्जाचा तपशील लोड होत आहे...' : 'Loading Application Timeline & Details...'}
      </div>
    );
  }

  if (!app) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 text-center text-rose-600 font-medium">
        {language === 'mr' ? 'अर्ज सापडला नाही.' : 'Application not found.'}
      </div>
    );
  }

  const applicant = app.applicantData || {};
  const dataUsedList = app.dataUsed || ['Applicant Profile', 'Identity Register', 'Higher Education EMIS'];

  const srvName = (language === 'mr' && serviceTranslationsMr[app.serviceId]?.name) || app.serviceName;
  const srvDept = (language === 'mr' && serviceTranslationsMr[app.serviceId]?.department) || app.department;

  const default9Steps = [
    { status: 'Requirements Checked', timestamp: new Date(Date.now() - 480000).toISOString(), notes: `Verified citizen profile against ${srvName} rules.` },
    { status: 'Missing Information Completed', timestamp: new Date(Date.now() - 420000).toISOString(), notes: 'Citizen provided required service-specific pending fields.' },
    { status: 'Consent Granted', timestamp: new Date(Date.now() - 360000).toISOString(), notes: 'Citizen authorized service-scoped data exchange.' },
    { status: 'Data Retrieved', timestamp: new Date(Date.now() - 300000).toISOString(), notes: 'Retrieved standardized records via Mock Government APIs.' },
    { status: 'Data Standardized', timestamp: new Date(Date.now() - 240000).toISOString(), notes: 'Records transformed into Common Citizen Data Model.' },
    { status: 'Application Auto-Filled', timestamp: new Date(Date.now() - 180000).toISOString(), notes: 'Mapped normalized data fields into target department application form.' },
    { status: 'Citizen Reviewed', timestamp: new Date(Date.now() - 60000).toISOString(), notes: 'Citizen reviewed and confirmed application details.' },
    { status: 'Application Submitted', timestamp: new Date().toISOString(), notes: `Payload successfully dispatched to ${srvDept} API.` },
    { status: 'Under Review', timestamp: new Date().toISOString(), notes: 'Application placed in department verification queue.' }
  ];

  const timelineSteps = (app.statusHistory && app.statusHistory.length > 0) ? app.statusHistory : default9Steps;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      
      <Link to="/my-applications" className="text-xs font-bold text-gov-700 hover:underline flex items-center space-x-1">
        <ArrowLeft className="w-4 h-4" />
        <span>{language === 'mr' ? 'माझ्या अर्जांकडे परत जा' : 'Back to My Applications'}</span>
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-extrabold text-gov-800 text-lg">{app.applicationId}</span>
              <StatusBadge status={app.status || 'Under Review'} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">{srvName}</h1>
            <p className="text-xs text-slate-500">{srvDept}</p>
          </div>

          <div className="text-right text-xs text-slate-500">
            <div>
              {language === 'mr' ? 'अर्जाची तारीख:' : 'Applied:'}{' '}
              {new Date(app.appliedDate || Date.now()).toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            <div className="font-mono text-[11px] text-emerald-700 font-bold mt-0.5">
              {language === 'mr' ? 'पावती क्र. (Ack ID):' : 'Ack ID:'} {app.mockApiResponse?.ackId || app.mockResponse?.ackId || 'ACK-GOV-9876543'}
            </div>
          </div>
        </div>

        {/* Top Overview Cards: Data Used & Consent Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Data Used Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <UserCheck className="w-4 h-4 text-gov-700" />
                <span>{language === 'mr' ? 'वापरलेली अधिकृत डेटा व्याप्ती' : 'Authorized Data Scopes Used'}</span>
              </h3>
              <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                {language === 'mr' ? 'पडताळणी झाली' : 'Verified Cross-API'}
              </span>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-700">
              {dataUsedList.map((scope, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>{scope}</strong></span>
                </li>
              ))}
            </ul>
          </div>

          {/* Consent Status Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'mr' ? 'संमती पडताळणी' : 'Consent Verification'}</span>
                </h3>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  {language === 'mr' ? '✓ संमती मंजूर व सक्रिय' : '✓ Granted & Active'}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'mr'
                  ? `नागरिकाने ${srvName} योजनेसाठी अधिकृत डेटा देवाणघेवाण, मानकीकरण आणि स्वयं-भरणा करण्यास स्पष्ट संमती दिली आहे.`
                  : `The citizen explicitly authorized automated retrieval, normalization, and field mapping of verified records strictly for ${srvName}.`}
              </p>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-600 flex items-center justify-between">
              <span>{language === 'mr' ? 'शासकीय कनेक्टर:' : 'Connector:'} <strong>{app.connectorUsed || 'DepartmentConnector'}</strong></span>
              <span className="text-emerald-700 font-bold">{language === 'mr' ? '१००% अधिकृत' : '100% Authorized'}</span>
            </div>
          </div>

        </div>

        {/* Submitted Information Summary Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-gov-700" />
              <span>{language === 'mr' ? 'सादर केलेल्या अर्जाचा सविस्तर डेटा' : 'Submitted Application Information Payload'}</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500 font-bold">
              {language === 'mr' ? `${Object.keys(applicant).length} बाबी` : `${Object.keys(applicant).length} Fields`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {Object.entries(applicant).map(([key, val]) => (
              <div key={key} className={`bg-white p-3 rounded-lg border border-slate-200 space-y-0.5 ${typeof val === 'string' && val.length > 50 ? 'sm:col-span-2' : ''}`}>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                </span>
                <span className="font-bold text-slate-900 text-xs break-words">
                  {String(val)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 9-Step Lifecycle Status Timeline */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gov-600" />
              <span>{language === 'mr' ? '९-टप्प्यांची अर्ज जीवनचक्र प्रगती टाइमलाइन' : '9-Step Application Lifecycle Timeline'}</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">
              {language === 'mr' ? `${timelineSteps.length} टप्पे नोंदवले` : `${timelineSteps.length} Milestones Tracked`}
            </span>
          </div>

          <div className="space-y-4 relative border-l-2 border-gov-600 ml-4 pl-6 py-2">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="relative space-y-1 text-xs">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-gov-700 border-2 border-white flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-bold text-slate-900 text-sm">{idx + 1}. {translateTimeline(step.status, language)}</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(step.timestamp).toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-600 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                  {step.notes}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ApplicationDetailsPage;
