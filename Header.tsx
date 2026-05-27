/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Decision, ActiveCommitment, MarketReport, AuditLog, ArchiveProject, UserProfile } from './types';

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'user-1',
    name: 'Artur Mendes',
    role: 'Gestor de Risco',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoGFct2-CnU_8V_NIEKjB9WvVN8fdHBuWe6c1XDuBKWolSlCCZDPOqNtrdJp9OAdg0v1dMc0MNqbSJ1_e4fxzoqavHRjwlfJNd8atu4mVcvOI3Acs6SgJ7mZsGWbmZfOEjNMq7QvJaNsV1AAbWWwSr1q3Z_WxruUjdpPRe_qWPZtI-XSjysWaLqb72e4XLZXnh7fz2ZfirHFaU-9bS0sOqQY85Mv8A7zPYaUjRCEh_k1pv1CmNxRz2uoKke95fDC24-0At_h0hvus',
    avatarAlt: 'A professional portrait of a senior project manager with a calm and focused expression.'
  },
  {
    id: 'user-2',
    name: 'Mariana Silva',
    role: 'Designer de Produto',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2dbALc7NZxY4ZJBf2oox63xxhiNIYC4Kxyx9yYX9sjeHK9UkxYofYZzVnbKMx2wFsVUN-6h9qS5e-wGVuPiGN79OEh0qitN9vywfA4enBygKkfLN3VhTUzw7xyw_o-L-RMlEMe2WosRXSnJ-zXF5DddNJavWNcLZ42lH-5oS_RtFOoL4WWxWHbNSsRvEXs6U-0i4UsluTKIRyJxIlWU9jAh87iFEKrKislFbeDjkUv5CwQxgDkEeYIyfmzoq7m-3yhJ5Vye9JyCQ',
    avatarAlt: 'A professional portrait of a senior creative director with a focused expression.'
  },
  {
    id: 'user-3',
    name: 'Dr. A. Valente',
    role: 'Regulador Chefe',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBS3Xu6kwdRCo4oXrxhhTBKJZrrgA9BhkViWbclkF0wJVG2LH7bWI_7_sXwpHkl9uKSJo1x21ObuMFaS5pMPiClNFzNLd0nI0UAB0gTd2DNkTk2rMImtd_3lTOO6p2gU422veEaO9YcLAsDKmuibhJQMkdf9bhnYGcyvkSfFNFO_j6v615ekOPAYpBfMy8dbaaG0ASaUv03QBm3RX4duIe8AsE76A7385e2jm7a9hTNyx9gqKf48tsTQXlAHad7RzwYeer5w6SMQ1g',
    avatarAlt: 'A professional portrait of a chief regulator.'
  },
  {
    id: 'user-4',
    name: 'A. Cavalcanti',
    role: 'Regulador Sênior',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhfVwQAmi1KMNViHKnhnZO3a2XOUT_1w51U_7n3WGWPDTIZWEkCs9satVRXTPo9UB6sdz6b23xUOV8GEyIpeR03Bj5YVXDzjqKzQUcKsPH6ZCSehqjqHrMwAqQNQAbBFbgzA2w6dOnB_Q2rIYkWXj_n4KHllPPanygu6NgxNoxSPqIr6jQd2NHcJQ1pWoUltGQPJ-uD5GifqAg2MRTxS-mnFtLC2rlgJMBrCD8IpxegW3tHrKK2EC4qEqyeKVlj1dYYbBNmyhRuis',
    avatarAlt: 'A professional portrait of a senior consultant in architectural space.'
  }
];

