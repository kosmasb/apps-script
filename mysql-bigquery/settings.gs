function getConnection(query) {
  var conn = Jdbc.getConnection('jdbc:mysql://$url:3306/$database', { // Construct jdbc url
        user: '', // Enter username
        password: '' // Enter password
  });
  var stmt = conn.createStatement();
  var start = new Date(); // Get script starting time
  var rs = stmt.executeQuery(query);
  return rs;
}

// Map MySQL field types with BigQuery field types
function fieldTypeMapping(titles) {  
  var fieldsTemp = [];
  for (var i = 0; i < titles.length; i++) {
    var n1 = {};
    n1.name = titles[i][0];
    //Logger.log(n1);
    if (titles[i][1] == 'VARCHAR' || titles[i][1] == 'CHAR' || titles[i][1] == 'BLOB' || titles[i][1] == 'MEDIUMBLOB') {
      var fieldType = 'STRING';
      n1.type = fieldType;
    }
    else if (titles[i][1] == 'INT' || titles[i][1] == 'BIGINT' || titles[i][1] == 'SMALLINT' || titles[i][1] == 'TINYINT' || titles[i][1] == 'INT UNSIGNED' || titles[i][1] == 'SMALLINT UNSIGNED') {
      var fieldType = 'INTEGER';
      n1.type = fieldType;
    }
    else if (titles[i][1] == 'DECIMAL' || titles[i][1] == 'DOUBLE') {
      var fieldType = 'FLOAT';
      n1.type = fieldType;
    }
    else {
      var fieldType = titles[i][1];
      n1.type = fieldType;
    }
    fieldsTemp.push(n1);
  }
  var fieldList = {fields: fieldsTemp};
  return fieldList;
}

// CSV format helper
  var safeValue = function (val) {
    var result = '';
    if (val) {
      if (!(typeof val === 'STRING' && val instanceof String)) {       
        if (typeof val.toString === 'function') {
          result = val.toString();
        } else {
          result = val;
        }
        if (result === '[object Object]') {
          result = JSON.stringify(val);
        }
      }
      result = result.replace(/"/g, '');
      result = "\"" + result + "\"";
    };
    Logger.log(result);
    return result;
  };
