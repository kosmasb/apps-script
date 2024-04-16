// Woocommerce API credentials
const consumerKey = "ck_...";
const consumerSecret = "cs_...";

function getProducts() {
  // BigQuery configuration
  //............................................................................................
  var tableID = "product"; // Enter BigQuery table name
  var schema = {
    fields: [
      { name: "id", type: "INTEGER", mode: "REQUIRED", description: "" },
      { name: "name", type: "STRING", mode: "NULLABLE", description: "" },
      {
        name: "date_created",
        type: "DATETIME",
        mode: "NULLABLE",
        description: "",
      },
      { name: "type", type: "STRING", mode: "NULLABLE", description: "" },
      { name: "status", type: "STRING", mode: "NULLABLE", description: "" },
      { name: "price", type: "FLOAT", mode: "NULLABLE", description: "" },
      {
        name: "regular_price",
        type: "FLOAT",
        mode: "NULLABLE",
        description: "",
      },
      {
        name: "category_id",
        type: "INTEGER",
        mode: "NULLABLE",
        description: "",
      },
      {
        name: "category_name",
        type: "STRING",
        mode: "NULLABLE",
        description: "",
      },
      {
        name: "stock_status",
        type: "STRING",
        mode: "NULLABLE",
        description: "",
      },
    ],
  };
  var writeDisposition = "WRITE_TRUNCATE";
  //............................................................................................

  var perPage = 100; // Number of items per page
  var currentPage = 1; // Initial page number
  var totalPages = 8; // Total pages, initialized to 1
  var totalProducts = 0; // Total products, initialized to 0
  var allProducts = []; // Array to store all products

  // Loop until all pages are fetched
  do {
    var url =
      "https://www.abcde.com/wp-json/wc/v3/products?per_page=" +
      perPage +
      "&offset=" +
      totalProducts +
      "&page=" +
      currentPage +
      "&consumer_key=" +
      consumerKey +
      "&consumer_secret=" +
      consumerSecret;
    var headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    var response = UrlFetchApp.fetch(url, headers);
    var dataSet = JSON.parse(response.getContentText());

    // Add products from the current page to the array
    allProducts = allProducts.concat(dataSet);

    totalProducts = currentPage * 100;
    currentPage++; // Move to the next page
  } while (currentPage <= totalPages);

  // Process all products
  var values = [];
  allProducts.forEach(function (record) {
    var id = parseInt(record.id);
    var name = '"' + record.name + '"';
    var dateCreated = record.date_created;
    var type = record.type;
    var status = record.status;
    var price = parseFloat(record.price);
    var regularPrice = parseFloat(record.regular_price);
    var categoryId = parseInt(record.categories[0].id);
    var categoryName = record.categories[0].name;
    var stockStatus = record.stock_status;

    values.push([
      id,
      name,
      dateCreated,
      type,
      status,
      price,
      regularPrice,
      categoryId,
      categoryName,
      stockStatus,
    ]);
  });

  // Write all products to BigQuery
  sendToBigQuery(
    projectID,
    datasetID,
    tableID,
    schema,
    writeDisposition,
    values
  );
}
