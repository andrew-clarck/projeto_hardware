import { obterLocalizacao } from "../hardware/gps";

export async function obterLocalizacaoAtual() {
  try {
    const localizacao = await obterLocalizacao();

    return localizacao;
  } catch (erro) {
    console.error("Erro ao obter localização:", erro);

    throw erro;
  }
}