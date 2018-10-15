'use strict';

/*
 * Main module of the application
 */

(function () {

  var DEBOUNCE_TIME = 500;
  var ESC_KEY_CODE = 27;

  var GOODS_HTML_TEMPLATE_SELECTOR = '#card';
  var GOODS_HTML_SELECTOR = '.catalog__cards';

  var TROLLEY_HTML_TEMPLATE_SELECTOR = '#card-order';
  var TROLLEY_HTML_SELECTOR = '.goods__cards';


  var FilterForm = {
    MAIN_SELECTOR: '.catalog__sidebar form',
    SHOW_ALL_HTML_SELECTOR: '.catalog__submit',
  };

  var FilterRange = {
    MAIN_SELECTOR: '.range__filter'
  };


  var Order = {
    MAIN_SELECTOR: '.buy form',
    SUBMIT_BTN_SELECTOR: '.buy__submit-btn',
    MODAL_ERROR_SELECTOR: '.modal--error',
    MODAL_SUCCESS_SELECTOR: '.modal--success',
    MODAL_CLOSE_BUTTON_SELECTOR: '.modal__close',
    MODAL_HIDDEN_CLASS: 'modal--hidden'
  };

  var Contacts = {
    MAIN_SELECTOR: '.contact-data',

    NAME_DOM_NODE: document.querySelector('#contact-data__name'),
    NAME_MIN_LENGTH: 1,

    PHONE_DOM_NODE: document.querySelector('#contact-data__tel'),
    PHONE_MIN_LENGTH: 10,
    PHONE_MAX_LENGTH: 22,

    EMAIL_DOM_NODE: document.querySelector('#contact-data__email')
  };

  var Payment = {
    MAIN_SELECTOR: '.payment',
    METHOD_SELECTOR: '.payment__method',

    CARD_VALIDITY_SELECTOR: '.payment__card-status',
    CARD_VALID_MESSAGE: 'Одобрен',
    CARD_INVALID_MESSAGE: 'Не определён',

    CARD_FIELDS_MAIN_SELECTOR: '.payment__card-wrap',
    CARD_LABEL_SELECTOR: '.toggle-btn__input[value="card"]',
    CASH_LABEL_SELECTOR: '.toggle-btn__input[value="cash"]',
    CARD_FORM_SELECTOR: '.payment__card-wrap',

    CARD_NUMBER_INPUT_DOM_NODE: document.querySelector('#payment__card-number'),
    CARD_NUMBER_MIN_LENGTH: 16,
    CARD_NUMBER_MAX_LENGTH: 16,

    CARD_DATE_INPUT_DOM_NODE: document.querySelector('#payment__card-date'),
    CARD_DATE_MIN_LENGTH: 5,
    CARD_DATE_MAX_LENGTH: 5,

    CARD_CVC_INPUT_DOM_NODE: document.querySelector('#payment__card-cvc'),
    CARD_CVC_MIN_LENGTH: 3,
    CARD_CVC_MAX_LENGTH: 3,

    CARD_HOLDER_INPUT_DOM_NODE: document.querySelector('#payment__cardholder'),
    CARD_HOLDER_MIN_WIDTH: 1,

    CASH_PAYMENT_MESSAGE_SELECTOR: '.payment__cash-wrap'
  };

  var Delivery = {
    MAIN_SELECTOR: '.deliver',
    TYPE_SELECTOR: '.deliver__toggle',
    SELF_TAKE_OUT_ID: 'deliver__store',
    BY_COURIER_SELECTOR: '.toggle-btn__input[value="courier"]',

    Store: {
      MAIN_SELECTOR: '.deliver__store',
      LIST_OF_SUBWAYS_SELECTOR: '.deliver__stores',
      MAP_SELECTOR: '.deliver__store-map-img'
    },
    Map: {
      'store-academicheskaya': {
        'name': 'Академическая',
        'filename': 'academicheskaya.jpg'
      },
      'store-vasileostrovskaya': {
        'name': 'Василеостровская',
        'filename': 'vasileostrovskaya.jpg'
      },
      'store-rechka': {
        'name': 'Черная речка',
        'filename': 'rechka.jpg'
      },
      'store-petrogradskaya': {
        'name': 'Петроградская',
        'filename': 'petrogradskaya.jpg'
      },
      'store-proletarskaya': {
        'name': 'Пролетарская',
        'filename': 'proletarskaya.jpg'
      },
      'store-vostaniya': {
        'name': 'Площадь Восстания',
        'filename': 'vostaniya.jpg'
      },
      'store-prosvesheniya': {
        'name': 'Проспект Просвещения',
        'filename': 'prosvesheniya.jpg'
      },
      'store-frunzenskaya': {
        'name': 'Фрунзенская',
        'filename': 'frunzenskaya.jpg'
      },
      'store-chernishevskaya': {
        'name': 'Чернышевская',
        'filename': 'chernishevskaya.jpg'
      },
      'store-tehinstitute': {
        'name': 'Технологический институт',
        'filename': 'tehinstitute.jpg'
      }
    },
    MAP_PATH: 'img/map/',

    Courier: {
      MAIN_SELECTOR: '.deliver__courier',

      STREET_DOM_NODE: document.querySelector('#deliver__street'),
      HOUSE_DOM_NODE: document.querySelector('#deliver__house'),
      FLOOR_SELECTOR: '#deliver__floor',
      ROOM_SELECTOR: '#deliver__room'
    },

  };


  /*
   * Main code
   */

  window.Backend.get(downloadSuccessHandler, downloadUploadErrorHandler);
  return;

  /*
   * End of main code
   */


  var catalog;
  var trolley;
  var dom;
  var filterRange;

  function downloadSuccessHandler(data) {
    catalog = new window.Catalog(function () {
      return data;
    });
    trolley = new window.Trolley(catalog);

    dom = new window.Dom(
        catalog, GOODS_HTML_TEMPLATE_SELECTOR, GOODS_HTML_SELECTOR,
        trolley, TROLLEY_HTML_TEMPLATE_SELECTOR, TROLLEY_HTML_SELECTOR
    );
    dom.setFunctionOnTrolleyEmpty(blockAllFormFields);
    dom.setFunctionOnTrolleyNotEmpty(unblockAllFormFields);

    filterRange = new window.Filter.Range(catalog.getMinPrice(), catalog.getMaxPrice());
    setInterfaceHandlers();
  }

  function setInterfaceHandlers() {
    setFieldsForCardPayment(true);
    setContactsToBeRequired(true);
    deliveryTypeChangeHandler();

    window.utils.setDomEventHandler(
        document, FilterForm.MAIN_SELECTOR,
        filterInputChangeHandler,
        'change'
    );

    window.utils.setDomEventHandler(
        document, FilterForm.SHOW_ALL_HTML_SELECTOR,
        filterShowAllHandler,
        'click'
    );

    window.utils.setDomEventHandler(
        document, FilterRange.MAIN_SELECTOR,
        filterPriceRangeHandler,
        'mousedown'
    );

    document.querySelector(Contacts.MAIN_SELECTOR).
      addEventListener('change', contactsChangeHandler);

    window.utils.setDomEventHandler(
        document, Payment.METHOD_SELECTOR,
        paymentTypeChangeHandler,
        'click'
    );

    window.utils.setDomEventHandler(
        document, Payment.MAIN_SELECTOR,
        paymentInformationChangeHandler,
        'change'
    );

    window.utils.setDomEventHandler(
        document, Delivery.TYPE_SELECTOR,
        deliveryTypeChangeHandler,
        'change'
    );

    window.utils.setDomEventHandler(
        document, Delivery.Store.MAIN_SELECTOR,
        deliveryInformationChangeHandler,
        'change'
    );

    document.querySelector(Order.MAIN_SELECTOR).
      addEventListener('submit', formSubmitHandler);
  }


  /*
   * Overall order form checking
   */

  function filterInputChangeHandler(evt) {
    window.utils.debounce(function () {
      dom.filterFormHandler(evt);
    }, DEBOUNCE_TIME);
  }

  function filterShowAllHandler(evt) {
    evt.preventDefault();
    dom.filterFormHandler(evt, filterRange.reset.bind(filterRange));
  }

  function filterPriceRangeHandler(evt) {
    filterRange.mouseDownHandler(evt, dom.filterFormHandler.bind(dom));
  }

  function formSubmitHandler(evt) {
    evt.preventDefault();
    if (isTrolleyEmpty(trolley)) {
      return;
    }
    checkContacts();
    checkPaymentInformation();
    checkDeliveryInformation();

    window.Backend.put(makeOrderFormData(), uploadSuccessHandler, downloadUploadErrorHandler);
  }

  function makeOrderFormData() {
    return document.querySelector(Order.MAIN_SELECTOR);
  }

  function uploadSuccessHandler() {
    resetOrderForm();
    showModal(Order.MODAL_SUCCESS_SELECTOR);
  }

  function downloadUploadErrorHandler() {
    showModal(Order.MODAL_ERROR_SELECTOR);
  }

  function showModal(modalSelector) {
    var modalNode = document.querySelector(modalSelector);
    modalNode.classList.remove(Order.MODAL_HIDDEN_CLASS);
    var closeButtonNode = modalNode.querySelector(Order.MODAL_CLOSE_BUTTON_SELECTOR);
    closeButtonNode.addEventListener('click', closeModal);
    document.addEventListener('keydown', closeModal);

    function closeModal(evt) {
      if (evt.type === 'keydown' && evt.keyCode !== ESC_KEY_CODE) {
        return;
      }
      if (!evt.type === 'click') {
        return;
      }
      modalNode.classList.add(Order.MODAL_HIDDEN_CLASS);
      closeButtonNode.removeEventListener('click', closeModal);
      document.removeEventListener('keydown', closeModal);
    }
  }

  /*
   * Trolley contains goods checking
   */

  function isTrolleyEmpty(trolleyObject) {
    return trolleyObject.getCount() <= 0;
  }

  /*
   * Contacts handler and checking
   */

  function contactsChangeHandler(evt) {
    evt.preventDefault();
    checkContacts();
  }

  function checkContacts() {
    switch (true) {
      case (!isNameValid()):
        window.utils.setDomNodeValidity(false, Contacts.NAME_DOM_NODE);
        break;
      case (isEmailTyped() && !isEmailValid()):
        window.utils.setDomNodeValidity(true, Contacts.NAME_DOM_NODE);
        window.utils.setDomNodeValidity(false, Contacts.EMAIL_DOM_NODE);
        break;
      default:
        resetContactsValidity();
    }

    function isNameValid() {
      var value = Contacts.NAME_DOM_NODE.value;
      var trimmed = window.utils.trimAll(value);
      return trimmed.length > 0;
    }

    function isEmailTyped() {
      var value = Contacts.EMAIL_DOM_NODE.value;
      var trimmed = window.utils.trimSpaces(value);
      return trimmed.length > 0;
    }

    function isEmailValid() {
      var value = Contacts.EMAIL_DOM_NODE.value;
      return window.utils.isEmailValid(value);
    }
  }

  function resetContactsValidity() {
    window.utils.setDomNodeValidity(true, Contacts.NAME_DOM_NODE);
    window.utils.setDomNodeValidity(true, Contacts.PHONE_DOM_NODE);
    window.utils.setDomNodeValidity(true, Contacts.EMAIL_DOM_NODE);
  }

  function resetContactsValues() {
    Contacts.NAME_DOM_NODE.value = '';
    Contacts.PHONE_DOM_NODE.value = '';
    Contacts.EMAIL_DOM_NODE.value = '';
  }

  function resetCardValidity() {
    window.utils.setDomNodeValidity(true, Payment.CARD_NUMBER_INPUT_DOM_NODE);
    window.utils.setDomNodeValidity(true, Payment.CARD_DATE_INPUT_DOM_NODE);
    window.utils.setDomNodeValidity(true, Payment.CARD_CVC_INPUT_DOM_NODE);
    window.utils.setDomNodeValidity(true, Payment.CARD_HOLDER_INPUT_DOM_NODE);
  }

  function resetCardValues() {
    Payment.CARD_NUMBER_INPUT_DOM_NODE.value = '';
    Payment.CARD_DATE_INPUT_DOM_NODE.value = '';
    Payment.CARD_CVC_INPUT_DOM_NODE.value = '';
    Payment.CARD_HOLDER_INPUT_DOM_NODE.value = '';
  }

  function resetDeliveryValues() {
    Delivery.Courier.STREET_DOM_NODE.value = '';
    Delivery.Courier.HOUSE_DOM_NODE.value = '';
    window.utils.setDomValue(document, Delivery.Courier.FLOOR_SELECTOR, '');
    window.utils.setDomValue(document, Delivery.Courier.ROOM_SELECTOR, '');
  }

  function resetDeliveryValidity() {
    window.utils.setDomNodeValidity(true, Delivery.Courier.STREET_DOM_NODE);
    window.utils.setDomNodeValidity(true, Delivery.Courier.HOUSE_DOM_NODE);
    window.utils.setDomValid(true, Delivery.Courier.FLOOR_SELECTOR);
    window.utils.setDomValid(true, Delivery.Courier.ROOM_SELECTOR);
  }

  function resetOrderForm() {
    resetContactsValidity();
    resetContactsValues();
    resetCardValidity();
    resetCardValues();
    resetDeliveryValues();
    resetDeliveryValidity();
  }


  /*
   * Payment handler and checking
   */

  function paymentTypeChangeHandler() {
    switch (true) {
      case (window.utils.isChecked(Payment.CARD_LABEL_SELECTOR)):
        adjustFormForPaymentByCard(true);
        break;
      case (window.utils.isChecked(Payment.CASH_LABEL_SELECTOR)):
        adjustFormForPaymentByCard(false);
        break;
    }
  }

  function adjustFormForPaymentByCard(byCard) {
    if (!byCard) {
      window.utils.hideHtmlSelector(document, Payment.CARD_FORM_SELECTOR);
      window.utils.showHtmlSelector(document, Payment.CASH_PAYMENT_MESSAGE_SELECTOR);
      setFieldsForCardPayment(false);
      resetCardValidity();
    } else {
      window.utils.showHtmlSelector(document, Payment.CARD_FORM_SELECTOR);
      window.utils.hideHtmlSelector(document, Payment.CASH_PAYMENT_MESSAGE_SELECTOR);
      setFieldsForCardPayment(true);
    }
  }

  function setFieldsForCardPayment(isToBeSet) {
    if (isToBeSet && trolley.getCount() <= 0) {
      return;
    }

    // Setup card number
    Payment.CARD_NUMBER_INPUT_DOM_NODE.required = isToBeSet;
    Payment.CARD_NUMBER_INPUT_DOM_NODE.disabled = !isToBeSet;
    window.utils.setDomNodeAttribute(isToBeSet, 'minlength', Payment.CARD_NUMBER_MIN_LENGTH,
      Payment.CARD_NUMBER_INPUT_DOM_NODE
    );
    window.utils.setDomNodeAttribute(isToBeSet, 'maxlength', Payment.CARD_NUMBER_MAX_LENGTH,
      Payment.CARD_NUMBER_INPUT_DOM_NODE
    );

    // Setup card date
    Payment.CARD_DATE_INPUT_DOM_NODE.required = isToBeSet;
    Payment.CARD_DATE_INPUT_DOM_NODE.disabled = !isToBeSet;
    window.utils.setDomNodeAttribute(isToBeSet, 'minlength', Payment.CARD_DATE_MIN_LENGTH,
      Payment.CARD_DATE_INPUT_DOM_NODE
    );
    window.utils.setDomNodeAttribute(isToBeSet, 'maxlength', Payment.CARD_DATE_MAX_LENGTH,
      Payment.CARD_DATE_INPUT_DOM_NODE
    );

    // Setup card CVC
    Payment.CARD_CVC_INPUT_DOM_NODE.required = isToBeSet;
    Payment.CARD_CVC_INPUT_DOM_NODE.disabled = !isToBeSet;
    window.utils.setDomNodeAttribute(isToBeSet, 'minlength', Payment.CARD_CVC_MIN_LENGTH,
      Payment.CARD_CVC_INPUT_DOM_NODE
    );
    window.utils.setDomNodeAttribute(isToBeSet, 'maxlength', Payment.CARD_CVC_MAX_LENGTH,
      Payment.CARD_CVC_INPUT_DOM_NODE
    );

    // Setup cardholder name
    Payment.CARD_HOLDER_INPUT_DOM_NODE.required = isToBeSet;
    Payment.CARD_HOLDER_INPUT_DOM_NODE.disabled = !isToBeSet;
    window.utils.setDomNodeAttribute(isToBeSet, 'minlength', Payment.CARD_HOLDER_MIN_WIDTH,
      Payment.CARD_HOLDER_INPUT_DOM_NODE
    );
  }

  function paymentInformationChangeHandler() {
    checkPaymentInformation();
  }

  function checkPaymentInformation() {
    switch (true) {
      case (!window.utils.isChecked(Payment.CARD_LABEL_SELECTOR)):
        resetCardValidity();
        break;
      case (!isCardNumberValid()):
        window.utils.setDomNodeValidity(false, Payment.CARD_NUMBER_INPUT_DOM_NODE);
        window.utils.setDomTextContent(document, Payment.CARD_VALIDITY_SELECTOR, Payment.CARD_INVALID_MESSAGE);
        break;
      case (!isCardDateValid()):
        window.utils.setDomNodeValidity(true, Payment.CARD_NUMBER_INPUT_DOM_NODE);
        window.utils.setDomNodeValidity(false, Payment.CARD_DATE_INPUT_DOM_NODE);
        window.utils.setDomTextContent(document, Payment.CARD_VALIDITY_SELECTOR, Payment.CARD_INVALID_MESSAGE);
        break;
      case (!isCardCvcValid()):
        window.utils.setDomNodeValidity(true, Payment.CARD_NUMBER_INPUT_DOM_NODE);
        window.utils.setDomNodeValidity(true, Payment.CARD_DATE_INPUT_DOM_NODE);
        window.utils.setDomNodeValidity(false, Payment.CARD_CVC_INPUT_DOM_NODE);
        window.utils.setDomTextContent(document, Payment.CARD_VALIDITY_SELECTOR, Payment.CARD_INVALID_MESSAGE);
        break;
      case (!isCardholderNameValid()):
        window.utils.setDomNodeValidity(true, Payment.CARD_NUMBER_INPUT_DOM_NODE);
        window.utils.setDomNodeValidity(true, Payment.CARD_DATE_INPUT_DOM_NODE);
        window.utils.setDomNodeValidity(true, Payment.CARD_CVC_INPUT_DOM_NODE);
        window.utils.setDomNodeValidity(false, Payment.CARD_HOLDER_INPUT_DOM_NODE);
        window.utils.setDomTextContent(document, Payment.CARD_VALIDITY_SELECTOR, Payment.CARD_INVALID_MESSAGE);
        break;
      default:
        window.utils.setDomTextContent(document, Payment.CARD_VALIDITY_SELECTOR, Payment.CARD_VALID_MESSAGE);
        resetCardValidity();
    }

    function isCardNumberValid() {
      var cardNumber = Payment.CARD_NUMBER_INPUT_DOM_NODE.value;
      return window.utils.isLuhnChecked(cardNumber);
    }

    function isCardDateValid() {
      var cardDate = Payment.CARD_DATE_INPUT_DOM_NODE.value;
      return window.utils.isCardDateChecked(cardDate);
    }

    function isCardCvcValid() {
      var cvc = Payment.CARD_CVC_INPUT_DOM_NODE.value;
      return window.utils.isCvcChecked(cvc);
    }

    function isCardholderNameValid() {
      var cardholder = Payment.CARD_HOLDER_INPUT_DOM_NODE.value;
      return window.utils.isCacrdholderNameChecked(cardholder);
    }
  }

  function setContactsToBeRequired(isToBeSet) {
    Contacts.NAME_DOM_NODE.required = isToBeSet;
    window.utils.setDomNodeAttribute(isToBeSet, 'minlength', Contacts.NAME_MIN_LENGTH, Contacts.NAME_DOM_NODE);

    Contacts.PHONE_DOM_NODE.required = isToBeSet;
    window.utils.setDomNodeAttribute(isToBeSet, 'minlength', Contacts.PHONE_MIN_LENGTH, Contacts.PHONE_DOM_NODE);
    window.utils.setDomNodeAttribute(isToBeSet, 'maxlength', Contacts.PHONE_MAX_LENGTH, Contacts.PHONE_DOM_NODE);
  }


  /*
   * Delivery handler and checking
   */

  function deliveryTypeChangeHandler() {
    switch (true) {
      case (window.utils.isChecked(Delivery.BY_COURIER_SELECTOR)):
        adjustFormForDeliveryByCourier(true);
        break;
      case (isTakeoutSelected()):
        adjustFormForDeliveryByCourier(false);
        break;
    }
  }

  function adjustFormForDeliveryByCourier(byCourier) {
    Delivery.Courier.STREET_DOM_NODE.required = byCourier;
    Delivery.Courier.HOUSE_DOM_NODE.required = byCourier;
    window.utils.setInputToBeRequired(byCourier, Delivery.Courier.ROOM_SELECTOR);

    if (byCourier) {
      window.utils.hideHtmlSelector(document, Delivery.Store.MAIN_SELECTOR);
      window.utils.showHtmlSelector(document, Delivery.Courier.MAIN_SELECTOR);
    } else {
      window.utils.hideHtmlSelector(document, Delivery.Courier.MAIN_SELECTOR);
      window.utils.showHtmlSelector(document, Delivery.Store.MAIN_SELECTOR);
      resetDeliveryValidity();
    }

    if (byCourier && trolley.getCount() <= 0) {
      return;
    }
    Delivery.Courier.STREET_DOM_NODE.disabled = !byCourier;
    Delivery.Courier.HOUSE_DOM_NODE.disabled = !byCourier;
    window.utils.disableHtmlSelector(!byCourier, Delivery.Courier.ROOM_SELECTOR);
  }

  function deliveryInformationChangeHandler(evt) {
    evt.preventDefault();
    checkDeliveryInformation(evt);
  }

  function checkDeliveryInformation(evt) {
    switch (true) {
      case (!!evt && !!Delivery.Map[evt.srcElement.id]):
        setSubwayMap(evt);
        break;
      case (!isStreetValid()):
        window.utils.setDomNodeValidity(false, Delivery.Courier.STREET_DOM_NODE);
        break;
      case (!isHouseValid()):
        window.utils.setDomNodeValidity(true, Delivery.Courier.STREET_DOM_NODE);
        window.utils.setDomNodeValidity(false, Delivery.Courier.HOUSE_DOM_NODE);
        break;
      case (isFloorTyped() && !isFloorValid()):
        window.utils.setDomNodeValidity(true, Delivery.Courier.STREET_DOM_NODE);
        window.utils.setDomNodeValidity(true, Delivery.Courier.HOUSE_DOM_NODE);
        window.utils.setDomValid(false, Delivery.Courier.FLOOR_SELECTOR);
        break;
      default:
        resetDeliveryValidity();
    }

    function isStreetValid() {
      var value = Delivery.Courier.STREET_DOM_NODE.value;
      var noFillings = window.utils.trimSpaces(value);
      return noFillings.length > 0;
    }

    function isHouseValid() {
      var value = Delivery.Courier.HOUSE_DOM_NODE.value;
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

  function isTakeoutSelected() {
    return window.utils.isHtmlIdChecked(Delivery.SELF_TAKE_OUT_ID);
  }

  function setSubwayMap(evt) {
    var htmlId = evt.srcElement.id;
    var altText = Delivery.Map[htmlId].name;
    var fileName = Delivery.Map[htmlId].filename;
    var mapFullUrl = Delivery.MAP_PATH + fileName;
    window.utils.setDomImage(document, Delivery.Store.MAP_SELECTOR, mapFullUrl, altText);
  }

  function blockAllFormFields() {
    disableAllFormFields(true);
  }

  function unblockAllFormFields() {
    disableAllFormFields(false);
    paymentTypeChangeHandler();
  }

  function disableAllFormFields(shouldBeDisabled) {
    Contacts.NAME_DOM_NODE.disabled = shouldBeDisabled;
    Contacts.PHONE_DOM_NODE.disabled = shouldBeDisabled;
    Contacts.EMAIL_DOM_NODE.disabled = shouldBeDisabled;

    Payment.CARD_NUMBER_INPUT_DOM_NODE.disabled = shouldBeDisabled;
    Payment.CARD_DATE_INPUT_DOM_NODE.disabled = shouldBeDisabled;
    Payment.CARD_CVC_INPUT_DOM_NODE.disabled = shouldBeDisabled;
    Payment.CARD_HOLDER_INPUT_DOM_NODE.disabled = shouldBeDisabled;

    Delivery.Courier.STREET_DOM_NODE.disabled = shouldBeDisabled;
    Delivery.Courier.HOUSE_DOM_NODE.disabled = shouldBeDisabled;
    window.utils.blockInput(shouldBeDisabled, Delivery.Courier.FLOOR_SELECTOR);
    window.utils.blockInput(shouldBeDisabled, Delivery.Courier.ROOM_SELECTOR);
  }

})();
