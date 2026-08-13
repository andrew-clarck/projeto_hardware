# Documentação dos Serviços: Detector de Quedas

Esta documentação detalha a camada de `services/` do aplicativo, responsável pelas regras de negócio e pela lógica que utiliza os recursos de hardware.

A camada de Services não controla diretamente a interface. Ela recebe informações dos módulos de `hardware/` e fornece os resultados necessários para as `screens/`.

---

## Estrutura

```text
services/
├── fall_detector.ts
└── localization.ts
```

````

---

# 1. Serviço Detector de Quedas (`services/fall_detector.ts`)

**Propósito:**

Atuar como o responsável pela lógica de detecção de possíveis quedas.

O serviço utiliza o acelerômetro através de `hardware/accelerometer.js`, recebe os valores dos eixos X, Y e Z e calcula a intensidade do movimento.

Quando o valor ultrapassa o limite definido, o serviço informa à interface que uma possível queda foi detectada.

O `fall_detector.ts` não é responsável por:

- controlar o contador da interface;
- reproduzir áudio;
- acessar o GPS;
- enviar mensagens;
- controlar telas;
- exibir alertas.

Essas responsabilidades pertencem às respectivas camadas do projeto.

---

## Constante de detecção

O serviço possui um limite de impacto:

```ts
const LIMITE_IMPACTO = 3.0;
```

Os valores do acelerômetro são utilizados para calcular a magnitude do movimento:

```ts
const magnitude = Math.sqrt(dados.x ** 2 + dados.y ** 2 + dados.z ** 2);
```

Quando:

```text
magnitude > LIMITE_IMPACTO
```

uma possível queda é identificada.

---

## Função principal

```ts
iniciarMonitoramento(onQueda: () => void): Promise<void>
```

### Parâmetros

**`onQueda`**

Função executada quando uma possível queda é detectada.

Exemplo:

```js
iniciarMonitoramento(() => {
  setAlertVisible(true);
});
```

Nesse caso, o Service não sabe o que acontecerá depois da queda. Ele apenas informa:

> "Uma possível queda foi detectada."

A `HomeScreen` decide o que fazer com essa informação.

---

## Funcionamento

O fluxo do serviço é:

```text
fall_detector.ts
       │
       ▼
iniciarAcelerometro()
       │
       ▼
Recebe x, y e z
       │
       ▼
Calcula magnitude
       │
       ▼
Ultrapassou 3.0?
       │
    ┌──┴──┐
   NÃO   SIM
    │      │
    │      ▼
    │   onQueda()
    │
    └──► continua monitorando
```

---

## Função para interromper o monitoramento

```ts
pararMonitoramento(): void
```

Responsável por:

- interromper a inscrição no acelerômetro;
- limpar a referência da inscrição.

É utilizada quando a `HomeScreen` deixa de estar ativa ou quando o monitoramento precisa ser interrompido.

---

# 2. Serviço de Localização (`services/localization.ts`)

**Propósito:**

Responsável pela lógica relacionada à obtenção da localização atual do dispositivo.

O serviço utiliza o `hardware/gps.js` para acessar o GPS.

O `localization.ts` não exibe mapas e não decide o que fazer com a localização. Ele apenas obtém e retorna os dados.

---

## Função principal

```ts
obterLocalizacaoAtual(): Promise<Localizacao>
```

A função solicita a localização através do módulo de hardware:

```ts
const localizacao = await obterLocalizacao();
```

Depois, retorna os dados para quem solicitou.

---

## Dados retornados

A localização possui:

```text
latitude
longitude
```

Exemplo:

```js
{
  latitude: -23.5505,
  longitude: -46.6333
}
```

Esses dados são utilizados posteriormente pela `emergency_screen.js` para posicionar o marcador no mapa.

---

## Funcionamento

```text
emergency_screen.js
        │
        ▼
localization.ts
        │
        ▼
gps.js
        │
        ▼
GPS do dispositivo
        │
        ▼
latitude + longitude
        │
        ▼
localization.ts
        │
        ▼
emergency_screen.js
        │
        ▼
MapView
```

---

# 3. Integração com as Screens

Os Services não controlam diretamente a interface.

A comunicação acontece através de funções de callback e retornos de dados.

---

## Detecção de queda

A `home_screen.js` inicia o monitoramento:

```js
await iniciarMonitoramento(() => {
  setAlertVisible(true);
});
```

Quando o acelerômetro identifica uma possível queda:

```text
accelerometer.js
       ↓
fall_detector.ts
       ↓
onQueda()
       ↓
home_screen.js
       ↓
alert_modal.js
```

---

## Localização

Quando a emergência é iniciada, a `emergency_screen.js` solicita a localização:

```js
const local = await obterLocalizacaoAtual();

setLocalizacao(local);
```

O fluxo é:

```text
emergency_screen.js
       ↓
localization.ts
       ↓
gps.js
       ↓
latitude + longitude
       ↓
emergency_screen.js
       ↓
mapa
```

---

# 4. Responsabilidade de cada camada

O projeto utiliza três camadas principais.

## Hardware

Responsável por acessar diretamente os recursos do dispositivo.

```text
hardware/
├── accelerometer.js
├── gps.js
└── audio.js
```

### Hardware responde:

> "Como acessar o recurso?"

---

## Services

Responsável pelas regras e pela lógica do sistema.

```text
services/
├── fall_detector.ts
└── localization.ts
```

### Services respondem:

> "O que fazer com os dados?"

---

## Screens

Responsável pela interface e interação com o usuário.

```text
screens/
├── home_screen.js
├── alert_modal.js
└── emergency_screen.js
```

### Screens respondem:

> "O que o usuário deve ver e fazer?"

---

# 5. Fluxo completo do aplicativo

```text
                    HomeScreen
                        │
                        ▼
                 fall_detector.ts
                        │
                        ▼
                 accelerometer.js
                        │
                        ▼
                  x, y, z
                        │
                        ▼
              Detectou possível queda
                        │
                        ▼
                  Alert Modal
                        │
              ┌─────────┴─────────┐
              │                   │
             SIM                 NÃO
              │                   │
              ▼                   ▼
        Fecha alerta          Emergência
              │                   │
              │                   ▼
              │          EmergencyScreen
              │                   │
              │            ┌──────┴──────┐
              │            │             │
              │            ▼             ▼
              │      localization.ts   audio.js
              │            │             │
              │            ▼             ▼
              │          gps.js       alerta.mp3
              │            │
              │            ▼
              │       Localização
              │            │
              │            ▼
              │           Mapa
              │
              ▼
        Monitoramento
           continua
```

Se o usuário não responder ao alerta dentro de **10 segundos**, a `alert_modal.js` inicia o mesmo fluxo de emergência.

---

# 6. Princípio de separação

Cada arquivo deve possuir uma responsabilidade clara.

```text
accelerometer.js
→ Acessa o acelerômetro.

fall_detector.ts
→ Interpreta os dados e detecta uma possível queda.

alert_modal.js
→ Exibe o alerta e controla o contador de 15 segundos.

gps.js
→ Acessa o GPS.

localization.ts
→ Organiza a obtenção da localização.

audio.js
→ Reproduz e interrompe o áudio.

emergency_screen.js
→ Exibe o mapa e controla a interface da emergência.

home_screen.js
→ Exibe a tela principal e inicia o monitoramento.
```
````
