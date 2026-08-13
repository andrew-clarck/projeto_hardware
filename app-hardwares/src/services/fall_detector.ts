import {
  iniciarAcelerometro,
  pararAcelerometro,
} from "../hardware/accelerometer";

const LIMITE_IMPACTO = 3.0;

let inscricaoAcelerometro: any = null;

export async function iniciarMonitoramento(onQueda: () => void) {
  // Evita iniciar mais de um monitoramento
  if (inscricaoAcelerometro) {
    return;
  }

  inscricaoAcelerometro = await iniciarAcelerometro(
    (dados: { x: number; y: number; z: number }) => {
      const magnitude = Math.sqrt(dados.x ** 2 + dados.y ** 2 + dados.z ** 2);

      if (magnitude > LIMITE_IMPACTO) {
        onQueda();
      }
    },
  );
}

export function pararMonitoramento() {
  if (inscricaoAcelerometro) {
    pararAcelerometro(inscricaoAcelerometro);

    inscricaoAcelerometro = null;
  }
}
