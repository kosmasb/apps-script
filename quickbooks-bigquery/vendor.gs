function getVendors() {
  // BigQuery configuration
  //............................................................................................
  var tableID = "..."; // Enter BigQuery table name
  var schema = {
    fields: [
      {name: 'primary_email_addr', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'vendor1099', type: 'BOOLEAN', mode: 'NULLABLE', description: ''},
      {name: 'domain', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'given_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'display_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'bill_addr_city', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'bill_addr_line1', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'bill_addr_postal_code', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'bill_addr_lat', type: 'FLOAT', mode: 'NULLABLE', description: ''},
      {name: 'bill_addr_long', type: 'FLOAT', mode: 'NULLABLE', description: ''},
      {name: 'bill_addr_country_sub_division_code', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'bill_addr_id', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'sync_token', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'print_on_check_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'family_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'primary_phone', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'acct_num', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'company_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'web_addr', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'sparse', type: 'BOOLEAN', mode: 'NULLABLE', description: ''},
      {name: 'active', type: 'BOOLEAN', mode: 'NULLABLE', description: ''},
      {name: 'balance', type: 'FLOAT', mode: 'NULLABLE', description: ''},
      {name: 'id', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'create_time', type: 'DATETIME', mode: 'NULLABLE', description: ''},
      {name: 'last_updated_time', type: 'DATETIME', mode: 'NULLABLE', description: ''}
    ]
  };
  var writeDisposition = 'WRITE_TRUNCATE';
  //............................................................................................
  var start = 1;
  var values = [];
  for (var k = 0; k < 20; k++) {
    var url = "https://quickbooks.api.intuit.com/v3/company/[companyId]/query?query=select * from Vendor STARTPOSITION "+ start + "&minorversion=59"
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
    for (var i = 0; i < dataSet.QueryResponse.Vendor.length; i++) {
      var record = dataSet.QueryResponse.Vendor[i];
      if (record.PrimaryEmailAddr === undefined) {
        var primaryEmailAddr = '';
      }
      else {
        var primaryEmailAddr = record.PrimaryEmailAddr.Address;
      }
      var vendor1099 = record.Vendor1099;
      var domain = record.domain;
      var givenName = record.GivenName;
      var displayName = record.DisplayName;
      if (record.BillAddr === undefined) {
        var billAddrCity = '';
        var billAddrLine1 = '';
        var billAddrPostalCode = '';
        var billAddrLat = '';
        var billAddrLong = '';
        var billAddrCountrySubDivisionCode = '';
        var billAddrId = '';
      }
      else {
        var billAddrCity = record.BillAddr.City;
        var billAddrLine1 = record.BillAddr.Line1;
        var billAddrPostalCode = record.BillAddr.PostalCode;
        var billAddrLat = record.BillAddr.Lat;
        var billAddrLong = record.BillAddr.Long;
        var billAddrCountrySubDivisionCode = record.BillAddr.CountrySubDivisionCode;
        var billAddrId = record.BillAddr.Id;
      }
      var syncToken = record.SyncToken;
      var printOnCheckName = record.PrintOnCheckName;
      var familyName = record.FamilyName;
      if (record.PrimaryPhone === undefined) {
        var primaryPhone = '';
      }
      else {
        var primaryPhone = record.PrimaryPhone.FreeFormNumber;
      }
      var acctNum = record.AcctNum;
      var companyName = record.CompanyName;
      if (record.WebAddr === undefined) {
        var webAddr = '';
      }
      else {
        var webAddr = record.WebAddr.URI;
      }
      var sparse = record.sparse;
      var active = record.Active;
      var balance = record.Balance;
      var id = record.Id;
      var createTime = Utilities.formatDate(new Date(record.MetaData.CreateTime), "UTC", "yyyy-MM-dd HH:mm:ss");
      var lastUpdatedTime = Utilities.formatDate(new Date(record.MetaData.LastUpdatedTime), "UTC", "yyyy-MM-dd HH:mm:ss");
      valuesInner.push([primaryEmailAddr, vendor1099, domain, givenName, displayName, billAddrCity, billAddrLine1, billAddrPostalCode, billAddrLat, billAddrLong, billAddrCountrySubDivisionCode, billAddrId, syncToken, printOnCheckName, familyName, primaryPhone, acctNum, companyName, webAddr, sparse, active, balance, id, createTime, lastUpdatedTime].map(safeValue).join(','));     
    }
    for (var m = 0; m < valuesInner.length; m++) {
         values.push(valuesInner[m]);
       }
    start = start + 100;
    if (dataSet.QueryResponse.Vendor.length < 100) {
      break; // Stop loop if URL has less than 100 records.
    }
  }
  sendToBigQuery(projectID, datasetID, tableID, schema, writeDisposition, values);
}
