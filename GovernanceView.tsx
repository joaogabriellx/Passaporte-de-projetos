/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { UserProfile } from '../types';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  activeProfile: UserProfile;
  profiles: UserProfile[];
  onProfileChange: (profile: UserProfile) => void;
}

export default function Sidebar({
  currentTab,
  onTabChange,
  activeProfile,
  profiles,
  onProfileChange,
}: SidebarProps) {
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

  const navItems = [
    { id: 'timeline', label: 'Linha do Tempo', icon: 'timeline' },
    { id: 'commitments', label: 'Compromissos Ativos', icon: 'assignment_turned_in' },
    { id: 'governance', label: 'Governança', icon: 'gavel' },
    { id: 'archive', label: 'Arquivo de Aprendizado', icon: 'library_books' },
  ];

  const handleProfileSelect = (profile: UserProfile) => {
    onProfileChange(profile);
    setShowProfileSwitcher(false);
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-slate-900 text-slate-100 border-r border-slate-800 flex flex-col py-6 z-50 shadow-2xl transition-all duration-300">
      {/* Brand Header */}
      <div className="px-6 mb-8 group cursor-pointer">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-400 text-3xl animate-pulse">
              verified_user
            </span>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
              Passaporte
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono tracking-widest uppercase font-semibold text-emerald-400/90 pl-8">
            Regulação Consciente
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-250 cursor-pointer ${
                isActive
                  ? 'border-l-4 border-emerald-400 text-white font-semibold bg-slate-800/80 shadow-lg shadow-emerald-500/5'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
              }`}
            >
              <span
                className={`material-symbols-outlined text-2xl transition-transform duration-300 ${
                  isActive ? 'text-emerald-400 scale-110' : 'text-slate-400'
                }`}
              >
                {item.icon}
              </span>
              <span className="text-[14px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Audit Logs Tab & Profile Switcher */}
      <div className="px-4 mt-auto space-y-4">
        <button
          onClick={() => onTabChange('audit_logs')}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-250 text-left cursor-pointer ${
            currentTab === 'audit_logs'
              ? 'border-l-4 border-emerald-400 text-purple-200 font-semibold bg-slate-800/80'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">history_edu</span>
          <span className="text-[14px]">Log de Auditoria</span>
        </button>

        {/* Profile Card / Swapper Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
            className="w-full flex items-center gap-3 p-3 bg-slate-800/90 hover:bg-slate-800 rounded-2xl border border-slate-700/60 shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
            title="Clique para alternar gestor/perfil"
          >
            <img
              alt={activeProfile.avatarAlt}
              src={activeProfile.avatar}
              className="w-10 h-10 rounded-full object-cover border-2 border-slate-600 shadow-md mr-1"
            />
            <div className="flex flex-col text-left overflow-hidden">
              <span className="font-bold text-slate-100 text-[13px] truncate flex items-center gap-1">
                {activeProfile.name}
                <span className="material-symbols-outlined text-[14px] text-slate-400 uppercase">
                  unfold_more
                </span>
              </span>
              <span className="text-[11px] text-emerald-400 font-mono tracking-wider truncate uppercase">
                {activeProfile.role}
              </span>
            </div>
          </button>

          {/* Profile Switcher Bubble Dropdown */}
          {showProfileSwitcher && (
            <div className="absolute bottom-16 left-0 w-full bg-slate-800 border-2 border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-200">
              <div className="px-3 py-1.5 border-b border-slate-700 mb-1">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">
                  Selecione o Agente do Portal
                </span>
              </div>
              <div className="max-h-[220px] overflow-y-auto space-y-1 custom-scrollbar">
                {profiles.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => handleProfileSelect(profile)}
                    className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                      activeProfile.id === profile.id
                        ? 'bg-slate-700 text-white font-medium'
                        : 'hover:bg-slate-700/50'
                    }`}
                  >
                    <img
                      alt={profile.avatarAlt}
                      src={profile.avatar}
                      className="w-8 h-8 rounded-full object-cover border border-slate-600"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[12px] text-slate-200 font-bold truncate">
                        {profile.name}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate">
                        {profile.role}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