export const INITIAL_DECISIONS: Decision[] = [
  {
    id: 'dec-1',
    code: '#00421',
    title: 'Uso de Plástico Virgem no Protetor',
    date: '18 OUT 2024 • 14:30',
    type: 'CRÍTICO',
    justification: 'Incompatível com regulação EU 2025. O uso deste polímero impede a certificação de sustentabilidade necessária para exportação no bloco europeu.',
    alternativesRejected: 'Alternativas rejeitadas: Polímero biodegradável bio-baseado (alto custo de escala e instabilidade mecânica em testes de impacto), alumínio anodizado primário (viabilidade orçamentária comprometida devido ao custo 45% maior do lote de amostragem).',
    impactLevel: 'ALTO',
    impactProgress: 90,
    commitmentDuration: 'Garantia legal de recobrimento',
    decisor: 'Compliance',
    auditedAt: 'Revisado ontem pelo comitê técnico',
    viewsCount: 2,
    isImmutable: true,
    avatars: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCXtERc-CnVm0G7qpKx9Jn8jLgIBV3ODejiqYwqs5i8tHQraMQ6FrSL8zDGkg6-5VFUaxDZRJ8HDoec88B3ves_NJ7qaI2dQa3sPzvXbGZJER8EMLoIelxk7_e5ZKOGEH3VSO7UKMM9725RMiVkHgAC1w1VwCsl0bM36vEUPzZ__uCth--BE6xTuEphMxqpw5LBNEvzcTu8y7vrbKs6YIfOL1erDWADCQ-jA2GQwaiAndOtTp2f5VbjBrPbCo_h0bbLli9qUQCTSn4',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCTQerPSv7_z8z1r0a1Qj6yA2cW9m3BpMaPiPt4W49EGBJkEKrFZ7sc_T_s9nC-ZlCcfAZEqGXzhh1OLSmOBGRLv3POHuLBUMxppofvahj41oo2JQdJIwESQOK-rFVE9bPXZZlBsUxB6iDa_G6DuRc4155CMs6SWugR_3xY9MTX3RC49mPc0v1oL_tqC6UnQ-FDIeKUiZuaolMKnUqTdPdnF4DRpLUPmYTHSzliMV8Zr8FHGtcds0_97w3y5jNF4sqrk2LXWKshs5M'
    ],
    author: 'Mariana Silva',
    authorRole: 'Designer de Produto',
    regulatoryRiskWarning: '⚠️ ALERTA: A diretiva europeia de 2025 prevê banimento definitivo do polímero em itens de consumo corporativo sem plano de logística reversa imutável.'
  },
  {
    id: 'dec-2',
    code: '#00388',
    title: 'Parceria com Fornecedor Local',
    date: '16 OUT 2024 • 09:15',
    type: 'RISCO',
    divergencesCount: 2,
    justification: 'Risco de prazo identificado na entrega de componentes eletrônicos. O fornecedor local possui histórico de 15% de atraso em projetos similares.',
    alternativesRejected: 'Alternativas rejeitadas: Importação de distribuidor global (reduz o prazo em 4 dias, mas aumenta a pegada de pegada CO2 no transporte em 310% e colide com diretrizes pro-comunidade local).',
    impactLevel: 'MÉDIO',
    impactProgress: 50,
    commitmentDuration: 'Revisão trimestral do fornecedor (12 meses)',
    decisor: 'Engenharia',
    auditedAt: 'Registrado em livro digital',
    isImmutable: true,
    author: 'Artur Mendes',
    authorRole: 'Gestor de Risco',
    regulatoryRiskWarning: '⚡ DIVERGÊNCIA: Rastreamento de entregas offline não integrado com o banco de dados principal de auditoria.'
  },
  {
    id: 'dec-3',
    code: '#00455',
    title: 'Escolha de Material Sustentável',
    date: '14 OUT 2024 • 16:45',
    type: 'CONFORMIDADE',
    justification: 'Redução de 40% na pegada de carbono através da substituição do alumínio primário por material reciclado certificado. Alinhado com o compromisso Net Zero 2030.',
    alternativesRejected: 'Alternativas rejeitadas: Aço estrutural de liga leve (alto peso e aumento correspondente no carbono logístico correspondente a 28%), plástico ABS reciclado comum (baixa longevidade mecânica).',
    impactLevel: 'BAIXO',
    impactProgress: 15,
    commitmentDuration: 'Residência contínua / Net Zero 2030',
    decisor: 'Engenharia',
    auditedAt: 'Auditado há 2 dias',
    viewsCount: 4,
    isImmutable: true,
    author: 'Mariana Silva',
    authorRole: 'Designer de Produto'
  },
  {
    id: 'dec-4',
    code: '#00215',
    title: 'Redução de Desperdício Têxtil',
    date: '10 OUT 2024 • 11:20',
    type: 'CONFORMIDADE',
    justification: 'Implementação de corte a laser otimizado por IA, reduzindo retalhos em 12% na linha de produção Alpha.',
    alternativesRejected: 'Alternativas rejeitadas: Corte mecânico por faca (baixa precisão e perda inerente constante de 20% do rolo de tecido).',
    impactLevel: 'BAIXO',
    impactProgress: 12,
    commitmentDuration: 'Meta de zero-residência têxtil (24 meses)',
    decisor: 'Design de Produto',
    auditedAt: 'Auditado eletronicamente em conformidade',
    viewsCount: 4,
    isImmutable: true,
    author: 'Mariana Silva',
    authorRole: 'Designer de Produto'
  }
];

