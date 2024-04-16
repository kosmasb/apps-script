// This function is manually triggered every day to get data from the last 7 days.
function trafficTransaction() {
  var tableID = "traffic_transaction"; // Enter BigQuery table name
  var schema = {
    fields: [
      {
        name: "date_string",
        type: "STRING",
        mode: "NULLABLE",
        description: "",
      },
      { name: "channel", type: "STRING", mode: "NULLABLE", description: "" },
      {
        name: "transaction_id",
        type: "STRING",
        mode: "NULLABLE",
        description: "",
      },
      { name: "date", type: "DATE", mode: "NULLABLE", description: "" },
    ],
  };
  var writeDisposition = "WRITE_APPEND";
  const propertyId = "";
  const today = new Date();
  // const endDate = Utilities.formatDate(new Date(today), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  // const startDate = Utilities.formatDate(new Date(today.setDate(today.getDate() - 7)), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const startDate = "2024-04-09";
  const endDate = "2024-04-14";
  try {
    // List of Dimensions
    const date = AnalyticsData.newDimension();
    date.name = "date";
    const channel = AnalyticsData.newDimension();
    channel.name = "sessionDefaultChannelGroup";
    const transaction_id = AnalyticsData.newDimension();
    transaction_id.name = "transactionId";

    // List of Metrics

    // Date Range
    const dateRange = AnalyticsData.newDateRange();
    dateRange.startDate = startDate;
    dateRange.endDate = endDate;

    const request = AnalyticsData.newRunReportRequest();
    request.dimensions = [date, channel, transaction_id];
    request.dateRanges = dateRange;

    const report = AnalyticsData.Properties.runReport(
      request,
      "properties/" + propertyId
    );
    if (!report.rows) {
      console.log("No rows returned.");
      return;
    }

    // Append the headers.
    const dimensionHeaders = report.dimensionHeaders.map((dimensionHeader) => {
      return dimensionHeader.name;
    });
    const headers = [...dimensionHeaders];

    Logger.log(headers);

    // Append the results.
    const filteredRows = report.rows.filter((row) => {
      // Adjust the index based on the position of transaction_id in your dimensions
      const transactionIdValue =
        row.dimensionValues[row.dimensionValues.length - 1].value;
      // Check for '(not set)', null, and undefined
      return (
        transactionIdValue !== "(not set)" &&
        transactionIdValue !== "" &&
        transactionIdValue != null
      );
    });

    const rows = filteredRows.map((row) => {
      const dimensionValues = row.dimensionValues.map((dimensionValue) => {
        return dimensionValue.value;
      });
      // Ensure the date is formatted correctly, assuming the first dimension is the date
      return [
        ...dimensionValues,
        dimensionValues[0].replace(/(\d{4})(\d{2})(\d{2})/g, "$1-$2-$3"),
      ];
    });

    Logger.log(rows);
    if (rows.length > 0) {
      sendToBigQuery(
        projectID,
        datasetID,
        tableID,
        schema,
        writeDisposition,
        rows
      );
    } else {
      console.log("No valid rows to send after filtering.");
    }
  } catch (e) {
    // TODO (Developer) - Handle exception
    console.log("Failed with error: %s", e.error);
  }
}
