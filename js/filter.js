'use strict';

/*
 * Class for Range filter
 */

(function () {

  var Filter = {
    MAIN_SECTION_SELECTOR: '.catalog__filter.range',

    RANGE_MIN_BTN_CLASS: 'range__btn--left',
    RANGE_MIN_PIN_BTN_DOM_NODE: document.querySelector('.range__btn--left'),

    RANGE_MAX_BTN_CLASS: 'range__btn--right',
    RANGE_MAX_PIN_BTN_DOM_NODE: document.querySelector('.range__btn--right'),

    MIN_RANGE_TEXT_DOM_NODE: document.querySelector('.range__price--min'),
    MAX_RANGE_TEXT_DOM_NODE: document.querySelector('.range__price--max'),

    RANGE_BTN_PARENT_DOM_NODE: document.querySelector('.range__filter'),
    SLIDER_DOM_NODE: document.querySelector('.range__fill-line'),

    PIN_WIDTH: 10,

    rangeMinPinDomNode: document.querySelector('.range__btn--left')
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
  };

  var SLIDER_WIDTH = getSliderWidth() - Filter.PIN_WIDTH - Filter.PIN_WIDTH / 2;

  function Range(minPrice, maxPrice) {
    Price.min = minPrice;
    Price.max = maxPrice;
    updatePinAndSliderPosition(Pin.isMin);
    updatePinAndSliderPosition(!Pin.isMin);

    this.reset = resetRange;
    this.mouseDownHandler = mouseDownHandler;
  }

  function resetRange() {
    updatePinAndSliderPosition(true);
    updatePinAndSliderPosition(false);
  }

  function mouseDownHandler(evt, funcCb) {
    evt.preventDefault();
    if (!isMinRangePinPressed(evt) && !isMaxRangePinPressed(evt)) {
      return;
    }
    Pin.isMin = isMinRangePinPressed(evt);
    Pin.mouseStartX = evt.clientX;

    document.addEventListener('mouseup', mouseUpHandler);
    document.addEventListener('mousemove', mouseMoveHandler);

    function mouseUpHandler(ownEvt) {
      ownEvt.preventDefault();
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      if (funcCb) {
        funcCb(ownEvt);
      }
    }

    function mouseMoveHandler(evt) {
      evt.preventDefault();
      updatePinAndSliderPosition(Pin.isMin, evt);
    }
  } // mouseDownHandler

  function updatePinAndSliderPosition(isMinPin, evt) {
    if (evt) {
      var dX = evt.clientX - Pin.mouseStartX;
    } else {
      dX = isMinPin ? -Infinity : +Infinity;
    }
    if (dX === 0) {
      return;
    }

    var minPinLeftShift = window.utils.getDomNodeLeftProperty(Filter.rangeMinPinDomNode);
    var maxPinRightShift = window.utils.getDomNodeRightProperty(Filter.RANGE_MAX_PIN_BTN_DOM_NODE);
    var maxPinLeftShift = SLIDER_WIDTH - maxPinRightShift;

    var newX;
    if (isMinPin) {
      newX = minPinLeftShift + dX;
      newX = window.utils.setWithinRange(newX, 0, maxPinLeftShift);
      window.utils.setDomNodeLeftProperty(Filter.RANGE_MIN_PIN_BTN_DOM_NODE, newX);
      window.utils.setDomNodeLeftProperty(Filter.SLIDER_DOM_NODE, newX);

    } else {
      newX = maxPinRightShift - dX;
      newX = window.utils.setWithinRange(newX, 0, SLIDER_WIDTH - minPinLeftShift);
      window.utils.setDomNodeRightProperty(Filter.RANGE_MAX_PIN_BTN_DOM_NODE, newX);
      window.utils.setDomNodeRightProperty(Filter.SLIDER_DOM_NODE, newX);
    }
    Pin.mouseStartX += dX;
    updateTextValue(isMinPin);
  }

  function updateTextValue(isMinPin) {
    var value = calculateSliderValue(isMinPin);
    if (isMinPin) {
      Filter.MIN_RANGE_TEXT_DOM_NODE.textContent = value;
    } else {
      Filter.MAX_RANGE_TEXT_DOM_NODE.textContent = value;
    }
  }

  function calculateSliderValue(isMinPin) {
    if (isMinPin) {
      var leftDistance = window.utils.getDomNodeLeftProperty(Filter.RANGE_MIN_PIN_BTN_DOM_NODE);
    } else {
      var rightDistance = window.utils.getDomNodeRightProperty(Filter.RANGE_MAX_PIN_BTN_DOM_NODE);
      leftDistance = SLIDER_WIDTH - rightDistance;
    }
    var percent = window.utils.calcIntPercent(SLIDER_WIDTH, leftDistance);
    return window.utils.convertPercentToIntWithinRange(percent, Price.min, Price.max);
  }

  function isMinRangePinPressed(evt) {
    return evt.target.classList.contains(Filter.RANGE_MIN_BTN_CLASS);
  }

  function isMaxRangePinPressed(evt) {
    return evt.target.classList.contains(Filter.RANGE_MAX_BTN_CLASS);
  }

  function getSliderWidth() {
    var resultPx = window.getComputedStyle(Filter.RANGE_BTN_PARENT_DOM_NODE).
      getPropertyValue('width');
    return window.utils.omitPx(resultPx);
  }

})();
