import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

// serviços e hardware do projeto
import { iniciarMonitoramentoDeQueda } from "../services/fallDetectionService";
import { pararAcelerometro } from "../hardware/accelerometer";

export default function HomeScreen({ navigation }) {
  const [location, setLocation] = useState(null);

  // 1. permissão e localização do GPS
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão Negada",
          "Precisamos do GPS para exibir sua localização no mapa."
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

  // 2. monitoramento do acelerometro 
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

      {/*MAPA */}
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
  mapContainer: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
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
});