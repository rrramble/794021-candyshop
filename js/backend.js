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

  var processResult = function (result, onLoadCb, onErrorCb) {
    if (window.utils.HttpCode.isSuccess(result.status)) {
      onLoadCb(result.response);
    } else {
      onErrorCb(result.status + '. ' + result.statusText);
    }
  };

  var processXhr = function (connection, onLoadCb, onErrorCb, data) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      processResult(xhr, onLoadCb, onErrorCb);
    });
    xhr.addEventListener('error', function () {
      processResult(xhr, onLoadCb, onErrorCb);
    });
    xhr.addEventListener('timeout', function () {
      processResult(xhr, onLoadCb, onErrorCb);
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
      onErrorCb(err.name + ' ' + err.message);
    }
  };

  var get = function (onLoadCb, onErrorCb) {
    processXhr(Host.Download, onLoadCb, onErrorCb);
  };

  var put = function (data, onLoadCb, onErrorCb) {
    processXhr(Host.Upload, onLoadCb, onErrorCb, data);
  };

  window.Backend = {
    get: get,
    put: put
  };

})();
