
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems, options);
});


const feelingInputElem= document.getElementById('feeling')
const adviceHeader = document.getElementById('resourceHeading')
const adviceOutput1 = document.getElementById('resourceList1')
const adviceOutput2 = document.getElementById('resourceList2')
const adviceOutput3 = document.getElementById('resourceList3')
const agreeButton = document.getElementById('agree')


agreeButton.addEventListener('click', async () => {
  const list = await resourceDisplay();
  console.log(list);
  let feelingFound = false; // keep track if a match is found
  for (let i = 0; i < list.length; i++) {
    if (feelingInputElem.value.toUpperCase() === list[i].feeling.toUpperCase()) {
      adviceHeader.innerText = 'Here are tips based on how you\'re feeling:';
      adviceOutput1.innerText = list[i].advice1;
      adviceOutput2.innerText = list[i].advice2;
      adviceOutput3.innerText = list[i].advice3;
      feelingFound = true; // true when a match is found
      break; // exit the loop since we found a match
    }
  }
  if (!feelingFound) { // if no match is found
    adviceHeader.innerText = 'Please select another feeling';
    adviceOutput1.innerText = "";
    adviceOutput2.innerText = "";
    adviceOutput3.innerText = "";
  }
});

async function resourceDisplay() {
  return fetch(`${window.location.origin}/feeling`)
    .then(res => res.json())
    .then(list => {
      return list
    });
}


let i = 0;
let placeholder = "";
const words = ["Depressed...", "Overwhelmed...", "Anxious...", "Frustrated...", "Manic...", "Alone...", "Guilty..."];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const word = words[wordIndex];
  const speed = isDeleting ? 120 : 200;

  if (!isDeleting && charIndex < word.length) {
    placeholder += word.charAt(charIndex);
    charIndex++;
  } else if (isDeleting && charIndex > 0) {
    placeholder = placeholder.slice(0, -1);
    charIndex--;
  } else {
    isDeleting = !isDeleting;

    if (isDeleting) {
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  document.getElementById("feeling").setAttribute("placeholder", placeholder);

  setTimeout(type, speed);
}

type();



