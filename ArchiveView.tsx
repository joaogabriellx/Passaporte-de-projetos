/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Decision } from '../types';

interface TimelineViewProps {
  decisions: Decision[];
  onOpenNewDecision: () => void;
  searchQuery: string;
}

export default function TimelineView({
  decisions,
  onOpenNewDecision,
  searchQuery,
}: TimelineViewProps) {
  // Filter States
  const [period, setPeriod] = useState('Últimos 30 dias');
  const [alertType, setAlertType] = useState<'Todos' | 'Críticos' | 'Riscos'>('Todos');
  const [decisor, setDecisor] = useState('Qualquer Decisor');
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);

  // Clear filters
  const handleClearFilters = () => {
    setPeriod('Últimos 30 dias');
    setAlertType('Todos');
    setDecisor('Qualquer Decisor');
  };

  // Filter Logic
  const filteredDecisions = decisions.filter((d) => {
    // 1. Alert Type filter
    if (alertType === 'Críticos' && d.type !== 'CRÍTICO') return false;
    if (alertType === 'Riscos' && d.type !== 'RISCO') return false;

    // 2. Decisor filter
    if (decisor !== 'Qualquer Decisor' && d.decisor !== decisor) return false;

    // 3. Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = d.title.toLowerCase().includes(q);
      const matchesJustification = d.justification.toLowerCase().includes(q);
      const matchesAuthor = d.author.toLowerCase().includes(q);
      const matchesDecisor = d.decisor.toLowerCase().includes(q);
      if (!matchesTitle && !matchesJustification && !matchesAuthor && !matchesDecisor) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Dynamic Filter Bar */}
      <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-6">
        {/* Period selection */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase">
            PERÍODO
          </span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none outline-none cursor-pointer"
          >
            <option>Últimos 30 dias</option>
            <option>Trimestre Atual</option>
            <option>Ano 2024</option>
          </select>
        </div>

        {/* Alert type selection */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase">
            TIPO DE ALERTA
          </span>
          <div className="flex gap-2">
            {(['Todos', 'Críticos', 'Riscos'] as const).map((type) => {
              const isActive = alertType === type;
              return (
                <button
                  key={type}
                  onClick={() => setAlertType(type)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200/80'
                  } transition-all duration-150 cursor-pointer`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Decisor selection */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase">
            DECISOR
          </span>
          <select
            value={decisor}
            onChange={(e) => setDecisor(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none outline-none cursor-pointer"
          >
            <option>Qualquer Decisor</option>
            <option>Engenharia</option>
            <option>Compliance</option>
            <option>Design de Produto</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        {(alertType !== 'Todos' || decisor !== 'Qualquer Decisor' || period !== 'Últimos 30 dias') && (
          <button
            onClick={handleClearFilters}
            className="ml-auto flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold text-xs select-none cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[16px] group-hover:rotate-180 transition-transform duration-300">
              filter_list_off
            </span>
            <span>Limpar Filtros</span>
          </button>
        )}
      </section>

      {/* Chronological Vertical Timeline Feed */}
      <div className="relative pl-12 before:content-[''] before:absolute before:left-5 before:top-0 before:bottom-0 before:w-0.5 before:bg-slate-250 before:z-0 space-y-6">
        {filteredDecisions.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 py-12 px-6 text-center text-slate-500">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">
              find_in_page
            </span>
            <p className="text-sm font-medium">Nenhuma decisão encontrada</p>
            <p className="text-xs text-slate-400 mt-1">
              Ajuste filtros ou registre um novo passaporte imutável de decisão.
            </p>
          </div>
        ) : (
          filteredDecisions.map((d, index) => {
            // Pick vertical indicator colors
            let indicatorBg = 'bg-slate-300';
            let cardBgAndBorder = 'bg-white border-slate-200';
            let categoryLabel = 'CONFORMIDADE';
            let badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-100';
            let descriptionTitleClass = 'text-emerald-600';

            if (d.type === 'CRÍTICO') {
              indicatorBg = 'bg-rose-500 ring-rose-300';
              cardBgAndBorder = 'bg-white border-rose-300 border-2';
              categoryLabel = 'CRÍTICO';
              badgeBg = 'bg-rose-50 text-rose-600 border-rose-100';
              descriptionTitleClass = 'text-rose-600';
            } else if (d.type === 'RISCO') {
              indicatorBg = 'bg-amber-500 ring-amber-300';
              cardBgAndBorder = 'bg-amber-50/10 border-amber-400 border-2 border-dashed';
              categoryLabel = `${d.divergencesCount || 2} DIVERGÊNCIAS`;
              badgeBg = 'bg-amber-50 text-amber-800 border-amber-200';
              descriptionTitleClass = 'text-amber-700';
            }

            return (
              <div key={d.id} className="relative group/card">
                {/* Timeline Dot Indicator */}
                <span
                  className={`absolute -left-[37px] top-6 w-3.5 h-3.5 rounded-full z-10 border-4 border-slate-50 ring-4 transition-all duration-300 ${indicatorBg} group-hover/card:scale-125`}
                />

                {/* Card Outer */}
                <div
                  className={`p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ${cardBgAndBorder} relative overflow-hidden`}
                >
                  {/* Decorative Red top line for Critical item */}
                  {d.type === 'CRÍTICO' && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />
                  )}

                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          d.type === 'CRÍTICO'
                            ? 'bg-rose-100 text-rose-600'
                            : d.type === 'RISCO'
                            ? 'bg-amber-150 text-amber-700'
                            : 'bg-emerald-100 text-emerald-600'
                        }`}
                      >
                        <span className="material-symbols-outlined text-2xl font-bold">
                          {d.type === 'CRÍTICO'
                            ? 'close'
                            : d.type === 'RISCO'
                            ? 'warning'
                            : 'check_circle'}
                        </span>
                      </div>
                      <div>
                        <div className="text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
                          {d.date}
                        </div>
                        <h3 className="font-bold text-[17px] text-slate-800 tracking-tight">
                          {d.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 self-stretch sm:self-auto">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border ${badgeBg} tracking-wide uppercase font-mono`}
                      >
                        {categoryLabel}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 tracking-wide select-none">
                        <span className="material-symbols-outlined text-[13px] text-slate-400">
                          database
                        </span>
                        SELO 🔒 IMUTÁVEL
                      </div>
                    </div>
                  </div>

                  {/* Card Body / Justification */}
                  <div className="pl-0 sm:pl-13">
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      <span className={`font-bold mr-1 ${descriptionTitleClass}`}>
                        Justificativa:
                      </span>
                      {d.justification}
                    </p>

                    {/* Alerta de regulamento legal integrado à tela */}
                    {d.regulatoryRiskWarning && (
                      <div className="mb-4 p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0 mt-0.5">
                          gavel
                        </span>
                        <p className="text-xs text-amber-800 leading-normal font-medium">
                          {d.regulatoryRiskWarning}
                        </p>
                      </div>
                    )}

                    {/* Card Footer actions */}
                    <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-4 gap-3">
                      {/* Avatars Involved */}
                      {d.avatars ? (
                        <div className="flex -space-x-2">
                          {d.avatars.map((av, idx) => (
                            <img
                              key={idx}
                              src={av}
                              alt="Votante"
                              className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm bg-slate-100"
                            />
                          ))}
                        </div>
                      ) : d.impactProgress > 0 ? (
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                            IMPACTO: {d.impactLevel}
                          </span>
                          <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                d.type === 'RISCO' ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${d.impactProgress}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          <span>Visualizado por 4 stakeholders</span>
                        </div>
                      )}

                      <button
                        onClick={() => setSelectedDecision(d)}
                        className={`px-4 py-2 hover:bg-slate-100 hover:text-slate-900 border text-slate-700 border-slate-200 font-semibold rounded-xl text-xs transition-all duration-200 cursor-pointer shadow-sm`}
                      >
                        Ver completa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Embedded Details Modal/Drawer */}
      {selectedDecision && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col animate-in scale-in duration-200">
            {/* Header */}
            <div className={`p-6 text-white ${
              selectedDecision.type === 'CRÍTICO'
                ? 'bg-rose-600'
                : selectedDecision.type === 'RISCO'
                ? 'bg-amber-500'
                : 'bg-emerald-600'
            } flex justify-between items-start flex-col gap-2 relative`}>
              <button
                onClick={() => setSelectedDecision(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl font-bold">close</span>
              </button>
              <div className="text-[10px] font-mono opacity-85 uppercase tracking-widest font-bold">
                CÉDULA DE EXAME DE CONFORMIDADE DIGITAL ({selectedDecision.code})
              </div>
              <h2 className="text-xl font-bold font-sans pr-10">{selectedDecision.title}</h2>
              <div className="flex gap-4 text-xs font-mono opacity-90 mt-1">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  {selectedDecision.date}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">database</span>
                  LEDGER ID: REG-{selectedDecision.code.replace('#', '')}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-sm text-slate-700">
              {/* Veredito */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-4">
                <div className={`p-3 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedDecision.type === 'CRÍTICO'
                    ? 'bg-rose-100 text-rose-600'
                    : selectedDecision.type === 'RISCO'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-600'
                }`}>
                  <span className="material-symbols-outlined text-3xl font-bold">
                    {selectedDecision.type === 'CRÍTICO'
                      ? 'gavel'
                      : selectedDecision.type === 'RISCO'
                      ? 'warning'
                      : 'verified'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm font-sans mb-0.5">Veredito do Diário de Bordo</h4>
                  <p className="text-xs text-slate-500">
                    Esta decisão está classificada como <span className="font-bold underline uppercase">{selectedDecision.type}</span> na escala regulatória.
                  </p>
                </div>
              </div>

              {/* Justification Section */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 font-sans text-sm tracking-tight flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-500 text-[18px]">verified_user</span>
                  Por que foi decidido? (Justificativa técnica)
                </h4>
                <p className="bg-slate-100/50 p-4 rounded-xl border border-slate-250 italic text-slate-600 leading-relaxed">
                  "{selectedDecision.justification}"
                </p>
              </div>

              {/* Alternatives Rejected */}
              {selectedDecision.alternativesRejected && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 font-sans text-sm tracking-tight flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-rose-500 text-[18px]">cancel</span>
                    Alternativas Rejeitadas (E por que foram descartadas?)
                  </h4>
                  <p className="bg-rose-50/10 p-4 rounded-xl border border-rose-150 text-slate-600 leading-relaxed">
                    {selectedDecision.alternativesRejected}
                  </p>
                </div>
              )}

              {/* Carbon rating and metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-100/50 rounded-2xl border border-slate-200">
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider font-mono mb-2">
                    IMPACTO DE CARBONO ESTIMADO
                  </div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl font-extrabold text-slate-800">
                      {selectedDecision.impactProgress}%
                    </span>
                    <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      selectedDecision.impactLevel === 'ALTO'
                        ? 'bg-rose-100 text-rose-700 animate-pulse'
                        : selectedDecision.impactLevel === 'MÉDIO'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {selectedDecision.impactLevel} IMPACTO
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        selectedDecision.impactLevel === 'ALTO'
                          ? 'bg-rose-500'
                          : selectedDecision.impactLevel === 'MÉDIO'
                          ? 'bg-amber-400'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${selectedDecision.impactProgress}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-150/50 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-wider font-mono mb-1">
                      COMPROMISSO DE DURAÇÃO
                    </div>
                    <p className="text-slate-800 font-bold text-sm">
                      {selectedDecision.commitmentDuration}
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-2">
                    Status: <span className="text-emerald-500 font-bold">VIGENTE E AUDITÁVEL</span>
                  </div>
                </div>
              </div>

              {/* Decisor credentials */}
              <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase mb-1">
                    DECISOR RESPONSÁVEL
                  </div>
                  <p className="text-slate-800 font-bold text-sm">{selectedDecision.decisor}</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase mb-1">
                    AUTOR DO REGISTRO
                  </div>
                  <p className="text-slate-800 font-medium text-xs">
                    {selectedDecision.author} ({selectedDecision.authorRole})
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                IMUTÁVEL E INTEGRADO (HASHLOG: CFH94318X)
              </span>
              <button
                onClick={() => setSelectedDecision(null)}
                className="px-5 py-2 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer bg-slate-100 border border-slate-200 shadow-sm"
              >
                Fechar Painel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
