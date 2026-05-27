/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn('GEMINI_API_KEY variable is not defined. AI analysis will run in local simulation mode.');
}

// API: Analyze design decision using Gemini
app.post('/api/analyze-decision', async (req, res) => {
  const { title, justification, sector, alternatives, commitment, impactDetail } = req.body;

  if (!title || !justification) {
    return res.status(400).json({ error: 'Título e Justificativa são obrigatórios' });
  }

  // If Gemini client is not initialized, fallback gracefully to a smart simulation response
  if (!ai) {
    return res.json({
      verdict: justification.toLowerCase().includes('plástico') || justification.toLowerCase().includes('polímero') 
        ? 'CRÍTICO' 
        : justification.toLowerCase().includes('aço') || justification.toLowerCase().includes('fornecedor') 
        ? 'RISCO' 
        : 'CONFORMIDADE',
      analysis: 'Simulação de Conformidade: Sua justificativa foi analisada localmente. O uso de materiais de alta pegada de CO2 ou compostos sintéticos em larga escala sem canais de reversibilidade atrai auditoria especial de ciclo de vida.',
      riskWarning: '⚠️ AVISO REGULATÓRIO SIMULADO: Diretivas ECO-2026 exigem rotulagem clara para todo insumo não degradável.',
      alternative: 'Recomenda-se substituir por compósito natural bio-baseado ou alumínio certificado ISO 14040.',
      carbonScore: justification.toLowerCase().includes('reciclado') ? 22 : 85,
      isSimulated: true
    });
  }

  try {
    const prompt = `Analise a seguinte decisão de design tirada do "Passaporte do Projeto" na Era da Regulação Consciente.
Setor: ${sector || 'Geral'}
Título da Decisão: ${title}
Justificativa fornecida: ${justification}
Alternativas Rejeitadas: ${alternatives || 'Nenhuma especificada'}
Compromisso temporal pretendido: ${commitment || 'Imediato / indeterminado'}
Impacto esperado: ${impactDetail || 'Não especificado'}

Retorne uma análise técnica detalhada no formato do esquema JSON, considerando normas ecológicas globais atuais e tendências como economia circular, logística reversa, restrição de materiais problemáticos (como plásticos virgens, químicos poluentes) e conformidade jurídica (ex: Diretiva Europeia de Embalagens e Resíduos 2025/2026, ESG standards, RoHS, etc.).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `Você é o regulador sênior do "Passaporte do Projeto", uma autoridade técnica em ecodesign, economia circular e compliance regulatório.
Sua missão é emitir um veredito de risco rigoroso na escala de:
- "CONFORMIDADE": Totalmente alinhada com as melhores práticas ecológicas, circulares e de baixo carbono.
- "RISCO": Há riscos moderados, prazos atrasáveis ou pontos de atenção que podem desequilibrar o ecossistema ou atrair divergência futura.
- "CRÍTICO": Viola diretamente regras propostas para 2025/2526, emprega matéria-prima não renovável sem logística reversa rígida ou possui alto índice de rejeição social/ecológica.

Forneça resultados práticos, profissionais em português brasileiro, claros e objetivos para designers éticos.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: {
              type: Type.STRING,
              description: 'Veredito final. Deve ser obrigatoriamente um destes três: "CONFORMIDADE", "RISCO" ou "CRÍTICO"',
            },
            analysis: {
              type: Type.STRING,
              description: 'Análise técnica em língua portuguesa contendo justificativa do veredito focado na sustentabilidade.',
            },
            riskWarning: {
              type: Type.STRING,
              description: 'Selo de alerta regulatório em formato de chamada resumida (máximo duas frases), ex: "⚠️ ALERTA: Polímero virgem atrai taxa carbono de até 15%..."',
            },
            alternative: {
              type: Type.STRING,
              description: 'Sugestão prática de alternativa mais ecologicamente conforme.',
            },
            carbonScore: {
              type: Type.INTEGER,
              description: 'Pontuação de intensidade ou impacto de carbono de 0 (melhor/baixo impacto) a 100 (pior/altíssima pegada de CO2).',
            }
          },
          required: ['verdict', 'analysis', 'riskWarning', 'alternative', 'carbonScore']
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Nenhum resultado de texto retornado pelo modelo Gemini');
    }

    const jsonResult = JSON.parse(resultText);
    res.json(jsonResult);
  } catch (err: any) {
    console.error('Erro ao realizar análise por IA via Gemini:', err);
    res.status(500).json({ 
      error: 'Erro interno ao realizar análise da IA',
      details: err.message 
    });
  }
});

// Configure Vite integration or static file server
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

setupServer();
