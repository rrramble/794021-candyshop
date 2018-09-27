'use strict';

/*
 * Class for DOM of one trolley commodity
 */

(function () {

  var TROLLEY_HTML_ID_HEAD = 'trolley-commodity';


  window.TrolleyItemDom = function (commodity, templateNode) {


    // Constructor body

    this.commodity = commodity;
    var baseNode = templateNode.content.cloneNode(true);
    setId(baseNode, commodity.id);
    setTitle(baseNode, commodity.name);
    setImage(baseNode, commodity.picture, commodity.name);
    setPrice(baseNode, commodity.price);
    setAmount(baseNode, commodity.amount);
    setNameAndId(baseNode, '------placeholder-----');
    /*
    if (commodity.amount <= 0) {
      window.utils.hideHtmlSelector(node, '.card-order');
    }
    */
    return baseNode;

    // End of constructor body


    function setId(node, commodityId) {
      var text = TROLLEY_HTML_ID_HEAD + commodityId;
      window.utils.setDomId(node, '.card-order', text);
    }

    function setTitle(node, name) {
      window.utils.setDomTextContent(node, '.card-order__title', name);
    }

    function setImage(node, url, alt) {
      window.utils.setDomImage(node, '.card-order__img', url, alt);
    }

    function setPrice(node, price) {
      window.utils.setDomTextContent(node, '.card-order__price', price);
    }

    function setAmount(node, amount) {
      window.utils.setDomValue(node, '.card-order__count', amount);
    }

    function setNameAndId(node, name) {
      window.utils.setDomName(node, '.card-order__count', name);
      window.utils.setDomId(node, '.card-order__count', 'card-order__' + name);
    }

  };

})();
