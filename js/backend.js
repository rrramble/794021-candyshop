'use strict';


/*
 * Download catalog of goods
 */

(function () {

  var Host = {
    Download: {
      URL: 'https://js.dump.academy/candyshop/data',
      RESPONSE_TYPE: 'json',
      METHOD: 'GET'
    },

    Upload: {
      URL: 'https://js.dump.academy/candyshop',
      METHOD: 'POST'
    }
  };

  window.Backend = {
    get: get,
    put: put
  };

  function get(onLoad, onError) {
    processXhr(Host.Download, onLoad, onError);
  }

  function put(data, onLoad, onError) {
    processXhr(Host.Upload, onLoad, onError, data);
  }

  function processXhr(connection, onLoad, onError, data) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      processResult(xhr, onLoad, onError);
    });
    xhr.addEventListener('error', function () {
      processResult(xhr, onLoad, onError);
    });
    xhr.addEventListener('timeout', function () {
      processResult(xhr, onLoad, onError);
    });

    if (connection.RESPONSE_TYPE) {
      xhr.responseType = connection.RESPONSE_TYPE;
    }
    if (connection.TIMEOUT) {
      xhr.timeout = connection.TIMEOUT;
    }

    xhr.open(connection.METHOD, connection.URL);
    try {
      var formData = data ? new FormData(data) : undefined;
      xhr.send(formData);
    } catch (err) {
      onError(err.name + ' ' + err.message);
    }

  }

  function processResult(result, onLoad, onError) {
    if (window.utils.HttpCode.isSuccess(result.status)) {
      onLoad(result.response);
    } else {
      onError(result.status + '. ' + result.statusText);
    }
  }

})();
