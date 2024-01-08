

let symptoms = [];
let gender = '';
let birthYear = '';

document.addEventListener('DOMContentLoaded', async function () {
    const token = await fetch(`https://healthhub-server.glitch.me/apimedic/getToken`).then(res => res.json()).then(token => token)
    const url = 'https://healthservice.priaid.ch/symptoms?token=' + token + '&format=json&language=en-gb';
    fetch(url)
        .then(res => res.json())
        .then(data => {
            symptoms = data;

            const selectElement = document.getElementById('symptoms');
            symptoms.forEach(item => {
                const option = document.createElement('option');
                option.value = item.Name;
                option.textContent = item.Name;
                selectElement.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching symptoms:', error));
    const storedGender = localStorage.getItem('selectedGender');
    const storedBirthYear = localStorage.getItem('selectedBirthYear');

    if (storedGender) {
        gender = storedGender;
        document.getElementById('gender').value = gender;
    } else { gender = document.getElementById('gender').value }

    if (storedBirthYear) {
        birthYear = storedBirthYear;
        document.getElementById('birthYear').value = birthYear;
    }
});

document.getElementById('gender').addEventListener('change', function () {
    gender = this.value;
    localStorage.setItem('selectedGender', gender);
});

document.getElementById('birthYear').addEventListener('input', function () {
    birthYear = this.value;
    localStorage.setItem('selectedBirthYear', birthYear);
});


function addSymptom() {
    const selectedSymptomInput = document.getElementById('selectedSymptom');
    const selectedSymptomsList = document.getElementById('selectedSymptoms');

    const selectedSymptomName = selectedSymptomInput.value.trim();

    if (selectedSymptomName === '') {
        return;
    }

    getSymptomIds(selectedSymptomName)
        .then(selectedSymptomId => {
            const listItem = document.createElement('li');
            listItem.textContent = selectedSymptomName;

            listItem.classList.add('symptom-item');
            listItem.dataset.id = selectedSymptomId;

            listItem.addEventListener('click', function () {
                removeSymptom(selectedSymptomId);
                selectedSymptomsList.removeChild(listItem);
            });

            listItem.addEventListener('mouseover', function () {
                listItem.style.color = 'red';
            });

            listItem.addEventListener('mouseout', function () {
                listItem.style.color = '';
            });

            if (!selectedSymptoms.includes(selectedSymptomId)) {
                selectedSymptoms.push(selectedSymptomId);
            }

            selectedSymptomsList.appendChild(listItem);

            selectedSymptomInput.value = '';
        })
        .catch(error => console.error('Error getting symptom IDs:', error));
}

function removeSymptom(symptomId) {
    const index = selectedSymptoms.indexOf(symptomId);
    if (index !== -1) {
        selectedSymptoms.splice(index, 1);
    }
}


async function getSymptomIdByName() {
    const token = await fetch(`https://healthhub-server.glitch.me/apimedic/getToken`).then(res => res.json()).then(token => token)
    const url = 'https://healthservice.priaid.ch/symptoms?token=' + token + '&format=json&language=en-gb';
    return fetch(url).then(res => res.json()).then(symptoms => symptoms);
}

async function getSymptomIds(selectedSymptomName) {
    const symptomList = await getSymptomIdByName();
    const selectedSymptom = symptomList.find(item => item.Name === selectedSymptomName);

    if (selectedSymptom) {
        return selectedSymptom.ID;
    } else {
        throw new Error('Symptom not found');
    }
}

const selectedSymptoms = [];


function updateDiagnosesList(diagnoses) {
    const diagnosesList = document.getElementById('Diagnoses');
    diagnosesList.innerHTML = '';

    if (diagnoses.length > 0) {
        // Only iterate over the first 3 diagnoses
        for (let i = 0; i < Math.min(3, diagnoses.length); i++) {
            const diagnosis = diagnoses[i];
            const listItem = document.createElement('li');
            listItem.textContent = 'Diagnoses: ' + diagnosis.Issue.Name + ' Accuracy: ' + diagnosis.Issue.Accuracy + '%';
            diagnosesList.appendChild(listItem);
        }
    } else {
        // Display a message when no diagnoses are found
        const messageItem = document.createElement('li');
        messageItem.textContent = 'No diagnoses found with those symptoms. Please try again.';
        diagnosesList.appendChild(messageItem);
    }
}

async function getDiagnoses() {
    if (selectedSymptoms.length > 0) {
        const token = await fetch(`${window.location.origin}/apimedic/getToken`).then(res => res.json()).then(token => token);
        const diagnosisUrl = 'https://healthservice.priaid.ch/diagnosis?symptoms=[' + selectedSymptoms.join(',') + ']&gender=' + gender + '&year_of_birth=' + birthYear + '&token=' + token + '&format=json&language=en-gb';

        fetch(diagnosisUrl)
            .then(res => res.json())
            .then(diagnoses => {
                console.log('Diagnoses:', diagnoses);
                if (diagnoses.length > 0) {
                    const firstDiagnosis = diagnoses[0];
                    localStorage.setItem('firstDiagnosis', JSON.stringify(firstDiagnosis));
                }

                updateDiagnosesList(diagnoses);
            })
            .catch(error => console.error('Error fetching diagnoses:', error));
    } else {
        // Display a message when no symptoms are selected
        const diagnosesList = document.getElementById('Diagnoses');
        diagnosesList.innerHTML = '';

        const messageItem = document.createElement('li');
        messageItem.textContent = 'No symptoms selected for diagnosis.';
        diagnosesList.appendChild(messageItem);

        console.log('No symptoms selected for diagnosis.');
    }
}


