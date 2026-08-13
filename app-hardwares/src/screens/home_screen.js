import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";

// serviços e hardware do projeto
import { iniciarMonitoramentoDeQueda } from "../services/fall_detector";
import { pararAcelerometro } from "../hardware/accelerometer";

export default function HomeScreen({ navigation }) {
  // 1. monitoramento do acelerometro
  useEffect(() => {
    let subscription;

    async function iniciar() {
      try {
        subscription = await iniciarMonitoramentoDeQueda(() => {
          // ao detectar queda, manda para o alert modal
          navigation.navigate("AlertModal");
        });
      } catch (erro) {
        console.error("Erro no acelerômetro:", erro);
      }
    }

    iniciar();

    return () => {
      pararAcelerometro(subscription);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Sistema de Segurança</Text>
      <Text style={styles.status}>🟢 Monitoramento ativo</Text>
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
