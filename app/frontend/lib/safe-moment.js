import moment from "moment"

let parse = function(input, dateFormat) {
  if( arguments.length < 2 ){
    throw new Error("Invalid arguments error: must supply input and dateFormat")
  }
  if( dateFormat === undefined || dateFormat === null){
    throw new Error("Must supply valid dateFormat")
  }

  let result = moment(input, dateFormat, true);
  if( !result.isValid() ){
    throw new Error(`invalid date ${input} supplied`)
  }

  return result;
};

let iso8601Parse = function(input){
  return parse(input, moment.ISO_8601)
};

let uiDateParse = function(input){
  return parse(input, 'DD-MM-YYYY');
};

export default {
  parse: parse,
  iso8601Parse: iso8601Parse,
  uiDateParse: uiDateParse
}
