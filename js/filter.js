'use strict';

/*
 * Make DOM from the catalog of goods and the trolley
 */

(function () {

  var Filter = {
    RANGE_MIN_BTN_CLASS: 'range__btn--left',
    RANGE_MAX_BTN_CLASS: 'range__btn--right',
    MIN_RANGE_BTN_TEXT_SELECTOR: '.range__price--min',
    MAX_RANGE_BTN_TEXT_SELECTOR: '.range__price--max',
    RANGE_BTN_PARENT_SELECTOR: '.range__filter'
  };

  var state = {
    down: false
  };

  var price = {};

  window.Filter = function(minPrice, maxPrice) {
    price.min = minPrice;
    price.max = maxPrice;
    updateSliderPositionValue('min');
    updateSliderPositionValue('max');

    this.eventHandlerMouseDown = function (evt) {
      var sliderClass = getSliderClass(evt);
      if (!sliderClass) {
        return;
      }
      var sliderSelector = window.utils.htmlClassToSelector(sliderClass);

      window.utils.setDomEventHandler(
          document, sliderSelector, eventHandlerMouseUp, 'mouseup'
      );
      window.utils.setDomEventHandler(
          document, sliderSelector, eventHandlerMouseMove, 'mousemove'
      );
    }

    function eventHandlerMouseUp (evt) {
      var sliderClass = getSliderClass(evt);

      switch (true) {
        case (sliderClass === Filter.RANGE_MIN_BTN_CLASS):
          updateSliderPositionValue('min');
          break;
        case (sliderClass === Filter.RANGE_MAX_BTN_CLASS):
          updateSliderPositionValue('max');
          break;
      }

      var sliderSelector = window.utils.htmlClassToSelector(sliderClass);
      window.utils.removeDomEventHandler(
          document, sliderSelector, eventHandlerMouseUp, 'mouseup'
      );
      window.utils.removeDomEventHandler(
          document, sliderSelector, eventHandlerMouseMove, 'mousemove'
      );

    }

    function eventHandlerMouseMove (evt) {
    }


    function updateSliderPositionValue(which) {
      if (which === 'min') {
        var value = getMinSliderValue();
        window.utils.setDomTextContent(document, Filter.MIN_RANGE_BTN_TEXT_SELECTOR, value);
      } else if (which === 'max') {
        var value = getMaxSliderValue();
        window.utils.setDomTextContent(document, Filter.MAX_RANGE_BTN_TEXT_SELECTOR, value);
      }
      return;

      function getMinSliderValue() {
        var parentWidth = window.utils.getHtmlSelectorWidth(Filter.RANGE_BTN_PARENT_SELECTOR);
        var width = window.utils.getHtmlClassRightProperty(Filter.RANGE_MAX_BTN_CLASS);
        var percent = window.utils.intPercent(parentWidth, width);
        var value = window.utils.percentToIntValue(percent, price.min, price.max);
        return value;
      }

      function getMaxSliderValue() {
        var parentWidth = window.utils.getHtmlSelectorWidth(Filter.RANGE_BTN_PARENT_SELECTOR);
        var width = window.utils.getHtmlClassRightProperty(Filter.RANGE_MAX_BTN_CLASS);
        var percent = window.utils.intPercent(parentWidth, parentWidth - width);
        var value = window.utils.percentToIntValue(percent, price.min, price.max);
        return value;
      }
    }

    function getSliderClass(evt) {
      if (evt.target.classList.contains(Filter.RANGE_MIN_BTN_CLASS)) {
        return Filter.RANGE_MIN_BTN_CLASS;
      };
      if (evt.target.classList.contains(Filter.RANGE_MAX_BTN_CLASS)) {
        return Filter.RANGE_MAX_BTN_CLASS;
      };
      return undefined;
    }

  } // End of class definition

})();
