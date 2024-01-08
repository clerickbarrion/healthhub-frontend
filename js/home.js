// //typewriter functionality
// // array of words to be typed by the typewriter effect
const words = ["nauseous", "fatigued", "congested", "lightheaded"];

let wordIndex = 0;
let charIndex = 0;

//created a variable to track if the typewriter is currently deleting characters
let isDeleting = false;

//function for typewriter effect
function type() {
  //gets the current word from the array
  const word = words[wordIndex];

  //sets typing speed based on if characters are being deleted or added
  const speed = isDeleting ? 250 : 200;

  //checks if characters are still being added to the word
  if (!isDeleting && charIndex < word.length) {
    //appends the next character to the displayed text
    document.getElementById('typewriter').textContent += word.charAt(charIndex);
    charIndex++;
  }
  //checks if characters are being deleted
  else if (isDeleting && charIndex > 0) {
    // Remove the last character from the displayed text
    document.getElementById('typewriter').textContent = word.substring(0, charIndex-1);
    charIndex--;
  }

  //changes the status to deleting characters if all characters have been added
  if (charIndex === word.length) {
    isDeleting = true;
  }
  //resets the status to add characters if all characters have been deleted
  else if (charIndex === 0) {
    isDeleting = false;

    //moves to the next word in the array
    wordIndex++;
    if (wordIndex === words.length) {
      wordIndex = 0;
    }
  }

  //recursively calls the type function with a delay
  setTimeout(type, speed);
}

//initial call to start the typewriter effect
type();
//materialize carousel functionality
  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(elems);

});