function getBills() {
  // BigQuery configuration
  //............................................................................................
  var tableID = "..."; // Enter BigQuery table name
  var schema = {
    fields: [
      {name: 'due_date', type: 'DATE', mode: 'NULLABLE', description: ''},
      {name: 'vendor_addr_id', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'vendor_addr_line1', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'vendor_addr_city', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'vendor_addr_country', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'vendor_addr_country_sub_division_code', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'vendor_addr_postal_code', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'balance', type: 'FLOAT', mode: 'NULLABLE', description: ''},
      {name: 'domain', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'sparse', type: 'BOOLEAN', mode: 'NULLABLE', description: ''},
      {name: 'id', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'sync_token', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'create_time', type: 'DATETIME', mode: 'NULLABLE', description: ''},
      {name: 'last_updated_time', type: 'DATETIME', mode: 'NULLABLE', description: ''},
      {name: 'doc_number', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'txn_date', type: 'DATE', mode: 'NULLABLE', description: ''},
      {name: 'currency_ref_value', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'currency_ref_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'private_note', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'linked_txn_id', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'linked_txn_type', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'line_id', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'line_num', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'description', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'line_amount', type: 'FLOAT', mode: 'NULLABLE', description: ''},
      {name: 'detail_type', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'class_ref_value', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'class_ref_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'account_ref_value', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'account_ref_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'billable_status', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'tax_code_ref_value', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'vendor_ref_value', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'vendor_ref_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'apa_account_ref_value', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'apa_account_ref_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'total_amt', type: 'FLOAT', mode: 'NULLABLE', description: ''}
    ]
  };
  var writeDisposition = 'WRITE_TRUNCATE';
  //............................................................................................
  var start = 1;
  var values = [];
  for (var k = 0; k < 400; k++) {
    var url = "https://quickbooks.api.intuit.com/v3/company/[companyId]/query?query=select * from Bill STARTPOSITION "+ start + "&minorversion=59"
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
    for (var i = 0; i < dataSet.QueryResponse.Bill.length; i++) {
      var record = dataSet.QueryResponse.Bill[i];
      var dueDate = record.DueDate;
      if (record.VendorAddr === undefined) {
        var vendorAddrId = '';
        var vendorAddrLine1 = '';
        var vendorAddrCity = '';
        var vendorAddrCountry = '';
        var vendorAddrCountrySubDivisionCode = '';
        var vendorAddrPostalCode = '';
      }
      else {
        var vendorAddrId = record.VendorAddr.Id;
        var vendorAddrLine1 = record.VendorAddr.Line1;
        var vendorAddrCity = record.VendorAddr.City;
        var vendorAddrCountry = record.VendorAddr.Country;
        var vendorAddrCountrySubDivisionCode = record.VendorAddr.CountrySubDivisionCode;
        var vendorAddrPostalCode = record.VendorAddr.PostalCode;
      }
      var balance = record.Balance;
      var domain = record.domain;
      var sparse = record.sparse;
      var id = record.Id;
      var syncToken = record.SyncToken;
      var createTime = Utilities.formatDate(new Date(record.MetaData.CreateTime), "UTC", "yyyy-MM-dd HH:mm:ss");
      var lastUpdatedTime = Utilities.formatDate(new Date(record.MetaData.LastUpdatedTime), "UTC", "yyyy-MM-dd HH:mm:ss");
      var docNumber = record.DocNumber;
      var txnDate = record.TxnDate;
      var currencyRefValue = record.CurrencyRef.value;
      var currencyRefName = record.CurrencyRef.name;
      var privateNote = record.PrivateNote;
      if (record.LinkedTxn === undefined) {
        var linkedTxnId = '';
        var linkedTxnType = '';
      }
      else {
        var linkedTxnId = record.LinkedTxn[0].TxnId;
        var linkedTxnType = record.LinkedTxn[0].TxnType;
      }
      // Line
      if (record.Line[0] === undefined) {
        var lineId = '';
        var lineNum = '';
        var lineDescription = '';
        var lineAmount = '';
        // LinkedTxn
        var lineDetailType = '';
        var lineClassRefValue = '';
        var lineClassRefName = '';
        var lineAccountRefValue = '';
        var lineAccountRefName = '';
        var lineBillableStatus = '';
        var lineTaxCodeRefValue = '';
      }
      else {
        var lineId = record.Line[0].Id;
        var lineNum = record.Line[0].LineNum;
        var lineDescription = record.Line[0].Description;
        var lineAmount = record.Line[0].Amount;
        // LinkedTxn
        var lineDetailType = record.Line[0].DetailType;
        if (record.Line[0].AccountBasedExpenseLineDetail === undefined) {
          var lineClassRefValue = '';
          var lineClassRefName = '';
          var lineAccountRefValue = '';
          var lineAccountRefName = '';
          var lineBillableStatus = '';
          var lineTacCodeRefValue = '';
        }
        else {
          if (record.Line[0].AccountBasedExpenseLineDetail.ClassRef === undefined) {
            var lineClassRefValue = '';
            var lineClassRefName = '';
          }
          else {
            var lineClassRefValue = record.Line[0].AccountBasedExpenseLineDetail.ClassRef.value;
            var lineClassRefName = record.Line[0].AccountBasedExpenseLineDetail.ClassRef.name;
          }
          var lineAccountRefValue = record.Line[0].AccountBasedExpenseLineDetail.AccountRef.value;
          var lineAccountRefName = record.Line[0].AccountBasedExpenseLineDetail.AccountRef.name;
          var lineBillableStatus = record.Line[0].AccountBasedExpenseLineDetail.BillableStatus;
          var lineTaxCodeRefValue = record.Line[0].AccountBasedExpenseLineDetail.TaxCodeRef.value;
        }
      }
      var vendorRefValue = record.VendorRef.value;
      var vendorRefName = record.VendorRef.name;
      var aPAccountRefValue = record.APAccountRef.value;
      var aPAccountRefName = record.APAccountRef.name;
      var totalAmt = record.TotalAmt;
      valuesInner.push([dueDate, vendorAddrId, vendorAddrLine1, vendorAddrCity, vendorAddrCountry, vendorAddrCountrySubDivisionCode, vendorAddrPostalCode, balance, domain, sparse, id, syncToken, createTime, lastUpdatedTime, docNumber, txnDate, currencyRefValue, currencyRefName, privateNote, linkedTxnId, linkedTxnType, lineId, lineNum, lineDescription, lineAmount, lineDetailType, lineClassRefValue, lineClassRefName, lineAccountRefValue, lineAccountRefName, lineBillableStatus, lineTaxCodeRefValue, vendorRefValue, vendorRefName, aPAccountRefValue, aPAccountRefName, totalAmt].map(safeValue).join(','));     
    }
    for (var m = 0; m < valuesInner.length; m++) {
         values.push(valuesInner[m]);
       }
    start = start + 100;
    if (dataSet.QueryResponse.Bill.length < 100) {
      break; // Stop loop if URL has less than 100 records.
    }
  }
  sendToBigQuery(projectID, datasetID, tableID, schema, writeDisposition, values);
}
