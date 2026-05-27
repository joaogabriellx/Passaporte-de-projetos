/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TimelineView from './components/TimelineView';
import GovernanceView from './components/GovernanceView';
import CommitmentsView from './components/CommitmentsView';
import ArchiveView from './components/ArchiveView';
import NewDecisionModal from './components/NewDecisionModal';

import {
  INITIAL_PROFILES,
  INITIAL_DECISIONS,
  INITIAL_COMMITMENTS,
  INITIAL_MARKET_REPORTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ARCHIVE_PROJECTS,
} from './data';
import { Decision, ActiveCommitment, AuditLog, ArchiveProject, UserProfile } from './types';

export default function App() {
  // Navigation Tab State
  const [currentTab, setCurrentTab] = useState<string>('timeline');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Profile State
  const [activeProfile, setActiveProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('passaporte_active_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILES[0];
  });

  // Decisions State
  const [decisions, setDecisions] = useState<Decision[]>(() => {
    const saved = localStorage.getItem('passaporte_decisions');
    return saved ? JSON.parse(saved) : INITIAL_DECISIONS;
  });

  // Active Commitments State
  const [commitments, setCommitments] = useState<ActiveCommitment[]>(() => {
    const saved = localStorage.getItem('passaporte_commitments');
    return saved ? JSON.parse(saved) : INITIAL_COMMITMENTS;
  });

  // Peer-Learning Archive State
  const [archiveProjects, setArchiveProjects] = useState<ArchiveProject[]>(() => {
    const saved = localStorage.getItem('passaporte_archive_projects');
    return saved ? JSON.parse(saved) : INITIAL_ARCHIVE_PROJECTS;
  });

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('passaporte_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Modal Dialog toggle
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync state to local storage to guarantee client-side persistence
  useEffect(() => {
    localStorage.setItem('passaporte_active_profile', JSON.stringify(activeProfile));
  }, [activeProfile]);

  useEffect(() => {
    localStorage.setItem('passaporte_decisions', JSON.stringify(decisions));
  }, [decisions]);

  useEffect(() => {
    localStorage.setItem('passaporte_commitments', JSON.stringify(commitments));
  }, [commitments]);

  useEffect(() => {
    localStorage.setItem('passaporte_archive_projects', JSON.stringify(archiveProjects));
  }, [archiveProjects]);

  useEffect(() => {
    localStorage.setItem('passaporte_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Helper: Append a new Audit Log entry
  const addAuditLog = (title: string, desc: string) => {
    const now = new Date();
    const formattedDate = `Hoje, ${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')} • Por ${activeProfile.name}`;

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      title,
      dateDetail: formattedDate,
      description: desc,
      locked: true,
    };

    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Action: Add a new Decisão Imutável
  const handleAddNewDecision = (formData: Omit<Decision, 'id' | 'code' | 'date' | 'isImmutable' | 'author' | 'authorRole'>) => {
    const now = new Date();
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const formattedDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} • ${now
      .getHours()
      .toString()
      .padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const uniqueIdNum = Math.floor(100 + Math.random() * 900);
    const codeStr = `#00${uniqueIdNum}`;
    const newId = `dec-${Date.now()}`;

    const newDecision: Decision = {
      ...formData,
      id: newId,
      code: codeStr,
      date: formattedDate,
      isImmutable: true,
      author: activeProfile.name,
      authorRole: activeProfile.role,
    };

    // Append decision
    setDecisions((prev) => [newDecision, ...prev]);

    // Also: Add linked regulatory commitments automatically!
    const commitmentId = `com-${Date.now()}`;
    const newCommitment: ActiveCommitment = {
      id: commitmentId,
      code: codeStr,
      title: `Planificação: ${newDecision.title}`,
      description: `Rotina técnica de auditoria vinculada à nova decisão '${newDecision.title}'. Validada pelo setor de ${newDecision.decisor}.`,
      status: 'agendado',
      statusLabel: 'Agendado',
      progress: 0,
      timeRemaining: formData.commitmentDuration || '6 meses restantes',
      linkedDecisionId: newId,
      linkedDecisionCode: codeStr,
    };
    setCommitments((prev) => [newCommitment, ...prev]);

    // Also: Log to real ledger audit trail
    addAuditLog(
      `Decisão ${codeStr} assinada`,
      `A decisão imutável '${newDecision.title}' foi registrada sob hashes cegas na trilha de auditoria digital por ${activeProfile.name}.`
    );

    alert(`Decisão de ecodesign registrada com sucesso. O código da cédula ${codeStr} foi gravado imutavelmente no passaporte.`);
  };

  // Action: Fulfill a commitment
  const handleFulfillCommitment = (id: string, obs: string) => {
    setCommitments((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'concluido',
              statusLabel: 'Concluído',
              progress: 100,
              timeRemaining: 'Concluído há poucos instantes',
            }
          : c
      )
    );

    const match = commitments.find((c) => c.id === id);
    if (match) {
      addAuditLog(
        `Compromisso ${match.code} cumprido`,
        `A obrigação técnica '${match.title}' de sustentabilidade foi declarada cumprida por ${activeProfile.name}. Observação: "${obs}"`
      );
    }
  };

  // Action: Regularize an expired commitment
  const handleRegularizeCommitment = (id: string, obs: string) => {
    setCommitments((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'em_andamento',
              statusLabel: 'Em andamento',
              progress: 15,
              timeRemaining: '1 ano e 11 meses',
            }
          : c
      )
    );

    const match = commitments.find((c) => c.id === id);
    if (match) {
      addAuditLog(
        `Multa remediada: ${match.code}`,
        `A advertência de atraso ambiental para '${match.title}' foi saneada e o status normalizado para em andamento por ${activeProfile.name}. Observação: "${obs}"`
      );
    }
  };

  // Action: Toggle Saved Ref within the Peer Archive
  const handleToggleSaveProject = (id: string) => {
    setArchiveProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isSaving = !p.isSaved;
          return {
            ...p,
            isSaved: isSaving,
            savedCount: isSaving ? p.savedCount + 1 : p.savedCount - 1,
          };
        }
        return p;
      })
    );

    const match = archiveProjects.find((p) => p.id === id);
    if (match) {
      const stateLogStr = !match.isSaved ? 'adicionado às referências' : 'removido das referências';
      addAuditLog(
        `Referência atualizada`,
        `O projeto comunitário '${match.title}' foi ${stateLogStr} no repositório inteligente de estudo.`
      );
    }
  };

  // Action: Publish current local project results anonymously to the Peer community
  const handlePublishCurrentProject = () => {
    const isAlreadyPublished = archiveProjects.some((p) => p.title === 'Mesa Adaptativa [CONCLUÍDO]');
    if (isAlreadyPublished) {
      alert('Seu projeto "Mesa Adaptativa" já foi publicado no Arquivo de Aprendizado.');
      return;
    }

    const newContribId = `arch-${Date.now()}`;
    const newContribItem: ArchiveProject = {
      id: newContribId,
      title: 'Mesa Adaptativa [CONCLUÍDO]',
      sector: 'MOBILIÁRIO SUSTENTÁVEL',
      badgeType: 'verified',
      period: '2026-Q2',
      learnings: `Mapeamento imutável de ${decisions.length} decisões críticas na plataforma. A substituição do alumínio primário reduziu as emissões totais estimadas em 40%, enquanto que o bloqueio do polímero virgem atendeu as diretivas regulatórias SUP-2025 europeias com êxito.`,
      author: activeProfile.name,
      isAnonymized: true,
      savedCount: 1,
      isSaved: false,
    };

    setArchiveProjects((prev) => [newContribItem, ...prev]);
    addAuditLog(
      `Diário publicado na comunidade`,
      `O Passaporte de decisões da "Mesa Adaptativa" foi anonymizado e exportado como bem-sucedido para o acervo de aprendizagem.`
    );

    alert('Parabéns! Suas lições de design sustentável foram publicadas de forma 100% segura e anônima no Arquivo de Aprendizado comunitario.');
  };

  // Action: Complete irreversible reset/destruction
  const handleResetProjectData = () => {
    localStorage.removeItem('passaporte_decisions');
    localStorage.removeItem('passaporte_commitments');
    localStorage.removeItem('passaporte_audit_logs');
    localStorage.removeItem('passaporte_archive_projects');

    setDecisions(INITIAL_DECISIONS);
    setCommitments(INITIAL_COMMITMENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setArchiveProjects(INITIAL_ARCHIVE_PROJECTS);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation Left */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setSearchQuery(''); // Clear search on tab change for clean focus
        }}
        activeProfile={activeProfile}
        profiles={INITIAL_PROFILES}
        onProfileChange={(profile) => {
          setActiveProfile(profile);
          // Justify in audit log who log in
          const now = new Date();
          const logTitle = `Agente Conectado: ${profile.role}`;
          const logDesc = `O auditor técnico ${profile.name} assumiu a supervisão e o controle do diário de bordo do Passaporte.`;
          
          // Custom check to push inside list
          const formattedDate = `Hoje, ${now.getHours().toString().padStart(2, '0')}:${now
            .getMinutes()
            .toString()
            .padStart(2, '0')} • Por Sistema`;

          const accessLog: AuditLog = {
            id: `sys-log-${Date.now()}`,
            title: logTitle,
            dateDetail: formattedDate,
            description: logDesc,
            locked: false,
          };
          setAuditLogs((prev) => [accessLog, ...prev]);
        }}
      />

      {/* Main Content Pane Right */}
      <div className="flex-grow pl-[280px] pt-16 min-h-screen flex flex-col justify-between">
        <Header
          currentTab={currentTab}
          projectName="Mesa Adaptativa"
          activeProfile={activeProfile}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onNotificationClick={() => {
            alert(
              'Aviso Técnico:\nSinalizadores de conformidade de ciclo de vida integrados e saudáveis. Nenhuma inconformidade catastrófica pendente.'
            );
          }}
        />

        {/* Dynamic Nested Tab Selector */}
        <main className="flex-grow p-8 max-w-7xl mx-auto w-full">
          {currentTab === 'timeline' && (
            <TimelineView
              decisions={decisions}
              onOpenNewDecision={() => setIsModalOpen(true)}
              searchQuery={searchQuery}
            />
          )}

          {currentTab === 'commitments' && (
            <CommitmentsView
              commitments={commitments}
              onFulfillCommitment={handleFulfillCommitment}
              onRegularizeCommitment={handleRegularizeCommitment}
              onAddAuditLog={addAuditLog}
              searchQuery={searchQuery}
            />
          )}

          {currentTab === 'governance' && (
            <GovernanceView
              marketReports={INITIAL_MARKET_REPORTS}
              auditLogs={auditLogs}
              projectName="Mesa Adaptativa"
              projectSector="Furniture Design"
              statusText="Privado (Ledger Lock)"
              projectLogo="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=256&auto=format&fit=crop"
              onAddAuditLog={addAuditLog}
              onResetProjectData={handleResetProjectData}
              searchQuery={searchQuery}
            />
          )}

          {currentTab === 'archive' && (
            <ArchiveView
              projects={archiveProjects}
              onToggleSaveProject={handleToggleSaveProject}
              onPublishCurrentProject={handlePublishCurrentProject}
              searchQuery={searchQuery}
            />
          )}

          {currentTab === 'audit_logs' && (
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-150 pb-3">
                <h3 className="font-extrabold text-base text-slate-800 font-sans flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 font-bold">history_edu</span>
                  Histórico Auditável Completo do Passaporte
                </h3>
                <span className="text-[10px] font-mono bg-slate-100 border text-slate-500 font-bold px-3 py-1 rounded-xl">
                  {auditLogs.length} BLOCOS ASSINADOS
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Esta tabela exibe todos os registros imutáveis e auditáveis gravados sob chaves criptográficas no diário de bordo do ecossistema.
              </p>
              
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-4">
                    <span className="material-symbols-outlined text-slate-400 p-2 bg-white rounded-xl border border-slate-200 shrink-0 text-xl font-bold">
                      {log.locked ? 'lock' : 'verified_user'}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800 leading-snug">{log.title}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{log.dateDetail}</p>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{log.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Footer Area with Humility credit & guidelines safety */}
        <footer className="w-full text-center py-4 text-[11px] font-mono text-slate-400 border-t border-slate-100 select-none bg-white">
          <span>Passaporte do Projeto © Era da Regulação Consciente | Plataforma Imutável de Auditoria Digital</span>
        </footer>
      </div>

      {/* Embedded Floating Action Button (Nova Decisão) - Only displayed inside the chronological timeline feed */}
      {currentTab === 'timeline' && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 z-40 cursor-pointer shadow-slate-950/30 group border border-slate-700/60"
          title="Digitar Nova Decisão de Ecodesign"
        >
          <span className="material-symbols-outlined text-[32px] font-bold group-hover:rotate-90 transition-transform duration-300">
            add
          </span>
        </button>
      )}

      {/* Nova Decisão Form Modal overlay trigger */}
      {isModalOpen && (
        <NewDecisionModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddNewDecision}
        />
      )}
    </div>
  );
}
