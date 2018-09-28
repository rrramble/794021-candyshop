'use strict';

/*
 * Текст задания:
 * https://up.htmlacademy.ru/javascript/15/tasks/16
 */

(function () {

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
  };

  var Order = {
    MAIN_SELECTOR: '.buy form',
    SUBMIT_BTN_SELECTOR: '.buy__submit-btn'
  };

  var Contacts = {
    NAME_SELECTOR: '#contact-data__name',
    NAME_MIN_LENGTH: 1,

    PHONE_SELECTOR: '#contact-data__tel',
    PHONE_MIN_LENGTH: 10,
    PHONE_MAX_LENGTH: 22,

    EMAIL_SELECTOR: '#contact-data__email',
  };

  var PAYMENT = {
    MAIN_SELECTOR: '.payment',
    METHOD_SELECTOR: '.payment__method',

    CARD_VALIDITY_SELECTOR: '.payment__card-status',
    CARD_VALID_MESSAGE: 'Одобрен',
    CARD_INVALID_MESSAGE: 'Не определён',

    CARD_FIELDS_MAIN_SELECTOR: '.payment__card-wrap',
    CARD_LABEL_SELECTOR: '.toggle-btn__input[value="card"]',
    CASH_LABEL_SELECTOR: '.toggle-btn__input[value="cash"]',
    CARD_FORM_SELECTOR: '.payment__card-wrap',

    CARD_NUMBER_INPUT_SELECTOR: '#payment__card-number',
    CARD_NUMBER_INPUT_CLASS: 'text-input__input',
    CARD_NUMBER_MIN_LENGTH: 16,
    CARD_NUMBER_MAX_LENGTH: 16,

    CARD_DATE_INPUT_SELECTOR: '#payment__card-date',
    CARD_DATE_MIN_LENGTH: 5,
    CARD_DATE_MAX_LENGTH: 5,

    CARD_CVC_INPUT_SELECTOR: '#payment__card-cvc',
    CARD_CVC_MIN_LENGTH: 3,
    CARD_CVC_MAX_LENGTH: 3,

    CARD_HOLDER_INPUT_SELECTOR: '#payment__cardholder',
    CARD_HOLDER_MIN_WIDTH: 1,

    CASH_PAYMENT_MESSAGE_SELECTOR: '.payment__cash-wrap'
  };

  var Delivery = {
    MAIN_SELECTOR: '.deliver',
    METHOD_SELECTOR: '.deliver__toggle',
    SELF_TAKE_OUT_SELECTOR: '.toggle-btn__input[value="store"]',
    BY_COURIER_SELECTOR: '.toggle-btn__input[value="courier"]',

    Store: {
      MAIN_SELECTOR: '.deliver__store',
    },

    Courier: {
      MAIN_SELECTOR: '.deliver__courier',
      STREET_SELECTOR: '#deliver__street',
      HOUSE_SELECTOR: '#deliver__house',
      FLOOR_SELECTOR: '#deliver__floor',
      ROOM_SELECTOR: '#deliver__room'
    }
  };


  /*
   * Main code
   */

  var catalog = new window.Catalog(window.mockGoods.get);
  var trolley = new window.Trolley(catalog);
  var dom = new window.Dom(
      catalog, GOODS_HTML_TEMPLATE_SELECTOR, GOODS_HTML_SELECTOR,
      trolley, TROLLEY_HTML_TEMPLATE_SELECTOR, TROLLEY_HTML_SELECTOR
  );
  dom.renderCatalogDom();
  dom.renderTrolleyDom();

  /*
  var GOODS_IN_TROLLEY_COUNT = 3;
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
    setContactsToBeRequired(true);

    window.utils.setDomEventHandler(
        document, Filter.MAIN_SELECTOR,
        filterHandler,
        'mouseup'
    );

    window.utils.setDomEventHandler(
        document, Order.MAIN_SELECTOR,
        contactsCheckHandler,
        'change'
    );

    window.utils.setDomEventHandler(
        document, PAYMENT.METHOD_SELECTOR,
        paymentTypeHandler,
        'click'
    );

    window.utils.setDomEventHandler(
        document, Order.MAIN_SELECTOR,
        paymentCheckHandler,
        'change'
    );

    window.utils.setDomEventHandler(
        document, Delivery.MAIN_SELECTOR,
        deliveryTypeHandler,
        'click'
    );

    window.utils.setDomEventHandler(
        document, Delivery.MAIN_SELECTOR,
        deliveryCheckHandler,
        'change'
    );

    window.utils.setDomEventHandler(
        document, Order.MAIN_SELECTOR,
        checkOrderFormValidity,
        'submit'
    );

  }


  /*
   * Overall order form checking
   */

  function checkOrderFormValidity() {
    contactsCheckHandler();
    paymentCheckHandler();
    deliveryCheckHandler();
  }

  /*
   * Contacts handler and checking
   */

  function contactsCheckHandler() {
    switch (true) {
      case (!isNameValid()):
        window.utils.setDomValid(false, Contacts.NAME_SELECTOR);
        break;
      case (isEmailTyped() && !isEmailValid()):
        window.utils.setDomValid(true, Contacts.NAME_SELECTOR);
        window.utils.setDomValid(false, Contacts.EMAIL_SELECTOR);
        break;
      default:
        resetContactsValidity();
    }

    function isNameValid() {
      var value = window.utils.getDomValue(document, Contacts.NAME_SELECTOR);
      var trimmed = window.utils.trimAll(value);
      return trimmed.length > 0;
    }

    function isEmailTyped() {
      var value = window.utils.getDomValue(document, Contacts.EMAIL_SELECTOR);
      var trimmed = window.utils.trimSpaces(value);
      return trimmed.length > 0;
    }

    function isEmailValid() {
      var value = window.utils.getDomValue(document, Contacts.EMAIL_SELECTOR);
      var se = /^[\w\.\-_]{1,}@[\w\.\-]{6,}/;
      return se.test(value);
    }
  }

  function resetContactsValidity() {
    window.utils.setDomValid(true, Contacts.NAME_SELECTOR);
    window.utils.setDomValid(true, Contacts.PHONE_SELECTOR);
    window.utils.setDomValid(true, Contacts.EMAIL_SELECTOR);
  }


  /*
   * Payment handler and checking
   */

  function paymentTypeHandler() {
    switch (true) {
      case (window.utils.isChecked(PAYMENT.CARD_LABEL_SELECTOR)):
        adjustFormForPayment('card');
        break;
      case (window.utils.isChecked(PAYMENT.CASH_LABEL_SELECTOR)):
        adjustFormForPayment('cash');
        break;
    }
  }

  function adjustFormForPayment(type) {
    if (type === 'card') {
      window.utils.showHtmlSelector(document, PAYMENT.CARD_FORM_SELECTOR);
      window.utils.hideHtmlSelector(document, PAYMENT.CASH_PAYMENT_MESSAGE_SELECTOR);
      setFieldsForCardPayment(true);
    } else {
      window.utils.hideHtmlSelector(document, PAYMENT.CARD_FORM_SELECTOR);
      window.utils.showHtmlSelector(document, PAYMENT.CASH_PAYMENT_MESSAGE_SELECTOR);
      setFieldsForCardPayment(false);
      resetCardValidity();
    }
  }

  function setFieldsForCardPayment(isToBeSet) {
    window.utils.setInputToBeRequired(isToBeSet, PAYMENT.CARD_NUMBER_INPUT_SELECTOR);
    window.utils.setHtmlTagAttribute(isToBeSet, 'minlength', PAYMENT.CARD_NUMBER_MIN_LENGTH, PAYMENT.CARD_NUMBER_INPUT_SELECTOR);
    window.utils.setHtmlTagAttribute(isToBeSet, 'maxlength', PAYMENT.CARD_NUMBER_MAX_LENGTH, PAYMENT.CARD_NUMBER_INPUT_SELECTOR);
    window.utils.blockInput(!isToBeSet, PAYMENT.CARD_NUMBER_INPUT_SELECTOR);

    window.utils.setInputToBeRequired(isToBeSet, PAYMENT.CARD_DATE_INPUT_SELECTOR);
    window.utils.setHtmlTagAttribute(isToBeSet, 'minlength', PAYMENT.CARD_DATE_MIN_LENGTH, PAYMENT.CARD_DATE_INPUT_SELECTOR);
    window.utils.setHtmlTagAttribute(isToBeSet, 'maxlength', PAYMENT.CARD_DATE_MAX_LENGTH, PAYMENT.CARD_DATE_INPUT_SELECTOR);
    window.utils.blockInput(!isToBeSet, PAYMENT.CARD_DATE_INPUT_SELECTOR);

    window.utils.setInputToBeRequired(isToBeSet, PAYMENT.CARD_CVC_INPUT_SELECTOR);
    window.utils.setHtmlTagAttribute(isToBeSet, 'minlength', PAYMENT.CARD_CVC_MIN_LENGTH, PAYMENT.CARD_CVC_INPUT_SELECTOR);
    window.utils.setHtmlTagAttribute(isToBeSet, 'maxlength', PAYMENT.CARD_CVC_MAX_LENGTH, PAYMENT.CARD_CVC_INPUT_SELECTOR);
    window.utils.blockInput(!isToBeSet, PAYMENT.CARD_CVC_INPUT_SELECTOR);

    window.utils.setInputToBeRequired(isToBeSet, PAYMENT.CARD_HOLDER_INPUT_SELECTOR);
    window.utils.setHtmlTagAttribute(isToBeSet, 'minlength', PAYMENT.CARD_HOLDER_MIN_WIDTH, PAYMENT.CARD_HOLDER_INPUT_SELECTOR);
    window.utils.blockInput(!isToBeSet, PAYMENT.CARD_HOLDER_INPUT_SELECTOR);
  }

  function paymentCheckHandler() {
    switch (true) {
      case (!window.utils.isChecked(PAYMENT.CARD_LABEL_SELECTOR)):
        resetCardValidity();
        break;
      case (!isCardNumberValid()):
        window.utils.setDomValid(false, PAYMENT.CARD_NUMBER_INPUT_SELECTOR);
        window.utils.setDomTextContent(document, PAYMENT.CARD_VALIDITY_SELECTOR, PAYMENT.CARD_INVALID_MESSAGE);
        break;
      case (!isCardDateValid()):
        window.utils.setDomValid(true, PAYMENT.CARD_NUMBER_INPUT_SELECTOR);
        window.utils.setDomValid(false, PAYMENT.CARD_DATE_INPUT_SELECTOR);
        window.utils.setDomTextContent(document, PAYMENT.CARD_VALIDITY_SELECTOR, PAYMENT.CARD_INVALID_MESSAGE);
        break;
      case (!isCardCvcValid()):
        window.utils.setDomValid(true, PAYMENT.CARD_NUMBER_INPUT_SELECTOR);
        window.utils.setDomValid(true, PAYMENT.CARD_DATE_INPUT_SELECTOR);
        window.utils.setDomValid(false, PAYMENT.CARD_CVC_INPUT_SELECTOR);
        window.utils.setDomTextContent(document, PAYMENT.CARD_VALIDITY_SELECTOR, PAYMENT.CARD_INVALID_MESSAGE);
        break;
      case (!isCardholderNameValid()):
        window.utils.setDomValid(true, PAYMENT.CARD_NUMBER_INPUT_SELECTOR);
        window.utils.setDomValid(true, PAYMENT.CARD_DATE_INPUT_SELECTOR);
        window.utils.setDomValid(true, PAYMENT.CARD_CVC_INPUT_SELECTOR);
        window.utils.setDomValid(false, PAYMENT.CARD_HOLDER_INPUT_SELECTOR);
        window.utils.setDomTextContent(document, PAYMENT.CARD_VALIDITY_SELECTOR, PAYMENT.CARD_INVALID_MESSAGE);
        break;
      default:
        window.utils.setDomTextContent(document, PAYMENT.CARD_VALIDITY_SELECTOR, PAYMENT.CARD_VALID_MESSAGE);
        resetCardValidity();
    }

    function isCardNumberValid() {
      var cardNumber = window.utils.getDomValue(document, PAYMENT.CARD_NUMBER_INPUT_SELECTOR);
      return window.utils.isLuhnChecked(cardNumber);
    }

    function isCardDateValid() {
      var cardDate = window.utils.getDomValue(document, PAYMENT.CARD_DATE_INPUT_SELECTOR);
      return window.utils.isCardDateChecked(cardDate);
    }

    function isCardCvcValid() {
      var cvc = window.utils.getDomValue(document, PAYMENT.CARD_CVC_INPUT_SELECTOR);
      return window.utils.isCvcChecked(cvc);
    }

    function isCardholderNameValid() {
      var cardholder = window.utils.getDomValue(document, PAYMENT.CARD_HOLDER_INPUT_SELECTOR);
      return window.utils.isCacrdholderNameChecked(cardholder);
    }
  }

  function resetCardValidity() {
    window.utils.setDomValid(true, PAYMENT.CARD_NUMBER_INPUT_SELECTOR);
    window.utils.setDomValid(true, PAYMENT.CARD_DATE_INPUT_SELECTOR);
    window.utils.setDomValid(true, PAYMENT.CARD_CVC_INPUT_SELECTOR);
    window.utils.setDomValid(true, PAYMENT.CARD_HOLDER_INPUT_SELECTOR);
  }

  function setContactsToBeRequired(isToBeSet) {
    window.utils.setInputToBeRequired(isToBeSet, Contacts.NAME_SELECTOR);
    window.utils.setHtmlTagAttribute(isToBeSet, 'minlength', Contacts.NAME_MIN_LENGTH, Contacts.NAME_SELECTOR);

    window.utils.setInputToBeRequired(isToBeSet, Contacts.PHONE_SELECTOR);
    window.utils.setHtmlTagAttribute(isToBeSet, 'minlength', Contacts.PHONE_MIN_LENGTH, Contacts.PHONE_SELECTOR);
    window.utils.setHtmlTagAttribute(isToBeSet, 'maxlength', Contacts.PHONE_MAX_LENGTH, Contacts.PHONE_SELECTOR);
  }


  /*
   * Delivery handler and checking
   */

  function deliveryTypeHandler() {
    switch (true) {
      case (window.utils.isChecked(Delivery.BY_COURIER_SELECTOR)):
        adjustFormForDelivery('courier');
        break;
      case (window.utils.isChecked(Delivery.SELF_TAKE_OUT_SELECTOR)):
        adjustFormForDelivery('takeout');
        break;
    }
  }

  function adjustFormForDelivery(type) {
    if (type === 'courier') {
      window.utils.hideHtmlSelector(document, Delivery.Store.MAIN_SELECTOR);
      window.utils.showHtmlSelector(document, Delivery.Courier.MAIN_SELECTOR);

      window.utils.setInputToBeRequired(true, Delivery.Courier.STREET_SELECTOR);
      window.utils.setInputToBeRequired(true, Delivery.Courier.HOUSE_SELECTOR);
      window.utils.setInputToBeRequired(true, Delivery.Courier.ROOM_SELECTOR);

    } else {
      window.utils.hideHtmlSelector(document, Delivery.Courier.MAIN_SELECTOR);
      window.utils.showHtmlSelector(document, Delivery.Store.MAIN_SELECTOR);

      window.utils.setInputToBeRequired(false, Delivery.Courier.STREET_SELECTOR);
      window.utils.setInputToBeRequired(false, Delivery.Courier.HOUSE_SELECTOR);
      window.utils.setInputToBeRequired(false, Delivery.Courier.ROOM_SELECTOR);

      resetContactsValidity();
    }
  }

  function deliveryCheckHandler() {
    switch (true) {
      case (!window.utils.isChecked(Delivery.BY_COURIER_SELECTOR)):
        resetDeliveryValidity();
        break;
      case (!isStreetValid()):
        window.utils.setDomValid(false, Delivery.Courier.STREET_SELECTOR);
        break;
      case (!isHouseValid()):
        window.utils.setDomValid(true, Delivery.Courier.STREET_SELECTOR);
        window.utils.setDomValid(false, Delivery.Courier.HOUSE_SELECTOR);
        break;
      case (isFloorTyped() && !isFloorValid()):
        window.utils.setDomValid(true, Delivery.Courier.STREET_SELECTOR);
        window.utils.setDomValid(true, Delivery.Courier.HOUSE_SELECTOR);
        window.utils.setDomValid(false, Delivery.Courier.FLOOR_SELECTOR);
        break;
      default:
        resetDeliveryValidity();
    }

    function isStreetValid() {
      var value = window.utils.getDomValue(document, Delivery.Courier.STREET_SELECTOR);
      var noFillings = window.utils.trimSpaces(value);
      return noFillings.length > 0;
    }

    function isHouseValid() {
      var value = window.utils.getDomValue(document, Delivery.Courier.HOUSE_SELECTOR);
      var noFillings = window.utils.trimSpaces(value);
      return noFillings.length > 0;
    }

    function isFloorTyped() {
      var value = window.utils.getDomValue(document, Delivery.Courier.FLOOR_SELECTOR);
      return value.length > 0;
    }

    function isFloorValid() {
      var value = window.utils.getDomValue(document, Delivery.Courier.FLOOR_SELECTOR);
      return window.utils.isNumber(value);
    }
  }

  function resetDeliveryValidity() {
    window.utils.setDomValid(true, Delivery.Courier.STREET_SELECTOR);
    window.utils.setDomValid(true, Delivery.Courier.HOUSE_SELECTOR);
    window.utils.setDomValid(true, Delivery.Courier.FLOOR_SELECTOR);
    window.utils.setDomValid(true, Delivery.Courier.ROOM_SELECTOR);
  }


  /*
   *
   */

  function filterHandler(evt) {
    switch (true) {
      case (evt.target.classList.contains(Filter.RANGE_MIN_BTN_CLASS)):
        updateSliderPositionValue();
        break;

      case (evt.target.classList.contains(Filter.RANGE_MAX_BTN_CLASS)):
        updateSliderPositionValue();
        break;
    }
  }


  /*
   *
   */

  function updateSliderPositionValue() {
    var minSliderValue = getMinSliderValue();
    var maxSliderValue = getMaxSliderValue();
    window.utils.setDomTextContent(document, Filter.MIN_RANGE_BTN_TEXT_SELECTOR, minSliderValue);
    window.utils.setDomTextContent(document, Filter.MAX_RANGE_BTN_TEXT_SELECTOR, maxSliderValue);

    function getMinSliderValue() {
      var parentWidth = window.utils.getHtmlSelectorWidth(Filter.RANGE_BTN_PARENT_SELECTOR);
      var width = window.utils.getHtmlClassLeftProperty(Filter.RANGE_MIN_BTN_CLASS);
      return window.utils.intPercent(parentWidth, width);
    }

    function getMaxSliderValue() {
      var parentWidth = window.utils.getHtmlSelectorWidth(Filter.RANGE_BTN_PARENT_SELECTOR);
      var width = window.utils.getHtmlClassRightProperty(Filter.RANGE_MAX_BTN_CLASS);
      return window.utils.intPercent(parentWidth, parentWidth - width);
    }
  }

})();
