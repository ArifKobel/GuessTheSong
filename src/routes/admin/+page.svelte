<script lang="ts">
	import { onMount } from "svelte";
  import type { song } from "$lib/types/songInterface";
	import axios from "axios";
  let songName = '';
  let autoComplete : song[] = [];
  const useAutoComplete = (name: string) => {
    songName = name;
  }
  $: if (songName.length >= 3) {
    axios.get(`/api/search?q=${songName}`).then((res) => {
      console.log(res.data);
      autoComplete = res.data;
    })
  } else {
    autoComplete = [];
  }
</script>

<main class="flex-main">
  <form method="POST" class="flex flex-col gap-4">
    <h1 class=" text-3xl font-retro">Add Song</h1>
    <div class=" w-full">
      <input bind:value={songName} name="name" type="text" placeholder="Song Name" class=" outline-none p-2 rounded-md bg-gray-900 text-white w-full" />
      {#if autoComplete.length > 0}
      <div class=" mt-2 w-72 p-4 bg-gray-900 rounded-lg text-xs max-h-80 flex flex-col overflow-auto">
        {#each autoComplete as song}
          <button type="button" class="hover:bg-gray-800 text-left p-4" on:click={() => useAutoComplete(song.name)}>
            <p>{song.name}</p>
          </button>
        {/each}
        </div>
      {/if}
    </div>
    <input name="url" type="text" placeholder="Song URL" class=" outline-none p-2 rounded-md bg-gray-900 text-white" />
    <input name="artist" type="text" placeholder="Song Artist" class=" outline-none p-2 rounded-md bg-gray-900 text-white" />
    <input name="secret" type="password" placeholder="Secret" class=" outline-none p-2 rounded-md bg-gray-900 text-white" >
    <button type="submit" class=" p-2 rounded-md bg-gray-900 text-white">Submit</button>
  </form>
</main>