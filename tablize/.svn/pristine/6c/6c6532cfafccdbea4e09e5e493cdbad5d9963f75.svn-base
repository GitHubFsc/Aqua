window.dojoXHR = dojo.xhr;

dojo.xhr = function(){
  var _self = this;
  var errerFunc = arguments[1].error ? arguments[1].error : null;
  arguments[1].error = function(response, ioArgs){
    if (response) {
      var errorString = "";
      var errorCode = "";
      if (response.responseText != "") {
        var errorText = null;
        try {
          errorText = dojo.fromJson(response.responseText);
        } 
        catch (e) {
          console.log(e);
        }
        if (errorText != undefined && errorText.items && errorText.items[0] && errorText.items[0].$) {
          errorString = errorText.items[0].$;
        }
        else if (errorText != undefined && errorText.items && errorText.items[0] && errorText.items[0].errorMessage) {
          errorString = errorText.items[0].errorMessage;
          errorCode = errorText.items[0].errorCode;
        }
      }
      if (errorString == "" && response.message) {
        errorString = response.message;
      }
      if (errorString != "" && errorCode != "") {
          //-----login_again-----
          login_again(errorCode,errorString);
      }

    }
    return errerFunc.apply(arguments[1], [response, ioArgs]);
  };
  return window.dojoXHR.apply(_self, arguments);
}
