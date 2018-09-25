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

  window.utils.isInRange= function (value, from, to) {
    return (value >= from && value < to);
  };

  window.utils.setDomId = function (node, htmlSelector, data) {
    var subNode = window.utils.querySelectorIncludingSelf(node, htmlSelector);
    subNode.id = data;
  }

  window.utils.setDomTextContent = function (node, htmlSelector, data) {
    var subNode = window.utils.querySelectorIncludingSelf(node, htmlSelector);
    subNode.textContent = data;
  }

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
  }

  window.utils.setDomValue = function (node, selector, data) {
    var subNode = window.utils.querySelectorIncludingSelf(node, selector);
    subNode.value = data;
  }

  window.utils.setDomName = function (node, selector, data) {
    var subNode = window.utils.querySelectorIncludingSelf(node, selector);
    subNode.name = data;
  }

  window.utils.replaceDomItem = function (mainDomObject, oldChildSelector, newChildNode) {
    var startDomObject = mainDomObject;
    if (!mainDomObject) {
      startDomObject = document;
    }
    var parentNode = startDomObject.querySelector(oldChildSelector).parentNode;
    var oldChildNode = parentNode.querySelector(oldChildSelector);
    parentNode.replaceChild(newChildNode, oldChildNode);
  }

  window.utils.setDomHandlers = function (domNode, htmlSelector, cb, type) {
    var node = domNode.querySelector(htmlSelector);
    node.addEventListener(type, cb);
  }

  window.utils.luhnCheck = function (cardNumber) {
    numbers = cardNumber.toString(10).split(' ');
    semiDoubled = numbers.map(iter);
    return !(semiDoubled.reduce(window.utils.sum, 0) % 10 === 0);

    function iter (char, index) {
      var digit = parseInt(char);
      if (isEven(index)) {
        var digitDoubled = digit * 2;
        digit = digitDoubled > 9 ? digitDoubled - 9 : digitDoubled;
      }
      return digit;
    };

    function isEven(a) {
      return a % 2 === 0;
    }
  }

  window.utils.sum = function (a, b) {
    return b ? a + b : a;
  }

  window.utils.omitPx(px) {
    return px.parseInt();
  }

})();

