'use strict';

/*
 * Текст задания:
 * https://up.htmlacademy.ru/javascript/15/tasks/16
 */

var COMMODITY_HTML_ID_HEAD = 'commodity';
var TROLLEY_HTML_ID_HEAD = 'trolley-commodity';

var GOODS_TEMPLATE_ID = 'card';
var GOODS_HTML_TAG_CLASS = 'catalog__cards';

var TROLLEY_TEMPLATE_ID = 'card-order';
var TROLLEY_HTML_TAG_CLASS = 'goods__cards';

var GOODS_IN_TROLLEY_COUNT = 3;

/*
 * Main logic
 */

var catalog;
var catalogDom;

(function () {
  catalog = new Catalog(window.mockGoods.get);
  catalogDom = new CatalogDom(catalog.getGoods(), GOODS_TEMPLATE_ID);
  renderGoods(catalogDom.getElements(), GOODS_HTML_TAG_CLASS);

  putRandomGoodsInTrolley(catalog.getGoods(), GOODS_IN_TROLLEY_COUNT);
  setInterfaceHandlers();
})();


/*
 * Make catalog of goods
 */

function Catalog(loadFunction) {
  this.getGoods = function () {
    return this.goods;
  };

  this.getTrolley = function () {
    var result = this.goods.filter(function (item) {
      return item.trolleyAmount > 0;
    });
    return result;
  };

  this.getElement = function (id) {
    return this.goods[id];
  };

  this.getAmount = function (id) {
    return this.goods[id].amount;
  };

  this.getTrolleyAmount = function (id) {
    return this.goods[id].trolleyAmount;
  };

  this.getTotalAmount = function (id) {
    return this.getAmount(id) + this.getTrolleyAmount(id);
  };

  this.getCount = function () {
    return this.goods.length;
  };

  this.addToTrolley = function (id, amount) {
    if (this.goods[id].amount >= amount) {
      this.goods[id].amount -= amount;
      this.goods[id].trolleyAmount += amount;
      return true;
    }
    return false;
  };

  this.setTrolleyAmount = function (id, amount) {
    var addition = amount - this.getTrolleyAmount(id);
    this.addToTrolley(id, addition);
  };

  this.isTrolleyEmpty = function () {
    function trolleyAmountEmpty(item) {
      return item.trolleyAmount <= 0;
    }

    var result = this.goods.every(trolleyAmountEmpty);
    return result;
  };

  this.toggleFavorite = function (id) {
    this.goods[id].favorite = !this.goods[id].favorite;
    return this.goods[id].favorite;
  };

  this.getFavoriteStatus = function (id) {
    return this.goods[id].favorite;
  };

  this.decreaseTrolley = function (id, amount) {
    var actualDecrease = Math.min(amount, this.goods[id].trolleyAmount);
    this.goods[id].amount += actualDecrease;
    this.goods[id].trolleyAmount -= actualDecrease;
  };

  // Costructor of the class

  this.goods = loadFunction();
}

function putRandomGoodsInTrolley(goods, amount) {
  for (var i = 0; i < amount; i++) {
    var index = window.utils.randomInRange(0, goods.length);
    catalog.addToTrolley(index, 1);
    updateDomGoods(index);
    updateDomTrolley(index);
  }
}

/*
 * Make DOM from the catalog of goods
 */


