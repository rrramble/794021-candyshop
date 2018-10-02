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
      url: 'https://js.dump.academy/candyshop',
      method: 'POST'
    }
  };

  window.Backend = {};
  window.Backend.get = function(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onEndLoading);
    xhr.addEventListener('error', onErrorLoading);
    xhr.addEventListener('timeout', onTimeoutLoading);

    xhr.responseType = Host.Download.RESPONSE_TYPE;
    try {
      xhr.open(Host.Download.METHOD, Host.Download.URL);
      xhr.send();
    } catch (err) {
      onError('Error sending request: ' + err.name + '. ' + err.message);
    }
    return;

    function onEndLoading() {
      if (window.utils.isInRangeUpTo(xhr.status, 200, 299)) {
        onLoad(xhr.response)
      } else {
        onError(xhr.status + '. ' + xhr.statusText);
      }
    }

    function onErrorLoading() {
      onError('Downloading error.');
    }

    function onTimeoutLoading() {
      onError('Downloading timeout error.');
    }
  };

  window.Backend.put = function (data, onLoad, onError) {
    ;
  };

})();
