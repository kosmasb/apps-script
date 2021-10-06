function oauthSignIn() {
  var oauth2Endpoint = "https://www.googleapis.com/oauth2/v4/token";
  var params =
      {
        'client_id': '', // Enter BigQuery API client Id
        'client_secret': '', // Enter BigQuery API client secret
        'grant_type': 'refresh_token',
        'refresh_token': '' // Enter refresh token
       };
  var fetchArgs =
      {
        method: "post",
        contentType: "application/x-www-form-urlencoded",
        payload: params
      };
  var response = UrlFetchApp.fetch(oauth2Endpoint,fetchArgs);
  var dataSet = JSON.parse(response.getContentText());
  var accessToken = dataSet.access_token;
  return accessToken;
}
