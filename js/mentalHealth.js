
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, options);
  });


const feelingInputElem= document.getElementById('feeling')
//const feelingInput = feelingInputElem.value
  const adviceOutput = document.getElementById('resourceList')
  const agreeButton = document.getElementById('agree')

agreeButton.addEventListener('click', async ()=>{
console.log('click')
const list = await resourceDisplay()
console.log(list)
for (let i = 0; i < list.length ; i++){
  if(feelingInputElem.value === list[i].feeling){



    console.log('working')
  }
  else{ console.log('not working')}
  // console.log(feelingInput)
console.log(list[i].feeling)
 }
}

)

  async function resourceDisplay(){
console.log('triggered')
return fetch(`https://healthhub-server.glitch.me/feeling`)
.then(res=> res.json())
.then(list=>{
  return list


 
})}
  



  // create drop down menu of feelings that narrows the list to match, displays no relsults in drop menu if none are in list
//takes selected feeling and returns matching value from object, get resources trigger modal
// when id.agree is clicked. use feelings.inner text to s
//



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

 