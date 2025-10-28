// **!!! SOSTITUISCI QUESTO URL con il tuo URL /exec del deployment FINALE !!!**
// NON USARE L'URL /dev
var date = new Date().toLocaleDateString();
const val = date;
const url='https://script.google.com/macros/s/AKfycbwCmRv1uzVchZ6W1Z7pjfn2Zk7YwerrlOB2PaQa8NfUltMdtIg2rH2g7EJoRIbRyl1Scg/exec';

// ... (le tue dichiarazioni DOM e variabili restano qui) ...
const form = document.getElementById('formGuide');
const paragraph = document.getElementById('paragraph');
const fieldset = document.getElementById('driverFieldset');
fieldset.style.display = 'none';

var keys = [];
var values = [];
var who; // Non inizializzato qui

document.getElementById('date').innerHTML = date;

// Richiesta 1: Carica i dati iniziali
const url1 = url + "?date=" + val;
invia(url1);

// ... (tutte le tue altre funzioni, ad eccezione di updateSpreadSheet e invia, restano invariate) ...

function updateSpreadSheet(totali, modifiedStatus){ // Modificata per la nuova struttura JSON
    try {
        const spreadsheetDataDiv = document.getElementById('spreadsheetData');
        spreadsheetDataDiv.innerHTML = '';
        
        keys = ["chi"];
        values = ["n passaggi"];
        
        // Scorri i totali (che sono oggetti, non array bidimensionali)
        for(let item of totali){
            keys.push(item.chi);
            values.push(item.n_passaggi);
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

        // Aggiorna lo stato del campo/paragrafo dopo aver aggiornato la tabella
        showDriverFieldset(modifiedStatus == -1);
        showParagraph(modifiedStatus != -1);
        updateParagraph(parseInt(modifiedStatus));

    } catch (error) {
        console.error("Errore in updateSpreadSheet:", error);
    }
}

function invia(url) {
    // Aggiunto 'no-cache' per evitare problemi di cache del browser durante i test
    fetch(url, { cache: 'no-cache' }) 
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        // Il browser solleverà un errore CORS prima di arrivare qui se non risolto
        return res.json();
    })
    .then(data => {
        // console.log("Dati ricevuti:", data); // Utile per il debug

        // RICHIESTA 1: Caricamento iniziale (ha 'totali' e 'modified')
        if("totali" in data && "modified" in data){
            updateSpreadSheet(data.totali, data.modified);
            return;
        }

        // RICHIESTA 2: Dopo l'invio del form (ha 'done')
        if("done" in data){
            if(data.done){
                updateTable(who);
                showParagraph(true);
            } else {
                // Caso in cui il form è stato compilato da un altro (logica interna dello script GAS)
                showParagraph(true);
                updateParagraph(-1); // Mostra "form gia' compilato da qualcun altro"
            }
            return data.done;
        }

    })
    .catch(error => {
        console.error("Errore FETCH (CORS/Rete/JSON):", error);
        // Puoi aggiungere qui una logica per visualizzare un errore utente
        paragraph.textContent = "ERRORE DI CARICAMENTO! Controlla la console per i dettagli (potrebbe essere un problema CORS).";
        showParagraph(true);
        showDriverFieldset(false);
    });
}