<script lang="ts">
  import { scale, slide } from 'svelte/transition';
  import WordList from './WordList.svelte';
  import { spellCheck } from './lib/utils';
  import { createWordStore } from './store/words';
  import { quintOut } from 'svelte/easing';
  import clsx from 'clsx';
  import { createUiStore } from './store/ui';

  const sentence = window._card.Sentence;

  const words = [...sentence.matchAll(/\w+/g)].map((match) => match[0].toLocaleLowerCase());
  const shuffledWords = [...words].sort(() => Math.random() - 0.5);

  const wordStore = createWordStore(
    shuffledWords.map((w) => ({
      checked: false,
      word: w,
    }))
  );
  $: isAllChecked = $wordStore.every((w) => w.checked);
  $: checkedWords = $wordStore.filter((w) => w.checked).map((w) => w.word);

  const uiStore = createUiStore();
  $: isShowAnswer = $uiStore.showAnswer;

  let listHeight = 0;
  // @ts-expect-error
  $: maxListHeight = Math.max(maxListHeight ?? 0, listHeight);

  $: {
    if (isShowAnswer && !isAllChecked) {
      uiStore.toggleAnswer(false);
    }
  }

  let inputResult: {
    result: string;
    correction: string;
    isCorrect: boolean;
  }[] = [];

  $: isAllCorrect = checkedWords.length === words.length;

  function handleCheck() {
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

      if (!isWordCorrect) {
        isAllCorrect = false;
      }
    });

    uiStore.toggleAnswer(true);
  }

  function handleTryAgain() {
    wordStore.reset();
    inputResult = [];
    uiStore.toggleAnswer(false);
  }
</script>

<main style="--list-height: {maxListHeight}px" class="p-4 mx-auto max-w-xl h-full flex flex-col">
  <div class="flex-1 flex flex-col justify-center gap-6">
    <WordList bind:listHeight checked={true} store={wordStore} />
    <div class="w-[200%] h-[1px] bg-neutral-200 scale-50 origin-left" />
    <div>
      <WordList bind:listHeight checked={false} store={wordStore} />
      <div class="relative">
        {#if isShowAnswer}
          <div
            transition:slide={{ duration: 250, easing: quintOut, axis: 'y' }}
            class={clsx('px-4 pb-[4.5rem] pt-4 flex flex-col gap-2 rounded', {
              'bg-red-200 text-red-600': !isAllCorrect,
              'bg-green-200 text-green-600': isAllCorrect,
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
                {@html inputResult.map((c) => c.correction).join(' ')}
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
                '!text-base w-full bg-white group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border px-6 font-medium transition-all shadow-[0px_4px_1px] active:translate-y-[2px] active:shadow-none',
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
