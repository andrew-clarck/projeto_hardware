import { useAudioPlayer } from "expo-audio";

export function useAudio() {
  const player = useAudioPlayer();

  function reproduzirAlerta(audio) {
    player.replace(audio);
    player.loop = true;
    player.play();
  }

  function pararAlerta() {
    player.pause();
    player.seekTo(0);
  }

  return {
    reproduzirAlerta,
    pararAlerta,
  };
}
