'use strict';

/*
 * Class for DOM of one trolley commodity
 */

(function () {

  var TROLLEY_HTML_ID_HEAD = 'trolley-commodity';


  window.TrolleyItemDom = function (commodity, templateNode) {

    var setId = function (node, commodityId) {
      var text = TROLLEY_HTML_ID_HEAD + commodityId;
      window.utils.setDomId(node, '.card-order', text);
    };

    var setTitle = function (node, name) {
      window.utils.setDomTextContent(node, '.card-order__title', name);
    };

    var setImage = function (node, url, alt) {
      window.utils.setDomImage(node, '.card-order__img', url, alt);
    };

    var setPrice = function (node, price) {
      window.utils.setDomTextContent(node, '.card-order__price', price);
    };

    var setAmount = function (node, amount) {
      window.utils.setDomValue(node, '.card-order__count', amount);
    };


    // Beginning of the constructor

    this.commodity = commodity;
    var baseNode = templateNode.content.cloneNode(true);
    setId(baseNode, commodity.id);
    setTitle(baseNode, commodity.name);
    setImage(baseNode, commodity.picture, commodity.name);
    setPrice(baseNode, commodity.price);
    setAmount(baseNode, commodity.amount);
    return baseNode;

    // End of the constructor

  }; // window.TrolleyItemDom

})();
