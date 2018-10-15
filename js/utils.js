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
    isCacrdholderNameChecked: isCacrdholderNameChecked,
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

  function getDomObjectsByClassName(objectClass) {
    var domId = window.utils.convertHtmlClassToHtmlSelector(objectClass);
    var domObjects = document.querySelectorAll(domId);
    return domObjects;
  }

  function removeCssClass(objectClass, classToBeRemoved) {
    var domObjects = window.utils.getDomObjectsByClassName(objectClass);
    domObjects.forEach(function (domObject) {
      domObject.classList.remove(classToBeRemoved);
    });
  }

  function addCssClass(objectClass, classToBeAdded) {
    var domObjects = window.utils.getDomObjectsByClassName(objectClass);
    domObjects.forEach(function (domObject) {
      domObject.classList.add(classToBeAdded);
    });
  }

  function showHtmlSelector(node, htmlSelector) {
    var el = window.utils.querySelectorIncludingSelf(node, htmlSelector);
    var className = window.utils.convertHtmlSelectorToHtmlClass(SELECTOR_HIDDEN);
    el.classList.remove(className);
  }

  function hideHtmlSelector(node, htmlSelector) {
    var el = window.utils.querySelectorIncludingSelf(node, htmlSelector);
    var className = window.utils.convertHtmlSelectorToHtmlClass(SELECTOR_HIDDEN);
    el.classList.add(className);
  }

  function convertHtmlClassToHtmlSelector(htmlClass) {
    return '.' + htmlClass;
  }

  function convertHtmlSelectorToHtmlClass(htmlSelector) {
    return htmlSelector.slice(1);
  }

  function querySelectorIncludingSelf(dom, selector) {
    var classes = dom.classList;
    if (classes) {
      var className = window.utils.convertHtmlSelectorToHtmlClass(selector);
      if (classes.contains(className)) {
        return dom;
      }
    }
    return dom.querySelector(selector);
  }

  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function isChecked(htmlSelector, node) {
    var baseNode = node ? node : document;
    var result = baseNode.querySelector(htmlSelector).checked;
    return result;
  }

  function isHtmlIdChecked(htmlId, node) {
    var baseNode = node ? node : document;
    var selector = window.utils.convertHtmlIdToHtmlSelector(htmlId);
    var result = baseNode.querySelector(selector).checked;
    return result;
  }

  function setInputHtmlIdCheck(htmlId, shouldBeSet) {
    var htmlSelector = window.utils.convertHtmlIdToHtmlSelector(htmlId);
    document.querySelector(htmlSelector).checked = shouldBeSet;
  }

  function convertHtmlIdToHtmlSelector(id) {
    return '#' + id;
  }

  function isInRange(value, from, to) {
    return (value >= from && value < to);
  }

  function isInRangeUpTo(value, from, to) {
    return (value >= from && value <= to);
  }

  function setWithinRange(value, from, upTo) {
    if (value < from) {
      return from;
    }
    return value > upTo ? upTo : value;
  }

  function setDomId(node, htmlSelector, data) {
    var subNode = window.utils.querySelectorIncludingSelf(node, htmlSelector);
    subNode.id = data;
  }

  function setDomTextContent(node, htmlSelector, data) {
    var subNode = window.utils.querySelectorIncludingSelf(node, htmlSelector);
    subNode.textContent = data;
  }

  function getDomTextContent(node, htmlSelector) {
    var subNode = window.utils.querySelectorIncludingSelf(node, htmlSelector);
    return subNode.textContent;
  }

  function setDomImage(node, htmlSelector, imageUrl, imageAlt) {
    var subNode = window.utils.querySelectorIncludingSelf(node, htmlSelector);
    subNode.src = imageUrl ? imageUrl : '';
    subNode.alt = imageAlt ? imageAlt : '';
  }

  function setDomNodeImage(baseNode, imageUrl, imageAlt) {
    baseNode.src = imageUrl ? imageUrl : '';
    baseNode.alt = imageAlt ? imageAlt : '';
  }

  function setDomValue(node, selector, data) {
    var subNode = window.utils.querySelectorIncludingSelf(node, selector);
    subNode.value = data;
  }

  function getDomValue(node, selector) {
    var subNode = window.utils.querySelectorIncludingSelf(node, selector);
    return subNode.value;
  }

  function setDomName(node, selector, data) {
    var subNode = window.utils.querySelectorIncludingSelf(node, selector);
    subNode.name = data;
  }

  function replaceDomItem(mainDomObject, oldChildSelector, newChildNode) {
    var baseNode = mainDomObject ? mainDomObject : document;
    var oldChildNode = baseNode.querySelector(oldChildSelector);
    if (!oldChildNode) {
      return;
    }
    var parentNode = oldChildNode.parentNode;
    parentNode.replaceChild(newChildNode, oldChildNode);
  }

  function setDomEventHandler(domNode, htmlSelector, cb, type) {
    var node = domNode.querySelector(htmlSelector);
    node.addEventListener(type, cb);
  }

  function removeFirstDomSelector(selector, domNode) {
    var baseNode = domNode ? domNode : document;
    var node = baseNode.querySelector(selector);
    if (node) {
      node.remove();
    }
  }

  function isLuhnChecked(cardNumber) {
    var noSpaces = window.utils.trimAll(cardNumber.toString());
    if (!Card.NUMBER_LENGTHS.includes(noSpaces.length)) {
      return false;
    }
    var numbers = noSpaces.split('');
    var semiDoubled = numbers.map(calculateLuhnSemiDouble);
    var total = semiDoubled.reduce(window.utils.sum, 0);
    return (total % 10 === 0);
  }

  function calculateLuhnSemiDouble(char, index) {
    var digit = parseInt(char, 10);
    if (window.utils.isEven(index)) {
      var digitDoubled = digit * 2;
      digit = digitDoubled > 9 ? digitDoubled - 9 : digitDoubled;
    }
    return digit;
  }

  function isCardDateChecked(cardDate) {
    var noFillings = window.utils.trimSpaces(cardDate);
    var month = noFillings.slice(0, 2);
    var divider = noFillings.slice(2, 3);
    var year = noFillings.slice(3);
    return window.utils.isInRangeUpTo(month, Card.MIN_MONTH, Card.MAX_MONTH) &&
      window.utils.isInRangeUpTo(year, Card.MIN_YEAR, Card.MAX_YEAR) &&
      !window.utils.isNumber(divider);
  }

  function isCvcChecked(cvc) {
    var noFillings = window.utils.trimAll(cvc) / 1;
    var number = noFillings.toFixed(0);
    return window.utils.isInRangeUpTo(number, Card.MIN_CVC, Card.MAX_CVC);
  }

  function isCacrdholderNameChecked(fullName) {
    var noFillings = window.utils.trimAll(fullName);
    return window.utils.isInRangeUpTo(noFillings.length,
      Card.HOLDER_MIN_LENGTH, Card.HOLDER_MAX_LENGTH
    );
  }

  function isEven(a) {
    return a % 2 === 0;
  }

  function sum(a, b) {
    return b ? a + b : a;
  }

  function trimAll(s) {
    var noSpaces = s.replace(/\s/g, '');
    var noFillings = noSpaces.replace('.', '').replace('-', '').replace('_', '');
    return noFillings;
  }

  function trimSpaces(s) {
    var noSpaces = s.replace(/\s/g, '');
    return noSpaces;
  }

  function omitPx(px) {
    return parseFloat(px.toString());
  }

  function getDomNodeLeftProperty(domNode) {
    var propertyPx = window.getComputedStyle(domNode).getPropertyValue('left');
    return window.utils.omitPx(propertyPx);
  }

  function getDomNodeRightProperty(domNode) {
    var propertyPx = window.getComputedStyle(domNode).getPropertyValue('right');
    return window.utils.omitPx(propertyPx);
  }

  function setDomNodeLeftProperty(node, value) {
    node.style.left = value + 'px';
  }

  function setDomNodeRightProperty(node, value) {
    node.style.right = value + 'px';
  }

  function calculateIntPercent(base, part) {
    var percent = base === 0 ? 0 : part / base * 100;
    percent = window.utils.setWithinRange(percent, 0, 100);
    return percent.toFixed(0);
  }

  function convertPercentToIntWithinRange(percent, min, max) {
    var value = (max - min) * percent / 100 + min;
    value = window.utils.setWithinRange(value, min, max);
    return value.toFixed(0);
  }

  function disableHtmlSelector(shoudBeDisabled, selector, node) {
    var baseNode = node ? node : document;
    baseNode.querySelector(selector).disabled = shoudBeDisabled;
  }

  function disableHtmlId(shouldBeBlocked, htmlId, node) {
    var baseNode = node ? node : document;
    var selector = window.utils.convertHtmlIdToHtmlSelector(htmlId);
    var childNode = baseNode.querySelector(selector);
    childNode.disabled = shouldBeBlocked;
  }

  function isHtmlIdInputDisabled(htmlId, node) {
    var baseNode = node ? node : document;
    var selector = window.utils.convertHtmlIdToHtmlSelector(htmlId);
    return baseNode.querySelector(selector).disabled;
  }

  function isHtmlSelectorDisabled(htmlSelector, node) {
    var baseNode = node ? node : document;
    return baseNode.querySelector(htmlSelector).disabled;
  }

  function setInputToBeRequired(isToBeRequired, selector, node) {
    var baseNode = node ? node : document;
    baseNode.querySelector(selector).required = isToBeRequired;
  }

  function setDomValid(shouldBeValid, selector, node) {
    var baseNode = node ? node : document;
    var childNode = baseNode.querySelector(selector);
    if (shouldBeValid) {
      childNode.setCustomValidity('');
    } else {
      childNode.setCustomValidity('Некорретные данные');
    }
  }

  function setDomNodeValidity(shouldBeValid, baseNode) {
    var text = shouldBeValid ? '' : Text.INCORRECT_DATA;
    baseNode.setCustomValidity(text);
  }

  function setHtmlTagAttribute(shouldBeSet, parameter, value, selector, node) {
    var baseNode = node ? node : document;
    var childNode = baseNode.querySelector(selector);
    if (shouldBeSet) {
      childNode.setAttribute(parameter, value);
    } else {
      childNode.removeAttribute(parameter);
    }
  }

  function setDomNodeAttribute(shouldBeSet, parameter, value, baseNode) {
    shouldBeSet ?
      baseNode.setAttribute(parameter, value) :
      baseNode.removeAttribute(parameter);
  }

  function blockInput(shouldBeBlocked, selector, node) {
    var baseNode = node ? node : document;
    var childNode = baseNode.querySelector(selector);
    childNode.disabled = shouldBeBlocked;
  }

  function getListMin(list) {
    var result = Math.min.apply(null, list);
    return result;
  }

  function getListMax(list) {
    var result = Math.max.apply(null, list);
    return result;
  }

  function isKeyInObjectOfList(key, list) {
    return list.some(function (item) {
      return key in item;
    });
  }

  function isClassIncludesKey(aClass, searchedKey) {
    if (aClass.hasOwnProperty) {
      return aClass.hasOwnProperty(searchedKey);
    }
    return aClass.prototype.hasOwnProperty(searchedKey);
  }

  function isEmailValid(email) {
    return EMAIL_REGEX.test(email);
  }

  var _lastTimeout;
  function debounce(func, arg, intervalMilliseconds) {
    if (_lastTimeout) {
      window.clearTimeout(_lastTimeout);
    }
    _lastTimeout = window.setTimeout(func, arg, intervalMilliseconds);
  }

})();
