function getSubscriber() {
  // BigQuery configuration
  //............................................................................................
  var tableID = "item";  
  var schema = {
    fields: [
      {name: '...', type: '...', mode: 'NULLABLE', description: ''}
    ]
  };  
  var writeDisposition = 'WRITE_TRUNCATE';
  //............................................................................................
  var api = "https://api.getdrip.com/v2/9170453/subscribers";
  var username = "..."; // Enter API Key
  var password = ""; // Leave it blank
  var encCred = Utilities.base64Encode(username+":"+password);    
  var fetchArgs = 
      {
        contentType: "application/json",
        headers: {"Authorization":"Basic "+encCred},
        muteHttpExceptions : true
      }; 
  var page = 1;
  var values = [];
  // Get Date Range for the last hour
  var now = new Date();
  now.setHours(now.getHours()-2);
  // var updateTime = Utilities.formatDate(now, "GMT+3", "yyyy-MM-dd HH:mm:dd");
  var updateTime = now.toISOString();
  for (var k = 0; k < 30; k++) { // Each API url has a limit of 1000 records. Loop multiple times to get more records.
    var jql = "?per_page=1000&page=" + page;
    //var jql = "?per_page=1000&page=" + page + "&subscribed_after=" + updateTime;
    var response = UrlFetchApp.fetch(api + jql, fetchArgs);
    var dataSet = JSON.parse(response.getContentText()); 
    //Logger.log(dataSet);
    var data;
    var valuesInner = []; 
    //Logger.log(dataSet.length);  
    for (var i = 0; i < dataSet.subscribers.length; i++) {
      data = dataSet.subscribers[i];
      //Logger.log(data);
      // Fields to GET from API
      //--------------------------------------------------
      //Get current timestamp  
      var timestamp = Utilities.formatDate(new Date(), "UTC", "yyyy-MM-dd HH:mm:ss"); 
      var eventType = 'historical'; 
      var subscriberID = data.id;
      //Format Status
      if (data.status === null || data.status === '' || typeof data.status === 'undefined') {
        var subscriberStatus = '';
      }
      else {
        var subscriberStatus =  data.status;
        subscriberStatus = subscriberStatus.replace(/"/g, " ");
        subscriberStatus = subscriberStatus.replace(/\n/g, " "); // \n matches a newline character
        subscriberStatus = subscriberStatus.replace(/\s/g, " "); // \s matches a space, a tab, a carriage return, a line feed, or a form feed
        subscriberStatus = '\"' + subscriberStatus + '\"';
      }
      //Format Email
      if (data.email === null || data.email === '' || typeof data.email === 'undefined') {
        var subscriberEmail = '';
      }
      else {
        var subscriberEmail =  data.email;
        subscriberEmail = subscriberEmail.replace(/"/g, " ");
        subscriberEmail = subscriberEmail.replace(/\n/g, " "); // \n matches a newline character
        subscriberEmail = subscriberEmail.replace(/\s/g, " "); // \s matches a space, a tab, a carriage return, a line feed, or a form feed
        subscriberEmail = '\"' + subscriberEmail + '\"';
      } 
      //Format First Name
      if (data.first_name === null || data.first_name === '' || typeof data.first_name === 'undefined') {
        var firstName = '';
      }
      else {
        var firstName =  data.first_name;
        firstName = firstName.replace(/"/g, " ");
        firstName = firstName.replace(/\n/g, " "); // \n matches a newline character
        firstName = firstName.replace(/\s/g, " "); // \s matches a space, a tab, a carriage return, a line feed, or a form feed
        firstName = '\"' + firstName + '\"';
      }
      //Format Last Name
      if (data.last_name === null || data.last_name === '' || typeof data.last_name === 'undefined') {
        var lastName = '';
      }
      else {
        var lastName =  data.last_name;
        lastName = lastName.replace(/"/g, " ");
        lastName = lastName.replace(/\n/g, " "); // \n matches a newline character
        lastName = lastName.replace(/\s/g, " "); // \s matches a space, a tab, a carriage return, a line feed, or a form feed
        lastName = '\"' + lastName + '\"';
      }
      //Format Address
      if (data.custom_fields.Address === null || data.custom_fields.Address === '' || typeof data.custom_fields.Address === 'undefined') {
        var address = '';
      }
      else {
        var address =  data.custom_fields.Address;
        address = address.replace(/"/g, " ");
        address = address.replace(/\n/g, " "); // \n matches a newline character
        address = address.replace(/\s/g, " "); // \s matches a space, a tab, a carriage return, a line feed, or a form feed
        address = '\"' + address + '\"';
      }
      //Format City
      if (data.custom_fields.City === null || data.custom_fields.City === '' || typeof data.custom_fields.City === 'undefined') {
        var city = '';
      }
      else {
        var city =  data.custom_fields.City;
        city = city.replace(/"/g, " ");
        city = city.replace(/\n/g, " "); // \n matches a newline character
        city = city.replace(/\s/g, " "); // \s matches a space, a tab, a carriage return, a line feed, or a form feed
        city = '\"' + city + '\"';
      }
      //Format State
      if (data.custom_fields.State === null || data.custom_fields.State === '' || typeof data.custom_fields.State === 'undefined') {
        var state = '';
      }
      else {
        var state =  data.custom_fields.State;
        state = state.replace(/"/g, " ");
        state = state.replace(/\n/g, " "); // \n matches a newline character
        state = state.replace(/\s/g, " "); // \s matches a space, a tab, a carriage return, a line feed, or a form feed
        state = '\"' + state + '\"';
      }
      var zipCode = data.custom_fields.Zip_Code;
      //Format Phone
      if (data.custom_fields.Phone === null || data.custom_fields.Phone === '' || typeof data.custom_fields.Phone === 'undefined') {
        var phone = '';
      }
      else {
        var phone =  data.custom_fields.Phone;
        phone = phone.replace(/"/g, " ");
        phone = phone.replace(/\n/g, " "); // \n matches a newline character
        phone = phone.replace(/\s/g, " "); // \s matches a space, a tab, a carriage return, a line feed, or a form feed
        phone = '\"' + phone + '\"';
      }
      var dealID = data.custom_fields.Deal_Id;
      //Format Deal Stage
      if (data.custom_fields.Deal_Stage === null || data.custom_fields.Deal_Stage === '' || typeof data.custom_fields.Deal_Stage === 'undefined') {
        var dealStage = '';
      }
      else {
        var dealStage =  data.custom_fields.Deal_Stage;
        dealStage = dealStage.replace(/"/g, " ");
        dealStage = dealStage.replace(/\n/g, " "); // \n matches a newline character
        dealStage = dealStage.replace(/\s/g, " "); // \s matches a space, a tab, a carriage return, a line feed, or a form feed
        dealStage = '\"' + dealStage + '\"';
      }
      //Format Deal Status
      if (data.custom_fields.Deal_Status === null || data.custom_fields.Deal_Status === '' || typeof data.custom_fields.Deal_Status === 'undefined') {
        var dealStatus = '';
      }
      else {
        var dealStatus =  data.custom_fields.Deal_Status;
        dealStatus = dealStatus.replace(/"/g, " ");
        dealStatus = dealStatus.replace(/\n/g, " "); // \n matches a newline character
        dealStatus = dealStatus.replace(/\s/g, " "); // \s matches a space, a tab, a carriage return, a line feed, or a form feed
        dealStatus = '\"' + dealStatus + '\"';
      }
      //Format Lead URN
      if (data.custom_fields.Lead_Urn === null || data.custom_fields.Lead_Urn === '' || typeof data.custom_fields.Lead_Urn === 'undefined') {
        var leadUrn = '';
      }
      else {
        var leadUrn =  data.custom_fields.Lead_Urn;
        leadUrn = leadUrn.replace(/"/g, " ");
        leadUrn = leadUrn.replace(/\n/g, " "); // \n matches a newline character
        leadUrn = leadUrn.replace(/\s/g, " "); // \s matches a space, a tab, a carriage return, a line feed, or a form feed
        leadUrn = '\"' + leadUrn + '\"';
      }
      //Format Deal Owner
      if (data.custom_fields.Owner === null || data.custom_fields.Owner === ''  || typeof data.custom_fields.Owner === 'undefined') {
        var dealOwner = '';
      }
      else {
        var dealOwner =  data.custom_fields.Owner;
        dealOwner = dealOwner.replace(/"/g, " ");
        dealOwner = dealOwner.replace(/\n/g, " "); // \n matches a newline character
        dealOwner = dealOwner.replace(/\s/g, " "); // \s matches a space, a tab, a carriage return, a line feed, or a form feed
        dealOwner = '\"' + dealOwner + '\"';
      }
      var dealPersonID = data.custom_fields.Person_Id;
      //Format Product
      if (data.custom_fields.Product === null || data.custom_fields.Product === '' || typeof data.custom_fields.Product === 'undefined') {
        var product = '';
      }
      else {
        var product =  data.custom_fields.Product;
        product = product.replace(/"/g, " ");
        product = product.replace(/\n/g, " "); // \n matches a newline character
        product = product.replace(/\s/g, " "); // \s matches a space, a tab, a carriage return, a line feed, or a form feed
        product = '\"' + product + '\"';
      }
      //Format utm source
      if (data.custom_fields.Utm_source === null || data.custom_fields.Utm_source === '' || typeof data.custom_fields.Utm_source === 'undefined') {
        var utmSource = '';
      }
      else {
        var utmSource =  data.custom_fields.Utm_source;
        utmSource = utmSource.replace(/"/g, " ");
        utmSource = utmSource.replace(/\n/g, " "); // \n matches a newline character
        utmSource = utmSource.replace(/\s/g, " "); // \s matches a space, a tab, a carriage return, a line feed, or a form feed
        utmSource = '\"' + utmSource + '\"';
      }
      //Format Tags  
      if (data.tags === null || data.tags === '' || typeof data.tags === 'undefined') {
        var tags = '';
      }
      else {
        var tagsArray = [];  
        for (var ti = 0; ti < data.tags.length; ti++) {
          tagsArray.push(data.tags[ti]);
        }  
        var tags = '\"' + tagsArray + '\"';
      }
      var createdAt = Utilities.formatDate(new Date(data.created_at), "UTC", "yyyy-MM-dd HH:mm:ss");
      //Format Country
      if (data.country === null || data.country === '' || typeof data.country === 'undefined') {
        var country = '';
      }
      else {
        var country =  data.country;
        country = country.replace(/"/g, " ");
        country = country.replace(/\n/g, " "); // \n matches a newline character
        country = country.replace(/\s/g, " "); // \s matches a space, a tab, a carriage return, a line feed, or a form feed
        country = '\"' + country + '\"';
      }
      //--------------------------------------------------
      // Create Array of data
      var pushRange = [timestamp, eventType, subscriberID, subscriberStatus, subscriberEmail, firstName, lastName, address, city, state, zipCode, phone, dealID, dealStage, dealStatus, leadUrn, dealOwner, dealPersonID, product, utmSource, tags, createdAt, country];            
      valuesInner.push(pushRange);
    }
       for(var m = 0; m < valuesInner.length; m++) {
         values.push(valuesInner[m]);  
       }
    page = page + 1;
    // Stop looping if URL has less than 1000 records.
    if (dataSet.subscribers.length < 1000) {
      break;
    }  
  }
  sendToBigQuery(projectID, datasetID, tableID, schema, writeDisposition, values);
}