function CatalogDom(goods, templateHtmlId) {
  this.getElements = function () {
    return this.elements;
  };

  this.getElement = function (id) {
    return this.elements[id];
  };

  this.getCommodityDomElement = function (id) {
    var htmlId = idToHtmlId(id);
    var el = document.querySelector(htmlId);
    return el;
  };

  this.createCommodityNode = function (commodity) {
    var template = document.querySelector('#' + this.templateHtmlId);
    var newDom = template.content.cloneNode(true);

    setCommodityHtmlIds(newDom, commodity.id);
    setCommodityName(newDom, commodity.name);
    setCommodityImage(newDom, commodity.picture, commodity.name);
    setCommodityPrice(newDom, commodity.price);
    setCommodityWeight(newDom, commodity.weight);
    setCommodityStockAmount(newDom, commodity.amount);
    setCommodityRating(newDom, commodity.rating);
    setCommodityNutritionFacts(newDom, commodity.nutritionFacts);
    setCommodityFavorite(newDom, commodity.favorite);
    setCommodityHandlers(newDom);
    return newDom;
  };


  // Constructor body

  this.templateHtmlId = templateHtmlId;
  this.elements = [];
  for (var i = 0; i < goods.length; i++) {
    var node = this.createCommodityNode(goods[i]);
    this.elements.push(node);
  }
}

function setCommodityName(dom, data) {
  var element = dom.querySelector('.card__title');
  element.textContent = data;
}

function setCommodityImage(dom, data, htmlAltProperty) {
  var element = dom.querySelector('.card__img');
  element.src = data;
  element.alt = htmlAltProperty;
}

function setCommodityStockAmount(dom, data) {
  var htmlClass;
  if (data > 5) {
    htmlClass = 'card--in-stock';
  } else if (data >= 1 && data <= 5) {
    htmlClass = 'card--little';
  } else if (data === 0) {
    htmlClass = 'card--soon';
  }

  var element = window.utils.querySelectorIncludingSelf(dom, '.catalog__card');
  element.classList.remove('card--in-stock');
  element.classList.remove('card--little');
  element.classList.remove('card--soon');
  element.classList.add(htmlClass);
}

function setCommodityPrice(dom, data) {
  var priceElement = dom.querySelector('.card__price');
  var currencyElement = dom.querySelector('.card__currency');
  var weightElement = dom.querySelector('.card__weight');
  priceElement.textContent = data + ' ';
  priceElement.appendChild(currencyElement);
  priceElement.appendChild(weightElement);
}

function setCommodityWeight(dom, data) {
  var element = dom.querySelector('.card__weight');
  var weight = '/ ' + data + ' Г';
  element.textContent = weight;
}

function setCommodityRating(dom, data) {
  var htmlClass;
  var textRating = 'Рейтинг: ';
  if (data.value >= 4.5) {
    htmlClass = 'stars__rating--five';
    textRating += '5 звёзд';
  } else if (data.value >= 3.5 && data.value < 4.5) {
    htmlClass = 'stars__rating--four';
    textRating += '4 звeзды';
  } else if (data.value >= 2.5 && data.value < 3.5) {
    htmlClass = 'stars__rating--three';
    textRating += '3 звeзды';
  } else if (data.value >= 1.5 && data.value < 2.5) {
    htmlClass = 'stars__rating--two';
    textRating += '2 звeзды';
  } else if (data.value >= 0.5 && data.value < 1.5) {
    htmlClass = 'stars__rating--one';
    textRating += '1 звeзда';
  } else if (data.value >= 0.0 && data.value < 0.5) {
    htmlClass = 'stars__rating--zero';
    textRating += 'ноль звёзд';
  } else {
    htmlClass = '';
  }

  var element = dom.querySelector('.stars__rating');
  element.classList.remove('stars__rating--five');
  element.classList.add(htmlClass);
  element.textContent = textRating;

  element = dom.querySelector('.star__count');
  var number = '(' + data.number + ')';
  element.textContent = number;
}

function setCommodityNutritionFacts(dom, data) {
  var element = dom.querySelector('.card__composition-list');
  element.textContent = data.contents;

  element = dom.querySelector('.card__characteristic');
  var sugar = data.sugar ? 'С сахаром' : 'Без сахара';
  var sugarAndEnergy = sugar + '. ' + data.energy + ' ккал';
  element.textContent = sugarAndEnergy;
}

function setCommodityHtmlIds(dom, id) {
  var element = dom.querySelector('.catalog__card');
  element.id = idToHtmlId(id);
}

