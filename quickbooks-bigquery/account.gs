function getAccounts() {
  // BigQuery configuration
  //............................................................................................
  var tableID = "..."; // Enter BigQuery table name
  var schema = {
    fields: [
      {name: 'account_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'sub_account', type: 'BOOLEAN', mode: 'NULLABLE', description: ''},
      {name: 'fully_qualified_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'active', type: 'BOOLEAN', mode: 'NULLABLE', description: ''},
      {name: 'classification', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'account_type', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'account_sub_type', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'acct_num', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'current_balance', type: 'FLOAT', mode: 'NULLABLE', description: ''},
      {name: 'current_balance_with_sub_accounts', type: 'FLOAT', mode: 'NULLABLE', description: ''},
      {name: 'currency_ref_value', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'currency_ref_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'domain', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'sparse', type: 'BOOLEAN', mode: 'NULLABLE', description: ''},
      {name: 'id', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'sync_token', type: 'STRING', mode: 'NULLABLE', description: ''},
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
  for (var k = 0; k < 10; k++) {
    var url = "https://quickbooks.api.intuit.com/v3/company/[companyId]/query?query=select * from Account STARTPOSITION "+ start + "&minorversion=59"
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
    for (var i = 0; i < dataSet.QueryResponse.Account.length; i++) {
      var record = dataSet.QueryResponse.Account[i];
      var accountName = record.Name;
      var subAccount = record.SubAccount;
      var fullyQualifiedName = record.FullyQualifiedName;
      var active = record.Active;
      var classification = record.Classification;
      var accountType = record.AccountType;
      var accountSubType = record.AccountSubType;
      var acctNum = record.AcctNum;
      var currentBalance = record.CurrentBalance;
      var currentBalanceWithSubAccounts = record.CurrentBalanceWithSubAccounts;
      var currencyRefValue = record.CurrencyRef.value;
      var currencyRefName = record.CurrencyRef.name;
      var domain = record.domain;
      var sparse = record.sparse;
      var id = record.Id;
      var syncToken = record.SyncToken;
      var createTime = Utilities.formatDate(new Date(record.MetaData.CreateTime), "UTC", "yyyy-MM-dd HH:mm:ss");
      var lastUpdatedTime = Utilities.formatDate(new Date(record.MetaData.LastUpdatedTime), "UTC", "yyyy-MM-dd HH:mm:ss");
      valuesInner.push([accountName, subAccount, fullyQualifiedName, active, classification, accountType, accountSubType, acctNum, currentBalance, currentBalanceWithSubAccounts, currencyRefValue, currencyRefName, domain, sparse, id, syncToken, createTime, lastUpdatedTime].map(safeValue).join(','));     
    }
    for (var m = 0; m < valuesInner.length; m++) {
         values.push(valuesInner[m]);
       }
    start = start + 100;
    if (dataSet.QueryResponse.Account.length < 100) {
      break; // Stop loop if URL has less than 100 records.
    }
  }
  sendToBigQuery(projectID, datasetID, tableID, schema, writeDisposition, values);
}
