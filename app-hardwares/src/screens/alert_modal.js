import { useEffect, useState } from "react";
import {Modal,StyleSheet,Text,TouchableOpacity,View,} from "react-native";

const TEMPO_ALERTA = 10;

export default function AlertScreen({
  visible,
  onConfirm,
  onEmergency,
}) {
  const [tempo, setTempo] = useState(TEMPO_ALERTA);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setTempo(TEMPO_ALERTA);

    const contador = setInterval(() => {
      setTempo((tempoAtual) => {
        if (tempoAtual <= 0) {
          clearInterval(contador);

          onEmergency();

          return 0;
        }

        return tempoAtual - 1;
      });
    }, 1000);

    return () => {
      clearInterval(contador);
    };
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>

        <View style={styles.alertBox}>

          <Text style={styles.alertIcon}>⚠️</Text>

          <Text style={styles.title}>
            Possível queda detectada
          </Text>

          <Text style={styles.question}>
            Você está bem?
          </Text>

          <Text style={styles.timer}>
            Responda em {tempo} segundos
          </Text>

          <View style={styles.buttonsContainer}>

            {/* SIM */}
            <TouchableOpacity
              style={[styles.button, styles.yesButton]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                Sim
              </Text>
            </TouchableOpacity>

            {/* NÃO */}
            <TouchableOpacity
              style={[styles.button, styles.noButton]}
              onPress={onEmergency}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                Não
              </Text>
            </TouchableOpacity>

          </View>

        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  alertBox: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  alertIcon: {
    fontSize: 50,
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#D32F2F",
    textAlign: "center",
    marginBottom: 15,
  },

  question: {
    fontSize: 20,
    fontWeight: "500",
    color: "#333333",
    textAlign: "center",
    marginBottom: 10,
  },

  timer: {
    fontSize: 15,
    color: "#777777",
    textAlign: "center",
    marginBottom: 25,
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    width: "100%",
  },

  button: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  yesButton: {
    backgroundColor: "#43A047",
  },

  noButton: {
    backgroundColor: "#E53935",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },

});
