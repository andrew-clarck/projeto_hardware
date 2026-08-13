# Documentação dos Serviços: Detector de Quedas

Esta documentação detalha a camada de `services/` do aplicativo, responsável por orquestrar a lógica de negócio, os sensores de hardware e as notificações de emergência.

---

## 1. Serviço de Notificação (`services/notifier.ts`)

**Propósito:** 
Atuar como o "Mensageiro" do aplicativo. É acionado exclusivamente quando uma emergência é confirmada (ou seja, quando o tempo de cancelamento esgota). Ele busca as coordenadas atuais do dispositivo e formata a mensagem de socorro.

### Função Principal

\`\`\`typescript
notificarEmergencia(contatos: string[]): Promise<boolean>
\`\`\`

**Parâmetros:**
*   `contatos` (Array de strings): Uma lista com os números de telefone ou identificadores dos contatos de emergência (ex: `['+5511999999999', '+5511888888888']`).

**Retorno:**
*   Retorna `true` se o processo de buscar localização e disparar o alerta for concluído com sucesso. Retorna `false` em caso de falha (ex: sem permissão de GPS).

**Comportamento Interno:**
1.  Chama a função `obterLocalizacao()` da camada de hardware.
2.  Gera um link clicável do Google Maps com a latitude e longitude exatas.
3.  Simula (ou executa, dependendo da sua API) o envio da mensagem.

---

## 2. Serviço Detector de Quedas (`services/fall_detector.ts`)

**Propósito:**
Atuar como o "Cérebro" do aplicativo. Ele gerencia o ciclo de vida do acelerômetro, processa os cálculos físicos para identificar impactos bruscos e controla a máquina de estados da emergência (ativação do alarme, contagem regressiva e acionamento do socorro).

### Estruturas de Dados

**`AcoesQueda` (Type):** Um "contrato" que obriga a tela a fornecer ferramentas essenciais para o serviço funcionar.
*   `reproduzirAlerta(audio)`: Função para tocar o som.
*   `pararAlerta()`: Função para parar o som.
*   `audioFile`: O arquivo de áudio carregado (ex: `require('./sirene.mp3')`).
*   `contatos`: Lista de números de emergência.
*   `onTimerTick(segundos)`: Callback que devolve o número de segundos restantes (15, 14, 13...).
*   `onAlertaEnviado()`: Callback executado quando o socorro é acionado com sucesso.

### Funções Principais

*   **`iniciarMonitoramento(acoes: AcoesQueda): Promise<void>`**
    Liga o sensor e começa a escutar os eixos X, Y e Z. Se a força vetorial passar de 3.0 Gs, inicia automaticamente o protocolo de emergência.

*   **`cancelarAlarmePeloUsuario(acoes: { pararAlerta: () => void }): void`**
    Interrompe a contagem regressiva, cala a sirene e volta ao estado de monitoramento padrão. Usado pelo botão "Estou Bem" da interface.

*   **`pararMonitoramento(): void`**
    Desliga o sensor de hardware e limpa todos os relógios (timers) da memória. Usado quando o usuário quer desativar o app totalmente.

---

## 3. Guia de Integração com a UI (Exemplo)

Como o módulo de áudio (`useAudio`) é um Hook do React, toda a orquestração deve partir de dentro de um Componente Funcional. Veja um exemplo real de como conectar os arquivos de hardware e os arquivos de serviço na interface (`App.tsx` ou `DetectorScreen.tsx`).

\`\`\`tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

// 1. Importa os hooks do hardware
import { useAudio } from './hardware/audio'; 

// 2. Importa o Cérebro (Serviços)
import { 
  iniciarMonitoramento, 
  cancelarAlarmePeloUsuario, 
  pararMonitoramento 
} from './services/fall_detector';

export default function App() {
  // Inicializa o Hook de Áudio do hardware
  const { reproduzirAlerta, pararAlerta } = useAudio();

  // Estados para controlar o que aparece na tela
  const [monitorando, setMonitorando] = useState(false);
  const [tempoRestante, setTempoRestante] = useState<number | null>(null);

  // Simulação de dados do usuário
  const MEUS_CONTATOS = ['+5511912345678'];
  const ARQUIVO_SIRENE = require('./assets/sirene.mp3');

  // Quando o componente for destruído, garante que tudo desligue
  useEffect(() => {
    return () => pararMonitoramento();
  }, []);

  const ligarDetector = async () => {
    setMonitorando(true);
    
    // Passamos todas as dependências para o cérebro
    await iniciarMonitoramento({
      reproduzirAlerta,
      pararAlerta,
      audioFile: ARQUIVO_SIRENE,
      contatos: MEUS_CONTATOS,
      // O cérebro atualiza o estado da tela aqui a cada 1 segundo:
      onTimerTick: (segundos) => setTempoRestante(segundos), 
      onAlertaEnviado: () => {
        alert("Socorro acionado com sucesso!");
        setTempoRestante(null); // Reseta a tela
      }
    });
  };

  const desligarDetector = () => {
    pararMonitoramento();
    setMonitorando(false);
    setTempoRestante(null);
  };

  const indicarFalsoPositivo = () => {
    cancelarAlarmePeloUsuario({ pararAlerta });
    setTempoRestante(null); // Tira o timer da tela
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Detector de Quedas</Text>

      {/* Se o timer estiver rodando, a pessoa caiu! */}
      {tempoRestante !== null ? (
        <View style={styles.alertaContainer}>
          <Text style={styles.textoAlerta}>Queda Detectada!</Text>
          <Text style={styles.cronometro}>{tempoRestante}s</Text>
          <Text style={styles.subtexto}>Enviando socorro em breve...</Text>
          
          <Button 
            title="ESTOU BEM! CANCELAR" 
            color="red" 
            onPress={indicarFalsoPositivo} 
          />
        </View>
      ) : (
        <View style={styles.controlesContainer}>
          <Text style={styles.status}>
            Status: {monitorando ? "Ativo e Vigiando" : "Desligado"}
          </Text>
          
          {!monitorando ? (
            <Button title="Ligar Proteção" onPress={ligarDetector} />
          ) : (
            <Button title="Desligar" color="gray" onPress={desligarDetector} />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  status: { fontSize: 16, marginBottom: 20 },
  controlesContainer: { alignItems: 'center' },
  alertaContainer: { alignItems: 'center', backgroundColor: '#ffe6e6', padding: 30, borderRadius: 10 },
  textoAlerta: { fontSize: 22, color: 'red', fontWeight: 'bold' },
  cronometro: { fontSize: 60, fontWeight: 'bold', color: 'red', marginVertical: 10 },
  subtexto: { fontSize: 16, marginBottom: 20 },
});
\`\`\`