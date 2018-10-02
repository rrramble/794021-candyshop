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
    xhr.addEventListener('load', onEndLoading);
    xhr.addEventListener('error', onLoadingError);
    xhr.addEventListener('timeout', onLoadingTimeout);

    xhr.responseType = Host.Download.RESPONSE_TYPE;
    try {
      xhr.open(Host.Download.METHOD, Host.Download.URL);
      xhr.send();
    } catch (err) {
      onLoadingError(err);
    }
    return;

    function onEndLoading() {
      if (window.utils.isInRangeUpTo(xhr.status, 200, 299)) {
        onLoad(xhr.response);
      } else {
        onError(xhr.status + '. ' + xhr.statusText);
      }
    }

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
    xhr.addEventListener('load', onEndLoading);
    xhr.addEventListener('error', onLoadingError);
    xhr.addEventListener('timeout', onLoadingTimeout);

    try {
      xhr.open(Host.Upload.METHOD, Host.Upload.URL);
      xhr.send(formData);
    } catch (err) {
      onLoadingError(err);
    }
    return;

    function onEndLoading() {
      if (window.utils.isInRangeUpTo(xhr.status, 200, 299)) {
        onLoad(xhr.response);
      } else {
        onError(xhr.status + '. ' + xhr.statusText);
      }
    }

    function onLoadingError() {
      onError('Uploading error.');
    }

    function onLoadingTimeout() {
      onError('Uploading timeout error.');
    }

  };

})();
