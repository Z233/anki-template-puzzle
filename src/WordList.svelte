<script lang="ts">
  import { flip } from 'svelte/animate';
  import { receive, send } from './lib/transition';
  import type { WordStore } from './store/words';
  import type { CheckableWord } from './types';
  import clsx from 'clsx';

  export let store: WordStore;
  export let checked: boolean;

  $: items = $store.filter((word) => word.checked === checked);

  function handleCheck(word: CheckableWord, checked: boolean) {
    store.check(word, checked);
  }
</script>

<ul class="flex gap-2 flex-wrap justify-center items-start gap-y-3">
  {#each items as word (word.id)}
    <button
      in:receive={{ key: word.id }}
      out:send={{ key: word.id }}
      animate:flip={{ duration: 200 }}
      on:click|stopPropagation|preventDefault={() => handleCheck(word, !checked)}
      class={clsx('px-3 py-1 rounded relative transition active:bg-opacity-85', {
        'bg-sky-100 text-sky-600': checked,
        'bg-orange-100 text-orange-600': !checked,
      })}
    >
      <label>
        <span>{word.word}</span>
        <input class="invisible absolute inset-0" type="checkbox" checked={word.checked} />
      </label>
    </button>
  {/each}
</ul>
