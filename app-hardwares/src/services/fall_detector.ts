import { iniciarAcelerometro, pararAcelerometro } from '../hardware/accelerometer';
import { notificarEmergencia } from './notifier';

const LIMITE_IMPACTO = 3.0; 
const TEMPO_TIMER_MS = 15000; // 15 segundos

let inscricaoAcelerometro: any = null;

// CORREÇÃO 1: Usar ReturnType para pegar o tipo correto do timer no ambiente atual
let timeoutId: ReturnType<typeof setTimeout> | null = null;
let intervaloId: ReturnType<typeof setInterval> | null = null;
let emContagemRegressiva = false;

export type AcoesQueda = {
  reproduzirAlerta: (audio: any) => void;
  pararAlerta: () => void;               
  audioFile: any;                         
  contatos: string[];                     
  onTimerTick: (segundos: number) => void;
  onAlertaEnviado: () => void;            
};

export async function iniciarMonitoramento(acoes: AcoesQueda) {
  if (inscricaoAcelerometro) return;

  // CORREÇÃO 2: Tipar explicitamente o parâmetro 'dados' recebido do callback
  inscricaoAcelerometro = await iniciarAcelerometro((dados: { x: number; y: number; z: number }) => {
    
    if (emContagemRegressiva) return;

    const magnitude = Math.sqrt(dados.x ** 2 + dados.y ** 2 + dados.z ** 2);

    if (magnitude > LIMITE_IMPACTO) {
      iniciarProtocoloEmergencia(acoes);
    }
  });
}

function iniciarProtocoloEmergencia(acoes: AcoesQueda) {
  emContagemRegressiva = true;
  acoes.reproduzirAlerta(acoes.audioFile);

  let tempoRestante = 15;
  acoes.onTimerTick(tempoRestante);

  intervaloId = setInterval(() => {
    tempoRestante--;
    acoes.onTimerTick(tempoRestante);
  }, 1000);

  timeoutId = setTimeout(async () => {
    limparTimers();
    acoes.pararAlerta();
    
    await notificarEmergencia(acoes.contatos);
    acoes.onAlertaEnviado();
    
    emContagemRegressiva = false;
  }, TEMPO_TIMER_MS);
}

export function cancelarAlarmePeloUsuario(acoes: { pararAlerta: () => void }) {
  if (emContagemRegressiva) {
    limparTimers();
    acoes.pararAlerta();
    emContagemRegressiva = false;
    console.log("Alarme cancelado pelo usuário. Falso positivo.");
  }
}

export function pararMonitoramento() {
  if (inscricaoAcelerometro) {
    pararAcelerometro(inscricaoAcelerometro);
    inscricaoAcelerometro = null;
  }
  limparTimers();
  emContagemRegressiva = false;
}

function limparTimers() {
  if (timeoutId) clearTimeout(timeoutId);
  if (intervaloId) clearInterval(intervaloId);
  timeoutId = null;
  intervaloId = null;
}