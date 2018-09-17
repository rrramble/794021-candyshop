'use strict';

/*
 * Текст задания:
 * https://up.htmlacademy.ru/javascript/15/tasks/16
 */

var WAT = 'Wat eez dat?';

var SELECTOR_HIDDEN = '.visually-hidden';
var COMMODITY_HTML_ID_HEAD = 'commodity';
var TROLLEY_HTML_ID_HEAD = 'trolley-commodity';

var GOODS_COUNT = 20;
var GOODS_IN_TROLLEY_COUNT = 3;

var AMOUNT_MIN = 0;
var AMOUNT_MAX = 100;

var PRICE_MIN = 100;
var PRICE_MAX = 1500;

var WEIGHT_MIN = 30;
var WEIGHT_MAX = 300;

var RATING_VALUE_MIN = 1;
var RATING_VALUE_MAX = 5;

var RATING_NUMBER_MIN = 10;
var RATING_NUMBER_MAX = 900;

var ENERGY_MIN = 70;
var ENERGY_MAX = 500;

var SUGARS = [false, true];

var NAMES = [
  'Чесночные сливки',
  'Огуречный педант',
  'Молочная хрюша',
  'Грибной шейк',
  'Баклажановое безумие',
  'Паприколу итальяно',
  'Нинзя-удар васаби',
  'Хитрый баклажан',
  'Горчичный вызов',
  'Кедровая липучка',
  'Корманный портвейн',
  'Чилийский задира',
  'Беконовый взрыв',
  'Арахис vs виноград',
  'Сельдерейная душа',
  'Початок в бутылке',
  'Чернющий мистер чеснок',
  'Раша федераша',
  'Кислая мина',
  'Кукурузное утро',
  'Икорный фуршет',
  'Новогоднее настроение',
  'С пивком потянет',
  'Мисс креветка',
  'Бесконечный взрыв',
  'Невинные винные',
  'Бельгийское пенное',
  'Острый язычок'
];

var PICTURES = [
  'img/cards/gum-cedar.jpg',
  'img/cards/gum-chile.jpg',
  'img/cards/gum-eggplant.jpg',
  'img/cards/gum-mustard.jpg',
  'img/cards/gum-portwine.jpg',
  'img/cards/gum-wasabi.jpg',
  'img/cards/ice-cucumber.jpg',
  'img/cards/ice-eggplant.jpg',
  'img/cards/ice-garlic.jpg',
  'img/cards/ice-italian.jpg',
  'img/cards/ice-mushroom.jpg',
  'img/cards/ice-pig.jpg',
  'img/cards/marmalade-beer.jpg',
  'img/cards/marmalade-caviar.jpg',
  'img/cards/marmalade-corn.jpg',
  'img/cards/marmalade-new-year.jpg',
  'img/cards/marmalade-sour.jpg',
  'img/cards/marshmallow-bacon.jpg',
  'img/cards/marshmallow-beer.jpg',
  'img/cards/marshmallow-shrimp.jpg',
  'img/cards/marshmallow-spicy.jpg',
  'img/cards/marshmallow-wine.jpg',
  'img/cards/soda-bacon.jpg',
  'img/cards/soda-celery.jpg',
  'img/cards/soda-cob.jpg',
  'img/cards/soda-garlic.jpg',
  'img/cards/soda-peanut-grapes.jpg',
  'img/cards/soda-russian.jpg'
];

var CONTENTS = [
  'молоко',
  'сливки',
  'вода',
  'пищевой краситель',
  'патока',
  'ароматизатор бекона',
  'ароматизатор свинца',
  'ароматизатор дуба, идентичный натуральному',
  'ароматизатор картофеля',
  'лимонная кислота',
  'загуститель',
  'эмульгатор',
  'консервант: сорбат калия',
  'посолочная смесь: соль, нитрат натрия',
  'ксилит',
  'карбамид',
  'вилларибо',
  'виллабаджо'
];

var GOODS_TEMPLATE_ID = 'card';
var GOODS_HTML_TAG_CLASS = 'catalog__cards';

var TROLLEY_TEMPLATE_ID = 'card-order';
var TROLLEY_HTML_TAG_CLASS = 'goods__cards';

