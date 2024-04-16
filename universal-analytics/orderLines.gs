function orderLines() {
  var tableID = "order_line"; // Enter BigQuery table name
  var schema = {
    fields: [
      {
        name: "product_sku",
        type: "STRING",
        mode: "NULLABLE",
        description: "",
      },
      {
        name: "product_brand",
        type: "STRING",
        mode: "NULLABLE",
        description: "",
      },
      {
        name: "product_coupon_code",
        type: "STRING",
        mode: "NULLABLE",
        description: "",
      },
      {
        name: "order_number",
        type: "STRING",
        mode: "NULLABLE",
        description: "",
      },
      { name: "quantity", type: "INTEGER", mode: "NULLABLE", description: "" },
      { name: "amount", type: "FLOAT", mode: "NULLABLE", description: "" },
      {
        name: "refunded_quantity",
        type: "INTEGER",
        mode: "NULLABLE",
        description: "",
      },
      {
        name: "refunded_amount",
        type: "FLOAT",
        mode: "NULLABLE",
        description: "",
      },
    ],
  };
  var writeDisposition = "WRITE_APPEND";
  const trackingId = "ga:"; // Universal Analytics TPS UA
  const startDate = "2023-07-01"; // Start date of the month
  const endDate = "2023-08-31"; // End date of the month
  const pageSize = 10000; // Number of rows to fetch per request
  let startIndex = 1; // Start index of the first request
  try {
    let allRows = []; // Array to store all rows
    while (true) {
      var report = Analytics.Data.Ga.get(
        trackingId,
        startDate,
        endDate,
        "ga:itemQuantity,ga:itemRevenue,ga:productRefunds,ga:productRefundAmount",
        {
          dimensions:
            "ga:productSku,ga:productBrand,ga:productCouponCode,ga:transactionId",
          "start-index": startIndex.toString(),
          "max-results": pageSize,
        }
      );
      if (!report || !report.rows || report.rows.length === 0) {
        console.log("No more rows returned.");
        break;
      }
      // Append the headers to the result array if it's the first page
      if (startIndex === 1) {
        const headers = report.columnHeaders.map((header) => header.name);
      }
      // Append the rows to the result array, with datetime formatting
      const rows = report.rows.map((row) => {
        return row;
      });
      allRows = allRows.concat(rows);
      // Check if there are more rows available
      if (report.rows.length < pageSize) {
        break;
      }
      // Increment the start index for the next request
      startIndex = startIndex + pageSize;
    }
    Logger.log(allRows);
    Utilities.sleep(5000);
    sendToBigQuery(
      projectID,
      datasetID,
      tableID,
      schema,
      writeDisposition,
      allRows
    );
  } catch (e) {
    console.log("Failed with error:", e);
  }
}
