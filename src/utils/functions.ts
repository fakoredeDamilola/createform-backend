export function getRandomString() {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const getRandomWord = () => {
    const wordLength = Math.floor(Math.random() * 3) + 3; // Generates a number between 3 and 5
    let word = '';
    for (let i = 0; i < wordLength; i++) {
      word += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return word;
  };

  const randomString = `${getRandomWord()}-${getRandomWord()}`;

  return randomString;
}