var Commodity = function (
    index,
    name,
    picture,
    amount,
    price,
    weight,
    rating,
    nutritionFacts
) {
  this.id = index;
  this.name = name;
  this.picture = picture;
  this.amount = amount;
  this.price = price;
  this.weight = weight;
  this.rating = rating;
  this.nutritionFacts = nutritionFacts;
};


/*
 * Main logic
 */

var catalog;
var catalogDom;
var trolleyGoods;

(function () {
  catalog = new Catalog(generateGoods);
  catalogDom = new CatalogDom(catalog.getGoods(), GOODS_TEMPLATE_ID);
  renderGoods(catalogDom.getElements(), GOODS_HTML_TAG_CLASS);

  putRandomGoodsInTrolley(catalog.getGoods(), GOODS_IN_TROLLEY_COUNT);
  setInterfaceHandlers();
})();


/*
 * Make catalog of goods
 */

function Catalog(loadFunction) {
  this.getGoods = function() {
    return this.goods;
  }

  this.getTrolley = function() {
    var result = this.goods.filter(function(item){
      return item.trolleyAmount > 0;
    });
    return result;
  }

  this.getElement = function(id) {
    return this.goods[id];
  }

  this.getAmount = function(id) {
    return this.goods[id].amount;
  }

  this.getTrolleyAmount = function(id) {
    return this.goods[id].trolleyAmount;
  }

  this.getTotalAmount = function(id) {
    return this.getAmount(id) + this.getTrolleyAmount(id);
  }

  this.getCount = function() {
    return this.goods.length;
  }

  this.addToTrolley = function(id, amount) {
    if (this.goods[id].amount >= amount) {
      this.goods[id].amount -= amount;
      this.goods[id].trolleyAmount += amount;
      return true;
    };
    return false;
  }

  this.setTrolleyAmount = function(id, amount) {
    var addition = amount - this.getTrolleyAmount(id);
    this.addToTrolley(id, addition);
  }

  this.isTrolleyEmpty = function() {
    function trolleyAmountEmpty(item) {
      return item.trolleyAmount <= 0 ? true : false;
    };

    var result = this.goods.every(trolleyAmountEmpty);
    return result;
  }

  this.toggleFavorite = function(id) {
    this.goods[id].favorite = !this.goods[id].favorite;
    return this.goods[id].favorite;
  }

  this.getFavoriteStatus = function(id) {
    return this.goods[id].favorite;
  }

  this.decreaseTrolley = function(id, amount) {
    var actualDecrease = Math.min(amount, this.goods[id].trolleyAmount);
    this.goods[id].amount += actualDecrease;
    this.goods[id].trolleyAmount -= actualDecrease;
  }

  // Costructor of the class

  this.loaded = false;
  this.goods = loadFunction();
  if (this.getCount() > 0 ) {
    this.loaded = true;
  }
}

function generateGoods() {
  var goods = [];
  for (var i = 0; i < GOODS_COUNT; i++) {
    var commodity = fulfillCommodity(generateCommodity(i));
    goods.push(commodity);
  }
  return goods;
}

function generateCommodity(index) {
  var commodity = new Commodity(index);
  return commodity;
}

function fulfillCommodity(commodity) {
  commodity.name = getRandomItemFromList(NAMES);
  commodity.picture = getRandomItemFromList(PICTURES);
  commodity.amount = randomInRangeUpTo(
    AMOUNT_MIN, AMOUNT_MAX
  );
  commodity.trolleyAmount = 0;
  commodity.price = randomInRangeUpTo(PRICE_MIN, PRICE_MAX);
  commodity.weight = randomInRangeUpTo(WEIGHT_MIN, WEIGHT_MAX);
  commodity.rating = getRating();
  commodity.nutritionFacts = getNutritionFacts();
  commodity.favorite = false;
  return commodity;
}

function getRating() {
  var rating = {};
  rating.value = randomInRangeUpTo(RATING_VALUE_MIN, RATING_VALUE_MAX);
  rating.number = randomInRangeUpTo(RATING_NUMBER_MIN, RATING_NUMBER_MAX);
  return rating;
}

function getNutritionFacts() {
  var nutritionFacts = {};
  nutritionFacts.sugar = getRandomItemFromList(SUGARS);
  nutritionFacts.energy = randomInRangeUpTo(ENERGY_MIN, ENERGY_MAX);
  nutritionFacts.contents = getContents();
  return nutritionFacts;
}

