const username = localStorage.getItem('username')
const greeting = document.getElementById('greeting')
const logButton = document.querySelector('nav').querySelector('a.btn')
logButton.addEventListener('click',()=>{ localStorage.setItem('username','') })
greeting.textContent = `Welcome to your profile, ${username}`

const history = document.getElementById('diagnosis-history')
// const description = document.getElementById('description')
// const remedy = document.getElementById('remedy')
// const summary = document.getElementById('summary')
// const descriptionSwitch = document.getElementById('description-switch')
// const remedySwitch = document.getElementById('remedy-switch')

fetch(`https://healthhub-server.glitch.me/retrieveHistory?username=${username}`)
.then(res=>res.json()).then(diagnosisList=>{
    diagnosisList.forEach(diagnosis=>{
        const li = document.createElement('li')
        li.innerHTML = `
        <div class="collapsible-header"> <p>${diagnosis.diagnosis}</p> <button class="waves-effect waves-light btn blue darken-4">Remove</button> </div>
        <div class="collapsible-body"> 
            <div>
                <button id="description-switch" class="waves-effect waves-light btn">Description</button>
                <button id="remedy-switch" class="waves-effect waves-light btn">Remedy</button>
            </div>
            <div id="description" class="card-content"></div>
            <div id="remedy" class="card-content"></div> 
        </div>
        `
        history.appendChild(li)
        const description = li.querySelector('#description')
        const remedy = li.querySelector('#remedy')
        const descriptionSwitch = li.querySelector('#description-switch')
        const remedySwitch = li.querySelector('#remedy-switch')

        li.addEventListener('click',()=>{
            fetch(`https://healthhub-server.glitch.me/apimedic/getRemedy?diagnosis=${diagnosis.diagnosisID}`)
            .then(res=>res.json()).then(issue=>{
                description.innerText = issue.Description
                remedy.innerText = issue.TreatmentDescription
            })
        })

        descriptionSwitch.addEventListener('click',()=>switchSection(remedySwitch,remedy,descriptionSwitch,description))
        remedySwitch.addEventListener('click',()=>switchSection(descriptionSwitch,description,remedySwitch,remedy))

        li.querySelector('button').addEventListener('click',()=>{
            li.remove()
            const data = {
                username: username,
                diagnosisID: diagnosis.diagnosisID
            }
            const options = {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            }
            fetch(`https://healthhub-server.glitch.me/removeDiagnosis`,options)
        })
    })
    if(history.innerHTML === ''){history.innerHTML = 'You have no history'}
    var elems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elems);
})



function switchSection(currentSwitch,currentSection,nextSwitch,nextSection){
    nextSwitch.style.backgroundColor = '#0D47A1'
    nextSwitch.style.color = 'white'
    currentSwitch.style.backgroundColor = 'white'
    currentSwitch.style.color = '#0D47A1'
    currentSection.style.display = 'none'
    nextSection.style.display = 'flex'
}