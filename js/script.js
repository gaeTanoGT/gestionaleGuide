var date = new Date().toLocaleDateString();
const val = date;     //TODO: get current date 
const url='https://script.google.com/macros/s/AKfycbxXe2rOlkOtf4yoAPLTAKXduFBJyHbUg5UU54o0RwkqaWlmRYKJv05T_r6WN8HlnJ6Y/exec';
const url1 = url+"?date="+val;

const form = document.getElementById('formGuide');
const fieldset = document.getElementById('driverFieldset');
fieldset.style.display = 'none';
const paragraph = document.getElementById('paragraph');

let keys = [];
let values = [];

document.getElementById('date').innerHTML = date;

fetch(url, {
        redirect: "follow",
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
          'Content-Type': "text/plain;charset=utf-8"
        }
      })
      .then(response => response.text())
      .then(result => {
        const res = JSON.parse(result);
        console.log(res);
      });

//request 1
invia(url1);

function invia(url) {
    fetch(url)
    .then(res => {
        console.log(res);
        return res.json()
    })
    .then(data => {
        console.log(data);
        let dataJs = JSON.parse(JSON.stringify(data));
        console.log(dataJs);
        paragraph.style.display = 'none';
        try {
            // Get the div where we'll insert the data
            const spreadsheetDataDiv = document.getElementById('spreadsheetData');
            
            // Clear any existing content in the div
            spreadsheetDataDiv.innerHTML = '';

            // Get all keys except the last one
            keys.push("chi")
            values.push("n passaggi")
            
            for(let k of Object.values(dataJs).slice(0, -1)){
                keys.push(k[0]);
                values.push(k[1]);
            }

            // Create a table to display the data
            const table = document.createElement('table');
            table.border = '1';

            // Create rows for each key-value pair
            for (let i = 0; i < keys.length; i++) {
                const row = table.insertRow();
                
                // Key cell
                const keyCell = row.insertCell();
                keyCell.textContent = keys[i];
                
                // Value cell
                const valueCell = row.insertCell();
                valueCell.textContent = values[i];
                valueCell.id = 'valueCell'+i;

                keyCell.style.fontWeight = 'bold';
            }

            // Append the table to the div
            spreadsheetDataDiv.appendChild(table);

            // Handle the last element as before
            let last = Object.values(Object.values(dataJs)[Object.values(dataJs).length - 1])[0];
            console.log(last);
            showDriverFieldset(last == -1)
            if(last != -1) updateParagraph(parseInt(last))
        } catch (error) {
            console.log(error);
        }
    })
    .catch(error => {
        console.log(error);
    });
}

function showDriverFieldset(st){
    fieldset.style.display = st==true ? 'block' : 'none';
}

function updateTable(who){
    let newWho = parseInt(who)+1;
    //table
    const valueCell = document.getElementById('valueCell'+newWho);
    values[newWho]++;
    valueCell.textContent = values[newWho];

    //paragraph
    updateParagraph(parseInt(who));
}

function updateParagraph(who){
    paragraph.textContent = "Oggi ha guidato " + whoString(who);
    paragraph.style.display = 'block';
}

function whoString(who){
    switch(who){
        case 0:
            return "lore";
        case 1:
            return "andre";
        case 2:
            return "enzo";
        case 3:
            return "gae";
    }
}

//invio dati
document.querySelector('.submit').addEventListener('click', function(e){
    const selectedRadio = document.querySelector('input[name="driver"]:checked');
    const who = selectedRadio.value;
    const url2 = url+"?who="+who;
    invia(url2);
    paragraph.textContent = "Form inviato!";
    showDriverFieldset(false);
    updateTable(who)
})

// Gestione del form (non aggiorna la pagina)
document.getElementById('formGuide').addEventListener('submit', function(e) {
    e.preventDefault();
});