function getContents() {
  var randomContents = getRandomListFromList(CONTENTS);
  var result = randomContents.join('; ');
  result += '.';
  return result;
}

function putRandomGoodsInTrolley(goods, amount) {
  for (var i = 0; i < amount; i++) {
    var index = randomInRange(0, goods.length);
    catalog.addToTrolley(index, 1);
    updateDomGoods(index);
    updateDomTrolley(index);
  }
}


/*
 * Make DOM from the catalog of goods
 */

 function CatalogDom(goods, templateHtmlId) {
  this.getElements = function(id) {
    return this.elements;
  }

  this.getElement = function(id) {
    return this.elements[id];
  }

  this.getCommodityDomElement = function(id) {
    var htmlId = idToHtmlId(id);
    var el = document.querySelector(htmlId);
    return el;
  }

  this.createCommodityNode = function(commodity) {
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
    setCommodityHandlers(newDom)
    return newDom;
  }


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

  var element = querySelectorIncludingSelf(dom, '.catalog__card');
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
  var element = dom.querySelector('.catalog__card')
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
  var commoditySelector = htmlIdToHtmlSelector(commodityHtmlId);
  var commodityNode = document.querySelector(commoditySelector);
  setCommodityFavorite(commodityNode, favoriteStatus);
}

function updateDomGoods(commodityId) {
  var commodityHtmlId = idToHtmlId(commodityId);
  var commoditySelector = htmlIdToHtmlSelector(commodityHtmlId);
  var commodityNode = document.querySelector(commoditySelector);
  var amount = catalog.getAmount(commodityId);
  setCommodityStockAmount(commodityNode, amount);
}

function updateDomTrolley(commodityId) {
  var trolleyAmount = catalog.getTrolleyAmount(commodityId);
  if (trolleyAmount <= 0) {
    deleteDisplayingFromTrolley(commodityId);
    if (catalog.isTrolleyEmpty()) {
      showHtmlSelector('.goods__card-empty');
      addCssClass('goods__cards', 'goods__cards--empty');
    }
    return;
  };

  if (isShownInTrolley(commodityId)) {
    var htmlTrolleyId = idToHtmlTrolleyId(commodityId);
    var htmlTrolleySelector = htmlIdToHtmlSelector(htmlTrolleyId);
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
  hideHtmlSelector('.goods__card-empty');
  removeCssClass('goods__cards', 'goods__cards--empty');
}

function setCommodityHandlers(dom) {
  var favoriteNode = dom.querySelector('.card__btn-favorite');
  favoriteNode.addEventListener('click', clickOnFavoriteHandler);

  var addToTrolleyNode = dom.querySelector('.card__btn');
  addToTrolleyNode.addEventListener('click', clickOnAddToTrolley);

  function clickOnFavoriteHandler(evt) { // delete 'On'
    var commodityId = findParentCommodityId(evt);
    catalog.toggleFavorite(commodityId);
    var favoriteStatus = catalog.getFavoriteStatus(commodityId);
    updateDomFavorite(commodityId, favoriteStatus);
  }

  function clickOnAddToTrolley(evt) { // delete 'On'
    var commodityId = findParentCommodityId(evt);
    catalog.addToTrolley(commodityId, 1);
    updateDomGoods(commodityId);
    updateDomTrolley(commodityId);
  }
}

function setTrolleyElementHandlers(dom) {
  var node = dom.querySelector('.card-order');
  node.addEventListener('click', clickTrolleyElement);
  node.addEventListener('change', enterTrolleyElement)
  return;

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
      if (newValue > maxAmount) {
        setTrolleyCommodityAmountInDom(commodityId, previousValue);
        return;

      } else if (newValue < 0) {
        setTrolleyCommodityAmountInDom(commodityId, previousValue); /////
        return;

      } else if (newValue === 0) {
        catalog.decreaseTrolley(commodityId, Infinity);

      } else if (!isNumber(newValue)) {
        return;

      } else {
        catalog.setTrolleyAmount(commodityId, newValue);
      }
      updateDomGoods(commodityId);
      updateDomTrolley(commodityId);
    }
  }
}