function setCommodityFavorite(dom, isFavorite) {
  var favorite = dom.querySelector('.card__btn-favorite');
  if (isFavorite) {
    favorite.classList.add('card__btn-favorite--selected');
  } else {
    favorite.classList.remove('card__btn-favorite--selected');
  }
}

function updateDomFavorite(commodityId, favoriteStatus) {
  var commodityHtmlId = idToHtmlId(commodityId);
  var commoditySelector = window.utils.htmlIdToHtmlSelector(commodityHtmlId);
  var commodityNode = document.querySelector(commoditySelector);
  setCommodityFavorite(commodityNode, favoriteStatus);
}

function updateDomGoods(commodityId) {
  var commodityHtmlId = idToHtmlId(commodityId);
  var commoditySelector = window.utils.htmlIdToHtmlSelector(commodityHtmlId);
  var commodityNode = document.querySelector(commoditySelector);
  var amount = catalog.getAmount(commodityId);
  setCommodityStockAmount(commodityNode, amount);
}

function updateDomTrolley(commodityId) {
  var trolleyAmount = catalog.getTrolleyAmount(commodityId);
  if (trolleyAmount <= 0) {
    deleteDisplayingFromTrolley(commodityId);
    if (catalog.isTrolleyEmpty()) {
      window.utils.showHtmlSelector('.goods__card-empty');
      window.utils.addCssClass('goods__cards', 'goods__cards--empty');
    }
    return;
  }

  if (isShownInTrolley(commodityId)) {
    var htmlTrolleyId = idToHtmlTrolleyId(commodityId);
    var htmlTrolleySelector = window.utils.htmlIdToHtmlSelector(htmlTrolleyId);
    var commodityNode = document.querySelector(htmlTrolleySelector);
    setTrolleyCommodityAmount(commodityNode, trolleyAmount);
  } else {
    var commodity = catalog.getElement(commodityId);
    var domElement = createDomOfTrolleyCommodityFromTemplate(
        commodity,
        TROLLEY_TEMPLATE_ID
    );
    renderItemInTrolley(domElement, TROLLEY_HTML_TAG_CLASS);
  }
  window.utils.hideHtmlSelector('.goods__card-empty');
  window.utils.removeCssClass('goods__cards', 'goods__cards--empty');
}


/*
 * Goods' elements handlers
 */

function setCommodityHandlers(dom) {
  var favoriteNode = dom.querySelector('.card__btn-favorite');
  favoriteNode.addEventListener('click', clickFavoriteHandler);

  var addToTrolleyNode = dom.querySelector('.card__btn');
  addToTrolleyNode.addEventListener('click', clickAddToTrolley);

  function clickFavoriteHandler(evt) {
    var commodityId = findParentCommodityId(evt);
    catalog.toggleFavorite(commodityId);
    var favoriteStatus = catalog.getFavoriteStatus(commodityId);
    updateDomFavorite(commodityId, favoriteStatus);
  }

  function clickAddToTrolley(evt) {
    var commodityId = findParentCommodityId(evt);
    catalog.addToTrolley(commodityId, 1);
    updateDomGoods(commodityId);
    updateDomTrolley(commodityId);
  }
}

/*
 * Trolley elements handlers
 */

function setTrolleyElementHandlers(dom) {
  var node = dom.querySelector('.card-order');
  node.addEventListener('click', clickTrolleyElement);
  node.addEventListener('change', enterTrolleyElement);
  return;
}

function clickTrolleyElement(evt) {
  var commodityId = findParentCommodityId(evt);

  if (evt.target.classList.contains('card-order__btn--increase')) {
    catalog.addToTrolley(commodityId, 1);

  } else if (evt.target.classList.contains('card-order__btn--decrease')) {
    catalog.decreaseTrolley(commodityId, 1);

  } else if (evt.target.classList.contains('card-order__close')) {
    catalog.decreaseTrolley(commodityId, Infinity);

  } else {
    return;
  }
  updateDomGoods(commodityId);
  updateDomTrolley(commodityId);
}

