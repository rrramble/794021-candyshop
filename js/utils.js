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

  window.utils.showHtmlSelector = function (htmlSelector) {
    var el = document.querySelector(htmlSelector);
    var className = window.utils.htmlClassFromSelector(SELECTOR_HIDDEN);
    el.classList.remove(className);
  };

  window.utils.htmlClassFromSelector = function (htmlSelector) {
    var firstChar = htmlSelector[0];
    if (firstChar === '.') {
      return htmlSelector.slice(1);
    }
    return undefined;
  };

  window.utils.hideHtmlSelector = function (htmlSelector) {
    var el = document.querySelector(htmlSelector);
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

  window.utils.isChecked = function (htmlSelector, dom) {
    var parentDom = document;
    if (dom) {
      parentDom = dom;
    }
    var result = parentDom.querySelector(htmlSelector).checked;
    return result;
  };

  window.utils.htmlIdToHtmlSelector = function (id) {
    return '#' + id;
  };

})();