import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { obterLocalizacao } from "../services/localization";
import { useAudio } from "../hardware/audio";

export default function EmergencyScreen() {
  const [localizacao, setLocalizacao] = useState(null);
  const [erro, setErro] = useState(null);

  const { reproduzirAlerta } = useAudio();

  useEffect(() => {
    async function executarEmergencia() {
      try {
        const local = await obterLocalizacao();

        setLocalizacao(local);

        reproduzirAlerta(require("../../assets/alerta.mp3"));
      } catch (erro) {
        console.error("Erro ao iniciar emergência:", erro);

        setErro(erro.message);
      }
    }

    executarEmergencia();
  }, []);

  if (erro) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Erro</Text>

        <Text>{erro}</Text>
      </View>
    );
  }

  if (!localizacao) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Emergência</Text>

        <Text>Obtendo localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Emergência acionada</Text>

      <Text style={styles.status}>Localização obtida</Text>

      <MapView
        style={styles.mapa}
        initialRegion={{
          latitude: localizacao.latitude,
          longitude: localizacao.longitude,

          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{
            latitude: localizacao.latitude,
            longitude: localizacao.longitude,
          }}
          title="Localização"
          description="Possível emergência"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  titulo: {
    marginTop: 50,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },

  status: {
    textAlign: "center",
    marginBottom: 15,
  },

  mapa: {
    flex: 1,
  },
});
