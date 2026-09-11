import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getAlerts, markAlertRead } from '../api/alerts';
import { FarmerAlert } from '../types';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  CheckCheck,
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState<FarmerAlert[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);

  const fetchAlertsList = async () => {
    try {
      const data = await getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertsList();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    await markAlertRead(id);
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_read: true } : a))
    );
  };

  const handleMarkAllRead = async () => {
    const unread = alerts.filter((a) => !a.is_read);
    for (const a of unread) {
      await markAlertRead(a.id);
    }
    setAlerts((prev) => prev.map((a) => ({ ...a, is_read: true })));
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'unread') return !a.is_read;
    return true;
  });

  const getAlertStyle = (type: string, severity?: string) => {
    if (severity === 'high' || type === 'high_risk') {
      return {
        badge: 'bg-red-100 text-red-800 border-red-200',
        card: 'bg-[#fff5f5] border-red-200',
        icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      };
    }
    if (type === 'diagnosis_ready') {
      return {
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        card: 'bg-[#f0fdf4] border-emerald-200',
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      };
    }
    return {
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      card: 'bg-white border-[#e7e9e3]',
      icon: <Bell className="w-5 h-5 text-[#004527]" />,
    };
  };

  return (
    <div className="min-h-screen bg-[#f8faf4] pb-28 px-4 pt-4 max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-[#004527]">
            {t.alerts}
          </h1>
          <p className="text-xs text-[#707971]">
            {language === 'mr' ? 'हवामान, रोग व तपासणीच्या तात्काळ सूचना' : 'Real-time farm risk notifications'}
          </p>
        </div>

        {alerts.some((a) => !a.is_read) && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-bold text-[#1b5e3b] hover:text-[#004527] flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>{language === 'mr' ? 'सर्व वाचल्याचे नोंदवा' : 'Mark all read'}</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-[#004527] text-white'
              : 'bg-white text-[#404942] border border-[#d8dbd5]'
          }`}
        >
          {language === 'mr' ? 'सर्व सूचना' : 'All Alerts'} ({alerts.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            filter === 'unread'
              ? 'bg-[#004527] text-white'
              : 'bg-white text-[#404942] border border-[#d8dbd5]'
          }`}
        >
          {language === 'mr' ? 'न वाचलेल्या' : 'Unread'} ({alerts.filter((a) => !a.is_read).length})
        </button>
      </div>

      {/* Alerts List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#707971]">Loading alerts...</div>
      ) : filteredAlerts.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-[#e7e9e3]">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
          <h2 className="text-base font-bold text-[#191c19]">
            {language === 'mr' ? 'कोणत्याही नवीन सूचना नाहीत' : 'No alerts right now'}
          </h2>
          <p className="text-xs text-[#707971] mt-1">
            {language === 'mr' ? 'आपली शेती सुरक्षित व सामान्य स्थितीत आहे.' : 'Your farm health looks good.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const style = getAlertStyle(alert.type, alert.severity);
            return (
              <div
                key={alert.id}
                id={`alert-card-${alert.id}`}
                className={`rounded-2xl p-4 sm:p-5 border shadow-2xs transition-all ${style.card}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-black/5 flex items-center justify-center shrink-0">
                      {style.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-[#191c19]">
                          {alert.title}
                        </h2>
                        {!alert.is_read && (
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        )}
                      </div>
                      <p className="text-xs text-[#404942] mt-1 leading-relaxed">
                        {alert.message}
                      </p>
                      <span className="text-[10px] text-[#707971] mt-1.5 block">
                        {new Date(alert.created_at).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 pt-3 border-t border-black/5 flex items-center justify-between">
                  {!alert.is_read ? (
                    <button
                      onClick={() => handleMarkAsRead(alert.id)}
                      className="text-xs font-semibold text-[#707971] hover:text-[#191c19] cursor-pointer"
                    >
                      {language === 'mr' ? 'वाचल्याचे नोंदवा' : 'Mark as read'}
                    </button>
                  ) : (
                    <span className="text-[11px] text-[#707971]">Read</span>
                  )}

                  {alert.action_url && (
                    <button
                      onClick={() => {
                        handleMarkAsRead(alert.id);
                        navigate(alert.action_url!);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#004527] text-white text-xs font-bold hover:bg-[#1b5e3b] flex items-center gap-1 cursor-pointer"
                    >
                      <span>{t.viewDetails}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
