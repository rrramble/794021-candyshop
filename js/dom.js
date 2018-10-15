'use strict';

/*
 * Make DOM from the catalog/trolley content
 */

(function () {

  var COMMODITY_HTML_SELECTOR_HEAD = '#commodity';
  var COMMODITY_HTML_ID_HEAD = 'commodity';

  var TROLLEY_HTML_SELECTOR_HEAD = '#trolley-commodity';
  var TROLLEY_HTML_ID_HEAD = 'trolley-commodity';
  var TROLLEY_TOTAL_DOM_NODE = document.querySelector('.main-header__basket');
  var NO_COMMODITY_IN_TROLLEY_MESSAGE = 'В корзине ничего нет';

  var CATALOG_WRAPPER_SELECTOR = '.catalog__cards-wrap';
  var CATALOG_LOADING_MESSAGE_DOM_NODE = document.querySelector('.catalog__load');

  var ADD_TO_TROLLEY_HTML_CLASS = 'card__btn';
  var TOGGLE_FAVORITE_HTML_CLASS = 'card__btn-favorite';

  var INCREASE_TROLLEY_HTML_CLASS = 'card-order__btn--increase';
  var DECREASE_TROLLEY_HTML_CLASS = 'card-order__btn--decrease';
  var TROLLEY_AMOUNT_HTML_CLASS = 'card-order__count';
  var DELETE_FROM_TROLLEY_HTML_CLASS = 'card-order__close';

  var TROLLEY_EMPTY_CLASS = 'goods__cards--empty';
  var TROLLEY_EMPTY_DOM_NODE = document.querySelector('.goods__card-empty');

  var EMPTY_FILTER_TEMPLATE_SELECTOR = '#empty-filters';
  var EMPTY_FILTER_HTML_SELECTOR = '.catalog__empty-filter'

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
      var amountNode = parentDom ? parentDom : getTrolleyDomNodeOfCommodityId(commodityId);
      var selector = window.utils.convertHtmlClassToHtmlSelector(TROLLEY_AMOUNT_HTML_CLASS);
      amountNode.querySelector(selector).value = this.trolley.getAmount(commodityId);
    };

    this.isCommodityDrawnInTrolley = function (commodityId) {
      var htmlId = convertCommodityIdToTrolleySelector(commodityId);
      var found = document.querySelector(htmlId);
      return !!found;
    };

    this.putToTrolley = function (commodityId, amount) {
      var actualAmount = amount ? amount : 1;
      var taken = this.catalog.takeItem(commodityId, actualAmount);
      if (taken <= 0) {
        return;
      }
      this.trolley.putItem(commodityId, actualAmount);
      this.updateCommodityView(commodityId);
      this.updateTrolleyView(commodityId);
      if (this.trolley.getCount() > 0 && this.onTrolleyNotEmpty) {
        this.onTrolleyNotEmpty();
      }
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

      if (this.trolley.getCount() <= 0 && this.onTrolleyEmpty) {
        this.onTrolleyEmpty();
      }
    };

    this.getTrolleyAmountFromThePage = function (commodityId) {
      var htmlSelector = convertCommodityIdToTrolleySelector(commodityId);
      var commodityNode = document.querySelector(htmlSelector);
      var valueSelector = window.utils.convertHtmlClassToHtmlSelector(TROLLEY_AMOUNT_HTML_CLASS);
      return window.utils.getDomValue(commodityNode, valueSelector);
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
      updateFilterAmount(
          FilterForm.FAVORITE,
          FilterForm.VALUE_SELECTOR,
          this.catalog.getFavoriteCount.bind(this.catalog)
      );
    };

    this.commodityClickHandler = function (evt) {
      var commodityId = findParentCommodityId(evt);
      if (!window.utils.isNumber(commodityId)) {
        return;
      }

      switch (true) {
        case (evt.target.classList.contains(ADD_TO_TROLLEY_HTML_CLASS)):
        case (evt.target.classList.contains(INCREASE_TROLLEY_HTML_CLASS)):
          evt.preventDefault();
          this.putToTrolley(commodityId);
          break;
        case (evt.target.classList.contains(DECREASE_TROLLEY_HTML_CLASS)):
          this.takeFromTrolley(commodityId);
          break;
        case (evt.target.classList.contains(DELETE_FROM_TROLLEY_HTML_CLASS)):
          evt.preventDefault();
          this.takeFromTrolley(commodityId, this.trolley.getAmount(commodityId));
          break;
        case (evt.target.classList.contains(TOGGLE_FAVORITE_HTML_CLASS)):
          evt.preventDefault();
          this.toggleFavorite(commodityId);
          this.applyFilter();
          break;
      }
    };

    this.trolleyChangeHandler = function (evt) {
      var commodityId = findParentCommodityId(evt);
      if (!window.utils.isNumber(commodityId)) {
        return;
      }
      if (evt.target.classList.contains(TROLLEY_AMOUNT_HTML_CLASS)) {
        this.setAmountInTrolley(commodityId);
      }
    };

    this.updateCommodityView = function (commodityId) {
      var newCommodityDom = new window.CatalogItemDom(
          this.catalog.getItem(commodityId),
          this.catalogHtmlTemplate
      );
      this.catalogNodes[commodityId] = newCommodityDom;

      window.utils.replaceDomItem(
          document,
          convertCommodityIdToHtmlSelector(commodityId),
          newCommodityDom
      );
      this.checkAndRenderCatalogPlaceholder();
    };

    this.replaceDomInTrolley = function (commodityId) {
      var newCommodityDom = this.trolleyNodes[commodityId];
      window.utils.replaceDomItem(
          document,
          convertCommodityIdToTrolleySelector(commodityId),
          newCommodityDom
      );
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
        deleteDisplayingInTrolley(commodityId);
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
        window.utils.hideDomNodeVisually(CATALOG_LOADING_MESSAGE_DOM_NODE);
      } else {
        window.utils.addCssClass('catalog__cards', 'catalog__cards--load');
        window.utils.showDomNodeVisually(CATALOG_LOADING_MESSAGE_DOM_NODE);
      }
      if (this.catalog.getUnfilteredCount() <= 0) {
        window.utils.showDomNodeVisually(emptyFilterDomNode);
      } else {
        window.utils.hideDomNodeVisually(emptyFilterDomNode);
      }
    };

    this.checkAndRenderTrolleyPlaceholder = function () {
      if (this.trolley.isEmpty()) {
        window.utils.showDomNodeVisually(TROLLEY_EMPTY_DOM_NODE);
        window.utils.addCssClass('goods__cards', TROLLEY_EMPTY_CLASS);
      } else {
        window.utils.hideDomNodeVisually(TROLLEY_EMPTY_DOM_NODE);
        window.utils.removeCssClass('goods__cards', TROLLEY_EMPTY_CLASS);
      }
    };

    this.updateTrolleyInfo = function () {
      if (this.trolley.isEmpty()) {
        TROLLEY_TOTAL_DOM_NODE.textContent = NO_COMMODITY_IN_TROLLEY_MESSAGE;
      } else {
        var text = 'Товаров в корзине: ' + this.trolley.getCount();
        text += ' , на сумму: ' + this.trolley.getTotalOrderedSum() + ' ₽';
        TROLLEY_TOTAL_DOM_NODE.textContent = text;
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
        window.utils.removeFirstDomSelector(convertCommodityIdToHtmlSelector(i));
      });

      // Render new DOM of goods
      document.querySelector(this.catalogParentHtmlSelector).appendChild(tempNode);
      this.checkAndRenderCatalogPlaceholder();
    };

    this.renderTrolleyDom = function () {
      var node = document.createDocumentFragment();
      var nodes = this.trolleyNodes;
      this.trolley.getGoods().reduce(function (accu, commodity) {
        return commodity.amount <= 0 ? node :
          node.appendChild(nodes[commodity.id]);
      }, node);
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

    this.applyFilter = function () {
      this.catalog.applyFilter(
          getCheckedInputs(FilterForm.CATEGORIES),
          getCheckedInputs(FilterForm.INGREDIENTS),
          getCheckedInputs(FilterForm.FAVORITE),
          getCheckedInputs(FilterForm.IN_STOCK),
          getMinPinInputRangeValue(true),
          getMinPinInputRangeValue(false),
          getSortingType()
      );
      this.renderCatalogDom();
    };

    this.filterFormHandler = function (evt, resetPriceRangeCb) {
      switch (true) {
        case isShowAllPressed(evt):
          evt.preventDefault();
          uncheckSectionInputs(FilterForm.CATEGORIES);
          uncheckSectionInputs(FilterForm.INGREDIENTS);
          uncheckSectionInputs(FilterForm.IN_STOCK);
          uncheckSectionInputs(FilterForm.FAVORITE);
          disableFilterSections(false);
          setSortingByPopular();
          break;
        case isFavoritePressed(evt) && isFavoriteChecked():
          evt.preventDefault();
          uncheckSectionInputs(FilterForm.IN_STOCK);
          disableFilterSections(true);
          break;
        case (isInStockPressed(evt) && isInStockChecked()):
          evt.preventDefault();
          uncheckSectionInputs(FilterForm.FAVORITE);
          disableFilterSections(true);
          break;
        case isFavoritePressed(evt) || isInStockPressed(evt):
          evt.preventDefault();
          disableFilterSections(false);
          break;
      }

      if (resetPriceRangeCb) {
        resetPriceRangeCb();
      }
      this.applyFilter();
      return;

    }; // filterFormHandler

    this.setFunctionOnTrolleyEmpty = function (func) {
      this.onTrolleyEmpty = func;
      if (this.trolley.isEmpty()) {
        func();
      }
    };

    this.setFunctionOnTrolleyNotEmpty = function (func) {
      this.onTrolleyNotEmpty = func;
      if (this.trolley.getCount() > 0) {
        func();
      }
    };

    var fulfillFilterAmount = function (obj) {
      updateFilterAmount(FilterForm.CATEGORIES, FilterForm.VALUE_SELECTOR, obj.catalog.getCategoryCount.bind(obj.catalog));
      updateFilterAmount(FilterForm.INGREDIENTS, FilterForm.VALUE_SELECTOR, obj.catalog.getIngredientsCount.bind(obj.catalog));
      obj.updateFavoriteAmount();
      updateFilterAmount(FilterForm.IN_STOCK, FilterForm.VALUE_SELECTOR, obj.catalog.getInStockCount.bind(obj.catalog));
    };

    var updateFilterAmount = function (list, valueSelector, getAmount) {
      list.forEach(function (item) {
        var htmlId = Object.keys(item)[0];
        var category = item[htmlId];
        var selector = window.utils.convertHtmlIdToHtmlSelector(htmlId) + ' ~ ' + valueSelector;
        var valueFormatted = '(' + getAmount(category) + ')';
        window.utils.setDomTextContent(document, selector, valueFormatted);
      });
    };


    /*
     * Beginning of the constructor
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
        this.commodityClickHandler.bind(this),
        'click'
    );
    window.utils.setDomEventHandler(
        document,
        this.trolleyParentHtmlSelector,
        this.commodityClickHandler.bind(this),
        'click'
    );

    window.utils.setDomEventHandler(
        document,
        this.trolleyParentHtmlSelector,
        this.trolleyChangeHandler.bind(this),
        'change'
    );

    // Draw a section 'Find no goods fitting selected filters'
    var fragmentNode = document.createDocumentFragment();
    var templateNode = document.querySelector(EMPTY_FILTER_TEMPLATE_SELECTOR).content.cloneNode(true);
    fragmentNode.appendChild(templateNode);
    document.querySelector(CATALOG_WRAPPER_SELECTOR).appendChild(fragmentNode);
    var emptyFilterDomNode = document.querySelector(EMPTY_FILTER_HTML_SELECTOR);

    this.renderCatalogDom();
    this.renderTrolleyDom();
    fulfillFilterAmount(this);
    return this;

    /*
     * End of constructor
     */
  };


  var deleteDisplayingInTrolley = function (commodityId) {
    var commodityNode = document.querySelector(convertCommodityIdToTrolleySelector(commodityId));
    commodityNode.remove();
  };

  var getCheckedInputs = function (listOfInputs) {
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
  };

  var getMinPinInputRangeValue = function (isMin) {
    if (isMin) {
      var textSelector = Filter.MIN_RANGE_BTN_TEXT_SELECTOR;
      var pinSelector = Object.keys(FilterForm.RANGE_PINS[0])[0];
    } else {
      textSelector = Filter.MAX_RANGE_BTN_TEXT_SELECTOR;
      pinSelector = Object.keys(FilterForm.RANGE_PINS[1])[0];
    }
    if (window.utils.isHtmlSelectorDisabled(pinSelector)) {
      return isMin ? -Infinity : +Infinity;
    }
    return window.utils.getDomTextContent(document, textSelector);
  };

  var getSortingType = function () {
    var result = FilterForm.SORTING_TYPES.reduce(function (currentType, item) {
      var htmlId = Object.keys(item)[0];
      var type = item[htmlId];
      currentType = window.utils.isHtmlIdChecked(htmlId) ? type : currentType;
      return currentType;
    }, '');
    return result;
  };

  var disableFilterSections = function (shouldBeDisabled) {
    disableInputs(FilterForm.CATEGORIES, shouldBeDisabled);
    disableInputs(FilterForm.INGREDIENTS, shouldBeDisabled);
    disableButtons(FilterForm.RANGE_PINS, shouldBeDisabled);
  };

  var isShowAllPressed = function (ownEvt) {
    return ownEvt.srcElement.classList.contains(FilterForm.SHOW_ALL_HTML_CLASS);
  };

  var isFavoritePressed = function (ownEvt) {
    var key = Object.keys(FilterForm.FAVORITE[0])[0];
    return ownEvt.srcElement.id === key;
  };

  var isFavoriteChecked = function () {
    return isSectionChecked(FilterForm.FAVORITE);
  };

  var isInStockPressed = function (ownEvt) {
    var key = Object.keys(FilterForm.IN_STOCK[0])[0];
    return ownEvt.srcElement.id === key;
  };

  var isInStockChecked = function () {
    return isSectionChecked(FilterForm.IN_STOCK);
  };

  var isSectionChecked = function (section) {
    var id = Object.keys(section[0])[0];
    return window.utils.isHtmlIdChecked(id);
  };

  var uncheckSectionInputs = function (formList, exceptionId) {
    formList.forEach(function (item) {
      var id = Object.keys(item)[0];
      if (exceptionId && (exceptionId === id || exceptionId.includes(id))) {
        return;
      }
      window.utils.setInputHtmlIdCheck(id);
    });
  };

  var disableInputs = function (inputs, shouldBeDisabled) {
    inputs.forEach(function (input) {
      var id = Object.keys(input)[0];
      window.utils.disableHtmlId(shouldBeDisabled, id);
    });
  };

  var disableButtons = function (buttons, shouldBeDisabled) {
    buttons.forEach(function (button) {
      var selector = Object.keys(button)[0];
      window.utils.disableHtmlSelector(shouldBeDisabled, selector);
    });
  };

  var setSortingByPopular = function () {
    var htmlId = Object.keys(FilterForm.SORTING_TYPES[0])[0];
    window.utils.setInputHtmlIdCheck(htmlId, true);
  };

  var getTrolleyDomNodeOfCommodityId = function (commodityId) {
    var htmlSelector = convertCommodityIdToHtmlSelector(commodityId);
    return document.querySelector(htmlSelector);
  };

  var convertCommodityIdToHtmlSelector = function (commodityId) {
    return COMMODITY_HTML_SELECTOR_HEAD + commodityId;
  };

  var convertCommodityIdToTrolleySelector = function (commodityId) {
    return TROLLEY_HTML_SELECTOR_HEAD + commodityId;
  };

  var convertCommodityHtmlIdToCommodityId = function (htmlId) {
    return htmlId.slice(COMMODITY_HTML_ID_HEAD.length, htmlId.length);
  };

  var convertTrolleyHtmlIdToCommodityId = function (htmlId) {
    return htmlId.slice(TROLLEY_HTML_ID_HEAD.length, htmlId.length);
  };

  var isCommodityHtmlId = function (htmlId) {
    if (!htmlId) {
      return false;
    }
    var firstLetters = htmlId.slice(0, COMMODITY_HTML_SELECTOR_HEAD.length - 1);
    firstLetters = window.utils.convertHtmlIdToHtmlSelector(firstLetters);
    return firstLetters === COMMODITY_HTML_SELECTOR_HEAD;
  };

  var isTrolleyHtmlId = function (htmlId) {
    if (!htmlId) {
      return false;
    }
    var firstLetters = htmlId.slice(0, TROLLEY_HTML_SELECTOR_HEAD.length - 1);
    firstLetters = window.utils.convertHtmlIdToHtmlSelector(firstLetters);
    return firstLetters === TROLLEY_HTML_SELECTOR_HEAD;
  };

  var findParentCommodityId = function (evt) {
    var evtPath = evt.path || (evt.composedPath && evt.composedPath());
    var htmlId = evtPath.reduce(function (accu, path) {
      if (isCommodityHtmlId(path.id)) {
        return convertCommodityHtmlIdToCommodityId(path.id);
      } else if (isTrolleyHtmlId(path.id)) {
        return convertTrolleyHtmlIdToCommodityId(path.id);
      } else {
        return accu;
      }
    }, -1);

    if (htmlId !== -1) {
      return htmlId;
    }
    return undefined;
  };

})();
