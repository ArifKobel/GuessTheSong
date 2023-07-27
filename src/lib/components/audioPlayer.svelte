<script lang="ts">
	import Icon from "@iconify/svelte";
  import { createEventDispatcher, onMount } from "svelte";
  export let audioUrl = "";
  let isPaused = true;
  let percent = 0;
  let audio:any = undefined
  const togglePause = () => {
		isPaused = !isPaused;
		if (isPaused) {
			audio.pause();
		} else {
			audio.play();
		}
	};
  onMount(() => {
    audio = new Audio(audioUrl);
    console.log(audioUrl)
    audio.addEventListener("timeupdate", () => {
      percent = (audio.currentTime / 10) * 100;
      if (percent >= 100) {
        percent = 0;
        isPaused = true;
        audio.pause();
        audio.currentTime = 0;
      }
    });
    audio.addEventListener("ended", () => {
      isPaused = true;
    });
  })
</script>

<div class=" w-72 h-16 rounded-md bg-gray-900 flex px-4 items-center gap-4">
  {#if isPaused}
    <button on:click={togglePause}>
      <Icon icon="mdi:play-circle" class=" text-3xl" />
    </button>
  {:else}
    <button on:click={togglePause}>
      <Icon icon="mdi:pause-circle" class=" text-3xl" />
    </button>
  {/if}
  <div class=" w-full h-4 bg-gray-800 rounded-full p-1">
    <div style="width: {percent}%;" class=" h-full bg-white rounded-full" />
  </div>
</div>