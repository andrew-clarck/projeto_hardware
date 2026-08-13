// services/notifier.ts
import { obterLocalizacao } from '../hardware/gps'; // Ajuste o caminho conforme seu projeto

export async function notificarEmergencia(contatos: string[]) {
  try {
    console.log("Buscando localização exata para o resgate...");
    const localizacao = await obterLocalizacao();
    
    const mensagem = `ALERTA DE QUEDA! Possível emergência detectada. \nLocalização atual: https://maps.google.com/?q=${localizacao.latitude},${localizacao.longitude}`;

    // Aqui entra a lógica real de envio (Ex: API do Twilio para SMS, WhatsApp, Servidor backend)
    console.log(`Enviando alerta para os contatos: ${contatos.join(', ')}`);
    console.log("Conteúdo da mensagem:", mensagem);

    return true;
  } catch (erro) {
    console.error("Falha ao notificar emergência:", erro);
    // Caso a localização falhe, ainda podemos tentar mandar mensagem sem ela
    return false;
  }
}