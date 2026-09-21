import React from 'react';
import { useLocation } from 'react-router-dom';
import { auth } from '../utils/firebase';

const titles = {
  '/dashboard': 'ڈیش بورڈ',
  '/users': 'صارفین اور پروفائلز',
  '/verification': 'پروفائل تصدیق',
  '/reports': 'رپورٹس اور سیفٹی',
  '/subscriptions': 'پریمیم ممبرشپ',
  '/payments': 'ادائیگیاں',
  '/pricing': 'قیمتوں کا کنٹرول',
  '/notifications': 'نوٹیفکیشنز',
  '/content': 'مواد اور FAQ',
  '/admin-security': 'ایڈمن سیکیورٹی',
};

const Topbar = ({ onMenuClick }) => {
  const location = useLocation();
  const title = titles[location.pathname] || 'Azwaj Admin';

  return (
    <header className="sticky top-0 z-30 border-b border-[#4A0E0E]/10 bg-[#FFFDF9]/95 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-5 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl border border-[#4A0E0E]/10 bg-white px-3 py-2 text-lg text-[#4A0E0E] shadow-sm lg:hidden"
            aria-label="سائیڈبار کھولیں"
          >
            ☰
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-[#4A0E0E] sm:text-xl">
              {title}
            </h1>
            <p className="hidden text-xs text-gray-500 sm:block">
              Azwaj Administration
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden max-w-[220px] truncate rounded-xl border border-[#4A0E0E]/10 bg-white px-3 py-2 text-xs text-gray-600 sm:block">
            {auth.currentUser?.email || 'Admin'}
          </div>

          <div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4A0E0E] text-sm font-bold text-[#D4AF37]"
            title="Admin"
          >
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
