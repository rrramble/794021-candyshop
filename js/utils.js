'use strict';

/*
 * Miscelaneous non-task-oriented functions
 */

(function () {

  var SELECTOR_HIDDEN = '.visually-hidden';

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
    randomInRange: randomInRange,
    randomInRangeUpTo: randomInRangeUpTo,
    getRandomItemFromList: getRandomItemFromList,
    getRandomListFromList: getRandomListFromList,
    htmlClassFromSelector: htmlClassFromSelector,
    showHtmlSelector: showHtmlSelector,
    hideHtmlSelector: hideHtmlSelector,
    htmlClassToSelector: htmlClassToSelector,
    querySelectorIncludingSelf: querySelectorIncludingSelf,
    htmlSelectorToClass: htmlSelectorToClass,
    isNumber: isNumber,
    isChecked: isChecked,
    htmlIdToHtmlSelector: htmlIdToHtmlSelector,
    isInRange: isInRange,
    isInRangeUpTo: isInRangeUpTo,
    setWithinRange: setWithinRange,

    setDomId: setDomId,
    setDomTextContent: setDomTextContent,
    setDomImage: setDomImage,
    setDomValue: setDomValue,
    getDomValue: getDomValue,
    setDomName: setDomName,
    replaceDomItem: replaceDomItem,
    setDomEventHandler: setDomEventHandler,
    removeDomEventHandler: removeDomEventHandler,

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
    disableButton: disableButton,
    enableButton: enableButton,
    setInputToBeRequired: setInputToBeRequired,
    setDomValid: setDomValid,
    setHtmlTagAttribute: setHtmlTagAttribute,
    blockInput: blockInput,
    listMin: listMin,
    listMax: listMax,
    getMovementX: getMovementX,

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

  function randomInRange(from, to) {
    var result = Math.floor(Math.random(to - from) * to + from);
    if (result < from) {
      result = from;
    } else if (result >= to) {
      result = to - 1;
    }
    return result;
  }

  function randomInRangeUpTo(from, upTo) {
    var to = upTo + 1;
    return window.utils.randomInRange(from, to);
  }

  function getRandomItemFromList(list) {
    if (list.length === 0) {
      return list;
    }
    var index = window.utils.randomInRange(0, list.length);
    return list[index];
  }

  function getRandomListFromList(list) {
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

  function removeDomEventHandler(domNode, htmlSelector, cb, type) {
    var node = domNode.querySelector(htmlSelector);
    node.removeEventListener(type, cb);
  }

  function isLuhnChecked(cardNumber) {
    var noSpaces = window.utils.trimAll(cardNumber.toString());
    if (noSpaces.length !== 16) {
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

  function disableButton(selector, node) {
    var baseNode = node ? node : document;
    baseNode.querySelector(selector).disabled = true;
  }

  function enableButton(selector, node) {
    var baseNode = node ? node : document;
    baseNode.querySelector(selector).disabled = false;
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

  function getMovementX(begin, end) {
    var value = end.x - begin.x;
    return value;
  }

})();
