'use strict';

/*
 * Miscelaneous not task-oriented functions
 */

(function () {

  var SELECTOR_HIDDEN = '.visually-hidden';
  var CARD_NUMBER_LENGTHS = [16, 17, 18, 19];

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
    htmlClassFromSelector: htmlClassFromSelector,
    showHtmlSelector: showHtmlSelector,
    hideHtmlSelector: hideHtmlSelector,
    htmlClassToSelector: htmlClassToSelector,
    querySelectorIncludingSelf: querySelectorIncludingSelf,
    htmlSelectorToClass: htmlSelectorToClass,
    isNumber: isNumber,

    isChecked: isChecked,
    isHtmlIdChecked: isHtmlIdChecked,
    setInputHtmlIdCheck: setInputHtmlIdCheck,
    htmlIdToHtmlSelector: htmlIdToHtmlSelector,
    isInRange: isInRange,
    isInRangeUpTo: isInRangeUpTo,
    setWithinRange: setWithinRange,

    setDomId: setDomId,
    setDomTextContent: setDomTextContent,
    getDomTextContent: getDomTextContent,

    setDomImage: setDomImage,
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

    getHtmlSelectorProperty: getHtmlSelectorProperty,
    getHtmlSelectorWidth: getHtmlSelectorWidth,
    getHtmlClassLeftProperty: getHtmlClassLeftProperty,
    setHtmlClassLeftProperty: setHtmlClassLeftProperty,
    getHtmlClassRightProperty: getHtmlClassRightProperty,
    setHtmlClassRightProperty: setHtmlClassRightProperty,

    intPercent: intPercent,
    percentToIntValue: percentToIntValue,

    disableHtmlSelector: disableHtmlSelector,
    isHtmlIdInputDisabled: isHtmlIdInputDisabled,
    isHtmlSelectorDisabled: isHtmlSelectorDisabled,
    disableHtmlId: disableHtmlId,

    setInputToBeRequired: setInputToBeRequired,
    setDomValid: setDomValid,
    setHtmlTagAttribute: setHtmlTagAttribute,
    blockInput: blockInput,
    listMin: listMin,
    listMax: listMax,
    isKeyInObjectOfList: isKeyInObjectOfList,

    debounce: debounce,
    isClassIncludesKey: isClassIncludesKey,
    isEmailValid: isEmailValid,

    HttpCode: HttpCode
  };

  function getDomObjectsByClassName(objectClass) {
    var domId = window.utils.htmlClassToSelector(objectClass);
    var domObjects = document.querySelectorAll(domId);
    return domObjects;
  }

  function removeCssClass(objectClass, classToBeRemoved) {
    var domObjects = window.utils.getDomObjectsByClassName(objectClass);
    for (var i = 0; i < domObjects.length; i++) {
      domObjects[i].classList.remove(classToBeRemoved);
    }
  }

  function addCssClass(objectClass, classToBeAdded) {
    var domObjects = window.utils.getDomObjectsByClassName(objectClass);
    for (var i = 0; i < domObjects.length; i++) {
      domObjects[i].classList.add(classToBeAdded);
    }
  }

  function htmlClassFromSelector(htmlSelector) {
    var firstChar = htmlSelector[0];
    if (firstChar === '.') {
      return htmlSelector.slice(1);
    }
    return undefined;
  }

  function showHtmlSelector(node, htmlSelector) {
    var el = window.utils.querySelectorIncludingSelf(node, htmlSelector);
    var className = window.utils.htmlClassFromSelector(SELECTOR_HIDDEN);
    el.classList.remove(className);
  }

  function hideHtmlSelector(node, htmlSelector) {
    var el = window.utils.querySelectorIncludingSelf(node, htmlSelector);
    var className = window.utils.htmlClassFromSelector(SELECTOR_HIDDEN);
    el.classList.add(className);
  }

  function htmlClassToSelector(htmlClass) {
    return '.' + htmlClass;
  }

  function querySelectorIncludingSelf(dom, selector) {
    var classes = dom.classList;
    if (classes) {
      var className = window.utils.htmlSelectorToClass(selector);
      if (classes.contains(className)) {
        return dom;
      }
    }
    return dom.querySelector(selector);
  }

  function htmlSelectorToClass(htmlSelector) {
    return htmlSelector.slice(1);
  }

  function isNumber(n) {
    if (isNaN(n)) {
      return false;
    }
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function isChecked(htmlSelector, node) {
    var baseNode = node ? node : document;
    var result = baseNode.querySelector(htmlSelector).checked;
    return result;
  }

  function isHtmlIdChecked(htmlId, node) {
    var baseNode = node ? node : document;
    var selector = window.utils.htmlIdToHtmlSelector(htmlId);
    var result = baseNode.querySelector(selector).checked;
    return result;
  }

  function setInputHtmlIdCheck(htmlId, shouldBeSet) {
    var htmlSelector = window.utils.htmlIdToHtmlSelector(htmlId);
    document.querySelector(htmlSelector).checked = shouldBeSet;
  }

  function htmlIdToHtmlSelector(id) {
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
    var startDomObject = mainDomObject;
    if (!mainDomObject) {
      startDomObject = document;
    }
    var parentNode = startDomObject.querySelector(oldChildSelector).parentNode;
    var oldChildNode = parentNode.querySelector(oldChildSelector);
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
    if (!CARD_NUMBER_LENGTHS.includes(noSpaces.length)) {
      return false;
    }
    var numbers = noSpaces.split('');
    var semiDoubled = numbers.map(semiDouble);
    var total = semiDoubled.reduce(window.utils.sum, 0);
    return (total % 10 === 0);

    function semiDouble(char, index) {
      var digit = parseInt(char, 10);
      if (window.utils.isEven(index)) {
        var digitDoubled = digit * 2;
        digit = digitDoubled > 9 ? digitDoubled - 9 : digitDoubled;
      }
      return digit;
    }
  }

  function isCardDateChecked(cardDate) {
    var noFillings = window.utils.trimSpaces(cardDate);
    var month = noFillings.slice(0, 2);
    var divider = noFillings.slice(2, 3);
    var year = noFillings.slice(3);
    return window.utils.isInRangeUpTo(month, 1, 12) &&
      window.utils.isInRangeUpTo(year, 18, 50) &&
      !window.utils.isNumber(divider);
  }

  function isCvcChecked(cvc) {
    var noFillings = window.utils.trimAll(cvc) / 1;
    var number = noFillings.toFixed(0);
    var result = window.utils.isInRangeUpTo(number, 0, 999) &&
      number.length === 3;
    return result;
  }

  function isCacrdholderNameChecked(fullName) {
    var noFillings = window.utils.trimAll(fullName);
    return noFillings.length > 0;
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

  function getHtmlSelectorProperty(property, htmlSelector, node) {
    var baseNode = node ? node : document;
    var childNode = baseNode.querySelector(htmlSelector);
    var result = window.getComputedStyle(childNode).getPropertyValue(property);
    return result;
  }

  function getHtmlSelectorWidth(htmlSelector, node) {
    var resultPx = window.utils.getHtmlSelectorProperty('width', htmlSelector, node);
    return window.utils.omitPx(resultPx);
  }

  function getHtmlClassLeftProperty(htmlClass, node) {
    var selector = window.utils.htmlClassToSelector(htmlClass);
    var leftPx = window.utils.getHtmlSelectorProperty('left', selector, node);
    return window.utils.omitPx(leftPx);
  }

  function setHtmlClassLeftProperty(value, htmlClass, node) {
    var baseNode = node ? node : document;
    var selector = window.utils.htmlClassToSelector(htmlClass);
    baseNode.querySelector(selector).style.left = value + 'px';
  }

  function getHtmlClassRightProperty(htmlClass, node) {
    var selector = window.utils.htmlClassToSelector(htmlClass);
    var rightPx = window.utils.getHtmlSelectorProperty('right', selector, node);
    return window.utils.omitPx(rightPx);
  }

  function setHtmlClassRightProperty(value, htmlClass, node) {
    var baseNode = node ? node : document;
    var selector = window.utils.htmlClassToSelector(htmlClass);
    baseNode.querySelector(selector).style.right = value + 'px';
  }

  function intPercent(base, part) {
    var percent = base === 0 ? 0 : part / base * 100;
    percent = window.utils.setWithinRange(percent, 0, 100);
    return percent.toFixed(0);
  }

  function percentToIntValue(percent, min, max) {
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
    var selector = window.utils.htmlIdToHtmlSelector(htmlId);
    var childNode = baseNode.querySelector(selector);
    childNode.disabled = shouldBeBlocked;
  }

  function isHtmlIdInputDisabled(htmlId, node) {
    var baseNode = node ? node : document;
    var selector = window.utils.htmlIdToHtmlSelector(htmlId);
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

  function setHtmlTagAttribute(shouldBeSet, parameter, value, selector, node) {
    var baseNode = node ? node : document;
    var childNode = baseNode.querySelector(selector);
    if (shouldBeSet) {
      childNode.setAttribute(parameter, value);
    } else {
      childNode.removeAttribute(parameter);
    }
  }

  function blockInput(shouldBeBlocked, selector, node) {
    var baseNode = node ? node : document;
    var childNode = baseNode.querySelector(selector);
    childNode.disabled = shouldBeBlocked;
  }

  function listMin(list) {
    var result = Math.min.apply(null, list);
    return result;
  }

  function listMax(list) {
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
    // Thanks to https://emailregex.com/
    var regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regEx.test(email);
  }

  var _lastTimeout;
  function debounce(func, arg, intervalMilliseconds) {
    if (_lastTimeout) {
      window.clearTimeout(_lastTimeout);
    }
    _lastTimeout = window.setTimeout(func, arg, intervalMilliseconds);
  }

})();
