function calcGouge() {
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getActiveSheet();
  var oldVals = {
    costs: {
      mine: 0,
      client: 0
    },
    net: 0
  };
  var newVals = {
    costs: {
      mine: 0,
      client: 0
    },
    net: 0
  };
  sheet.getRange('B2:B').getValues().some(function(cells) {
    var cell = cells[0];
    var oldCost = cell*.1;
    oldVals.costs.mine += oldCost;
    oldVals.net += cell - oldCost;
    
    var gross = cell;
    var newCost = 0;
    var first = 500;
    var second = 9999.99;
    
    newCost += Math.min(gross, first) * 0.2;
    if(gross > first) {
      newCost += Math.min(second, (gross - first)) * 0.1;
    }
    if(gross > second) {
      newCost += (gross - second) * 0.05;
    }
    newVals.costs.mine += newCost;
    newVals.net += gross - newCost;
    newVals.costs.client += gross * 0.0275;
  });
  var ui = SpreadsheetApp.getUi();
  
  var htmlOutput = HtmlService
    .createHtmlOutput('<table><tbody><tr><th colspan=2>Prev Jun 21, 2016</th></tr>'+
                      '<tr><th>Your Fees</th><td>' + oldVals.costs.mine + '</td></tr>' +
                      '<tr><th>Client Fees</th><td>' + oldVals.costs.client + '</td></tr>' +
                      '<tr><th>You Earn</th><td>' + oldVals.net + '</td></tr>' +
                      '<tr><th colspan=2>Jun, 21 2016</th></tr>'+
                      '<tr><th>Your Fees</th><td>' + newVals.costs.mine + '</td></tr>' +
                      '<tr><th>Client Fees</th><td>' + newVals.costs.client + '</td></tr>' +
                      '<tr><th>You Earn</th><td>' + newVals.net + '</td></tr>' +
                      '</tbody></table>');
  
  ui.showModalDialog(htmlOutput, 'Upwork Price Changes');
}

function onOpen(e) {
  SpreadsheetApp.getUi().createMenu('Upwork').addItem('Calculate New Fees', 'calcGouge').addToUi();
}
