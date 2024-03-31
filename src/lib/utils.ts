export function spellCheck(input: string, answer: string) {
  const length = Math.max(answer.length, input.length);
  let resultHTML = '',
    correctHTML = '',
    isCorrect = true;

  const makeResultHTML = (text: string) => `<span class="wrong">${text}</span>`;
  const makeCorrectHTML = (text: string) => `<span class="font-bold underline">${text}</span>`;

  for (let i = 0, j = 0; i < length && j < length; ) {
    while (answer[j] && input[j] && answer[j] !== input[j]) {
      j++;
      isCorrect = false;
    }
    if (!answer[j] || !input[j]) {
      isCorrect = false;
      resultHTML += makeResultHTML(input.substring(i, length));
      correctHTML += makeCorrectHTML(answer.substring(i, length));
      break;
    }
    if (i !== j) {
      resultHTML += makeResultHTML(input.substring(i, j));
      correctHTML += makeCorrectHTML(answer.substring(i, j));
      i = j;
    } else {
      resultHTML += input[i];
      correctHTML += answer[i];
      i++, j++;
    }
  }

  return {
    resultHTML,
    correctHTML,
    isCorrect,
  };
}
