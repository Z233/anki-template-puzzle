<script lang="ts">
  import { flip } from 'svelte/animate';
  import { receive, send } from './lib/transition';
  import type { WordStore } from './store/words';
  import type { CheckableWord } from './types';

  export let store: WordStore;
  export let checked: boolean;

  export let listHeight: number = 0;

  $: items = $store.filter((word) => word.checked === checked);

  function handleCheck(word: CheckableWord, checked: boolean) {
    store.check(word, checked);
  }
</script>

<ul bind:clientHeight={listHeight} class="flex gap-2 flex-wrap justify-center items-start gap-y-3">
  {#each items as word (word.id)}
    <button
      in:receive={{ key: word.id }}
      out:send={{ key: word.id }}
      animate:flip={{ duration: 200 }}
      on:click|stopPropagation|preventDefault={() => handleCheck(word, !checked)}
    >
      <label class="bg-orange-100 text-orange-600 px-3 py-1 rounded relative">
        <span>{word.word}</span>
        <input class="invisible absolute inset-0" type="checkbox" checked={word.checked} />
      </label>
    </button>
  {/each}
</ul>
