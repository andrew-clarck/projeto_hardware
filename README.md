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

        
- pega a localização;
- toca um alarme.
