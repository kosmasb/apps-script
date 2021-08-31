const projectID = "..." // Enter BigQuery projectID
const datasetID = "..." // Enter BigQuery datasetID
// CSV format helper
var safeValue = function (val) {
  var result = '';
  if (val) {
    if (!(typeof val === 'string' && val instanceof String)) {       
      if (typeof val.toString === 'function') {
        result = val.toString();
      } 
      else {
        result = `${val}`;
      }
      if (result === '[object Object]') {
        result = JSON.stringify(val);
      }
    }
    result = result.replace(/"/g, '""');
    result = `"${result}"`;
  };
  return result;
};
