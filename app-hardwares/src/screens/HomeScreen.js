import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Vibration,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Audio } from "expo-av";

// Array de módulos mantido da sua versão original
const modules = [
  {
    route: "Contatos",
    label: "Contatos de Emergência",
    description: "Gerencie quem será avisado em caso de queda",
    color: "#e74c3c",
  },
  {
    route: "Historico",
    label: "Histórico de Quedas",
    description: "Veja os registros de eventos anteriores",
    color: "#3498db",
  },
];

export default function HomeScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [fallDetected, setFallDetected] = useState(false);
  const [soundObject, setSoundObject] = useState(null);

  // 1. Obtém permissão e localização inicial do usuário
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão Negada",
          "Precisamos do GPS para mostrar sua localização no mapa."
        );
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    })();
  }, []);

  // 2. Funções de Áudio e Vibração do Alarme
  const startAlarm = async () => {
    try {
      // Inicia som de alarme em loop
      const { sound } = await Audio.Sound.createAsync(
        { uri: "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg" },
        { shouldPlay: true, isLooping: true }
      );
      setSoundObject(sound);

      // Padrao de vibração: [espera, vibra, espera, vibra...]
      Vibration.vibrate([500, 500, 500], true);
    } catch (error) {
      console.log("Erro ao tocar o alarme:", error);
    }
  };

  const stopAlarm = async () => {
    if (soundObject) {
      await soundObject.stopAsync();
      await soundObject.unloadAsync();
      setSoundObject(null);
    }
    Vibration.cancel();
  };

  // 3. Simula a detecção de queda (chame esta função quando o sensor detectar a queda)
  const triggerFallDetection = () => {
    setFallDetected(true);
    startAlarm();
  };

  // 4. Ações dos botões do Pop-up
  const handleCancel = () => {
    stopAlarm();
    setFallDetected(false);
  };

  const handleConfirmHelp = () => {
    stopAlarm();
    setFallDetected(false);
    Alert.alert(
      "Alerta Enviado!",
      "Sua localização foi enviada aos seus contatos de emergência."
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* MAPA DA LOCALIZAÇÃO */}
      <View style={styles.mapContainer}>
        {location ? (
          <MapView style={styles.map} initialRegion={location}>
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Você está aqui"
            />
          </MapView>
        ) : (
          <View style={styles.loadingMap}>
            <Text style={styles.loadingText}>Carregando mapa...</Text>
          </View>
        )}
      </View>

      {/* BOTÃO DE TESTE DE QUEDA */}
      <TouchableOpacity
        style={styles.testButton}
        onPress={triggerFallDetection}
      >
        <Text style={styles.testButtonText}>⚠️ Simular Queda (Teste)</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Selecione um módulo para explorar</Text>

      {/* LISTA DE MÓDULOS */}
      {modules.map((mod) => (
        <TouchableOpacity
          key={mod.route}
          style={[styles.card, { borderLeftColor: mod.color }]}
          onPress={() => navigation.navigate(mod.route)}
          activeOpacity={0.75}
        >
          <Text style={[styles.cardTitle, { color: mod.color }]}>
            {mod.label}
          </Text>
          <Text style={styles.cardDescription}>{mod.description}</Text>
        </TouchableOpacity>
      ))}

      {/* POP-UP DE ALERTA DE QUEDA */}
      <Modal
        visible={fallDetected}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.alertTitle}>⚠️ QUEDA DETECTADA!</Text>
            <Text style={styles.alertMessage}>
              Detectamos um impacto grave. Você precisa de ajuda médica?
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelBtn]}
                onPress={handleCancel}
              >
                <Text style={styles.btnText}>Estou Bem</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.helpBtn]}
                onPress={handleConfirmHelp}
              >
                <Text style={styles.btnText}>Preciso de Ajuda</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  mapContainer: {
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loadingMap: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#666",
  },
  testButton: {
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  testButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: "#555",
  },
  // Estilos do Pop-up (Modal)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 24,
    width: "100%",
    alignItems: "center",
    elevation: 10,
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#c0392b",
    marginBottom: 12,
  },
  alertMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#2ecc71",
  },
  helpBtn: {
    backgroundColor: "#e74c3c",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});