function sendToBigQuery(projectID, datasetID, tableID, schema, writeDisposition, values) {
  //--------------------------------------------------
  // Create the table.
  var table = {
    tableReference: {
      projectId: projectID,
      datasetId: datasetID,
      tableId: tableID
    },
    // Details about schema can be found here: https://cloud.google.com/bigquery/docs/schemas
    // Enter a schema below:
    schema: schema
  };
  //--------------------------------------------------
  // Delete Table if write disposition is WRITE_TRUNCATE
  if (writeDisposition == 'WRITE_TRUNCATE') {
    try {
      var deleteResults = BigQuery.Tables.remove(projectID, datasetID, tableID);
      Logger.log(deleteResults);
    } catch (err){
    //return false;
    }
  }
  // the write disposition tells BigQuery what to do if this table already exists
  // WRITE_TRUNCATE: If the table already exists, BigQuery overwrites the table data.
  // WRITE_APPEND: If the table already exists, BigQuery appends the data to the table.
  // WRITE_EMPTY: If the table already exists and contains data, a 'duplicate' error is returned in the job result.
  var writeDispositionSetting = writeDisposition;
  // Create a new table if it doesn't exist yet.
  try {BigQuery.Tables.get(projectID, datasetID, tableID)}
  catch (error) {
    table = BigQuery.Tables.insert(table, projectID, datasetID);
    //Logger.log('Table created: %s', table.id);
  }
  var rows = values;
  var rowsCSV = rows.join("\n");
  var blob = Utilities.newBlob(rowsCSV, "text/csv");
  var data = blob.setContentType('application/octet-stream');
  // Create the data upload job.
  var job = {
    configuration: {
      load: {
        destinationTable: {
          projectId: projectID,
          datasetId: datasetID,
          tableId: tableID
        },
        skipLeadingRows: 0,
        writeDisposition: writeDispositionSetting
      }
    }
  };
  // send the job to BigQuery so it will run your query
  var runJob = BigQuery.Jobs.insert(job, projectID, data);
  Logger.log(runJob.status);
  var jobId = runJob.jobReference.jobId
  Logger.log('jobId: ' + jobId);
  var status = BigQuery.Jobs.get(projectID, jobId);
  // wait for the query to finish running before you move on
  while (status.status.state === 'RUNNING') {
    Utilities.sleep(500);
    status = BigQuery.Jobs.get(projectID, jobId);
    Logger.log('Status: ' + status);
  }
  Logger.log('FINISHED!');
}
