document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.carousel');
    M.Carousel.init(elems);
    M.Tabs.init(document.querySelector('.tabs'), {});
});

fetch(`https://healthhub-server.glitch.me/apimedic/getDiagnosisList`)
.then(res=>res.json()).then(list=>{
    const datalist = document.getElementById('diagnosisList')
    list.forEach(i=>{
        const option = document.createElement('option')
        option.textContent = i.ID
        option.value = i.Name
        datalist.appendChild(option)
    })
})

const findRemediesBtn = document.getElementById('submit-diagnosis')
const diagnosis = document.getElementById('diagnosis')
const recommended = document.getElementById('recommended')
const alternative = document.getElementById('alternative-text')
const description = document.getElementById('description')
const popup = document.getElementById('popup')
const storedDiagnosis = localStorage.getItem('firstDiagnosis')

if (storedDiagnosis) { diagnosis.value = JSON.parse(storedDiagnosis).Issue.Name }

findRemediesBtn.addEventListener('click', async ()=>{
    location.href = "#";
    location.href = "#popup";
    if(diagnosis.value){
        popup.style.display = 'flex'
        recommended.innerHTML = `<div class="preloader-wrapper big active"><div class="spinner-layer spinner-red-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>`
        alternative.innerHTML = `<div class="preloader-wrapper big active"><div class="spinner-layer spinner-red-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>`
        description.innerHTML = `<div class="preloader-wrapper big active"><div class="spinner-layer spinner-red-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>`
        const list = await fetch(`https://healthhub-server.glitch.me/apimedic/getDiagnosisList`).then(res=>res.json()).then(list=>list)
        const issue = list.find(i => i.Name === diagnosis.value)
        let remedy
        if (issue) { 
            remedy = await fetch(`https://healthhub-server.glitch.me/apimedic/getRemedy?diagnosis=${issue.ID}`)
            .then(res=>res.json()).then(issue=>{
                description.textContent = issue.Description
                return issue.TreatmentDescription
            })
        }
        else { 
            remedy = 'No remedy found' 
            description.textContent = 'No description'
        }
        const alt = await fetch(`https://healthhub-server.glitch.me/api/homecare?search=${diagnosis.value}`).then(res=>res.json()).then(issue=>issue)
        recommended.textContent = remedy
        alternative.textContent = alt.homeCare || alt.error

        if (alt.source) document.getElementById('alternative').querySelector('a').href = alt.source
        else {document.getElementById('alternative').querySelector('a').href = '#'}

        if (alt.img) document.querySelector('.card-image').querySelector('img').src = alt.img
        else {document.querySelector('.card-image').querySelector('img').src = '../imgs/medicine.png'}
        localStorage.setItem('firstDiagnosis', '')

        if (localStorage.getItem('username')){
            const data = {
                username: localStorage.getItem('username'),
                diagnosis: diagnosis.value,
                diagnosisId: issue.ID
            }
            const options = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            }
            fetch(`https://healthhub-server.glitch.me/uploadHistory`,options)
        }
    }
})