function trafficAcquisition() {
  var tableID = "traffic_acquisition"; // Enter BigQuery table name
  var schema = {
    fields: [
      {
        name: "date_string",
        type: "STRING",
        mode: "NULLABLE",
        description: "",
      },
      { name: "channel", type: "STRING", mode: "NULLABLE", description: "" },
      { name: "users", type: "INTEGER", mode: "NULLABLE", description: "" },
      { name: "sessions", type: "INTEGER", mode: "NULLABLE", description: "" },
      {
        name: "conversion_rate",
        type: "FLOAT",
        mode: "NULLABLE",
        description: "",
      },
      {
        name: "transactions",
        type: "FLOAT",
        mode: "NULLABLE",
        description: "",
      },
      { name: "revenue", type: "FLOAT", mode: "NULLABLE", description: "" },
      { name: "date", type: "DATE", mode: "NULLABLE", description: "" },
    ],
  };
  var writeDisposition = "WRITE_TRUNCATE";
  const propertyId = "";
  try {
    // List of Dimensions
    const date = AnalyticsData.newDimension();
    date.name = "date";
    // date = date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
    const channel = AnalyticsData.newDimension();
    channel.name = "sessionDefaultChannelGroup";

    // List of Metrics
    const users = AnalyticsData.newMetric();
    users.name = "activeUsers";
    const sessions = AnalyticsData.newMetric();
    sessions.name = "sessions";
    const conversion_rate = AnalyticsData.newMetric();
    conversion_rate.name = "userConversionRate";
    const transactions = AnalyticsData.newMetric();
    transactions.name = "transactions";
    const revenue = AnalyticsData.newMetric();
    revenue.name = "totalRevenue";

    // Date Range
    const dateRange = AnalyticsData.newDateRange();
    dateRange.startDate = "2022-10-01";
    dateRange.endDate = "today";

    const request = AnalyticsData.newRunReportRequest();
    request.dimensions = [date, channel];
    request.metrics = [users, sessions, conversion_rate, transactions, revenue];
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
    const metricHeaders = report.metricHeaders.map((metricHeader) => {
      return metricHeader.name;
    });
    const headers = [...dimensionHeaders, ...metricHeaders];

    Logger.log(headers);

    // Append the results.
    const rows = report.rows.map((row) => {
      const dimensionValues = row.dimensionValues.map((dimensionValue) => {
        return dimensionValue.value;
      });
      const metricValues = row.metricValues.map((metricValues) => {
        return metricValues.value;
      });
      return [
        ...dimensionValues,
        ...metricValues,
        dimensionValues[0].replace(/(\d{4})(\d{2})(\d{2})/g, "$1-$2-$3"),
      ];
    });

    Logger.log(rows);
    sendToBigQuery(
      projectID,
      datasetID,
      tableID,
      schema,
      writeDisposition,
      rows
    );
  } catch (e) {
    // TODO (Developer) - Handle exception
    console.log("Failed with error: %s", e.error);
  }
}