function enterTrolleyElement(evt) {
  var commodityId = findParentCommodityId(evt);
  var previousValue = catalog.getTrolleyAmount(commodityId);
  var maxAmount = catalog.getTotalAmount(commodityId);
  var newValue = getElementTrolleyAmountInDom(commodityId) / 1.0;

  if (evt.target.classList.contains('card-order__count')) {
    if (
      newValue > maxAmount ||
        newValue <= 0 ||
        !window.utils.isNumber(newValue)
    ) {
      setTrolleyCommodityAmountInDom(commodityId, previousValue);
      return;

    } else {
      catalog.setTrolleyAmount(commodityId, newValue);
    }
    updateDomGoods(commodityId);
    updateDomTrolley(commodityId);
  }
}

function deleteTrolleyElementHandlers(dom) {
  dom.removeEventListener('click', clickTrolleyElement);
  dom.removeEventListener('change', enterTrolleyElement);
}


/*
 * Payment handlers
 */

function setPaymentHandlers() {
  var paymentTypeSelector = '.toggle-btn';
  var nodeCash = document.querySelector(paymentTypeSelector);
  nodeCash.addEventListener('click', clickCashPay);

  function clickCashPay() {
    var cardLabelSelector = '.toggle-btn__input[value="card"]';
    var cashLabelSelector = '.toggle-btn__input[value="cash"]';
    var cardFormSelector = '.payment__card-wrap';

    if (window.utils.isChecked(cardLabelSelector)) {
      window.utils.showHtmlSelector(cardFormSelector);

    } else if (window.utils.isChecked(cashLabelSelector)) {
      window.utils.hideHtmlSelector(cardFormSelector);

    } else {
      return;
    }
  }
}


function isShownInTrolley(commodityId) {
  var htmlIdToSearch = idToHtmlTrolleyId(commodityId);
  var nodes = document.querySelectorAll('.goods_card.card-order');
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].id === htmlIdToSearch) {
      return true;
    }
  }
  return false;
}

function idToHtmlId(id) {
  return COMMODITY_HTML_ID_HEAD + id;
}

function idToHtmlTrolleyId(id) {
  return TROLLEY_HTML_ID_HEAD + id;
}

function htmlIdToId(htmlId) {
  if (isCommodityHtmlId(htmlId)) {
    var id = htmlId.slice(COMMODITY_HTML_ID_HEAD.length, htmlId.length);
    return id;
  }
  return undefined;
}

function trolleyIdToId(htmlId) {
  if (isTrolleyHtmlId(htmlId)) {
    var id = htmlId.slice(TROLLEY_HTML_ID_HEAD.length, htmlId.length);
    return id;
  }
  return undefined;
}

function isCommodityHtmlId(id) {
  var firstLetters = id.slice(0, COMMODITY_HTML_ID_HEAD.length);
  if (firstLetters === COMMODITY_HTML_ID_HEAD) {
    return true;
  }
  return false;
}

function isTrolleyHtmlId(htmlId) {
  var firstLetters = htmlId.slice(0, TROLLEY_HTML_ID_HEAD.length);
  if (firstLetters === TROLLEY_HTML_ID_HEAD) {
    return true;
  }
  return false;
}

function findParentCommodityId(htmlClasses) {
  for (var i = 0; i < htmlClasses.path.length; i++) {
    var htmlClass = htmlClasses.path[i].id;

    if (isCommodityHtmlId(htmlClass)) {
      return htmlIdToId(htmlClass);
    }

    if (isTrolleyHtmlId(htmlClass)) {
      return trolleyIdToId(htmlClass);
    }
  }
  return undefined;
}


/*
 * Render DOM of the catalog of goods
 */

