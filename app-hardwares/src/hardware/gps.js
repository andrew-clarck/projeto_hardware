import * as Location from "expo-location";

export async function obterLocalizacao() {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Permissão de localização negada.");
  }

  const localizacao = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  return {
    latitude: localizacao.coords.latitude,
    longitude: localizacao.coords.longitude,
  };
}
