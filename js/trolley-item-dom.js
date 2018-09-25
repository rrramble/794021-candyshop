'use strict';

/*
 * Class for DOM of one trolley commodity
 */

(function () {

  var TROLLEY_HTML_ID_HEAD = 'trolley-commodity';

  var TROLLEY_EMPTY_TEXT = 'В корзине ничего нет';
  var TROLLEY_FILLED_TEMPLATE_TEXT = 'Выбрано товаров на сумму: ';
  var TROLLEY_TEXT_SELECTOR = '.main-header__basket';


  window.TrolleyItemDom = function (commodity, templateNode) {


    // Constructor body

    this.commodity = commodity;
    var node = templateNode.content.cloneNode(true);
    setId(node, commodity.id);
    setTitle(node, commodity.name);
    setImage(node, commodity.picture, commodity.name);
    setPrice(node, commodity.price);
    setAmount(node, commodity.amount);
    setNameAndId(node, '------placeholder-----');
    /*
    if (commodity.amount <= 0) {
      window.utils.hideHtmlSelector(node, '.card-order');
    }
    */
    return node;

    // End of constructor body


    function setId(node, commodityId) {
      var text = TROLLEY_HTML_ID_HEAD + commodityId;
      window.utils.setDomId(node, '.card-order', text);
    }

    function setTitle(node, name) {
      window.utils.setDomTextContent(node, '.card-order__title', name);
    }

    function setImage(node, url, alt) {
      window.utils.setDomImage(node, '.card-order__img', url, alt)
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

    function update(trolley, commodityId) {
      var trolleyAmount = trolley.getAmount(commodityId);
      if (trolleyAmount <= 0) {
        deleteDisplayingFromTrolley(commodityId);
      }

      if (isShownInTrolley(commodityId)) {
        setTrolleyCommodityAmountInDom(commodityId, trolleyAmount);
      } else {
        var commodity = catalog.goods(commodityId);
        var domElement = createDomOfTrolleyCommodityFromTemplate(
            commodity,
            TROLLEY_TEMPLATE_ID
        );
        renderItemInTrolley(domElement, TROLLEY_HTML_CLASS);
      }
    }

  }
})();
