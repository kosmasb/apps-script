// Allows BigQuery Data Transfers to automatically run on specific interval.
// BigQuery UI allows execution once per day, while this script might be triggered on per minute basis
function dataTransfer() {
  var url = ""; // Enter data transfer job url
  var accessToken = oauthSignIn();
  var startTime = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'"); // eg 2021-01-01T00:00:00Z
  var data =
        {
          requestedRunTime: startTime
        };
  var payload = JSON.stringify(data);
  var fetchArgs =
      {
        method: "post",
        contentType: "application/json",
        headers: {"Authorization":"Bearer " + accessToken},
        accept: "application/json",
        muteHttpExceptions: true,
        payload: payload
      };
  var response = UrlFetchApp.fetch(url,fetchArgs);
}
