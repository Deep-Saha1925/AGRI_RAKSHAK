import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Sprout, Camera, Bell, User as UserIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getAlerts } from '../api/alerts';

export const BottomNav: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadAlerts = async () => {
    try {
      const alerts = await getAlerts();
      const count = alerts.filter((a) => !a.is_read).length;
      setUnreadCount(count);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchUnreadAlerts();
    const interval = setInterval(fetchUnreadAlerts, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav
      id="farmer-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff] border-t border-[#d8dbd5] shadow-lg pb-safe"
    >
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around relative">
        {/* 1. Dashboard */}
        <NavLink
          id="nav-link-dashboard"
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-lg transition-colors ${
              isActive ? 'text-[#004527] font-bold' : 'text-[#707971] hover:text-[#191c19]'
            }`
          }
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">{t.home}</span>
        </NavLink>

        {/* 2. My Fields */}
        <NavLink
          id="nav-link-fields"
          to="/fields"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-lg transition-colors ${
              isActive ? 'text-[#004527] font-bold' : 'text-[#707971] hover:text-[#191c19]'
            }`
          }
        >
          <Sprout className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">{t.fields}</span>
        </NavLink>

        {/* 3. Primary Center CTA: Scan Crop */}
        <div className="flex flex-col items-center -mt-6">
          <button
            id="nav-btn-scan-center"
            onClick={() => navigate('/scan')}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#004527] to-[#1b5e3b] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all border-4 border-[#f8faf4] cursor-pointer"
            title={t.scanYourCrop}
          >
            <Camera className="w-7 h-7 text-[#aef2c4]" />
          </button>
          <span className="text-[11px] font-bold text-[#004527] mt-0.5">{t.scanYourCrop}</span>
        </div>

        {/* 4. Alerts */}
        <NavLink
          id="nav-link-alerts"
          to="/alerts"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-lg relative transition-colors ${
              isActive ? 'text-[#004527] font-bold' : 'text-[#707971] hover:text-[#191c19]'
            }`
          }
        >
          <div className="relative">
            <Bell className="w-5 h-5 mb-0.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#ba1a1a] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-[11px] leading-tight">{t.alerts}</span>
        </NavLink>

        {/* 5. Profile / Settings */}
        <NavLink
          id="nav-link-profile"
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-lg transition-colors ${
              isActive ? 'text-[#004527] font-bold' : 'text-[#707971] hover:text-[#191c19]'
            }`
          }
        >
          <UserIcon className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">
            {t.fullName.split(' ')[0] || 'Profile'}
          </span>
        </NavLink>
      </div>
    </nav>
  );
};
