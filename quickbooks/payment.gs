function getPayments() {
  // BigQuery configuration
  //............................................................................................
  var tableID = "..."; // Enter BigQuery table name
  var schema = {
    fields: [
      {name: 'sync_token', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'domain', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'deposit_to_account_ref', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'unapplied_amt', type: 'FLOAT', mode: 'NULLABLE', description: ''},
      {name: 'txn_date', type: 'DATE', mode: 'NULLABLE', description: ''},
      {name: 'total_amt', type: 'FLOAT', mode: 'NULLABLE', description: ''},
      {name: 'process_payment', type: 'BOOLEAN', mode: 'NULLABLE', description: ''},
      {name: 'sparse', type: 'BOOLEAN', mode: 'NULLABLE', description: ''},
      {name: 'linked_txn_id', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'linked_txn_type', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'customer_ref_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'customer_ref_value', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'id', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'create_time', type: 'DATETIME', mode: 'NULLABLE', description: ''},
      {name: 'last_updated_time', type: 'DATETIME', mode: 'NULLABLE', description: ''},
      {name: 'payment_method_ref', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'credit_card_name_on_acct', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'credit_card_amount', type: 'FLOAT', mode: 'NULLABLE', description: ''},
      {name: 'credit_card_process_payment', type: 'BOOLEAN', mode: 'NULLABLE', description: ''},
      {name: 'currency_ref_value', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'currency_ref_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'private_note', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'txn_source', type: 'STRING', mode: 'NULLABLE', description: ''}
    ]
  };
  var writeDisposition = 'WRITE_TRUNCATE';
  //............................................................................................
  // BigQuery configuration Line Items
  //............................................................................................
  var tableID2 = "payment_line";
  var schema2 = {
    fields: [
      {name: 'amount', type: 'FLOAT', mode: 'NULLABLE', description: ''},
      {name: 'txn_id', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'txn_type', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'payment_id', type: 'INTEGER', mode: 'NULLABLE', description: ''}
    ]
  };
  var writeDisposition2 = 'WRITE_TRUNCATE';
  //............................................................................................
  var start = 1;
  var values = [];
  var values2 = [];
  for (var k = 0; k < 200; k++) {
    var url = "https://quickbooks.api.intuit.com/v3/company/[companyId]/query?query=select * from Payment STARTPOSITION "+ start + "&minorversion=59"
    var headers = {
      "headers":{
      "Accept":"application/json",
      "Content-Type":"application/json",
      "Authorization": "Bearer " + getService().getAccessToken()
      }
    };
    var response = UrlFetchApp.fetch(url, headers);
    var dataSet = JSON.parse(response.getContentText());
    var valuesInner = [];
    var valuesInner2 = [];
    for (var i = 0; i < dataSet.QueryResponse.Payment.length; i++) {
      var record = dataSet.QueryResponse.Payment[i];
      var syncToken = record.SyncToken;
      var domain = record.domain;
      if (record.DepositToAccountRef === undefined) {
        var depositToAccountRef = '';
      }
      else {
        var depositToAccountRef = record.DepositToAccountRef.value;
      }
      var unappliedAmt = record.UnappliedAmt;
      var txnDate = record.TxnDate;
      var totalAmt = record.TotalAmt;
      var processPayment = record.ProcessPayment;
      var sparse = record.sparse;
      // Line
      if (record.Line[0] === undefined) {
        var linkedTxnId = '';
        var linkedTxnType = '';
      }
      else {
        var linkedTxnId = record.Line[0].LinkedTxn[0].TxnId;
        var linkedTxnType = record.Line[0].LinkedTxn[0].TxnType;
      }
      var customerRefName = record.CustomerRef.name;
      var customerRefValue = record.CustomerRef.value;
      var id = record.Id;
      var createTime = Utilities.formatDate(new Date(record.MetaData.CreateTime), "UTC", "yyyy-MM-dd HH:mm:ss");
      var lastUpdatedTime = Utilities.formatDate(new Date(record.MetaData.LastUpdatedTime), "UTC", "yyyy-MM-dd HH:mm:ss");
      if (record.PaymentMethodRef === undefined) {
        var paymentMethodRef = '';
      }
      else {
        var paymentMethodRef = record.PaymentMethodRef.value;
      }
      if (record.CreditCardPayment === undefined) {
        var creditCardNameOnAcct = '';
        var creditCardAmount = '';
        var creditCardProcessPayment = '';
      }
      else {
        var creditCardNameOnAcct = record.CreditCardPayment.CreditChargeInfo.NameOnAcct;
        var creditCardAmount = record.CreditCardPayment.CreditChargeInfo.Amount;
        var creditCardProcessPayment = record.CreditCardPayment.CreditChargeInfo.ProcessPayment;
      }
      var currencyRefValue = record.CurrencyRef.value;
      var currencyRefName = record.CurrencyRef.name;
      if (record.PrivateNote === undefined) {
        var privateNote = '';
      }
      else {
        var privateNoteInner = record.PrivateNote;
        var privateNote = privateNoteInner.toString().replace(/[^a-zA-Z0-9 ]/g, '');
      }
      var txnSource = record.TxnSource;
      valuesInner.push([syncToken, domain, depositToAccountRef, unappliedAmt, txnDate, totalAmt, processPayment, sparse, linkedTxnId, linkedTxnType, customerRefName, customerRefValue, id, createTime, lastUpdatedTime, paymentMethodRef, creditCardNameOnAcct, creditCardAmount, creditCardProcessPayment, currencyRefValue, currencyRefName, privateNote, txnSource].map(safeValue).join(','));      
      // line items
      var valuesInner3 = [];
      for (var l = 0; l < record.Line.length; l++) {
        var lineRecord = record.Line[l];
        var lineAmount = lineRecord.Amount;
        var linkedTxnId = lineRecord.LinkedTxn[0].TxnId;
        var linkedTxnType = lineRecord.LinkedTxn[0].TxnType;
        valuesInner3.push([lineAmount, linkedTxnId, linkedTxnType, id].map(safeValue).join(','));
      }
      for (var n = 0; n < valuesInner3.length; n++) {
        valuesInner2.push(valuesInner3[n]);
      }
    }
    for (var m = 0; m < valuesInner.length; m++) {
         values.push(valuesInner[m]);
    }
    for (var p = 0; p < valuesInner2.length; p++) {
        values2.push(valuesInner2[p]);
    }
    start = start + 100;
    if (dataSet.QueryResponse.Payment.length < 100) {
      break; // Stop loop if URL has less than 100 records.
    }
  }
  sendToBigQuery(projectID, datasetID, tableID, schema, writeDisposition, values);
  sendToBigQueryL2(projectID, datasetID, tableID2, schema2, writeDisposition2, values2);
}
