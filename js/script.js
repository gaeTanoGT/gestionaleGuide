var date = new Date().toLocaleDateString();
const val = date;
const url='https://script.google.com/macros/library/d/1Lf8nUpxb1ZFVYDAtXCOvX9KUe128C-OfoqNyfQfIEl-YLPF0_ugMd-nQ/9';

const form = document.getElementById('formGuide');
const paragraph = document.getElementById('paragraph');
const fieldset = document.getElementById('driverFieldset');
fieldset.style.display = 'none';

var keys = [];
var values = [];
var who

document.getElementById('date').innerHTML = date;

//request 1
const url1 = url+"?date="+val;
invia(url1);

function updateSpreadSheet(dataJs){
    try {
        const spreadsheetDataDiv = document.getElementById('spreadsheetData');
        
        spreadsheetDataDiv.innerHTML = '';

        keys.push("chi")
        values.push("n passaggi")
        
        //scorri tutti gli elementi dell'oggetto ad eccezione dell'ultimo
        for(let k of Object.values(dataJs).slice(0, -1)){
            keys.push(k[0]);
            values.push(k[1]);
        }

        const table = document.createElement('table');

        for (let i = 0; i < keys.length; i++) {
            const row = table.insertRow();
            
            const keyCell = row.insertCell();
            keyCell.textContent = keys[i];
            
            const valueCell = row.insertCell();
            valueCell.textContent = values[i];
            valueCell.id = 'valueCell'+i;

            keyCell.style.fontWeight = 'bold';
        }

        spreadsheetDataDiv.appendChild(table);

    } catch (error) {
        
    }
}

function invia(url) {
    fetch(url)
    .then(res => 
        res.json()
    )
    .then(data => {
        let dataJs = JSON.parse(JSON.stringify(data));
        console.log(dataJs);

        /*analizzo l'ultimo elemento: 
            -1: nessuno ha guidato
            0: gori
            1: delca
            2: enzo
            3: io
        */
        let lastKey = Object.keys(Object.values(dataJs)[Object.values(dataJs).length - 1])[0]
        let last = Object.values(Object.values(dataJs)[Object.values(dataJs).length - 1])[0]

        showDriverFieldset(last == -1)
        showParagraph(last!=-1)
        updateParagraph(parseInt(last))

        if(lastKey == "modified"){
            updateSpreadSheet(dataJs)
            return
        }

        if(!dataJs.done){
            showParagraph(true)
            updateParagraph(-1)
            return
        }

        updateTable(who)

        return dataJs.done
    })
    .catch(error => {
        console.log(error);
    });
}

function showDriverFieldset(st){
    fieldset.style.display = (st==true) ? 'block' : 'none';
}

function showParagraph(st){
    paragraph.style.display = (st==true) ? 'block' : 'none';
}

function updateTable(who){
    let newWho = parseInt(who)+1;
    
    //tabella
    const valueCell = document.getElementById('valueCell'+newWho);
    values[newWho]++;
    valueCell.textContent = values[newWho];

    //paragrafo
    updateParagraph(parseInt(who));
}

function updateParagraph(who){
    if(who == -1){
        //showDriverFieldset(false)
        paragraph.textContent = "form gia' compilato da qualcun altro"
        return
    }

    paragraph.textContent = "Oggi ha guidato " + whoString(who);
    showParagraph(true)
}

function whoString(who){
    switch(who){
        case -1:
            return "form gia' compilato da qualcun altro"
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

//invio dati form
document.querySelector('.submit').addEventListener('click', function(e){
    const selectedRadio = document.querySelector('input[name="driver"]:checked');
    who = selectedRadio.value;
    const url2 = url+"?who="+who;

    invia(url2)
    
    paragraph.textContent = "Invio form...";
    showParagraph(true)

    showDriverFieldset(false);
})

// Gestione del form (non aggiorna la pagina)
document.getElementById('formGuide').addEventListener('submit', function(e) {
    e.preventDefault();
});
