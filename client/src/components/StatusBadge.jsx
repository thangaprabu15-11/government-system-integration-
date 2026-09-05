import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, XCircle, FileEdit, ShieldAlert, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translateStatus } from '../locales/translations';

const StatusBadge = ({ status }) => {
  const { language } = useLanguage();

  const getBadgeConfig = (st) => {
    switch (st) {
      case 'Draft':
        return { color: 'bg-slate-100 text-slate-700 border-slate-300', icon: FileEdit };
      case 'Awaiting Consent':
        return { color: 'bg-amber-50 text-amber-800 border-amber-300', icon: ShieldAlert };
      case 'Submitted':
        return { color: 'bg-blue-50 text-blue-800 border-blue-300', icon: CheckCircle2 };
      case 'Processing':
        return { color: 'bg-indigo-50 text-indigo-800 border-indigo-300', icon: RefreshCw };
      case 'Under Review':
        return { color: 'bg-purple-50 text-purple-800 border-purple-300', icon: Clock };
      case 'Approved':
        return { color: 'bg-emerald-50 text-emerald-800 border-emerald-300', icon: CheckCircle2 };
      case 'Rejected':
        return { color: 'bg-rose-50 text-rose-800 border-rose-300', icon: XCircle };
      case 'Action Required':
        return { color: 'bg-amber-100 text-amber-900 border-amber-400 font-bold', icon: AlertTriangle };
      default:
        return { color: 'bg-slate-100 text-slate-800 border-slate-300', icon: Clock };
    }
  };

  const config = getBadgeConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${config.color} space-x-1.5 shadow-2xs`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{translateStatus(status, language)}</span>
    </span>
  );
};

export default StatusBadge;
