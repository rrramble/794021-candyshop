'use strict';

/*
 * Miscelaneous not task-oriented functions
 */

(function () {

  var SELECTOR_HIDDEN = '.visually-hidden';

  var Card = {
    NUMBER_LENGTHS: [16, 17, 18, 19],
    MIN_YEAR: 18,
    MAX_YEAR: 99,
    MIN_MONTH: 1,
    MAX_MONTH: 12,
    MIN_CVC: 100,
    MAX_CVC: 999,
    HOLDER_MIN_LENGTH: 1,
    HOLDER_MAX_LENGTH: 200
  };

  var Text = {
    INCORRECT_DATA: 'Некорректные данные'
  };

  // Thanks to https://emailregex.com/
  var EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  var HttpCode = {
    successCodes: [200, 201, 202, 203, 204, 205, 206, 207, 208, 226],
    isSuccess: function (code) {
      return this.successCodes.includes(parseInt(code, 10));
    }
  };

  var isEven = function (a) {
    return a % 2 === 0;
  };

  var sum = function (a, b) {
    return b ? a + b : a;
  };

  var getDomObjectsByClassName = function (objectClass) {
    var domId = window.utils.convertHtmlClassToHtmlSelector(objectClass);
    var domObjects = document.querySelectorAll(domId);
    return domObjects;
  };

  var removeCssClass = function (objectClass, classToBeRemoved) {
    var domObjects = window.utils.getDomObjectsByClassName(objectClass);
    domObjects.forEach(function (domObject) {
      domObject.classList.remove(classToBeRemoved);
    });
  };

  var addCssClass = function (objectClass, classToBeAdded) {
    var domObjects = window.utils.getDomObjectsByClassName(objectClass);
    domObjects.forEach(function (domObject) {
      domObject.classList.add(classToBeAdded);
    });
  };

  var showHtmlSelector = function (node, htmlSelector) {
    var el = window.utils.querySelectorIncludingSelf(node, htmlSelector);
    var className = window.utils.convertHtmlSelectorToHtmlClass(SELECTOR_HIDDEN);
    el.classList.remove(className);
  };

  var hideHtmlSelector = function (node, htmlSelector) {
    var el = window.utils.querySelectorIncludingSelf(node, htmlSelector);
    var className = window.utils.convertHtmlSelectorToHtmlClass(SELECTOR_HIDDEN);
    el.classList.add(className);
  };

  var convertHtmlClassToHtmlSelector = function (htmlClass) {
    return '.' + htmlClass;
  };

  var convertHtmlSelectorToHtmlClass = function (htmlSelector) {
    return htmlSelector.slice(1);
  };

  var querySelectorIncludingSelf = function (dom, selector) {
    var classes = dom.classList;
    if (classes) {
      var className = window.utils.convertHtmlSelectorToHtmlClass(selector);
      if (classes.contains(className)) {
        return dom;
      }
    }
    return dom.querySelector(selector);
  };

  var isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  var isChecked = function (htmlSelector, node) {
    var baseNode = node ? node : document;
    var result = baseNode.querySelector(htmlSelector).checked;
    return result;
  };

  var isHtmlIdChecked = function (htmlId, node) {
    var baseNode = node ? node : document;
    var selector = window.utils.convertHtmlIdToHtmlSelector(htmlId);
    var result = baseNode.querySelector(selector).checked;
    return result;
  };

  var setInputHtmlIdCheck = function (htmlId, shouldBeSet) {
    var htmlSelector = window.utils.convertHtmlIdToHtmlSelector(htmlId);
    document.querySelector(htmlSelector).checked = shouldBeSet;
  };

  var convertHtmlIdToHtmlSelector = function (id) {
    return '#' + id;
  };

  var isInRange = function (value, from, to) {
    return (value >= from && value < to);
  };

  var isInRangeUpTo = function (value, from, to) {
    return (value >= from && value <= to);
  };

  var setWithinRange = function (value, from, upTo) {
    if (value < from) {
      return from;
    }
    return value > upTo ? upTo : value;
  };

  var setDomId = function (node, htmlSelector, data) {
    var subNode = window.utils.querySelectorIncludingSelf(node, htmlSelector);
    subNode.id = data;
  };

  var setDomTextContent = function (node, htmlSelector, data) {
    var subNode = window.utils.querySelectorIncludingSelf(node, htmlSelector);
    subNode.textContent = data;
  };

  var getDomTextContent = function (node, htmlSelector) {
    var subNode = window.utils.querySelectorIncludingSelf(node, htmlSelector);
    return subNode.textContent;
  };

  var setDomImage = function (node, htmlSelector, imageUrl, imageAlt) {
    var subNode = window.utils.querySelectorIncludingSelf(node, htmlSelector);
    subNode.src = imageUrl ? imageUrl : '';
    subNode.alt = imageAlt ? imageAlt : '';
  };

  var setDomNodeImage = function (baseNode, imageUrl, imageAlt) {
    baseNode.src = imageUrl ? imageUrl : '';
    baseNode.alt = imageAlt ? imageAlt : '';
  };

  var setDomValue = function (node, selector, data) {
    var subNode = window.utils.querySelectorIncludingSelf(node, selector);
    subNode.value = data;
  };

  var getDomValue = function (node, selector) {
    var subNode = window.utils.querySelectorIncludingSelf(node, selector);
    return subNode.value;
  };

  var setDomName = function (node, selector, data) {
    var subNode = window.utils.querySelectorIncludingSelf(node, selector);
    subNode.name = data;
  };

  var replaceDomItem = function (mainDomObject, oldChildSelector, newChildNode) {
    var baseNode = mainDomObject ? mainDomObject : document;
    var oldChildNode = baseNode.querySelector(oldChildSelector);
    if (!oldChildNode) {
      return;
    }
    var parentNode = oldChildNode.parentNode;
    parentNode.replaceChild(newChildNode, oldChildNode);
  };

  var setDomEventHandler = function (domNode, htmlSelector, cb, type) {
    var node = domNode.querySelector(htmlSelector);
    node.addEventListener(type, cb);
  };

  var removeFirstDomSelector = function (selector, domNode) {
    var baseNode = domNode ? domNode : document;
    var node = baseNode.querySelector(selector);
    if (node) {
      node.remove();
    }
  };

  var isLuhnChecked = function (cardNumber) {
    var noSpaces = window.utils.trimAll(cardNumber.toString());
    if (!Card.NUMBER_LENGTHS.includes(noSpaces.length)) {
      return false;
    }
    var numbers = noSpaces.split('');
    var semiDoubled = numbers.map(calculateLuhnSemiDouble);
    var total = semiDoubled.reduce(window.utils.sum, 0);
    return (total % 10 === 0);
  };

  var calculateLuhnSemiDouble = function (char, index) {
    var digit = parseInt(char, 10);
    if (window.utils.isEven(index)) {
      var digitDoubled = digit * 2;
      digit = digitDoubled > 9 ? digitDoubled - 9 : digitDoubled;
    }
    return digit;
  };

  var isCardDateChecked = function (cardDate) {
    var noFillings = window.utils.trimSpaces(cardDate);
    var month = noFillings.slice(0, 2);
    var divider = noFillings.slice(2, 3);
    var year = noFillings.slice(3);
    return window.utils.isInRangeUpTo(month, Card.MIN_MONTH, Card.MAX_MONTH) &&
      window.utils.isInRangeUpTo(year, Card.MIN_YEAR, Card.MAX_YEAR) &&
      !window.utils.isNumber(divider);
  };

  var isCvcChecked = function (cvc) {
    var noFillings = window.utils.trimAll(cvc) / 1;
    var number = noFillings.toFixed(0);
    return window.utils.isInRangeUpTo(number, Card.MIN_CVC, Card.MAX_CVC);
  };

  var isCardholderNameChecked = function (fullName) {
    var noFillings = window.utils.trimAll(fullName);
    return window.utils.isInRangeUpTo(noFillings.length,
        Card.HOLDER_MIN_LENGTH, Card.HOLDER_MAX_LENGTH
    );
  };

  var trimAll = function (s) {
    var noSpaces = s.replace(/\s/g, '');
    var noFillings = noSpaces.replace('.', '').replace('-', '').replace('_', '');
    return noFillings;
  };

  var trimSpaces = function (s) {
    var noSpaces = s.replace(/\s/g, '');
    return noSpaces;
  };

  var omitPx = function (px) {
    return parseFloat(px.toString());
  };

  var getDomNodeLeftProperty = function (domNode) {
    var propertyPx = window.getComputedStyle(domNode).getPropertyValue('left');
    return window.utils.omitPx(propertyPx);
  };

  var getDomNodeRightProperty = function (domNode) {
    var propertyPx = window.getComputedStyle(domNode).getPropertyValue('right');
    return window.utils.omitPx(propertyPx);
  };

  var setDomNodeLeftProperty = function (node, value) {
    node.style.left = value + 'px';
  };

  var setDomNodeRightProperty = function (node, value) {
    node.style.right = value + 'px';
  };

  var calculateIntPercent = function (base, part) {
    var percent = base === 0 ? 0 : part / base * 100;
    percent = window.utils.setWithinRange(percent, 0, 100);
    return percent.toFixed(0);
  };

  var convertPercentToIntWithinRange = function (percent, min, max) {
    var value = (max - min) * percent / 100 + min;
    value = window.utils.setWithinRange(value, min, max);
    return value.toFixed(0);
  };

  var disableHtmlSelector = function (shoudBeDisabled, selector, node) {
    var baseNode = node ? node : document;
    baseNode.querySelector(selector).disabled = shoudBeDisabled;
  };

  var disableHtmlId = function (shouldBeBlocked, htmlId, node) {
    var baseNode = node ? node : document;
    var selector = window.utils.convertHtmlIdToHtmlSelector(htmlId);
    var childNode = baseNode.querySelector(selector);
    childNode.disabled = shouldBeBlocked;
  };

  var isHtmlIdInputDisabled = function (htmlId, node) {
    var baseNode = node ? node : document;
    var selector = window.utils.convertHtmlIdToHtmlSelector(htmlId);
    return baseNode.querySelector(selector).disabled;
  };

  var isHtmlSelectorDisabled = function (htmlSelector, node) {
    var baseNode = node ? node : document;
    return baseNode.querySelector(htmlSelector).disabled;
  };

  var setInputToBeRequired = function (isToBeRequired, selector, node) {
    var baseNode = node ? node : document;
    baseNode.querySelector(selector).required = isToBeRequired;
  };

  var setDomValid = function (shouldBeValid, selector, node) {
    var baseNode = node ? node : document;
    var childNode = baseNode.querySelector(selector);
    if (shouldBeValid) {
      childNode.setCustomValidity('');
    } else {
      childNode.setCustomValidity('Некорретные данные');
    }
  };

  var setDomNodeValidity = function (shouldBeValid, baseNode) {
    var text = shouldBeValid ? '' : Text.INCORRECT_DATA;
    baseNode.setCustomValidity(text);
  };

  var setHtmlTagAttribute = function (shouldBeSet, parameter, value, selector, node) {
    var baseNode = node ? node : document;
    var childNode = baseNode.querySelector(selector);
    if (shouldBeSet) {
      childNode.setAttribute(parameter, value);
    } else {
      childNode.removeAttribute(parameter);
    }
  };

  var setDomNodeAttribute = function (shouldBeSet, parameter, value, baseNode) {
    if (shouldBeSet) {
      baseNode.setAttribute(parameter, value);
    } else {
      baseNode.removeAttribute(parameter);
    }
  };

  var blockInput = function (shouldBeBlocked, selector, node) {
    var baseNode = node ? node : document;
    var childNode = baseNode.querySelector(selector);
    childNode.disabled = shouldBeBlocked;
  };

  var getListMin = function (list) {
    var result = Math.min.apply(null, list);
    return result;
  };

  var getListMax = function (list) {
    var result = Math.max.apply(null, list);
    return result;
  };

  var isKeyInObjectOfList = function (key, list) {
    return list.some(function (item) {
      return key in item;
    });
  };

  var isClassIncludesKey = function (aClass, searchedKey) {
    return aClass.hasOwnProperty ?
      aClass.hasOwnProperty(searchedKey) :
      aClass.prototype.hasOwnProperty(searchedKey);
  };

  var isEmailValid = function (email) {
    return EMAIL_REGEX.test(email);
  };

  var _lastTimeout;
  var debounce = function (func, arg, intervalMilliseconds) {
    if (_lastTimeout) {
      window.clearTimeout(_lastTimeout);
    }
    _lastTimeout = window.setTimeout(func, arg, intervalMilliseconds);
  };


  // Exporting the functions

  window.utils = {
    getDomObjectsByClassName: getDomObjectsByClassName,
    removeCssClass: removeCssClass,
    addCssClass: addCssClass,
    convertHtmlSelectorToHtmlClass: convertHtmlSelectorToHtmlClass,
    showHtmlSelector: showHtmlSelector,
    hideHtmlSelector: hideHtmlSelector,
    convertHtmlClassToHtmlSelector: convertHtmlClassToHtmlSelector,
    querySelectorIncludingSelf: querySelectorIncludingSelf,
    isNumber: isNumber,

    isChecked: isChecked,
    isHtmlIdChecked: isHtmlIdChecked,
    setInputHtmlIdCheck: setInputHtmlIdCheck,
    convertHtmlIdToHtmlSelector: convertHtmlIdToHtmlSelector,
    isInRange: isInRange,
    isInRangeUpTo: isInRangeUpTo,
    setWithinRange: setWithinRange,

    setDomId: setDomId,
    setDomTextContent: setDomTextContent,
    getDomTextContent: getDomTextContent,

    setDomImage: setDomImage,
    setDomNodeImage: setDomNodeImage,
    setDomValue: setDomValue,
    getDomValue: getDomValue,

    setDomName: setDomName,
    replaceDomItem: replaceDomItem,
    setDomEventHandler: setDomEventHandler,
    removeFirstDomSelector: removeFirstDomSelector,

    isLuhnChecked: isLuhnChecked,
    isCardDateChecked: isCardDateChecked,
    isCvcChecked: isCvcChecked,
    isCardholderNameChecked: isCardholderNameChecked,
    isEven: isEven,
    sum: sum,
    trimAll: trimAll,
    trimSpaces: trimSpaces,
    omitPx: omitPx,

    getDomNodeLeftProperty: getDomNodeLeftProperty,
    getDomNodeRightProperty: getDomNodeRightProperty,
    setDomNodeLeftProperty: setDomNodeLeftProperty,
    setDomNodeRightProperty: setDomNodeRightProperty,

    calculateIntPercent: calculateIntPercent,
    convertPercentToIntWithinRange: convertPercentToIntWithinRange,

    disableHtmlSelector: disableHtmlSelector,
    isHtmlIdInputDisabled: isHtmlIdInputDisabled,
    isHtmlSelectorDisabled: isHtmlSelectorDisabled,
    disableHtmlId: disableHtmlId,

    setInputToBeRequired: setInputToBeRequired,
    setDomValid: setDomValid,
    setDomNodeValidity: setDomNodeValidity,
    setHtmlTagAttribute: setHtmlTagAttribute,
    setDomNodeAttribute: setDomNodeAttribute,

    blockInput: blockInput,
    getListMin: getListMin,
    getListMax: getListMax,
    isKeyInObjectOfList: isKeyInObjectOfList,

    debounce: debounce,
    isClassIncludesKey: isClassIncludesKey,
    isEmailValid: isEmailValid,

    HttpCode: HttpCode
  };

})();
