'use strict';

/*
 * Текст задания:
 * https://up.htmlacademy.ru/javascript/15/tasks/16
 */

(function () {

  var COMMODITY_HTML_ID_HEAD = 'commodity';
  var TROLLEY_HTML_ID_HEAD = 'trolley-commodity';

  var GOODS_HTML_TEMPLATE_SELECTOR = '#card';
  var GOODS_HTML_SELECTOR = '.catalog__cards';

  var TROLLEY_HTML_TEMPLATE_SELECTOR = '#card-order';
  var TROLLEY_HTML_SELECTOR = '.goods__cards';

  var Filter = {
    MAIN_SELECTOR: '.catalog__filter.range',
    RANGE_MIN_BTN_CLASS: 'range__btn--left',
    RANGE_MAX_BTN_CLASS: 'range__btn--right',
    MIN_RANGE_BTN_TEXT_SELECTOR: '.range__price--min',
    MAX_RANGE_BTN_TEXT_SELECTOR: '.range__price--max',
    RANGE_BTN_PARENT_SELECTOR: '.range__filter'
  }

  var Order = {
    MAIN_SELECTOR: '.buy',
    SUBMIT_BTN_SELECTOR: '.buy__submit-btn'
  }

  var PAYMENT = {
    MAIN_SELECTOR: '.payment',
    METHOD_SELECTOR: '.payment__method',
    CARD_FIELDS_MAIN_SELECTOR: '.payment__card-wrap',
    CARD_LABEL_SELECTOR: '.toggle-btn__input[value="card"]',
    CASH_LABEL_SELECTOR: '.toggle-btn__input[value="cash"]',
    CARD_FORM_SELECTOR: '.payment__card-wrap',
    CARD_NUMBER_INPUT_SELECTOR: '#payment__card-number',
    CARD_NUMBER_INPUT_CLASS: 'text-input__input',
    CARD_DATE_INPUT_SELECTOR: '#payment__card-date',
    CARD_CVC_INPUT_SELECTOR: '#payment__card-cvc',
    CARD_HOLDER_INPUT_SELECTOR: '#payment__cardholder'
  }

  var DELIVERY = {
    MAIN_SELECTOR: '.deliver',
    METHOD_SELECTOR: '.deliver__toggle',
    SELF_TAKE_OUT_SELECTOR: '.toggle-btn__input[value="store"]',
    BY_COURIER_SELECTOR: '.toggle-btn__input[value="courier"]',
    SUBWAY_STATIONS_SELECTOR: '.deliver__stores'
  }


  var GOODS_IN_TROLLEY_COUNT = 3;


/*
 * Main code
 */

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

  /*
   * End of main code
   */


  function setInterfaceHandlers() {
    setFieldsForCardPayment(true);

    window.utils.setDomHandlers(
      document, PAYMENT.METHOD_SELECTOR,
      paymentTypeHandlers,
      'click'
    );

    window.utils.setDomHandlers(
      document, Order.MAIN_SELECTOR,
      checkOrderFormValidity,
      'submit'
    );

    window.utils.setDomHandlers(
      document, PAYMENT.CARD_FIELDS_MAIN_SELECTOR,
      checkOrderFormValidity,
      'change'
    );

    window.utils.setDomHandlers(
      document, DELIVERY.MAIN_SELECTOR,
      deliveryHandlers,
      'click'
    );

    window.utils.setDomHandlers(
      document, Filter.MAIN_SELECTOR,
      filterHandlers,
      'mouseup'
    );
  }

  function paymentTypeHandlers (evt) {
    switch(true) {
      case (window.utils.isChecked(PAYMENT.CARD_LABEL_SELECTOR)):
        adjustFormForCardPayment();
        break;
      case (window.utils.isChecked(PAYMENT.CASH_LABEL_SELECTOR)):
        adjustFormForCashPayment();
        break;
    }
  }

  function adjustFormForCardPayment () {
    window.utils.showHtmlSelector(document, PAYMENT.CARD_FORM_SELECTOR);
    setFieldsForCardPayment(true);
  }

  function adjustFormForCashPayment () {
    window.utils.hideHtmlSelector(document, PAYMENT.CARD_FORM_SELECTOR);
    setFieldsForCardPayment(false);
   	resetCardValidity();
  }

  function setFieldsForCardPayment (isToBeSet) {
    window.utils.setInputToBeRequired(isToBeSet, PAYMENT.CARD_NUMBER_INPUT_SELECTOR);
    window.utils.setInputToBeRequired(isToBeSet, PAYMENT.CARD_DATE_INPUT_SELECTOR);
    window.utils.setInputToBeRequired(isToBeSet, PAYMENT.CARD_CVC_INPUT_SELECTOR);
    window.utils.setInputToBeRequired(isToBeSet, PAYMENT.CARD_HOLDER_INPUT_SELECTOR);
  }

  function checkOrderFormValidity() {
    switch (true) {
      case (!isCardNumberValid()):
        window.utils.setDomValid(false, PAYMENT.CARD_NUMBER_INPUT_SELECTOR);
        break;    
      case (!isCardDateValid()):
        window.utils.setDomValid(true, PAYMENT.CARD_NUMBER_INPUT_SELECTOR);
        window.utils.setDomValid(false, PAYMENT.CARD_DATE_INPUT_SELECTOR);
        break;
      case (!isCardCvcValid()):
        window.utils.setDomValid(true, PAYMENT.CARD_NUMBER_INPUT_SELECTOR);
        window.utils.setDomValid(true, PAYMENT.CARD_DATE_INPUT_SELECTOR);
        window.utils.setDomValid(false, PAYMENT.CARD_CVC_INPUT_SELECTOR);
        break;
      case (!isCardholderNameValid()):
        window.utils.setDomValid(true, PAYMENT.CARD_NUMBER_INPUT_SELECTOR);
        window.utils.setDomValid(true, PAYMENT.CARD_DATE_INPUT_SELECTOR);
        window.utils.setDomValid(true, PAYMENT.CARD_CVC_INPUT_SELECTOR);
        window.utils.setDomValid(false, PAYMENT.CARD_HOLDER_INPUT_SELECTOR);
        break;
      default:
      	resetCardValidity();
    }
  }

  function resetCardValidity () {
    window.utils.setDomValid(true, PAYMENT.CARD_NUMBER_INPUT_SELECTOR);
    window.utils.setDomValid(true, PAYMENT.CARD_DATE_INPUT_SELECTOR);
    window.utils.setDomValid(true, PAYMENT.CARD_CVC_INPUT_SELECTOR);
    window.utils.setDomValid(true, PAYMENT.CARD_HOLDER_INPUT_SELECTOR);
  }

  function isCardNumberValid () {
    var cardNumber = window.utils.getDomValue(document, PAYMENT.CARD_NUMBER_INPUT_SELECTOR);
    var result = window.utils.isLuhnChecked(cardNumber);
    return result;
  }

  function isCardDateValid () {
    var cardDate = window.utils.getDomValue(document, PAYMENT.CARD_DATE_INPUT_SELECTOR);
    var result = window.utils.isCardDateChecked(cardDate);
    return result;
  }

  function isCardCvcValid () {
    var cvc = window.utils.getDomValue(document, PAYMENT.CARD_CVC_INPUT_SELECTOR);
    var state = window.utils.isCvcChecked(cvc);
    return state;
  }

  function isCardholderNameValid () {
    var cardholder = window.utils.getDomValue(document, PAYMENT.CARD_CVC_INPUT_SELECTOR);
    var state = window.utils.isCacrdholderNameChecked(cardholder);
    return state;
  }

  function deliveryHandlers (evt) {
    switch(true) {
      case (window.utils.isChecked(DELIVERY.BY_COURIER_SELECTOR)):
        window.utils.hideHtmlSelector(document, DELIVERY.SUBWAY_STATIONS_SELECTOR);
        break;

      case (window.utils.isChecked(DELIVERY.SELF_TAKE_OUT_SELECTOR)):
        window.utils.showHtmlSelector(document, DELIVERY.SUBWAY_STATIONS_SELECTOR);
        break;
    }
  }

  function filterHandlers (evt) {
    switch(true) {
      case (evt.target.classList.contains(Filter.RANGE_MIN_BTN_CLASS)):
        updateSliderPositionValue();
        break;

      case (evt.target.classList.contains(Filter.RANGE_MAX_BTN_CLASS)):
        updateSliderPositionValue();
        break;
    }
  }

  function updateSliderPositionValue () {
    var minSliderValue = getMinSliderValue();
    var maxSliderValue = getMaxSliderValue();
    window.utils.setDomTextContent(document, Filter.MIN_RANGE_BTN_TEXT_SELECTOR, minSliderValue);
    window.utils.setDomTextContent(document, Filter.MAX_RANGE_BTN_TEXT_SELECTOR, maxSliderValue);

    function getMinSliderValue () {
      var parentWidth = window.utils.getHtmlSelectorWidth(Filter.RANGE_BTN_PARENT_SELECTOR);
      var width = window.utils.getHtmlClassLeftProperty(Filter.RANGE_MIN_BTN_CLASS);
      return window.utils.intPercent(parentWidth, width);
    }
    function getMaxSliderValue () {
      var parentWidth = window.utils.getHtmlSelectorWidth(Filter.RANGE_BTN_PARENT_SELECTOR);
      var width = window.utils.getHtmlClassRightProperty(Filter.RANGE_MAX_BTN_CLASS);
      return window.utils.intPercent(parentWidth, parentWidth - width);
    }
  }

})();