export const INITIAL_COMMITMENTS: ActiveCommitment[] = [
  {
    id: 'com-1',
    code: '#00421',
    title: 'Monitoramento de Biodegradabilidade',
    description: 'Verificação contínua dos polímeros série-X em ambiente controlado conforme norma ISO 14855.',
    status: 'em_andamento',
    statusLabel: 'Em andamento',
    progress: 15,
    timeRemaining: '1 ano e 11 meses',
    linkedDecisionId: 'dec-1',
    linkedDecisionCode: 'DEC-01',
    auditedAt: 'Revisado ontem pelo comitê independente'
  },
  {
    id: 'com-2',
    code: '#00388',
    title: 'Revisão de Ciclo de Vida',
    description: 'Auditoria trimestral dos fornecedores Tier-2 para validação de pegada de carbono.',
    status: 'proximo',
    statusLabel: 'Próximo (15 dias)',
    progress: 80,
    timeRemaining: 'Vence em 15 dias',
    linkedDecisionId: 'dec-2',
    linkedDecisionCode: 'DEC-38'
  },
  {
    id: 'com-3',
    code: '#00215',
    title: 'Renovação de Licença Ambiental',
    description: 'Protocolo de renovação obrigatório junto ao órgão regulador regional.',
    status: 'expirado',
    statusLabel: 'Expirado',
    progress: 100,
    timeRemaining: 'Atraso: 2 dias',
    linkedDecisionId: 'dec-4',
    linkedDecisionCode: 'DEC-15'
  },
  {
    id: 'com-4',
    code: '#00455',
    title: 'Manutenção de Filtros de Ar',
    description: 'Substituição semestral dos filtros HEPA na unidade de produção central.',
    status: 'agendado',
    statusLabel: 'Agendado',
    progress: 2,
    timeRemaining: '4 meses restantes',
    linkedDecisionId: 'dec-3',
    linkedDecisionCode: 'DEC-03'
  }
];

