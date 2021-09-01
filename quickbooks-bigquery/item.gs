function getItems() {
  // BigQuery configuration
  //............................................................................................
  var tableID = "..."; // Enter BigQuery table name
  var schema = {
    fields: [
      {name: 'fully_qualified_name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'domain', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'name', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'sync_token', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'sparse', type: 'BOOLEAN', mode: 'NULLABLE', description: ''},
      {name: 'active', type: 'BOOLEAN', mode: 'NULLABLE', description: ''},
      {name: 'type', type: 'STRING', mode: 'NULLABLE', description: ''},
      {name: 'id', type: 'INTEGER', mode: 'NULLABLE', description: ''},
      {name: 'create_time', type: 'DATETIME', mode: 'NULLABLE', description: ''},
      {name: 'last_updated_time', type: 'DATETIME', mode: 'NULLABLE', description: ''}
    ]
  };
  var writeDisposition = 'WRITE_TRUNCATE';
  //............................................................................................
  var start = 1;
  var values = [];
  for (var k = 0; k < 5; k++) {
    var url = "https://quickbooks.api.intuit.com/v3/company/[companyId]/query?query=select * from Item STARTPOSITION "+ start + "&minorversion=59"
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
    for (var i = 0; i < dataSet.QueryResponse.Item.length; i++) {
      var record = dataSet.QueryResponse.Item[i];
      var fullyQualifiedName = record.FullyQualifiedName;
      var domain = record.domain;
      var name = record.Name;
      var syncToken = record.SyncToken;
      var sparse = record.sparse;
      var active = record.Active;
      var type = record.Type;
      var id = record.Id;
      var createTime = Utilities.formatDate(new Date(record.MetaData.CreateTime), "UTC", "yyyy-MM-dd HH:mm:ss");
      var lastUpdatedTime = Utilities.formatDate(new Date(record.MetaData.LastUpdatedTime), "UTC", "yyyy-MM-dd HH:mm:ss");
      valuesInner.push([fullyQualifiedName, domain, name, syncToken, sparse, active, type, id, createTime, lastUpdatedTime].map(safeValue).join(','));
    }
    for (var m = 0; m < valuesInner.length; m++) {
         values.push(valuesInner[m]);
       }
    start = start + 100;
    if (dataSet.QueryResponse.Item.length < 100) {
      break; // Stop loop if URL has less than 100 records.
    }
  }
  sendToBigQuery(projectID, datasetID, tableID, schema, writeDisposition, values);
}
