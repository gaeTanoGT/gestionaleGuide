const ID = '1l3LMC83_rwe69MIAh1QMqVjESxaVm61nLMU9Xeaye8s'

//funzione richiamata della GET
function doGet(e) {  
  const ss = SpreadsheetApp.openById(ID)
  const sheet1 = ss.getSheets()[0]
  const data = sheet1.getDataRange().getValues()
  
  if('date' in e.parameter) {
    const sheet2 = ss.getSheets()[1]
    const tab = sheet2.getDataRange().getValues() 

    /*aggiungo nell'oggetto tab il valore modified:
        -1: dato giornaliero non aggiornato nello spreadsheet
        0: gori
        1: delca
        2: enzo
        3: io
    */
    tab.push({'modified': (e.parameter['date'] == data[1][0]) ? getWho(data) : '-1'})

    return ContentService.createTextOutput(JSON.stringify(tab))
    .setMimeType(ContentService.MimeType.JSON);
  }
  
  if('who' in e.parameter){
    let who = e.parameter['who']
    var sheet = ss.getSheetByName("Foglio1")

    var date_now = Utilities.formatDate(new Date(), "GMT+2", "dd/MM/yyyy"); // gets the current date
    var time_now = Utilities.formatDate(new Date(), "GMT+2", "hh:mm:ss a"); // gets the current time

    let done = false
    if(date_now != data[1][0]){
      done = true
      sheet.insertRows(2)

      sheet.getRange('A2').setValue(date_now)
      sheet.getRange('B2').setValue(time_now)

      switch(who){
        case '0': //gori
          sheet.getRange('C2').setValue('1')
          break
        case '1': //delca
          sheet.getRange('D2').setValue('1')
          break
        case '2': //calissi
          sheet.getRange('E2').setValue('1')
          break
        case '3': //torrisi
          sheet.getRange('F2').setValue('1')
          break
        default: break
      }

      SpreadsheetApp.flush()
    }

    const result = {done: done}
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  }
}

//analizza l'ultimo update, restituisce l'indice del conducente
function getWho(data){
  for(let i = 2; i < 6; i++){
    if(data[1][i] == '1')
      return i - 2
  }
}