export const INITIAL_MARKET_REPORTS: MarketReport[] = [
  {
    id: 'rep-1',
    title: 'Escassez de Matéria-Prima: Aço',
    date: '24 OUT 2026',
    badge: 'Alerta Alto',
    badgeType: 'alto',
    description: 'Logística global impactada por novas taxas de importação de minérios na região leste-europeia.'
  },
  {
    id: 'rep-2',
    title: 'Tendências Office 2027',
    date: '15 OUT 2026',
    badge: 'Info',
    badgeType: 'info',
    description: 'Adoção massiva de mobiliário com certificações rastreáveis de circulação pós-uso.'
  },
  {
    id: 'rep-3',
    title: 'Certificações ESG Trimestrais',
    date: '02 OUT 2026',
    badge: 'Estável',
    badgeType: 'estavel',
    description: 'Auditoria de conformidade ambiental concluída com ótimos índices de logística verde local.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    title: 'Decisão #4 registrada',
    dateDetail: 'Hoje, 14:32 • Por Admin',
    description: 'Alteração de cronograma e seleção de plástico orgânico para a Fase 2 validada.',
    locked: true
  },
  {
    id: 'log-2',
    title: 'Membro adicionado',
    dateDetail: 'Ontem, 09:15 • Por Admin',
    description: 'Roberto Junior (Leitura) vinculado com sucesso ao projeto.',
    locked: false
  },
  {
    id: 'log-3',
    title: 'Relatório de Mercado',
    dateDetail: '24 Out 2026, 10:00 • Sistema',
    description: 'Análise de risco logístico atualizada via API reguladora automática.',
    locked: false
  },
  {
    id: 'log-4',
    title: 'Setup do Projeto',
    dateDetail: '15 Out 2026, 16:45 • Por Admin',
    description: 'Passaporte imutável inicializado para o projeto: Mesa Adaptativa.',
    locked: false
  }
];

export const INITIAL_ARCHIVE_PROJECTS: ArchiveProject[] = [
  {
    id: 'arch-1',
    title: 'Sistema DroneHub 01',
    sector: 'LOGÍSTICA URBANA',
    badgeType: 'verified',
    period: '2023-Q4',
    learnings: 'A antecipação das zonas de silêncio evitou 90% dos litígios comunitários. A governança baseada em tokens de ruído foi o diferencial para aprovação rápida pela agência regulatória de tráfego aéreo.',
    author: 'M. Rocha',
    isAnonymized: false,
    savedCount: 42,
    isSaved: false
  },
  {
    id: 'arch-2',
    title: '[ANONIMIZADO #492]',
    sector: 'FINTECHS',
    badgeType: 'warning',
    period: '2024-Q1',
    learnings: 'A falha na auditoria de contratos inteligentes derivou de uma discrepância de jurisdição. Lição: Sempre definir oráculos legais rígidos e auditar antes da execução de swaps.',
    author: 'Preservada',
    isAnonymized: true,
    savedCount: 18,
    isSaved: false
  },
  {
    id: 'arch-3',
    title: 'BioTrace Amazônia',
    sector: 'AGROTECH',
    badgeType: 'in_progress',
    period: 'ATIVO',
    learnings: 'Mapeamento genético descentralizado exige redundância de dados offline. A integração com APIs do governo local gerou gargalos de latência inesperados nos primeiros meses de campo.',
    author: 'J. Lima',
    isAnonymized: false,
    savedCount: 31,
    isSaved: false
  },
  {
    id: 'arch-4',
    title: 'Grid Block Solar',
    sector: 'ENERGIA',
    badgeType: 'failure',
    period: '2022-Q2',
    learnings: 'Subestimar o lobby regulatório tradicional levou ao bloqueio total do projeto de microrrede. O aprendizado é político: deve-se co-optar o órgão regulador antes do deploy prático da infraestrutura.',
    author: 'S. Mendes',
    isAnonymized: false,
    savedCount: 56,
    isSaved: true
  },
  {
    id: 'arch-5',
    title: 'TeleGov Protocol',
    sector: 'SAÚDE DIGITAL',
    badgeType: 'success',
    period: '2023-Q2',
    learnings: 'A interoperabilidade semântica foi garantida pelo uso de padrões HL7 FHIR integrados à blockchain descentralizada. Sucesso total na auditoria de privacidade de dados sensíveis médicos.',
    author: 'Dr. V. Lima',
    isAnonymized: false,
    savedCount: 78,
    isSaved: false
  }
];