function setPaymentHandlers() { ///////
  var paymentTypeSelector = '.toggle-btn';
  var nodeCash = document.querySelector(paymentTypeSelector);
  nodeCash.addEventListener('click', clickCashPay);

  function clickCashPay(evt) {
    var cardLabelSelector = '.toggle-btn__input[value="card"]';
    var cashLabelSelector = '.toggle-btn__input[value="cash"]';
    var cardFormSelector = '.payment__card-wrap';

    if (isChecked(cardLabelSelector)) {
      showHtmlSelector(cardFormSelector);

    } else if (isChecked(cashLabelSelector)) {
      hideHtmlSelector(cardFormSelector);

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

function htmlIdToHtmlSelector(id) {
  return '#' + id;
}

function idToHtmlSelector(id) {
  return '#' + idToHtmlId(id);
}

function htmlIdToId(id) {
  if (isCommodityHtmlId(id)) {
    var id = id.slice(COMMODITY_HTML_ID_HEAD.length, id.length);
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
  var node = document.createDocumentFragment();

  for (var i = 0; i < domElements.length; i++) {
    renderCommodity(domElements[i], htmlClass);
  }
  if (domElements.length > 0) {
    removeCssClass('catalog__cards', 'catalog__cards--load');
    hideHtmlSelector('.catalog__load');
  }
}

function renderCommodity(domElement, htmlClass) {
  var htmlSelector = htmlClassToSelector(htmlClass);
  var dom = document.querySelector(htmlSelector);
  dom.appendChild(domElement);
}


/*
 * Generate trolley content from the list of goods
 */

function fulfillTrolley(list) {
  var goodsInTrolley = [];
  for (var i = 0; i < GOODS_IN_TROLLEY_COUNT; i++) {
    var newGood = getRandomItemFromList(list);
    goodsInTrolley.push(newGood);
  }
  return goodsInTrolley;
}

function Trolley(goods, customTrolleyGenerator) {
  this.plus = function(id) {
    var index = this.getIndex(id);
    this.elements[index]++;
  }

  this.minus = function(id) {
    var index = this.getIndex(id);
    if (this.elements[index] > 1) {
      this.elements[index]--;
      return true;
    }
    else return false;
  }

  this.getIndex = function(id) {
    for (var i = 0; i < this.elements.length; i++) {
      if (this.elements[i].id === id) {
        return i;
      }
    }
    return undefined;
  }

  // Constructor block
  if (customTrolleyGenerator) {
    this.elements = customTrolleyGenerator(goods);
  }
}


/*
 * Make DOM from the trolley content
 */

function createTrolleyDomFromTemplate(goods, templateHtmlId) {
  var domElements = [];
  for (var i = 0; i < goods.length; i++) {
    var domElement = createDomOfTrolleyCommodityFromTemplate(goods[i], templateHtmlId);
    domElements.push(domElement);
  }
  return domElements;
}

function createDomOfTrolleyCommodityFromTemplate(commodity, templateHtmlId) {
  var htmlSelector = htmlIdToHtmlSelector(templateHtmlId);
  var template = document.querySelector(htmlSelector);
  var newDom = template.content.cloneNode(true);

  setTrolleyCommodityHtmlId(newDom, commodity.id);
  setTrolleyCommodityName(newDom, commodity.name);
  setTrolleyCommodityImage(newDom, commodity.picture);
  setTrolleyCommodityPrice(newDom, commodity.price);
  setTrolleyCommodityAmount(newDom, commodity.trolleyAmount);
  setTrolleyElementHandlers(newDom);
  return newDom;
}

function setTrolleyCommodityHtmlId(dom, id) {
  var element = querySelectorIncludingSelf(dom, '.card-order')
  element.id = idToHtmlTrolleyId(id);
}

function setTrolleyCommodityAmount(dom, trolleyAmount) {
  var amountNode = querySelectorIncludingSelf(dom, '.card-order__count');
  amountNode.value = trolleyAmount;
}

function setTrolleyCommodityAmountInDom(commodityId, trolleyAmount) {
  var htmlTrolleyId = idToHtmlTrolleyId(commodityId);
  var htmlTrolleySelector = htmlIdToHtmlSelector(htmlTrolleyId);
  var amountNode = document.querySelector(htmlTrolleySelector);
  var node = amountNode.querySelector('.card-order__count');
  node.value = trolleyAmount;
}

function getElementTrolleyAmountInDom(commodityId) {
  var htmlTrolleyId = idToHtmlTrolleyId(commodityId);
  var htmlTrolleySelector = htmlIdToHtmlSelector(htmlTrolleyId);
  var amountNode = document.querySelector(htmlTrolleySelector);
  var node = amountNode.querySelector('.card-order__count');
  return node.value;
}

function deleteDisplayingFromTrolley(commodityId) {
  var htmlTrolleyId = idToHtmlTrolleyId(commodityId);
  var htmlTrolleySelector = htmlIdToHtmlSelector(htmlTrolleyId);
  var commodityNode = document.querySelector(htmlTrolleySelector);
  if (commodityNode) {
    commodityNode.remove();
  }
}

function setTrolleyCommodityName(dom, name) {
  var element = dom.querySelector('.card-order__title');
  element.textContent = name;
}

function setTrolleyCommodityImage(dom, value) {
  var element = dom.querySelector('.card-order__img');
  element.src = value;
  element.alt = WAT;
}

function setTrolleyCommodityPrice(dom, value) {
  var element = dom.querySelector('.card-order__price');
  element.textContent = value;
}


/*
 * Render DOM of the trolley content
 */

function renderItemInTrolley(domElement, htmlClass) {
  var htmlSelector = htmlClassToSelector(htmlClass);
  var addTo = document.querySelector(htmlSelector);
  addTo.appendChild(domElement);
}

function setInterfaceHandlers() {
  var paymentSelector = '.payment';
  var node = document.querySelector(paymentSelector);
  node.addEventListener('click', setPaymentHandlers);
}


/*
 * Miscelaneous not task-oriented utility functions
 */

function removeCssClass(objectClass, classToBeRemoved) {
  var domObjects = getDomObjectsByClassName(objectClass);
  for (var i = 0; i < domObjects.length; i++) {
    domObjects[i].classList.remove(classToBeRemoved);
  }
}

function addCssClass(objectClass, classToBeAdded) {
  var domObjects = getDomObjectsByClassName(objectClass);
  for (var i = 0; i < domObjects.length; i++) {
    domObjects[i].classList.add(classToBeAdded);
  }
}

function getDomObjectsByClassName(objectClass) {
  var domId = '.' + objectClass;
  var domObjects = document.querySelectorAll(domId);
  return domObjects;
}

function getRandomItemFromList(list) {
  if (list.length === 0) {
    return list;
  }

  var index = randomInRange(0, list.length);
  return list[index];
}

function getRandomListFromList(list) {
  if (list.length === 0) {
    return list;
  }
  var newList = list.filter(function () {
    return randomInRangeUpTo(0, 1) === 0;
  });

  if (newList.length === 0) {
    newList = list[0];
  }
  return newList;
}

function randomInRangeUpTo(from, upTo) {
  var to = upTo + 1;
  return randomInRange(from, to);
}

function randomInRange(from, to) {
  var result = Math.floor(Math.random(to - from) * to + from);
  if (result < from) {
    result = from;
  } else if (result >= to) {
    result = to - 1;
  }
  return result;
}

function showHtmlSelector(htmlSelector) {
  var el = document.querySelector(htmlSelector);
  var className = htmlClassFromSelector(SELECTOR_HIDDEN);
  el.classList.remove(className);
}

function hideHtmlSelector(htmlSelector) {
  var el = document.querySelector(htmlSelector);
  var className = htmlClassFromSelector(SELECTOR_HIDDEN);
  el.classList.add(className);
}

function htmlClassFromSelector(htmlSelector) {
  var firstChar = htmlSelector[0];
  if (firstChar === '.') {
    return htmlSelector.slice(1);
  }
  return undefined;
}

function htmlClassToSelector(htmlClass) {
  return '.' + htmlClass;
}

function htmlSelectorToClass(htmlSelector) {
  return htmlSelector.slice(1);
}

function toggleBoolean(objectIsTrue) {
  objectIsTrue = !objectIsTrue;
}

function querySelectorIncludingSelf(dom, selector) {
  var classes = dom.classList;
  if (classes) {
    var className = htmlSelectorToClass(selector);
    if (classes.contains(className)) {
      return dom;
    }
  }
  return dom.querySelector(selector);
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isChecked(htmlSelector, dom) {
  var parentDom = document;
  if (dom) {
    var parentDom = dom;
  }
  var result = parentDom.querySelector(htmlSelector).checked;
  return result;
}