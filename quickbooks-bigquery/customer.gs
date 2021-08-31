function getCustomers() {
  // BigQuery configuration
  //............................................................................................
  var tableID = "..."; // Enter BigQuery table name  
  var schema = {
    fields: [
      {name: 'primary_email_addr', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'sync_token', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'domain', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'given_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'display_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'bill_with_parent', type: 'BOOLEAN', mode: 'NULLABLE', description: ''},
      {name: 'fully_qualified_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'company_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'family_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'sparse', type: 'BOOLEAN', mode: 'NULLABLE', description: ''},
      {name: 'primary_phone', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'active', type: 'BOOLEAN', mode: 'NULLABLE', description: ''},
      {name: 'job', type: 'BOOLEAN', mode: 'NULLABLE', description: ''},
      {name: 'balance_with_jobs', type: 'FLOAT', mode: 'NULLABLE', description: ''},
      {name: 'bill_addr_city', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'bill_addr_line1', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'bill_addr_postal_code', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'bill_addr_lat', type: 'FLOAT', mode: 'NULLABLE', description: ''},
      {name: 'bill_addr_long', type: 'FLOAT', mode: 'NULLABLE', description: ''},
      {name: 'bill_addr_country_sub_division_code', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'bill_addr_id', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'preferred_delivery_method', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'taxable', type: 'BOOLEAN', mode: 'NULLABLE', description: ''},
      {name: 'print_on_check_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'balance', type: 'FLOAT', mode: 'NULLABLE', description: ''},
      {name: 'id', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'create_time', type: 'DATETIME', mode: 'NULLABLE', description: ''},
      {name: 'last_updated_time', type: 'DATETIME', mode: 'NULLABLE', description: ''}
    ]
  };
  // the write disposition tells BigQuery what to do if this table already exists
  // WRITE_TRUNCATE: If the table already exists, BigQuery overwrites the table data. 
  // WRITE_APPEND: If the table already exists, BigQuery appends the data to the table.
  // WRITE_EMPTY: If the table already exists and contains data, a 'duplicate' error is returned in the job result.
  var writeDisposition = 'WRITE_TRUNCATE';
  //............................................................................................
  var start = 1;
  var values = [];
  for (var k = 0; k < 100; k++) {  
    var url = "https://quickbooks.api.intuit.com/v3/company/[companyId](https://quickbooks.intuit.com/learn-support/global/customer-company-settings/find-your-quickbooks-online-company-id/00/381495)/query?query=select * from Customer STARTPOSITION "+ start + "&minorversion=59"
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
    for (var i = 0; i < dataSet.QueryResponse.Customer.length; i++) {   
      var record = dataSet.QueryResponse.Customer[i];
      if (record.PrimaryEmailAddr === undefined) {
        var primaryEmailAddr = '';
      }
      else {
        var primaryEmailAddr = record.PrimaryEmailAddr.Address;
      }
      var syncToken = record.SyncToken;
      var domain = record.domain;
      var givenName = record.GivenName;
      var displayName = record.DisplayName;
      var billWithParent = record.BillWithParent;
      var fullyQualifiedName = record.FullyQualifiedName;
      var companyName = record.CompanyName
      var familyName = record.FamilyName;
      var sparse = record.sparse;
      if (record.PrimaryPhone === undefined) {
        var primaryPhone = '';
      }
      else {
        var primaryPhone = record.PrimaryPhone.FreeFormNumber;
      }
      var active = record.Active;
      var job = record.Job;
      var balanceWithJobs = record.BalanceWithJobs;
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
      var preferredDeliveryMethod = record.PreferredDeliveryMethod;
      var taxable = record.Taxable;
      var printOnCheckName = record.PrintOnCheckName;
      var balance = record.Balance;
      var id = record.Id;
      var createTime = Utilities.formatDate(new Date(record.MetaData.CreateTime), "UTC", "yyyy-MM-dd HH:mm:ss");
      var lastUpdatedTime = Utilities.formatDate(new Date(record.MetaData.LastUpdatedTime), "UTC", "yyyy-MM-dd HH:mm:ss");
      valuesInner.push([primaryEmailAddr, syncToken, domain, givenName, displayName, billWithParent, fullyQualifiedName, companyName, familyName, sparse, primaryPhone, active, job, balanceWithJobs, billAddrCity, billAddrLine1, billAddrPostalCode, billAddrLat, billAddrLong, billAddrCountrySubDivisionCode, billAddrId, preferredDeliveryMethod, taxable, printOnCheckName, balance, id, createTime, lastUpdatedTime].map(safeValue).join(','));     
    }    
    for (var m = 0; m < valuesInner.length; m++) {    
         values.push(valuesInner[m]);           
       }    
    start = start + 100;    
    if (dataSet.QueryResponse.Customer.length < 100) {
      break; // Stop loop if URL has less than 100 records.
    }    
  }  
  sendToBigQuery(projectID, datasetID, tableID, schema, writeDisposition, values);  
}
