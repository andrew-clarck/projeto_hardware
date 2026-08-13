import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import * as Location from 'expo-location';

const { status } = await Location.requestForegroundPermissionsAsync();

if (status !== 'granted') {
  // usuario negou — informe na UI, nao trave o app
  return;
}
