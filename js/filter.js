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
    FILL_LINE_CLASS: 'range__fill-line'
  };

  var price = {};

  var mouse = {
    x: 0
  };

  var Slider = {
    MOUSE_MOVE_UP_SELECTOR: 'main'
  };

  window.Filter = function(minPrice, maxPrice) {
    price.min = minPrice;
    price.max = maxPrice;
    updateSliderValue('min');
    updateSliderValue('max');

    this.mouseDownHandler = function (evt) {
      evt.preventDefault();
      mouse.x = evt.clientX;

      window.utils.setDomEventHandler(
          document, Slider.MOUSE_MOVE_UP_SELECTOR, mouseUpHandler, 'mouseup'
      );
      window.utils.setDomEventHandler(
          document, Slider.MOUSE_MOVE_UP_SELECTOR, mouseMoveHandler, 'mousemove'
      );
    }

    function mouseUpHandler (evt) {
      evt.preventDefault();
      window.utils.removeDomEventHandler(
          document, Slider.MOUSE_MOVE_UP_SELECTOR, mouseMoveHandler, 'mousemove'
      );
        window.utils.removeDomEventHandler(
          document, Slider.MOUSE_MOVE_UP_SELECTOR, mouseUpHandler, 'mouseup'
      );
    }

    function mouseMoveHandler (evt) {
      evt.preventDefault();
      var pinClass = getPinClass(evt);
      if (pinClass === Filter.RANGE_MIN_BTN_CLASS) {
          updateSliderPosition('min', evt);
      } else if (pinClass === Filter.RANGE_MAX_BTN_CLASS) {
          updateSliderPosition('max', evt);
      }
    }

    function updateSliderPosition(which, evt) {
      var dx = mouse.x - evt.clientX;

      var minSliderLeftDistance = window.utils.getHtmlClassLeftProperty(Filter.RANGE_MIN_BTN_CLASS);
      var width = getSliderWidth();
      var maxSliderRightDistance = window.utils.getHtmlClassRightProperty(Filter.RANGE_MAX_BTN_CLASS);
      var maxSliderLeftDistance = width - maxSliderRightDistance;

      if (which === 'min') {
        var newX = minSliderLeftDistance + dx;
        newX = window.utils.setWithinRange(newX, 0, maxSliderLeftDistance);
        window.utils.setHtmlClassLeftProperty(newX, Filter.RANGE_MIN_BTN_CLASS);
        window.utils.setHtmlClassLeftProperty(newX, Filter.FILL_LINE_CLASS);
        mouse.x += dx;
      } else {
        var newX = maxSliderRightDistance + dx;
        newX = window.utils.setWithinRange(newX, 0, width - minSliderLeftDistance);
        window.utils.setHtmlClassRightProperty(newX, Filter.RANGE_MAX_BTN_CLASS);
        window.utils.setHtmlClassRightProperty(newX, Filter.FILL_LINE_CLASS);
        mouse.x -= dx;
      }
      updateSliderValue(which);
    }

    function updateSliderValue(which) {
      var value = calculateSliderValue(which);
      if (which === 'min') {
        window.utils.setDomTextContent(document, Filter.MIN_RANGE_BTN_TEXT_SELECTOR, value);
      } else if (which === 'max') {
        window.utils.setDomTextContent(document, Filter.MAX_RANGE_BTN_TEXT_SELECTOR, value);
      }
      return;

      function calculateSliderValue(which) {
        var parentWidth = getSliderWidth();
        if (which === 'min') {
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

  } // End of class definition

})();
