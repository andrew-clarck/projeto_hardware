# projeto_hardware
Projeto utilizando recursos de hardware - Grupo 5

2. Detector de Quedas 🚨

Um app para monitorar possíveis acidentes.

# Hardware

- Acelerômetro
- GPS
- Áudio
  
# Como funciona

Se detectar uma queda muito brusca:

⚠ Possível queda detectada

Você está bem?

[Sim]
[Não]

Se o usuário não responder em 15 segundos:

pega a localização;

toca um alarme.


## Estruturação de Pastas
projeto_hardware/
├── assets/
│   └── alarm.mp3             # Áudio do alarme
│
└── src/
    ├── hardware/             # 1. Integração com o dispositivo (Sensores)
    │   ├── accelerometer.ts  # Captura movimento (x, y, z)
    │   ├── gps.ts            # Captura latitude/longitude
    │   └── audio.ts          # Toca o áudio de emergência
    │
    ├── services/             # 2. Regras de Negócio e Lógica Principal
    │   ├── fall_detector.ts  # Algoritmo que detecta impacto e roda os 15s
    │   └── notifier.ts       # Envia a localização via rede/SMS
    │
    └── ui/                   # 3. Telas e Interface
        ├── home_screen.tsx   # Tela principal (Monitorando...)
        └── alert_modal.tsx   # Pop-up: "Você está bem?" [Sim] [Não]


hardware/ (Entradas e Saídas Físicas): Isolamos a leitura do acelerômetro, o áudio e o GPS aqui. Se no futuro você mudar a biblioteca de sensores ou o sistema operacional, só altera os arquivos dessa pasta.

services/ (A Cérebro do App): O arquivo fall_detector.ts escuta os dados do acelerômetro. Quando detecta uma variação brusca, aciona o temporizador de 15 segundos. Se o tempo zerar sem resposta, ele chama o notifier.ts e o audio.ts.

ui/ (A Apoiadora de Decisões): A interface do usuário não sabe como o acelerômetro calcula a gravidade. Ela apenas exibe o aviso "Você está bem?" quando o fall_detector.ts manda, e envia o clique no botão "Sim" (cancela) ou "Não" (dispara alerta imediatamente).

- pega a localização;
- toca um alarme.
