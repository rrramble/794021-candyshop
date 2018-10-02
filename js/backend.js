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

  window.Backend = {};
  window.Backend.get = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function () {
      processXhrResult(xhr, onLoad, onError);
    });
    xhr.addEventListener('error', onLoadingError);
    xhr.addEventListener('timeout', onLoadingTimeout);

    xhr.responseType = Host.Download.RESPONSE_TYPE;
    xhr.open(Host.Download.METHOD, Host.Download.URL);
    xhr.send();
    return;

    function onLoadingError() {
      onError('Downloading error.');
    }

    function onLoadingTimeout() {
      onError('Downloading timeout error.');
    }
  };

  window.Backend.put = function (data, onLoad, onError) {
    var formData = new FormData(data);

    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function () {
      processXhrResult(xhr, onLoad, onError);
    });
    xhr.addEventListener('error', onLoadingError);
    xhr.addEventListener('timeout', onLoadingTimeout);

    xhr.open(Host.Upload.METHOD, Host.Upload.URL);
    xhr.send(formData);
    return;

    function onLoadingError() {
      onError('Uploading error.');
    }

    function onLoadingTimeout() {
      onError('Uploading timeout error.');
    }
  };

  function processXhrResult(result, onLoad, onError) {
    if (window.utils.HttpCode.isSuccess(result.status)) {
      onLoad(result.response);
    } else {
      onError(result.status + '. ' + result.statusText);
    }
  }

})();
