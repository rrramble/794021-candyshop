'use strict';

/*
 * Miscelaneous non-task-oriented functions
 */

(function () {

  var SELECTOR_HIDDEN = '.visually-hidden';

  window.utils = {};

  window.utils.getDomObjectsByClassName = function (objectClass) {
    var domId = window.utils.htmlClassToSelector(objectClass);
    var domObjects = document.querySelectorAll(domId);
    return domObjects;
  };

  window.utils.removeCssClass = function (objectClass, classToBeRemoved) {
    var domObjects = window.utils.getDomObjectsByClassName(objectClass);
    for (var i = 0; i < domObjects.length; i++) {
      domObjects[i].classList.remove(classToBeRemoved);
    }
  };

  window.utils.addCssClass = function (objectClass, classToBeAdded) {
    var domObjects = window.utils.getDomObjectsByClassName(objectClass);
    for (var i = 0; i < domObjects.length; i++) {
      domObjects[i].classList.add(classToBeAdded);
    }
  };

  window.utils.randomInRange = function (from, to) {
    var result = Math.floor(Math.random(to - from) * to + from);
    if (result < from) {
      result = from;
    } else if (result >= to) {
      result = to - 1;
    }
    return result;
  };

  window.utils.randomInRangeUpTo = function (from, upTo) {
    var to = upTo + 1;
    return window.utils.randomInRange(from, to);
  };

  window.utils.getRandomItemFromList = function (list) {
    if (list.length === 0) {
      return list;
    }

    var index = window.utils.randomInRange(0, list.length);
    return list[index];
  };

  window.utils.getRandomListFromList = function (list) {
    if (list.length === 0) {
      return list;
    }

    var newList = list.filter(function () {
      return window.utils.randomInRangeUpTo(0, 1) === 0;
    });

    if (newList.length === 0) {
      newList = list[0];
    }
    return newList;
  };

  window.utils.htmlClassFromSelector = function (htmlSelector) {
    var firstChar = htmlSelector[0];
    if (firstChar === '.') {
      return htmlSelector.slice(1);
    }
    return undefined;
  };

  window.utils.showHtmlSelector = function (node, htmlSelector) {
    var el = window.utils.querySelectorIncludingSelf(node, htmlSelector);
    var className = window.utils.htmlClassFromSelector(SELECTOR_HIDDEN);
    el.classList.remove(className);
  };

  window.utils.hideHtmlSelector = function (node, htmlSelector) {
    var el = window.utils.querySelectorIncludingSelf(node, htmlSelector);
    var className = window.utils.htmlClassFromSelector(SELECTOR_HIDDEN);
    el.classList.add(className);
  };

  window.utils.htmlClassToSelector = function (htmlClass) {
    return '.' + htmlClass;
  };

  window.utils.querySelectorIncludingSelf = function (dom, selector) {
    var classes = dom.classList;
    if (classes) {
      var className = window.utils.htmlSelectorToClass(selector);
      if (classes.contains(className)) {
        return dom;
      }
    }
    return dom.querySelector(selector);
  };

  window.utils.htmlSelectorToClass = function (htmlSelector) {
    return htmlSelector.slice(1);
  };

  window.utils.isNumber = function (n) {
    if (isNaN(n)) {
      return false;
    }
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  window.utils.isChecked = function (htmlSelector, node) {
    var baseNode = node ? node : document;
    var result = baseNode.querySelector(htmlSelector).checked;
    return result;
  };

  window.utils.htmlIdToHtmlSelector = function (id) {
    return '#' + id;
  };

  window.utils.isInRange = function (value, from, to) {
    return (value >= from && value < to);
  };

  window.utils.isInRangeUpTo = function (value, from, to) {
    return (value >= from && value <= to);
  };

  window.utils.setDomId = function (node, htmlSelector, data) {
    var subNode = window.utils.querySelectorIncludingSelf(node, htmlSelector);
    subNode.id = data;
  };

  window.utils.setDomTextContent = function (node, htmlSelector, data) {
    var subNode = window.utils.querySelectorIncludingSelf(node, htmlSelector);
    subNode.textContent = data;
  };

  window.utils.setDomImage = function (node, htmlSelector, imageUrl, imageAlt) {
    var subNode = window.utils.querySelectorIncludingSelf(node, htmlSelector);
    var actualUrl = imageUrl;
    if (!imageUrl) {
      actualUrl = '';
    }
    subNode.src = actualUrl;

    if (imageAlt) {
      subNode.alt = imageAlt;
    }
  };

  window.utils.setDomValue = function (node, selector, data) {
    var subNode = window.utils.querySelectorIncludingSelf(node, selector);
    subNode.value = data;
  };

  window.utils.getDomValue = function (node, selector) {
    var subNode = window.utils.querySelectorIncludingSelf(node, selector);
    return subNode.value;
  };

  window.utils.setDomName = function (node, selector, data) {
    var subNode = window.utils.querySelectorIncludingSelf(node, selector);
    subNode.name = data;
  };

  window.utils.replaceDomItem = function (mainDomObject, oldChildSelector, newChildNode) {
    var startDomObject = mainDomObject;
    if (!mainDomObject) {
      startDomObject = document;
    }
    var parentNode = startDomObject.querySelector(oldChildSelector).parentNode;
    var oldChildNode = parentNode.querySelector(oldChildSelector);
    parentNode.replaceChild(newChildNode, oldChildNode);
  };

  window.utils.setDomEventHandler = function (domNode, htmlSelector, cb, type) {
    var node = domNode.querySelector(htmlSelector);
    node.addEventListener(type, cb);
  };

  window.utils.removeDomEventHandler = function (domNode, htmlSelector, cb, type) {
    var node = domNode.querySelector(htmlSelector);
    node.removeEventListener(type, cb);
  }

  window.utils.isLuhnChecked = function (cardNumber) {
    var noSpaces = window.utils.trimAll(cardNumber.toString());
    if (noSpaces.length !== 16) {
      return false;
    }
    var numbers = noSpaces.split('');
    var semiDoubled = numbers.map(semiDouble);
    var sum = semiDoubled.reduce(window.utils.sum, 0);
    return (sum % 10 === 0);

    function semiDouble(char, index) {
      var digit = parseInt(char, 10);
      if (window.utils.isEven(index)) {
        var digitDoubled = digit * 2;
        digit = digitDoubled > 9 ? digitDoubled - 9 : digitDoubled;
      }
      return digit;
    }

  };

  window.utils.isCardDateChecked = function (cardDate) {
    var noFillings = window.utils.trimSpaces(cardDate);
    var month = noFillings.slice(0, 2);
    var divider = noFillings.slice(2, 3);
    var year = noFillings.slice(3);
    return window.utils.isInRangeUpTo(month, 1, 12) &&
      window.utils.isInRangeUpTo(year, 18, 50) &&
      !window.utils.isNumber(divider);
  };

  window.utils.isCvcChecked = function (cvc) {
    var noFillings = window.utils.trimAll(cvc) / 1;
    var number = noFillings.toFixed(0);
    var result = window.utils.isInRangeUpTo(number, 0, 999) &&
      number.length === 3;
    return result;
  };

  window.utils.isCacrdholderNameChecked = function (fullName) {
    var noFillings = window.utils.trimAll(fullName);
    return noFillings.length > 0;
  };

  window.utils.isEven = function (a) {
    return a % 2 === 0;
  };

  window.utils.sum = function (a, b) {
    return b ? a + b : a;
  };

  window.utils.trimAll = function (s) {
    var noSpaces = s.replace(/\s/g, '');
    var noFillings = noSpaces.replace('.', '').replace('-', '').replace('_', '');
    return noFillings;
  };

  window.utils.trimSpaces = function (s) {
    var noSpaces = s.replace(/\s/g, '');
    return noSpaces;
  };

  window.utils.omitPx = function (px) {
    return parseFloat(px.toString());
  };

  window.utils.getHtmlSelectorProperty = function (property, htmlSelector, node) {
    var baseNode = node ? node : document;
    var childNode = baseNode.querySelector(htmlSelector);
    var result = window.getComputedStyle(childNode).getPropertyValue(property);
    return result;
  };

  window.utils.getHtmlSelectorWidth = function (htmlSelector, node) {
    var resultPx = window.utils.getHtmlSelectorProperty('width', htmlSelector, node);
    return window.utils.omitPx(resultPx);
  };

  window.utils.getHtmlClassLeftProperty = function (htmlClass, node) {
    var selector = window.utils.htmlClassToSelector(htmlClass);
    var leftPx = window.utils.getHtmlSelectorProperty('left', selector, node);
    return window.utils.omitPx(leftPx);
  };

  window.utils.getHtmlClassRightProperty = function (htmlClass, node) {
    var selector = window.utils.htmlClassToSelector(htmlClass);
    var rightPx = window.utils.getHtmlSelectorProperty('right', selector, node);
    return window.utils.omitPx(rightPx);
  };

  window.utils.intPercent = function (base, part) {
    var percent = base !== 0 ? part / base * 100 : 0;
    if (percent > 100) {
      percent = 100;
    }
    return percent.toFixed(0);
  };

  window.utils.percentToIntValue = function (percent, min, max) {
    var value = (max - min) * percent / 100 + min;
    if (value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    }
    return value.toFixed(0);
  };

  window.utils.disableButton = function (selector, node) {
    var baseNode = node ? node : document;
    baseNode.querySelector(selector).disabled = true;
  };

  window.utils.enableButton = function (selector, node) {
    var baseNode = node ? node : document;
    baseNode.querySelector(selector).disabled = false;
  };

  window.utils.setInputToBeRequired = function (isToBeRequired, selector, node) {
    var baseNode = node ? node : document;
    baseNode.querySelector(selector).required = isToBeRequired;
  };

  window.utils.setDomValid = function (shouldBeValid, selector, node) {
    var baseNode = node ? node : document;
    var childNode = baseNode.querySelector(selector);
    if (shouldBeValid) {
      childNode.setCustomValidity('');
    } else {
      childNode.setCustomValidity('Некорретные данные');
    }
  };

  window.utils.setHtmlTagAttribute = function (shouldBeSet, parameter, value, selector, node) {
    var baseNode = node ? node : document;
    var childNode = baseNode.querySelector(selector);
    if (shouldBeSet) {
      childNode.setAttribute(parameter, value);
    } else {
      childNode.removeAttribute(parameter);
    }
  };

  window.utils.blockInput = function (shouldBeBlocked, selector, node) {
    var baseNode = node ? node : document;
    var childNode = baseNode.querySelector(selector);
    childNode.disabled = shouldBeBlocked;
  };

  window.utils.listMin = function (list) {
    var result = Math.min.apply(null, list);
    return result;
  }

  window.utils.listMax = function (list) {
    var result = Math.max.apply(null, list);
    return result;
  }

})();
