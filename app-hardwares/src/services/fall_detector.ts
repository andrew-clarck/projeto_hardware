import {
  iniciarAcelerometro,
  pararAcelerometro,
} from "../hardware/accelerometer";

const LIMITE_IMPACTO = 1.5;

let inscricaoAcelerometro: any = null;
let quedaDetectada = false;

export async function iniciarMonitoramento(onQueda: () => void) {
  // Evita criar mais de uma inscrição
  if (inscricaoAcelerometro) {
    return;
  }

  quedaDetectada = false;

  inscricaoAcelerometro = await iniciarAcelerometro(
    (dados: { x: number; y: number; z: number }) => {
      // Evita detectar a mesma queda várias vezes
      if (quedaDetectada) {
        return;
      }

      const magnitude = Math.sqrt(dados.x ** 2 + dados.y ** 2 + dados.z ** 2);

      if (magnitude > LIMITE_IMPACTO) {
        quedaDetectada = true;

        console.log("Possível queda detectada:", magnitude.toFixed(2));

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

  // Permite uma nova detecção quando o monitoramento for iniciado novamente
  quedaDetectada = false;
}
