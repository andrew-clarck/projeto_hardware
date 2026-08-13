import { useAudioPlayer } from "expo-audio";

export function useAudio() {
  const player = useAudioPlayer();

  function reproduzirAlerta(audio) {
    player.replace(audio);
    player.loop = true;
    player.play();
  }

  function pararAlerta() {
    try {
      player.pause();
      player.seekTo(0);
    } catch (erro) {
      console.log("Não foi possível parar o áudio.");
    }
  }

  return {
    reproduzirAlerta,
    pararAlerta,
  };
}