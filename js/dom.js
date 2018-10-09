'use strict';

/*
 * Make DOM from the catalog/trolley content
 */

(function () {

  var COMMODITY_HTML_SELECTOR_HEAD = '#commodity';
  var TROLLEY_HTML_SELECTOR_HEAD = '#trolley-commodity';

  var CATALOG_WRAPPER_SELECTOR = '.catalog__cards-wrap';
  var ADD_TO_TROLLEY_HTML_CLASS = 'card__btn';
  var ADD_TO_FAVORITE_HTML_CLASS = 'card__btn-favorite';
  var INCREASE_TROLLEY_HTML_CLASS = 'card-order__btn--increase';
  var DECREASE_TROLLEY_HTML_CLASS = 'card-order__btn--decrease';
  var TROLLEY_AMOUNT_HTML_CLASS = 'card-order__count';
  var DELETE_FROM_TROLLEY_HTML_CLASS = 'card-order__close';

  var EMPTY_FILTER_TEMPLATE_SELECTOR = '#empty-filters';
  var EMPTY_FILTER_SELECTOR = '.catalog__empty-filter';

  var FilterForm = {
    MAIN_SELECTOR: '.catalog__sidebar form',
    VALUE_SELECTOR: '.input-btn__item-count',
    CATEGORIES: [
      {'filter-icecream': 'Мороженое'},
      {'filter-soda': 'Газировка'},
      {'filter-gum': 'Жевательная резинка'},
      {'filter-marmalade': 'Мармелад'},
      {'filter-marshmallows': 'Зефир'}
    ],
    INGREDIENTS: [
      {'filter-sugar-free': 'sugar-free'},
      {'filter-vegetarian': 'vegetarian'},
      {'filter-gluten-free': 'gluten-free'}
    ],
    FAVORITE: [
      {'filter-favorite': 'favorite'}
    ],
    IN_STOCK: [
      {'filter-availability': 'in-stock'}
    ],
    RANGE_PINS: [
      {'.range__btn--left': 'left'},
      {'.range__btn--right': 'right'}
    ],
    SHOW_ALL_HTML_CLASS: 'catalog__submit',
    SORTING_TYPES: [
      {'filter-popular': 'popular'},
      {'filter-expensive': 'expensive'},
      {'filter-cheep': 'cheap'},
      {'filter-rating': 'rating'}
    ]
  };

  var Filter = {
    MIN_RANGE_BTN_TEXT_SELECTOR: '.range__price--min',
    MAX_RANGE_BTN_TEXT_SELECTOR: '.range__price--max',
  };

  window.Dom = function (
      catalog, catalogHtmlTemplateSelector, catalogParentHtmlSelector,
      trolley, trolleyHtmlTemplateSelector, trolleyParentHtmlSelector
  ) {

    this.updateTrolleyCommodityAmount = function (commodityId, parentDom) {
      var amountNode = parentDom;
      if (!parentDom) {
        amountNode = trolleyDomNodeFromCommodityId(commodityId);
      }
      amountNode.querySelector('.card-order__count').value = this.trolley.getAmount(commodityId);
    };

    this.isCommodityDrawnInTrolley = function (commodityId) {
      var htmlId = commodityIdToTrolleyHtmlSelector(commodityId);
      var found = document.querySelector(htmlId);
      return found !== null;
    };


    /*
     * Click handlers
     */

    this.putToTrolley = function (commodityId, amount) {
      var actualAmount = amount ? amount : 1;
      var taken = this.catalog.takeItem(commodityId, actualAmount);
      if (taken <= 0) {
        return;
      }
      this.trolley.putItem(commodityId, actualAmount);
      this.updateCommodityView(commodityId);
      this.updateTrolleyView(commodityId);
    };

    this.takeFromTrolley = function (commodityId, amount) {
      var actualAmount = amount ? amount : 1;
      var taken = this.trolley.takeItem(commodityId, actualAmount);
      if (taken <= 0) {
        return;
      }
      this.catalog.putItem(commodityId, actualAmount);
      this.updateCommodityView(commodityId);
      this.updateTrolleyView(commodityId);
    };

    this.getTrolleyAmountFromThePage = function (commodityId) {
      var htmlSelector = commodityIdToTrolleyHtmlSelector(commodityId);
      var commodityNode = document.querySelector(htmlSelector);
      var valueClass = window.utils.htmlClassToSelector(TROLLEY_AMOUNT_HTML_CLASS);
      var valueNode = commodityNode.querySelector(valueClass);
      var value = valueNode.value;
      return value;
    };

    this.setAmountInTrolley = function (commodityId) {
      var previousAmount = this.trolley.getAmount(commodityId);
      var triedAmount = this.getTrolleyAmountFromThePage(commodityId);
      var difference = triedAmount - previousAmount;
      if (isNaN(difference) || difference === undefined) {
        this.updateTrolleyView(commodityId);
        return;
      }
      if (difference > 0) {
        this.putToTrolley(commodityId, difference);
      } else if (difference < 0) {
        this.takeFromTrolley(commodityId, -difference);
      }
      this.updateTrolleyView(commodityId);
    };

    this.toggleFavorite = function (commodityId) {
      this.catalog.toggleFavorite(commodityId);
      var favoriteStatus = this.catalog.getFavoriteStatus(commodityId);
      this.updateCommodityView(commodityId);
      this.updateFavoriteAmount();
      return favoriteStatus;
    };

    this.updateFavoriteAmount = function () {
      updateFilterAmount(FilterForm.FAVORITE, FilterForm.VALUE_SELECTOR, this.catalog.getFavoriteCount.bind(this.catalog));
    };

    this.commodityCb = function (evt) {
      var commodityId = findParentCommodityId(evt);
      if (!window.utils.isNumber(commodityId)) {
        return;
      }

      switch (true) {
        case (evt.target.classList.contains(ADD_TO_TROLLEY_HTML_CLASS)):
        case (evt.target.classList.contains(INCREASE_TROLLEY_HTML_CLASS)):
          event.preventDefault();
          this.putToTrolley(commodityId);
          break;
        case (evt.target.classList.contains(DECREASE_TROLLEY_HTML_CLASS)):
          this.takeFromTrolley(commodityId);
          break;
        case (evt.target.classList.contains(DELETE_FROM_TROLLEY_HTML_CLASS)):
          event.preventDefault();
          this.takeFromTrolley(commodityId, this.trolley.getAmount(commodityId));
          break;
        case (evt.target.classList.contains(ADD_TO_FAVORITE_HTML_CLASS)):
          event.preventDefault();
          this.toggleFavorite(commodityId);
          break;
      }
    };

    this.trolleyChangeCb = function (evt) {
      var commodityId = findParentCommodityId(evt);
      if (!window.utils.isNumber(commodityId)) {
        return;
      }
      if (evt.target.classList.contains(TROLLEY_AMOUNT_HTML_CLASS)) {
        this.setAmountInTrolley(commodityId);
      }
    };


    /*
     * Document DOM render and update
     */

    this.updateCommodityView = function (commodityId) {
      var newCommodityDom = new window.CatalogItemDom(
          this.catalog.getItem(commodityId),
          this.catalogHtmlTemplate
      );
      this.catalogNodes[commodityId] = newCommodityDom;

      window.utils.replaceDomItem(
          document,
          commodityIdToCommodityHtmlSelector(commodityId),
          newCommodityDom
      );
      this.checkAndRenderCatalogPlaceholder();
    };

    this.replaceDomInTrolley = function (commodityId) {
      var newCommodityDom = this.trolleyNodes[commodityId];
      window.utils.replaceDomItem(
          document,
          commodityIdToTrolleyHtmlSelector(commodityId),
          newCommodityDom
      );
    };

    this.deleteDisplayingInTrolley = function (commodityId) {
      var commodityNode = document.querySelector(commodityIdToTrolleyHtmlSelector(commodityId));
      commodityNode.remove();
    };

    this.updateTrolleyView = function (commodityId) {
      var newCommodityDom = new window.TrolleyItemDom(
          this.trolley.getItem(commodityId),
          this.trolleyHtmlTemplate
      );
      this.trolleyNodes[commodityId] = newCommodityDom;

      if (this.isCommodityDrawnInTrolley(commodityId) &&
          this.trolley.getAmount(commodityId) > 0) {
        this.replaceDomInTrolley(commodityId);
      }

      if (this.isCommodityDrawnInTrolley(commodityId) &&
          this.trolley.getAmount(commodityId) <= 0) {
        this.deleteDisplayingInTrolley(commodityId);
      }

      if (!this.isCommodityDrawnInTrolley(commodityId) &&
          this.trolley.getAmount(commodityId) > 0) {
        document.querySelector(this.trolleyParentHtmlSelector).appendChild(newCommodityDom);
      }

      this.checkAndRenderTrolleyPlaceholder();
      this.updateTrolleyInfo();
    };

    this.checkAndRenderCatalogPlaceholder = function () {
      if (this.catalog.getCount() > 0) {
        window.utils.removeCssClass('catalog__cards', 'catalog__cards--load');
        window.utils.hideHtmlSelector(document, '.catalog__load');
      } else {
        window.utils.addCssClass('catalog__cards', 'catalog__cards--load');
        window.utils.showHtmlSelector(document, '.catalog__load');
      }
      if (this.catalog.getUnfilteredCount() <= 0) {
        window.utils.showHtmlSelector(document, EMPTY_FILTER_SELECTOR);
      } else {
        window.utils.hideHtmlSelector(document, EMPTY_FILTER_SELECTOR);
      }

    };

    this.checkAndRenderTrolleyPlaceholder = function () {
      if (this.trolley.isEmpty()) {
        window.utils.showHtmlSelector(document, '.goods__card-empty');
        window.utils.addCssClass('goods__cards', 'goods__cards--empty');
      } else {
        window.utils.hideHtmlSelector(document, '.goods__card-empty');
        window.utils.removeCssClass('goods__cards', 'goods__cards--empty');
      }
    };

    this.updateTrolleyInfo = function () {
      if (this.trolley.isEmpty()) {
        window.utils.setDomTextContent(document, '.main-header__basket', 'В корзине ничего нет');
      } else {
        var text = 'Товаров в корзине: ' + this.trolley.getCount();
        text += ' , на сумму: ' + this.trolley.getTotalOrderedSum() + ' ₽';
        window.utils.setDomTextContent(document, '.main-header__basket', text);
      }
    };

    this.renderCatalogDom = function () {
      this.catalogNodes = this.createCatalogNodes();

      // make new DOM of goods
      var tempNode = document.createDocumentFragment();
      this.catalogNodes.forEach(function (item) {
        tempNode.appendChild(item);
      });

      // remove old drawn goods
      this.catalog.getGoods().forEach(function (item, i) {
        window.utils.removeFirstDomSelector(commodityIdToCommodityHtmlSelector(i));
      });

      // Render new DOM of goods
      document.querySelector(this.catalogParentHtmlSelector).appendChild(tempNode);
      this.checkAndRenderCatalogPlaceholder();
    };

    this.renderTrolleyDom = function () {
      var node = document.createDocumentFragment();
      for (var i = 0; i < this.catalog.getCount(); i++) {
        if (this.trolley.getAmount(i) > 0) {
          node.appendChild(this.trolleyNodes[i]);
        }
      }
      document.querySelector(this.trolleyParentHtmlSelector).appendChild(node);
      this.checkAndRenderTrolleyPlaceholder();
    };

    this.createCatalogNodes = function () {
      var template = this.catalogHtmlTemplate;
      var result = this.catalog.getGoods().reduce(function (accu, item) {
        if (!item.filtered) {
          accu.push(new window.CatalogItemDom(item, template));
        }
        return accu;
      }, []);
      return result;
    };

    this.createTrolleyDom = function () {
      var template = this.trolleyHtmlTemplate;
      var result = this.trolley.getGoods().map(function (item) {
        return new window.TrolleyItemDom(item, template);
      });
      return result;
    };

    this.applyFilter = function (category, ingredients, favorite, inStock, min, max, sortingType) {
      this.catalog.applyFilter(category, ingredients, favorite, inStock, min, max, sortingType);
      this.renderCatalogDom();
    };


    /*
     * Filter form handler
     */

    this.filterFormHandler = function (evt) {
      switch (true) {
        case isFavoritePressed(evt) && isFavoriteChecked():
          evt.preventDefault();
          uncheckSectionInputs(FilterForm.IN_STOCK);
          disableInputs(FilterForm.CATEGORIES, true);
          disableInputs(FilterForm.INGREDIENTS, true);
          disableButtons(FilterForm.RANGE_PINS, true);
          break;
        case (isInStockPressed(evt) && isInStockChecked()):
          evt.preventDefault();
          uncheckSectionInputs(FilterForm.FAVORITE);
          disableInputs(FilterForm.CATEGORIES, true);
          disableInputs(FilterForm.INGREDIENTS, true);
          disableButtons(FilterForm.RANGE_PINS, true);
          break;
        case isFavoritePressed(evt) || isInStockPressed(evt):
          evt.preventDefault();
          disableInputs(FilterForm.CATEGORIES, false);
          disableInputs(FilterForm.INGREDIENTS, false);
          disableButtons(FilterForm.RANGE_PINS, false);
          break;
      }

      this.applyFilter(
          getCheckedInputs(FilterForm.CATEGORIES),
          getCheckedInputs(FilterForm.INGREDIENTS),
          getCheckedInputs(FilterForm.FAVORITE),
          getCheckedInputs(FilterForm.IN_STOCK),
          getInputRangeValue('min'),
          getInputRangeValue('max'),
          getSortingType()
      );
      return;

      function isFavoritePressed(ownEvt) {
        var key = Object.keys(FilterForm.FAVORITE[0])[0];
        return ownEvt.srcElement.id === key;
      }

      function isFavoriteChecked() {
        return isSectionChecked(FilterForm.FAVORITE);
      }

      function isInStockPressed(ownEvt) {
        var key = Object.keys(FilterForm.IN_STOCK[0])[0];
        return ownEvt.srcElement.id === key;
      }

      function isInStockChecked() {
        return isSectionChecked(FilterForm.IN_STOCK);
      }


      function isSectionChecked(section) {
        var id = Object.keys(section[0])[0];
        return window.utils.isHtmlIdChecked(id);
      }

      function getCheckedInputs(listOfInputs) {
        return listOfInputs.reduce(function (accu, item) {
          var id = Object.keys(item)[0];
          var value = item[id];
          if (
            !window.utils.isHtmlIdInputDisabled(id) &&
            window.utils.isHtmlIdChecked(id)
          ) {
            accu.push(value);
          }
          return accu;
        }, []);
      }

      function uncheckSectionInputs(formList, exceptionId) {
        formList.forEach(function (item) {
          var id = Object.keys(item)[0];
          if (exceptionId && (exceptionId === id || exceptionId.includes(id))) {
            return;
          }
          window.utils.setInputHtmlIdCheck(id);
        });
      }

      function disableInputs(inputs, shouldBeDisabled) {
        inputs.forEach(function (input) {
          var id = Object.keys(input)[0];
          window.utils.disableHtmlIdInput(shouldBeDisabled, id);
        });
      }

      function disableButtons(buttons, shouldBeDisabled) {
        buttons.forEach(function (button) {
          var selector = Object.keys(button)[0];
          window.utils.disableHtmlSelectorButton(shouldBeDisabled, selector);
        });
      }

      function getInputRangeValue(whichPin) {
        if (whichPin === 'min') {
          return window.utils.getDomTextContent(document, Filter.MIN_RANGE_BTN_TEXT_SELECTOR);
        } else {
          return window.utils.getDomTextContent(document, Filter.MAX_RANGE_BTN_TEXT_SELECTOR);
        }
      }

      function getSortingType() {
        var result = FilterForm.SORTING_TYPES.reduce(function (currentType, item) {
          var htmlId = Object.keys(item)[0];
          var type = item[htmlId];
          currentType = window.utils.isHtmlIdChecked(htmlId) ? type : currentType;
          return currentType;
        }, '');
        return result;
      }

    }; // this.filterFormHandler


    /*
     * Constructor body
     */

    this.catalog = catalog;
    this.trolley = trolley;

    this.catalogHtmlTemplate = document.querySelector(catalogHtmlTemplateSelector);
    this.trolleyHtmlTemplate = document.querySelector(trolleyHtmlTemplateSelector);

    this.catalogParentHtmlSelector = catalogParentHtmlSelector;
    this.trolleyParentHtmlSelector = trolleyParentHtmlSelector;

    this.trolleyNodes = this.createTrolleyDom();

    window.utils.setDomEventHandler(
        document,
        this.catalogParentHtmlSelector,
        this.commodityCb.bind(this),
        'click'
    );
    window.utils.setDomEventHandler(
        document,
        this.trolleyParentHtmlSelector,
        this.commodityCb.bind(this),
        'click'
    );

    window.utils.setDomEventHandler(
        document,
        this.trolleyParentHtmlSelector,
        this.trolleyChangeCb.bind(this),
        'change'
    );

    // Draw a section 'Find no goods fitting selected filters'
    var fragmentNode = document.createDocumentFragment();
    var templateNode = document.querySelector(EMPTY_FILTER_TEMPLATE_SELECTOR).content.cloneNode(true);
    fragmentNode.appendChild(templateNode);
    document.querySelector(CATALOG_WRAPPER_SELECTOR).appendChild(fragmentNode);

    this.renderCatalogDom();
    this.renderTrolleyDom();
    fulfillFilterAmount(this);

    return this;

    /*
     * End of constructor
     */


    function trolleyDomNodeFromCommodityId(commodityId) {
      var htmlSelector = commodityIdToCommodityHtmlSelector(commodityId);
      return document.querySelector(htmlSelector);
    }

    function commodityIdToCommodityHtmlSelector(commodityId) {
      return COMMODITY_HTML_SELECTOR_HEAD + commodityId;
    }

    function commodityIdToTrolleyHtmlSelector(commodityId) {
      return TROLLEY_HTML_SELECTOR_HEAD + commodityId;
    }

    function commodityHtmlSelectorToCommodityId(htmlSelector) {
      if (isCommodityHtmlSelector(htmlSelector)) {
        return htmlSelector.slice(COMMODITY_HTML_SELECTOR_HEAD.length, htmlSelector.length);
      }
      throw new Error('Not a commodity selector');
    }

    function trolleyHtmlSelectorToCommodityId(htmlSelector) {
      if (isTrolleyCommodityHtmlSelector(htmlSelector)) {
        return htmlSelector.slice(TROLLEY_HTML_SELECTOR_HEAD.length, htmlSelector.length);
      }
      throw new Error('Not a trolley commodity selector');
    }

    function isCommodityHtmlSelector(htmlSelector) {
      var firstLetters = htmlSelector.slice(0, COMMODITY_HTML_SELECTOR_HEAD.length);
      return firstLetters === COMMODITY_HTML_SELECTOR_HEAD;
    }

    function isTrolleyCommodityHtmlSelector(htmlSelector) {
      var firstLetters = htmlSelector.slice(0, TROLLEY_HTML_SELECTOR_HEAD.length);
      return firstLetters === TROLLEY_HTML_SELECTOR_HEAD;
    }

    function findParentCommodityId(evt) {
      for (var i = 0; i < evt.path.length; i++) {
        var htmlSelector = window.utils.htmlIdToHtmlSelector(evt.path[i].id);

        if (isCommodityHtmlSelector(htmlSelector)) {
          return commodityHtmlSelectorToCommodityId(htmlSelector);
        }

        if (isTrolleyCommodityHtmlSelector(htmlSelector)) {
          return trolleyHtmlSelectorToCommodityId(htmlSelector);
        }
      }
      return false;
    }
  };


  /*
   *
   */

  function fulfillFilterAmount(obj) {
    updateFilterAmount(FilterForm.CATEGORIES, FilterForm.VALUE_SELECTOR, obj.catalog.getCategoryCount.bind(obj.catalog));
    updateFilterAmount(FilterForm.INGREDIENTS, FilterForm.VALUE_SELECTOR, obj.catalog.getIngredientsCount.bind(obj.catalog));
    obj.updateFavoriteAmount();
    updateFilterAmount(FilterForm.IN_STOCK, FilterForm.VALUE_SELECTOR, obj.catalog.getInStockCount.bind(obj.catalog));
  }

  function updateFilterAmount(list, valueSelector, getAmount) {
    list.forEach(function (item) {
      var htmlId = Object.keys(item)[0];
      var category = item[htmlId];
      var selector = window.utils.htmlIdToHtmlSelector(htmlId) + ' ~ ' + valueSelector;
      var valueFormatted = '(' + getAmount(category) + ')';
      window.utils.setDomTextContent(document, selector, valueFormatted);
    });
  }

})();
