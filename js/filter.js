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

  var Price = {
    min: 0,
    max: 0
  };

  var Pin = {
    mouseStartX: 0,
    isMin: true
  };

  window.Filter = {
    Range: Range
  }

  function Range(minPrice, maxPrice) {
    Price.min = minPrice;
    Price.max = maxPrice;
    updateSliderValue(Pin.isMin);
    updateSliderValue(!Pin.isMin);

    this.mouseDownHandler = function (evt) {
      evt.preventDefault();
      Pin.mouseStartX = evt.clientX;
      Pin.isMin = isMinButtonClass(evt);

      document.addEventListener('mouseup', mouseUpHandler);
      document.addEventListener('mousemove', mouseMoveHandler);
    };

    function mouseUpHandler(evt) {
      evt.preventDefault();
      document.removeEventListener('mouseup', mouseUpHandler);
      document.removeEventListener('mousemove', mouseMoveHandler);
    }

    function mouseMoveHandler(evt) {
      evt.preventDefault();
      updateSliderPosition(Pin.isMin, evt);
    }

    function updateSliderPosition(isMinPin, evt) {
      var dX = evt.clientX - Pin.mouseStartX;
      if (dX === 0) {
        return;
      }

      var minPinLeftShift = window.utils.getHtmlClassLeftProperty(Filter.RANGE_MIN_BTN_CLASS);
      var width = getSliderWidth() - Filter.PIN_WIDTH - Filter.PIN_WIDTH / 2;
      var maxPinRightShift = window.utils.getHtmlClassRightProperty(Filter.RANGE_MAX_BTN_CLASS);
      var maxPinLeftShift = width - maxPinRightShift;

      var newX;
      if (isMinPin) {
        newX = minPinLeftShift + dX;
        newX = window.utils.setWithinRange(newX, 0, maxPinLeftShift);
        window.utils.setHtmlClassLeftProperty(newX, Filter.RANGE_MIN_BTN_CLASS);
        window.utils.setHtmlClassLeftProperty(newX, Filter.FILL_LINE_CLASS);
      } else {
        newX = maxPinRightShift - dX;
        newX = window.utils.setWithinRange(newX, 0, width - minPinLeftShift);
        window.utils.setHtmlClassRightProperty(newX, Filter.RANGE_MAX_BTN_CLASS);
        window.utils.setHtmlClassRightProperty(newX, Filter.FILL_LINE_CLASS);
      }
      Pin.mouseStartX += dX;
      updateSliderValue(isMinPin);
    }

    function updateSliderValue(isMinPin) {
      var value = calculateSliderValue(isMinPin);
      if (isMinPin) {
        window.utils.setDomTextContent(document, Filter.MIN_RANGE_BTN_TEXT_SELECTOR, value);
      } else {
        window.utils.setDomTextContent(document, Filter.MAX_RANGE_BTN_TEXT_SELECTOR, value);
      }
    }

    function calculateSliderValue(isMinPin) {
      var parentWidth = getSliderWidth() - Filter.PIN_WIDTH - Filter.PIN_WIDTH / 2;
      if (isMinPin) {
        var leftDistance = window.utils.getHtmlClassLeftProperty(Filter.RANGE_MIN_BTN_CLASS);
      } else {
        var rightDistance = window.utils.getHtmlClassRightProperty(Filter.RANGE_MAX_BTN_CLASS);
        leftDistance = parentWidth - rightDistance;
      }
      var percent = window.utils.intPercent(parentWidth, leftDistance);
      return window.utils.percentToIntValue(percent, Price.min, Price.max);
    }

    function isMinButtonClass(evt) {
      return evt.target.classList.contains(Filter.RANGE_MIN_BTN_CLASS);
    }

    function getSliderWidth() {
      return window.utils.getHtmlSelectorWidth(Filter.RANGE_BTN_PARENT_SELECTOR);
    }

  };

})();
