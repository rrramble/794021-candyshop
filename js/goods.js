'use strict';

/*
 * Текст задания:
 * https://up.htmlacademy.ru/javascript/15/tasks/16
 */

var COMMODITY_HTML_ID_HEAD = 'commodity';
var TROLLEY_HTML_ID_HEAD = 'trolley-commodity';

var GOODS_HTML_TEMPLATE_SELECTOR = '#card';
var GOODS_HTML_SELECTOR = '.catalog__cards';

var TROLLEY_HTML_TEMPLATE_SELECTOR = '#card-order';
var TROLLEY_HTML_SELECTOR = '.goods__cards';

var PAYMENT = {
  MAIN_SELECTOR: '.payment',
  METHOD_SELECTOR: '.payment__method',
  CARD_LABEL_SELECTOR: '.toggle-btn__input[value="card"]',
  CASH_LABEL_SELECTOR: '.toggle-btn__input[value="cash"]',
  CARD_FORM_SELECTOR: '.payment__inputs'
}

var DELIVERY = {
  MAIN_SELECTOR: '.deliver',
  METHOD_SELECTOR: '.deliver__toggle',
  SELF_TAKE_OUT_SELECTOR: '.toggle-btn__input[value="store"]',
  BY_COURIER_SELECTOR: '.toggle-btn__input[value="courier"]',
  SUBWAY_STATIONS_SELECTOR: '.deliver__stores'
}

var FILTER = {
  MAIN_SELECTOR: '.catalog__filter.range',
  RANGE_MIN_BTN_CLASS: 'range__btn--left',
  RANGE_MAX_BTN_CLASS: 'range__btn--right',
  MIN_RANGE_BTN_TEXT_SELECTOR: '.range__price--min',
  MAX_RANGE_BTN_TEXT_SELECTOR: '.range__price--max'
}

var GOODS_IN_TROLLEY_COUNT = 3;

(function () {
  var catalog = new window.Catalog(window.mockGoods.get);
  var trolley = new window.Trolley(catalog);
  var dom = new window.Dom(
    catalog, GOODS_HTML_TEMPLATE_SELECTOR, GOODS_HTML_SELECTOR,
    trolley, TROLLEY_HTML_TEMPLATE_SELECTOR, TROLLEY_HTML_SELECTOR
  );

  /*
  putRandomGoodsInTrolley(
      catalog, catalogDom.updateView,
      trolley, trolleyDom.updateView,
      GOODS_IN_TROLLEY_COUNT);
   */

  setInterfaceHandlers();
  return;

  function setInterfaceHandlers() {
    window.utils.setDomHandlers(
      document,
      PAYMENT.MAIN_SELECTOR,
      paymentHandlers,
      'click'
    );

    window.utils.setDomHandlers(
      document,
      DELIVERY.MAIN_SELECTOR,
      deliveryHandlers,
      'click'
    );

    window.utils.setDomHandlers(
      document,
      FILTER.MAIN_SELECTOR,
      filterHandlers,
      'mouseup'
    );

  }

  function paymentHandlers(evt) {
    switch(true) {
      case (window.utils.isChecked(PAYMENT.CARD_LABEL_SELECTOR)):
        window.utils.showHtmlSelector(document, PAYMENT.CARD_FORM_SELECTOR);
        break;

      case (window.utils.isChecked(PAYMENT.CASH_LABEL_SELECTOR)):
        window.utils.hideHtmlSelector(document, PAYMENT.CARD_FORM_SELECTOR); 
        break;
    }
  }

  function deliveryHandlers(evt) {
    switch(true) {
      case (window.utils.isChecked(DELIVERY.BY_COURIER_SELECTOR)):
        window.utils.hideHtmlSelector(document, DELIVERY.SUBWAY_STATIONS_SELECTOR); 
        break;

      case (window.utils.isChecked(DELIVERY.SELF_TAKE_OUT_SELECTOR)):
        window.utils.showHtmlSelector(document, DELIVERY.SUBWAY_STATIONS_SELECTOR);
        break;
    }
  }

  function filterHandlers(evt) {
    switch(true) {
      case (evt.target.classList.contains(FILTER.RANGE_MIN_BTN_CLASS)):
        updateSliderPositionValue();
        break;

      case (evt.target.classList.contains(FILTER.RANGE_MAX_BTN_CLASS)):
        updateSliderPositionValue();
        break;
    }
  }

  function updateSliderPositionValue() {
    var minSliderValue = 60; ///// Needs to make and use  function to calculate the actual value
    var maxSliderValue = 230; ///// Needs to make and use  function to calculate the actual value
    window.utils.setDomTextContent(document, FILTER.MIN_RANGE_BTN_TEXT_SELECTOR, minSliderValue);
    window.utils.setDomTextContent(document, FILTER.MAX_RANGE_BTN_TEXT_SELECTOR, maxSliderValue);
  }

})();
