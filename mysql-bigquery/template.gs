function template() {
  var projectID = ""; // Enter BigQuery project Id
  var datasetID = ""; // Enter BigQuery dataset Id
  var tableID = ""; // Enter BigQuery table name
  var query = "select * from " + tableID;
  var rs = getConnection(query);
  var numCols = rs.getMetaData().getColumnCount();
  rs.setFetchSize(numCols);
  var titles = [];
  for (var col = 0; col < numCols; col++){
    var colName = rs.getMetaData().getColumnLabel(col + 1);
    var colType = rs.getMetaData().getColumnTypeName(col + 1);
    titles.push([colName, colType]);
  }
  var schema = fieldTypeMapping(titles);
  var writeDisposition = 'WRITE_TRUNCATE';
  var values = [];
  var count = 0;
  while(rs.next()) {
      values.push([]);
      for (var i = 1; i <= numCols; i++)
          values[count].push([rs.getString(i)].map(safeValue).join(','));
      count++;
  }
  sendToBigQuery(projectID, datasetID, tableID, schema, writeDisposition, values);
  rs.close();
}
