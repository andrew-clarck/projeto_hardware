import { Accelerometer } from "expo-sensors";

export async function iniciarAcelerometro(callback) {
  const disponivel = await Accelerometer.isAvailableAsync();

  if (!disponivel) {
    throw new Error("Acelerômetro indisponível.");
  }

  // Intervalo de atualização: 200ms
  Accelerometer.setUpdateInterval(200);

  const subscription = Accelerometer.addListener(({ x, y, z }) => {
    callback({ x, y, z });
  });

  return subscription;
}

export function pararAcelerometro(subscription) {
  if (subscription) {
    subscription.remove();
  }
}
