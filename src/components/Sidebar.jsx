import React from 'react';
import { NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';

const menu = [
  { path: '/dashboard', label: 'ڈیش بورڈ', icon: '▦' },
  { path: '/users', label: 'صارفین اور پروفائلز', icon: '♙' },
  { path: '/verification', label: 'تصدیق', icon: '✓' },
  { path: '/reports', label: 'رپورٹس اور سیفٹی', icon: '⚠' },
  { path: '/subscriptions', label: 'پریمیم ممبرشپ', icon: '◆' },
  { path: '/payments', label: 'ادائیگیاں', icon: '₨' },
  { path: '/pricing', label: 'قیمتوں کا کنٹرول', icon: '₿' },
  { path: '/notifications', label: 'نوٹیفکیشنز', icon: '◉' },
  { path: '/content', label: 'مواد اور FAQ', icon: '▤' },
  { path: '/admin-security', label: 'ایڈمن سیکیورٹی', icon: '🔒' },
];

const Sidebar = ({ open, onClose }) => {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="مینو بند کریں"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-[280px] max-w-[86vw] flex-col
        bg-[#4A0E0E] text-white shadow-2xl transition-transform duration-200
        lg:translate-x-0
        ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <div>
            <div className="text-xl font-bold tracking-wide">AZWAJ</div>
            <div className="mt-0.5 text-xs text-[#D4AF37]">
              Admin Panel
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-xl hover:bg-white/10 lg:hidden"
            aria-label="مینو بند کریں"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-3 px-3 text-[11px] font-semibold text-white/50">
            MANAGEMENT
          </div>

          <div className="space-y-1">
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium
                  transition-colors
                  ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#4A0E0E] shadow-sm'
                      : 'text-white/85 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/10 text-base">
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="shrink-0 border-t border-white/10 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-red-600"
          >
            لاگ آؤٹ
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
