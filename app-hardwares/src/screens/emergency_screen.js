import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import MapView, { Marker } from "react-native-maps";

import { obterLocalizacaoAtual } from "../services/localization";
import { useAudio } from "../hardware/audio";

export default function EmergencyScreen({ navigation }) {
  const [localizacao, setLocalizacao] = useState(null);
  const [erro, setErro] = useState(null);

  const { reproduzirAlerta, pararAlerta } = useAudio();

  useEffect(() => {
    async function executarEmergencia() {
      try {
        const local = await obterLocalizacaoAtual();

        setLocalizacao(local);

        reproduzirAlerta(require("../../assets/alerta.mp3"));
      } catch (erro) {
        console.error("Erro ao iniciar emergência:", erro);

        setErro(erro.message);
      }
    }

    executarEmergencia();
  }, []);

  function encerrarEmergencia() {
    pararAlerta();

    navigation.navigate("home_screen");
  }

  if (erro) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Erro</Text>

        <Text>{erro}</Text>

        <TouchableOpacity style={styles.botao} onPress={encerrarEmergencia}>
          <Text style={styles.textoBotao}>Voltar para tela inicial</Text>
        </TouchableOpacity>
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

      <TouchableOpacity
        style={styles.botao}
        onPress={encerrarEmergencia}
        activeOpacity={0.8}
      >
        <Text style={styles.textoBotao}>Estou bem — Encerrar emergência</Text>
      </TouchableOpacity>
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

  botao: {
    margin: 20,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: "#43A047",
    alignItems: "center",
    justifyContent: "center",
  },

  textoBotao: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