function renderGoods(domElements, htmlClass) {
  for (var i = 0; i < domElements.length; i++) {
    renderCommodity(domElements[i], htmlClass);
  }
  if (domElements.length > 0) {
    window.utils.removeCssClass('catalog__cards', 'catalog__cards--load');
    window.utils.hideHtmlSelector('.catalog__load');
  }
}

function renderCommodity(domElement, htmlClass) {
  var htmlSelector = window.utils.htmlClassToSelector(htmlClass);
  var dom = document.querySelector(htmlSelector);
  dom.appendChild(domElement);
}


/*
 * Make DOM from the trolley content
 */

function createDomOfTrolleyCommodityFromTemplate(commodity, templateHtmlId) {
  var htmlSelector = window.utils.htmlIdToHtmlSelector(templateHtmlId);
  var template = document.querySelector(htmlSelector);
  var newDom = template.content.cloneNode(true);

  setTrolleyCommodityHtmlId(newDom, commodity.id);
  setTrolleyCommodityName(newDom, commodity.name);
  setTrolleyCommodityImage(newDom, commodity.picture, commodity.name);
  setTrolleyCommodityPrice(newDom, commodity.price);
  setTrolleyCommodityAmount(newDom, commodity.trolleyAmount);
  setTrolleyElementHandlers(newDom);
  return newDom;
}

function setTrolleyCommodityHtmlId(dom, id) {
  var element = window.utils.querySelectorIncludingSelf(dom, '.card-order');
  element.id = idToHtmlTrolleyId(id);
}

function setTrolleyCommodityAmount(dom, trolleyAmount) {
  var amountNode = window.utils.querySelectorIncludingSelf(dom, '.card-order__count');
  amountNode.value = trolleyAmount;
}

function setTrolleyCommodityAmountInDom(commodityId, trolleyAmount) {
  var htmlTrolleyId = idToHtmlTrolleyId(commodityId);
  var htmlTrolleySelector = window.utils.htmlIdToHtmlSelector(htmlTrolleyId);
  var amountNode = document.querySelector(htmlTrolleySelector);
  var node = amountNode.querySelector('.card-order__count');
  node.value = trolleyAmount;
}

function getElementTrolleyAmountInDom(commodityId) {
  var htmlTrolleyId = idToHtmlTrolleyId(commodityId);
  var htmlTrolleySelector = window.utils.htmlIdToHtmlSelector(htmlTrolleyId);
  var amountNode = document.querySelector(htmlTrolleySelector);
  var node = amountNode.querySelector('.card-order__count');
  return node.value;
}

function deleteDisplayingFromTrolley(commodityId) {
  var htmlTrolleyId = idToHtmlTrolleyId(commodityId);
  var htmlTrolleySelector = window.utils.htmlIdToHtmlSelector(htmlTrolleyId);
  var commodityNode = document.querySelector(htmlTrolleySelector);
  if (commodityNode) {
    deleteTrolleyElementHandlers(commodityNode);
    commodityNode.remove();
  }
}

function setTrolleyCommodityName(dom, name) {
  var element = dom.querySelector('.card-order__title');
  element.textContent = name;
}

function setTrolleyCommodityImage(dom, imageUrl, imageAlt) {
  var element = dom.querySelector('.card-order__img');
  element.src = imageUrl;
  element.alt = imageAlt;
}

function setTrolleyCommodityPrice(dom, value) {
  var element = dom.querySelector('.card-order__price');
  element.textContent = value;
}


/*
 * Render DOM of the trolley content
 */

function renderItemInTrolley(domElement, htmlClass) {
  var htmlSelector = window.utils.htmlClassToSelector(htmlClass);
  var addTo = document.querySelector(htmlSelector);
  addTo.appendChild(domElement);
}

function setInterfaceHandlers() {
  var paymentSelector = '.payment';
  var node = document.querySelector(paymentSelector);
  node.addEventListener('click', setPaymentHandlers);
}
