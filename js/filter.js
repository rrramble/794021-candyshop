'use strict';

/*
 * Make DOM from the catalog of goods and the trolley
 */

(function () {

  var Filter = {
    MAIN_SECTION_SELECTOR: '.catalog__filter.range',
    RANGE_MIN_BTN_CLASS: 'range__btn--left',
    RANGE_MAX_BTN_CLASS: 'range__btn--right',
    MIN_RANGE_BTN_TEXT_SELECTOR: '.range__price--min',
    MAX_RANGE_BTN_TEXT_SELECTOR: '.range__price--max',
    RANGE_BTN_PARENT_SELECTOR: '.range__filter',
    FILL_LINE_CLASS: 'range__fill-line',
    PIN_WIDTH: 10
  };

  var price = {};

  var Pin = {
    startX: 0,
    isMin: true
  };

  window.Filter = function(minPrice, maxPrice) {
    price.min = minPrice;
    price.max = maxPrice;
    updateSliderValue(Pin.isMin);
    updateSliderValue(!Pin.isMin);

    this.mouseDownHandler = function (evt) {
      evt.preventDefault();
      Pin.startX = evt.clientX;
      Pin.class = getPinClass(evt);
      if (Pin.class === Filter.RANGE_MIN_BTN_CLASS) {
        Pin.isMin = true;
      } else if (Pin.class === Filter.RANGE_MAX_BTN_CLASS) {
        Pin.isMin = false;
      } else {
        return;
      }

      document.addEventListener('mouseup', mouseUpHandler);
      document.addEventListener('mousemove', mouseMoveHandler);
    }

    function mouseUpHandler (evt) {
      evt.preventDefault();
      document.removeEventListener('mouseup', mouseUpHandler);
      document.removeEventListener('mousemove', mouseMoveHandler);
    }

    function mouseMoveHandler (evt) {
      evt.preventDefault();
      updateSliderPosition(Pin.isMin, evt);
    }

    function updateSliderPosition(isMin, evt) {
      var dX = evt.clientX - Pin.startX;
      if (dX === 0) {
        return;
      }

      var minPinLeftShift = window.utils.getHtmlClassLeftProperty(Filter.RANGE_MIN_BTN_CLASS);
      var width = getSliderWidth() - Filter.PIN_WIDTH - Filter.PIN_WIDTH / 2;
      var maxPinRightShift = window.utils.getHtmlClassRightProperty(Filter.RANGE_MAX_BTN_CLASS);
      var maxPinLeftShift = width - maxPinRightShift;

      if (isMin) {
        var newX = minPinLeftShift + dX;
        newX = window.utils.setWithinRange(newX, 0, maxPinLeftShift);
        window.utils.setHtmlClassLeftProperty(newX, Filter.RANGE_MIN_BTN_CLASS);
        window.utils.setHtmlClassLeftProperty(newX, Filter.FILL_LINE_CLASS);
        Pin.startX += dX;
      } else {
        var newX = maxPinRightShift - dX;
        newX = window.utils.setWithinRange(newX, 0, width - minPinLeftShift);
        window.utils.setHtmlClassRightProperty(newX, Filter.RANGE_MAX_BTN_CLASS);
        window.utils.setHtmlClassRightProperty(newX, Filter.FILL_LINE_CLASS);
        Pin.startX += dX;
      }
      updateSliderValue(isMin);
    }

    function updateSliderValue(isMin) {
      var value = calculateSliderValue(isMin);
      if (isMin) {
        window.utils.setDomTextContent(document, Filter.MIN_RANGE_BTN_TEXT_SELECTOR, value);
      } else {
        window.utils.setDomTextContent(document, Filter.MAX_RANGE_BTN_TEXT_SELECTOR, value);
      }
      return;

      function calculateSliderValue(isMin) {
        var parentWidth = getSliderWidth() - Filter.PIN_WIDTH - Filter.PIN_WIDTH / 2;
        if (isMin) {
          var leftDistance = window.utils.getHtmlClassLeftProperty(Filter.RANGE_MIN_BTN_CLASS);
        } else {
          var rightDistance = window.utils.getHtmlClassRightProperty(Filter.RANGE_MAX_BTN_CLASS);
          leftDistance = parentWidth - rightDistance;
        }
        var percent = window.utils.intPercent(parentWidth, leftDistance);
        var value = window.utils.percentToIntValue(percent, price.min, price.max);
        return value;
      }
    }

    function getPinClass(evt) {
      if (evt.target.classList.contains(Filter.RANGE_MIN_BTN_CLASS)) {
        return Filter.RANGE_MIN_BTN_CLASS;
      };
      if (evt.target.classList.contains(Filter.RANGE_MAX_BTN_CLASS)) {
        return Filter.RANGE_MAX_BTN_CLASS;
      };
      return undefined;
    }

    function getSliderWidth(evt) {
      return window.utils.getHtmlSelectorWidth(Filter.RANGE_BTN_PARENT_SELECTOR);
    }

  }

})();
