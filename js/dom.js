'use strict';

/*
 * Make DOM from the catalog of goods and the trolley
 */

(function () {

  var COMMODITY_HTML_SELECTOR_HEAD = '#commodity';
  var TROLLEY_HTML_SELECTOR_HEAD = '#trolley-commodity';

  var ADD_TO_TROLLEY_HTML_CLASS = 'card__btn';
  var ADD_TO_FAVORITE_HTML_CLASS = 'card__btn-favorite';
  var INCREASE_TROLLEY_HTML_CLASS = 'card-order__btn--increase';
  var DECREASE_TROLLEY_HTML_CLASS = 'card-order__btn--decrease';
  var TROLLEY_AMOUNT_HTML_CLASS = 'card-order__count';
  var DELETE_TROLLEY_HTML_CLASS = 'card-order__close';

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
      var actualAmount = amount;
      if (!actualAmount) {
        actualAmount = 1;
      }
      var taken = this.catalog.takeItem(commodityId, actualAmount);
      if (taken <= 0) {
        return;
      }
      this.trolley.putItem(commodityId, actualAmount);
      this.updateCommodityView(commodityId);
      this.updateTrolleyView(commodityId);
    };

    this.takeFromTrolley = function (commodityId, amount) {
      var actualAmount = amount;
      if (!actualAmount) {
        actualAmount = 1;
      }
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
      return favoriteStatus;
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
        case (evt.target.classList.contains(DELETE_TROLLEY_HTML_CLASS)):
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
      var node = document.createDocumentFragment();
      for (var i = 0; i < this.catalog.getCount(); i++) {
        node.appendChild(this.catalogNodes[i]);
      }
      document.querySelector(this.catalogParentHtmlSelector).appendChild(node);
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

    this.createCatalogDom = function () {
      var template = this.catalogHtmlTemplate;
      var result = this.catalog.getGoods().map(function (item) {
        return new window.CatalogItemDom(item, template);
      });
      return result;
    };

    this.createTrolleyDom = function () {
      var template = this.trolleyHtmlTemplate;
      var result = this.trolley.getGoods().map(function (item) {
        return new window.TrolleyItemDom(item, template);
      });
      return result;
    };


    /*
     * Constructor body
     */

    this.catalog = catalog;
    this.trolley = trolley;

    this.catalogHtmlTemplate = document.querySelector(catalogHtmlTemplateSelector);
    this.trolleyHtmlTemplate = document.querySelector(trolleyHtmlTemplateSelector);

    this.catalogParentHtmlSelector = catalogParentHtmlSelector;
    this.trolleyParentHtmlSelector = trolleyParentHtmlSelector;

    this.catalogNodes = this.createCatalogDom();
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

})();
