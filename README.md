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

<<<<<<< HEAD
pega a localização;

toca um alarme.


## Estruturação de Pastas
projeto_hardware/
├── assets/                          # Recursos estáticos
│   └── audio/
│       └── emergency_alarm.mp3     # Arquivo de áudio de alta prioridade
│
├── docs/                            # Documentação técnica e ADRs (Architectural Decision Records)
│   └── adr_001_fall_detection_algorithm.md
│
└── src/                             # Código-fonte principal
    ├── core/                        # Kernel compartilhado (independente de funcionalidade)
    │   ├── constants/               # Limiares de aceleração (g-force), tempos padrão
    │   ├── errors/                  # Exceções customizadas (HardwareException, PermissionDeniedException)
    │   ├── network/                 # Cliente HTTP / WebSockets com retry policy e circuit breaker
    │   ├── permissions/             # Gerenciamento de permissões do SO (GPS, Sensores)
    │   └── services/                # Wrappers do SO (Foreground Services para execução em segundo plano)
    │
    ├── data/                        # Camada de Dados e Integração de Hardware (Adapters)
    │   ├── datasources/
    │   │   ├── hardware/            # Acesso direto às APIs nativas do SO
    │   │   │   ├── accelerometer_datasource.ts   # Stream de dados brutos (x, y, z)
    │   │   │   ├── gps_datasource.ts             # Captura de latitude/longitude
    │   │   │   └── audio_datasource.ts           # Player de áudio com bypass de modo silencioso
    │   │   └── local/                            # Armazenamento de contatos de emergência e histórico
    │   └── repositories/            # Implementação concreta das interfaces do Domain
    │       ├── fall_detection_repository.ts
    │       └── emergency_repository.ts
    │
    ├── domain/                      # Camada do Domínio (Regras de Negócio Puras - Zero dependências externas)
    │   ├── entities/                # Modelos de dados do negócio
    │   │   ├── fall_event.ts        # Dados do impacto (vetor de força, timestamp)
    │   │   └── location_data.ts     # Entidade de geolocalização pura
    │   ├── repositories/            # Interfaces/Contratos (Inversão de Dependência)
    │   │   ├── i_fall_detection_repository.ts
    │   │   └── i_emergency_repository.ts
    │   └── usecases/                # Casos de Uso (Fluxos do usuário)
    │       ├── evaluate_impact_usecase.ts        # Filtra ruído e valida se o impacto é uma queda real
    │       ├── start_confirmation_timer_usecase.ts # Gerencia a janela de 15 segundos
    │       └── trigger_emergency_alert_usecase.ts # Orquestra: busca GPS + toca alarme + envia rede
    │
    └── presentation/                # Camada de Apresentação (UI e Gestão de Estado)
        ├── controllers/             # ViewModels / BLoC / State Machines
        │   └── fall_monitor_state_machine.ts # Estados: IDLE -> IMPACT_DETECTED -> COUNTDOWN -> ALERTING
        ├── screens/
        │   ├── home_screen.tsx                   # Status do monitoramento
        │   └── alert_modal_screen.tsx            # Tela de confirmação "Você está bem?"
        └── widgets/
            └── countdown_timer_widget.tsx        # Renderizador dos 15 segundos
=======
- pega a localização;
- toca um alarme.
>>>>>>> a74502666219c17b812d58b934e1b95692cc197e
