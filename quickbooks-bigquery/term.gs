function getTerms() {
  // BigQuery configuration
  //............................................................................................
  var tableID = "..."; // Enter BigQuery table name
  var schema = {
    fields: [
      {name: 'name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'active', type: 'BOOLEAN', mode: 'NULLABLE', description: ''},
      {name: 'type', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'due_days', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'discount_days', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'domain', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'sparse', type: 'BOOLEAN', mode: 'NULLABLE', description: ''},
      {name: 'id', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'sync_token', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'create_time', type: 'DATETIME', mode: 'NULLABLE', description: ''},
      {name: 'last_updated_time', type: 'DATETIME', mode: 'NULLABLE', description: ''}
    ]
  };
  var writeDisposition = 'WRITE_TRUNCATE';
  //............................................................................................
  var start = 1;
  var values = [];
  for (var k = 0; k < 10; k++) {
    var url = "https://quickbooks.api.intuit.com/v3/company/[companyId]/query?query=select * from Term STARTPOSITION "+ start + "&minorversion=59"
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
    for (var i = 0; i < dataSet.QueryResponse.Term.length; i++) {
      var record = dataSet.QueryResponse.Term[i];
      var name = record.Name;
      var active = record.Active;
      var type = record.Type;
      var dueDays = record.DueDays;
      var discountDays = record.DiscountDays;
      var domain = record.domain;
      var sparse = record.sparse;
      var id = record.Id;
      var syncToken = record.SyncToken;
      var createTime = Utilities.formatDate(new Date(record.MetaData.CreateTime), "UTC", "yyyy-MM-dd HH:mm:ss");
      var lastUpdatedTime = Utilities.formatDate(new Date(record.MetaData.LastUpdatedTime), "UTC", "yyyy-MM-dd HH:mm:ss");
      valuesInner.push([name, active, type, dueDays, discountDays, domain, sparse, id, syncToken, createTime, lastUpdatedTime].map(safeValue).join(','));
    }
    for (var m = 0; m < valuesInner.length; m++) {
         values.push(valuesInner[m]);
       }
    start = start + 100;
    if (dataSet.QueryResponse.Term.length < 100) {
      break; // Stop loop if URL has less than 100 records.
    }
  }
  sendToBigQuery(projectID, datasetID, tableID, schema, writeDisposition, values);
}
