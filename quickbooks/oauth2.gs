var CLIENT_ID = '...'; // Get from Quickbooks Developer Console
var CLIENT_SECRET = '...'; // Get from Quickbooks Developer Console
var BASE_AUTH_URL = 'https://appcenter.intuit.com/connect/oauth2';
var TOKEN_URL = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
var API_SCOPE = 'com.intuit.quickbooks.accounting';
var REDIRECT_URI = '...'; // Generate using the logRedirectUri() function mentioned at the end of this script
var RESPONSE_TYPE = 'code';

/**
 * Authorizes and makes a request to the Quickbooks API using OAuth 2.
*/ 
function run() {
  var service = getService();
  if (service.hasAccess()) {
    var url = 'https://quickbooks.api.intuit.com';
    var response = UrlFetchApp.fetch(url, {
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken()
      }
    });
    var result = JSON.parse(response.getContentText());
    Logger.log(JSON.stringify(result, null, 2));
  } else {
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Open the following URL and re-run the script: %s', authorizationUrl);
  }
}

/**
 * Reset the authorization state, so that it can be re-tested.
*/ 
function reset() {
  getService().reset();
}

/**
 * Configures the service.
 */
function getService() {
  return OAuth2.createService('Quickbooks')
      .setAuthorizationBaseUrl(BASE_AUTH_URL)
      .setTokenUrl(TOKEN_URL)
      .setClientId(CLIENT_ID)
      .setClientSecret(CLIENT_SECRET)
      .setScope(API_SCOPE)
      .setCallbackFunction('authCallback')
      .setParam('response_type', RESPONSE_TYPE)
      .setParam('state', getStateToken('authCallback')) // function to generate the state token on the fly
      .setPropertyStore(PropertiesService.getUserProperties());
}

/**
 * Handles the OAuth callback
 */
function authCallback(request) {
  var service = getService();
  var authorized = service.handleCallback(request);
  if (authorized) {
    Logger.log("Success!");
    return HtmlService.createHtmlOutput('Success!');
  } else {
    Logger.log("Denied!");
    return HtmlService.createHtmlOutput('Denied.');
  }
}

/** 
 * Generate a State Token
 */
function getStateToken(callbackFunction){
 var stateToken = ScriptApp.newStateToken()
     .withMethod(callbackFunction)
     .withTimeout(120)
     .createToken();
 return stateToken;
}

/**
 * Logs the redirect URI. Run this function to get the REDIRECT_URI to be mentioned at the top of this script. 
 */
function logRedirectUri() {
  Logger.log(getService().getRedirectUri());
}
