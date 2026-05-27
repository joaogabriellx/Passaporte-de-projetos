/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MarketReport, AuditLog, UserProfile } from '../types';

interface GovernanceViewProps {
  marketReports: MarketReport[];
  auditLogs: AuditLog[];
  projectName: string;
  projectSector: string;
  statusText: string;
  projectLogo: string;
  onAddAuditLog: (title: string, desc: string) => void;
  onResetProjectData: () => void;
  searchQuery: string;
}

export default function GovernanceView({
  marketReports,
  auditLogs,
  projectName,
  projectSector,
  statusText,
  projectLogo,
  onAddAuditLog,
  onResetProjectData,
  searchQuery,
}: GovernanceViewProps) {
  const [inviteLink, setInviteLink] = useState('https://passaporte.prj/mesa-adaptativa/invite/482s');
  const [copied, setCopied] = useState(false);
  const [teamMembers, setTeamMembers] = useState([
    { name: 'Admin (Você)', email: 'Dono do Projeto', role: 'Owner', id: 'm-1' },
    { name: 'Mariana Silva', email: 'm.silva@furniture.com', role: 'Editor', id: 'm-2' },
    { name: 'Roberto Junior', email: 'roberto.j@legalsys.pt', role: 'Leitura', id: 'm-3' },
  ]);
  const [shareArchive, setShareArchive] = useState(true);
  const [showClosureModal, setShowClosureModal] = useState(false);
  const [closureConfirmText, setClosureConfirmText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle copying
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onAddAuditLog('Link de convite copiado', 'O link de convite para colaboração foi exportado para o clipboard por Admin.');
  };

  // Change member role
  const handleRoleChange = (id: string, newRole: string) => {
    setTeamMembers(
      teamMembers.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    );
    const memberName = teamMembers.find((m) => m.id === id)?.name;
    onAddAuditLog(
      'Permissão de membro alterada',
      `O nível de acesso para ${memberName} foi alterado para ${newRole}.`
    );
  };

  // Irreversible Project closure
  const handleConfirmClosure = () => {
    if (closureConfirmText !== projectName) {
      setErrorMessage(`Por favor digite "${projectName}" corretamente.`);
      return;
    }
    // Execution of Reset / Closure
    onResetProjectData();
    setShowClosureModal(false);
    setClosureConfirmText('');
    setErrorMessage('');
    alert('O Passaporte do Projeto foi arquivado permanentemente no ledger frio. Todos os dados locais foram reiniciados.');
  };

  // Filter audit logs
  const filteredAuditLogs = auditLogs.filter((log) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return log.title.toLowerCase().includes(q) || log.description.toLowerCase().includes(q) || log.dateDetail.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* SECTION A: Project Header Card */}
      <section className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6 self-stretch">
          <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-slate-700 shadow-md">
            {projectLogo ? (
              <img alt="Project Incon" src={projectLogo} className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-3xl text-emerald-400">chair</span>
            )}
          </div>
          <div>
            <h2 className="font-bold text-2xl text-slate-800 tracking-tight">{projectName}</h2>
            <div className="flex flex-wrap gap-4 mt-2">
              <span className="flex items-center gap-1 text-slate-500 font-semibold uppercase font-mono text-[10px] tracking-wider select-none">
                <span className="material-symbols-outlined text-[16px] text-slate-400">chair</span>
                Setor: {projectSector}
              </span>
              <span className="flex items-center gap-1 text-slate-500 font-semibold uppercase font-mono text-[10px] tracking-wider select-none">
                <span className="material-symbols-outlined text-[16px] text-slate-400">lock</span>
                Status: {statusText}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 shrink-0 self-stretch sm:self-auto justify-end w-full sm:w-auto">
          <button className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 text-slate-700 font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer">
            Editar Perfil
          </button>
          <button className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer shadow-slate-950/10">
            Ver Roadmap
          </button>
        </div>
      </section>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Market Reports (Left Column - col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-5 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-[16px] text-slate-800 font-sans flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">summarize</span>
                Relatórios de Mercado
              </h3>
            </div>

            <div className="space-y-3">
              {marketReports.map((r) => (
                <div
                  key={r.id}
                  className="p-4 bg-slate-50 border border-slate-200 hover:border-slate-850 rounded-xl transition-all hover:bg-white cursor-pointer group shadow-sm flex flex-col gap-1.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-slate-400 font-semibold">
                      {r.date}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider font-mono border ${
                        r.badgeType === 'alto'
                          ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse'
                          : r.badgeType === 'info'
                          ? 'bg-sky-50 text-sky-700 border-sky-100'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      }`}
                    >
                      {r.badge}
                    </span>
                  </div>
                  <p className="text-xs font-extrabold text-slate-800 group-hover:text-emerald-600 block transition-colors leading-snug">
                    {r.title}
                  </p>
                  <p className="text-xs text-slate-500 leading-normal line-clamp-2">
                    {r.description}
                  </p>
                </div>
              ))}
            </div>

            <button className="w-full text-center text-emerald-600 hover:text-emerald-700 font-bold text-xs hover:underline pt-2 cursor-pointer">
              Ver todos os relatórios (7)
            </button>
          </div>

          {/* Project Closure Card */}
          <div className="bg-rose-50/10 border-2 border-dashed border-rose-300 p-5 rounded-2xl flex flex-col gap-4 shadow-sm">
            <div>
              <h3 className="font-bold text-[16px] text-rose-700 mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined">delete_forever</span>
                Encerrar Projeto
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Esta ação é irreversível e totalmente auditável. Todos os dados locais registrados serão arquivados sob chaves cegas e o acesso de edição será permanentemente revogado para todos os membros.
              </p>
            </div>
            <button
              onClick={() => setShowClosureModal(true)}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md scroll-smooth shadow-rose-600/10 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">gavel</span>
              Encerrar Passaporte do Projeto
            </button>
          </div>
        </div>

        {/* Team & Sharing (Middle Column - col-span-4) */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-5 h-full shadow-sm">
            <h3 className="font-bold text-[16px] text-slate-800 font-sans border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400">group</span>
              Equipe &amp; Compartilhamento
            </h3>

            <div className="space-y-4">
              {/* Copy invite link */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase block mb-1.5 tracking-wider">
                  LINK DE CONVITE
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    readOnly
                    value={inviteLink}
                    className="flex-grow bg-transparent border-none text-xs font-semibold text-slate-600 focus:ring-0 p-0 overflow-ellipsis"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="p-1 hover:bg-slate-200 text-slate-700 rounded-lg shrink-0 transition-transform hover:scale-105 active:scale-90 cursor-pointer"
                    title={copied ? 'Copiado!' : 'Copiar link'}
                  >
                    <span className="material-symbols-outlined text-slate-800 hover:text-emerald-500 font-bold text-[20px]">
                      {copied ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Members listing */}
              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-bold text-slate-400 font-mono uppercase block tracking-wider">
                  MEMBROS ATIVOS
                </label>

                <div className="divide-y divide-slate-100">
                  {teamMembers.map((m) => (
                    <div key={m.id} className="flex items-center justify-between py-2.5">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {m.role === 'Owner' ? (
                          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-[12px] font-extrabold shadow-sm shrink-0">
                            AD
                          </div>
                        ) : (
                          <span className="material-symbols-outlined text-slate-400 shrink-0 select-none text-3xl">
                            account_circle
                          </span>
                        )}
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-800 truncate">{m.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium truncate">{m.email}</p>
                        </div>
                      </div>

                      {m.role === 'Owner' ? (
                        <span className="text-[11px] font-mono font-bold text-slate-900 border border-slate-200 px-2 py-0.5 bg-slate-50 rounded-md">
                          Owner
                        </span>
                      ) : (
                        <select
                          value={m.role}
                          onChange={(e) => handleRoleChange(m.id, e.target.value)}
                          className="bg-transparent border-none focus:ring-0 font-mono text-[11px] font-bold text-emerald-600 text-right cursor-pointer outline-none focus:outline-none py-0 pr-6"
                        >
                          <option value="Editor">Editor</option>
                          <option value="Leitura">Leitura</option>
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggle Public share */}
              <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl mt-4">
                <input
                  type="checkbox"
                  id="sharing_archive"
                  checked={shareArchive}
                  onChange={(e) => {
                    setShareArchive(e.target.checked);
                    onAddAuditLog(
                      'Compartilhamento na comunidade alterado',
                      `O status de compartilhamento público no Arquivo de Aprendizagem foi definido para: ${
                        e.target.checked ? 'Compartilhado' : 'Privado'
                      }.`
                    );
                  }}
                  className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer shrink-0"
                />
                <label htmlFor="sharing_archive" className="text-xs font-semibold text-slate-700 cursor-pointer leading-tight select-none">
                  Compartilhar metadados anonimizados no Arquivo de Aprendizado
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log Timeline (Right Column - col-span-4) */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col h-full shadow-sm max-h-[580px]">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-[16px] text-slate-800 font-sans flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">gavel</span>
                Log de Auditoria
              </h3>
              <span className="material-symbols-outlined text-slate-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
            </div>

            {/* Locked vertical logs list */}
            <div className="flex-grow overflow-y-auto custom-scrollbar space-y-4 pr-1">
              {filteredAuditLogs.map((log) => (
                <div key={log.id} className="relative pl-5 border-l-2 border-slate-200 last:border-transparent py-0.5">
                  <span className="absolute -left-[6.5px] top-1.5 w-2.5 h-2.5 bg-slate-400 rounded-full border-2 border-white" />
                  <div className="bg-slate-50 p-3.5 border border-slate-200/80 rounded-xl hover:bg-slate-100/50 transition-colors">
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-bold text-xs font-mono text-slate-700 leading-snug">
                        {log.title}
                      </span>
                      {log.locked && (
                        <span className="material-symbols-outlined text-emerald-600 text-[14px] shrink-0 font-bold" title="Registro Assinado na Blockchain">
                          lock
                        </span>
                      )}
                    </div>
                    <p className="text-[10.5px] text-slate-400 font-mono mt-0.5 select-none">{log.dateDetail}</p>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{log.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Irreversible Closure Danger Modal */}
      {showClosureModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-rose-100 p-6 flex flex-col gap-4 animate-in scale-in duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <span className="material-symbols-outlined text-4xl">warning</span>
              <h3 className="font-extrabold text-lg text-slate-800 font-sans">Aviso de Segurança Crítico</h3>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Você está prestes a <span className="font-bold text-rose-600">encerrarem definitivo</span> o Passaporte da <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">{projectName}</span>. Todos os blocos locais de decisões, assinaturas criptográficas e compromissos ativos serão resetados localmente.
            </p>

            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
              <label className="text-xs font-bold text-rose-800 block mb-1">
                CONFIRME DIGITANDO O NOME DO PROJETO:
              </label>
              <p className="text-[11px] text-rose-600 mb-2 font-mono">
                Por favor, digite <span className="font-extrabold select-all">"{projectName}"</span> para confirmar.
              </p>
              <input
                type="text"
                value={closureConfirmText}
                onChange={(e) => {
                  setClosureConfirmText(e.target.value);
                  setErrorMessage('');
                }}
                className="w-full bg-white border border-rose-300 rounded-xl p-2 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20 text-slate-800 font-semibold"
                placeholder="Nome do projeto..."
              />
              {errorMessage && (
                <p className="text-xs font-bold text-rose-700 mt-2">{errorMessage}</p>
              )}
            </div>

            <div className="flex gap-3 mt-2 grid grid-cols-2">
              <button
                onClick={() => {
                  setShowClosureModal(false);
                  setClosureConfirmText('');
                  setErrorMessage('');
                }}
                className="py-2.5 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmClosure}
                disabled={closureConfirmText.trim() === ''}
                className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs transition-colors cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sim, Encerre Tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
