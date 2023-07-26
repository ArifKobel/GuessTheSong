<script>
	import { goto } from "$app/navigation";

  const play = () => {
    const audio = new Audio('/start.mp3')
    audio.play()
    goto('/play/guessthesong')
  }
</script>

<main class="flex-main flex-col gap-8">
  <h1 class=" font-retro">GuessTheSong</h1>
  <button on:click={play} class=" font-retro hover:text-red-500 transition-all">PLAY</button>
</main>