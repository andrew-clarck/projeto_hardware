import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import {
  iniciarMonitoramento,
  pararMonitoramento,
} from "../services/fall_detector";

import AlertScreen from "./alert_modal";

export default function HomeScreen({ navigation }) {
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    async function iniciar() {
      try {
        await iniciarMonitoramento(() => {
          // Uma possível queda foi detectada
          setAlertVisible(true);
        });
      } catch (erro) {
        console.error("Erro no monitoramento de queda:", erro);
      }
    }

    iniciar();

    return () => {
      pararMonitoramento();
    };
  }, []);

  function confirmarUsuario() {
    setAlertVisible(false);
  }

  function acionarEmergencia() {
    setAlertVisible(false);

    navigation.navigate("emergency_screen");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Sistema de Segurança</Text>

      <Text style={styles.status}>🟢 Monitoramento ativo</Text>

      <AlertScreen
        visible={alertVisible}
        onConfirm={confirmarUsuario}
        onEmergency={acionarEmergencia}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 6,
  },

  status: {
    fontSize: 16,
    color: "#27ae60",
    fontWeight: "600",
    marginBottom: 24,
  },
});
