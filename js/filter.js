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

  window.Filter = function() {

    this.eventHandler = function (evt) {
      switch (true) {
        case (evt.target.classList.contains(Filter.RANGE_MIN_BTN_CLASS)):
          updateSliderPositionValue();
          break;

        case (evt.target.classList.contains(Filter.RANGE_MAX_BTN_CLASS)):
          updateSliderPositionValue();
          break;
      }
    }

    /*
     * Constructor body
     */

    this.state = {
      down: false,
      move: false
    };
    return;

    /*
     * End of Constructor body
     */



    function updateSliderPositionValue() {
      var minSliderValue = getMinSliderValue();
      var maxSliderValue = getMaxSliderValue();
      window.utils.setDomTextContent(document, Filter.MIN_RANGE_BTN_TEXT_SELECTOR, minSliderValue);
      window.utils.setDomTextContent(document, Filter.MAX_RANGE_BTN_TEXT_SELECTOR, maxSliderValue);

      function getMinSliderValue() {
        var parentWidth = window.utils.getHtmlSelectorWidth(Filter.RANGE_BTN_PARENT_SELECTOR);
        var width = window.utils.getHtmlClassLeftProperty(Filter.RANGE_MIN_BTN_CLASS);
        return window.utils.intPercent(parentWidth, width);
      }

      function getMaxSliderValue() {
        var parentWidth = window.utils.getHtmlSelectorWidth(Filter.RANGE_BTN_PARENT_SELECTOR);
        var width = window.utils.getHtmlClassRightProperty(Filter.RANGE_MAX_BTN_CLASS);
        return window.utils.intPercent(parentWidth, parentWidth - width);
      }
    }

  } // End of class definition

})();
