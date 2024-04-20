<script lang="ts">
  import { scale, slide } from 'svelte/transition';
  import WordList from './WordList.svelte';
  import { spellCheck } from './lib/utils';
  import { createWordStore } from './store/words';
  import { quintOut } from 'svelte/easing';
  import clsx from 'clsx';
  import { createUiStore } from './store/ui';
  import { PersistenceKey } from './types';
  import { onMount } from 'svelte';

  const IS_BACK_SIDE = Boolean(document.getElementById('BACK_SIDE'));

  const persistenceData = IS_BACK_SIDE ? window.Persistence.getItem() : {};
  window.Persistence.clear();

  const info = window._card.Info;
  const sentence = new DOMParser().parseFromString(window._card.Sentence, 'text/html').documentElement.textContent!;

  const words = [...sentence.matchAll(/\w+/g)].map((match) => match[0]);
  const shuffledWords = [...words].sort(() => Math.random() - 0.5);

  const wordStore = createWordStore(
    persistenceData && persistenceData?.[PersistenceKey.Words]
      ? JSON.parse(persistenceData[PersistenceKey.Words])
      : shuffledWords.map((w) => ({
          checked: false,
          word: w,
        }))
  );

  const uiStore = createUiStore(
    persistenceData && persistenceData?.[PersistenceKey.UI]
      ? JSON.parse(persistenceData[PersistenceKey.UI])
      : { showAnswer: false }
  );

  $: {
    if (!IS_BACK_SIDE) {
      window.Persistence.setItem(undefined, {
        [PersistenceKey.Words]: JSON.stringify($wordStore),
        [PersistenceKey.UI]: JSON.stringify($uiStore),
      });
    }
  }

  $: isAllChecked = $wordStore.every((w) => w.checked);
  $: checkedWords = $wordStore.filter((w) => w.checked).map((w) => w.word);

  $: isShowAnswer = $uiStore.showAnswer;

  $: {
    if (!IS_BACK_SIDE && isShowAnswer && !isAllChecked) {
      requestAnimationFrame(() => {
        uiStore.toggleAnswer(false);
      });
    }
  }

  let inputResult: {
    result: string;
    correction: string;
    isCorrect: boolean;
  }[] = [];

  $: isAllCorrect = inputResult.length === words.length && inputResult.every((r) => r.isCorrect);

  function checkInputs() {
    checkedWords.forEach((word, index) => {
      const { resultHTML, correctHTML, isCorrect: isWordCorrect } = spellCheck(word, words[index]);

      inputResult = [
        ...inputResult,
        {
          result: resultHTML,
          correction: correctHTML,
          isCorrect: isWordCorrect,
        },
      ];
    });
  }

  function handleCheck() {
    checkInputs();
    uiStore.toggleAnswer(true);
  }

  onMount(() => {
    if (IS_BACK_SIDE) {
      checkInputs();
      if (!isShowAnswer) {
        uiStore.toggleAnswer(true);
      }
    }
  });

  function handleTryAgain() {
    wordStore.reset();
    inputResult = [];
    uiStore.toggleAnswer(false);
  }
</script>

<main class="h-full w-full flex flex-col">
  {#if info}
    <div class="h-48 border-b grid place-content-center bg-neutral-50">
      <p class="text-lg">
        {info}
      </p>
    </div>
  {/if}
  <div class="p-4 w-full mx-auto max-w-xl flex-1 flex flex-col justify-center gap-6">
    <WordList checked={true} store={wordStore} />
    <div class="w-[200%] h-[1px] bg-neutral-200 scale-50 origin-left transition" />
    <div>
      <WordList checked={false} store={wordStore} />
      <div class="relative">
        {#if isShowAnswer}
          <div
            transition:slide={{ duration: 250, easing: quintOut, axis: 'y' }}
            class={clsx('px-4 pb-[4.5rem] pt-4 flex flex-col gap-2 rounded', {
              'bg-red-200 text-red-600': !isAllCorrect,
              'bg-green-200 text-green-600': isAllCorrect,
              '!pb-4 mt-6': isShowAnswer && !isAllChecked,
            })}
          >
            <h3 class="font-bold flex gap-2 items-center">
              {#if isAllCorrect}
                <span class="gg-check-o" />
                <span>Matched</span>
              {:else}
                <span class="gg-close-o" />
                <span>Mismatched</span>
              {/if}
            </h3>

            <p class="text-left">
              {#if isAllCorrect}
                {sentence}
              {:else}
                {@html inputResult.length ? inputResult.map((c) => c.correction).join(' ') : `Answer: ${sentence}`}
              {/if}
            </p>
          </div>
        {/if}
        {#if isAllChecked}
          <div
            transition:scale={{ duration: 150 }}
            class={clsx('px-4', {
              'absolute bottom-0 left-0 right-0 pt-4 pb-5': isShowAnswer,
            })}
          >
            <button
              class={clsx(
                `!text-base w-full bg-white group relative inline-flex h-10 items-center justify-center 
                overflow-hidden rounded-md border px-6 font-medium transition-all shadow-[0px_4px_1px] 
                active:translate-y-[2px] active:shadow-none`,
                {
                  'shadow-neutral-600  text-neutral-600  border-neutrag-200': !isShowAnswer,
                  'border-green-200 text-green-600 shadow-green-600': isShowAnswer && isAllCorrect,
                  'border-red-200 text-red-600 shadow-red-500': isShowAnswer && !isAllCorrect,
                }
              )}
              on:click={isShowAnswer ? handleTryAgain : handleCheck}
            >
              {#if isShowAnswer}
                <span>Try Again</span>
              {:else}
                <span>Show Answer</span>
              {/if}
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>
