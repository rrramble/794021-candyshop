'use strict';

/*
 * Текст задания:
 * https://up.htmlacademy.ru/javascript/15/tasks/13
 */

var WAT = 'Wat eez dat?';

var GOODS_COUNT = 26;
var GOODS_IN_TROLLEY_COUNT = 3;

var AMOUNT_MIN = 0;
var AMOUNT_MAX = 20;
var AMOUNT_PRECISION = 0;

var PRICE_MIN = 100;
var PRICE_MAX = 1500;
var PRICE_PRECISION = 0;

var WEIGHT_MIN = 30;
var WEIGHT_MAX = 300;
var WEIGHT_PRECISION = 0;

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
    name,
    picture,
    amount,
    price,
    weight,
    rating,
    nutritionFacts
) {

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

(function () {
  var goods = generateGoods(GOODS_COUNT);
  var domGoods = createDomOfGoodsFromTemplate(goods, GOODS_TEMPLATE_ID);
  removeCssClass('catalog__cards', 'catalog__cards--load');
  addCssClass('catalog__load', 'visually-hidden');
  renderGoods(domGoods, GOODS_HTML_TAG_CLASS);

  var trolleyGoods = fulfillTrolley(goods, GOODS_IN_TROLLEY_COUNT);
  var domTrolleyGoods = createDomOfTrolleyGoodsFromTemplate(trolleyGoods, TROLLEY_TEMPLATE_ID);
  renderTrolley(domTrolleyGoods, TROLLEY_HTML_TAG_CLASS);
  addCssClass('goods__card-empty', 'visually-hidden');
  removeCssClass('goods__cards', 'goods__cards--empty');
})();


/*
 * Generate catalog of goods
 */

function generateGoods(count) {
  var goods = [];
  for (var i = 0; i < count; i++) {
    var commodity = fulfillCommodity(generateCommodity());
    goods.push(commodity);
  }
  return goods;
}

function generateCommodity() {
  return new Commodity();
}

function fulfillCommodity(commodity) {
  commodity.name = getName();
  commodity.picture = getPicture();
  commodity.amount = getAmount();
  commodity.price = getPrice();
  commodity.weight = getWeight();
  commodity.rating = getRating();
  commodity.nutritionFacts = getNutritionFacts();
  return commodity;
}

function getName() {
  return getRandomItemFromList(NAMES);
}

function getPicture() {
  return getRandomItemFromList(PICTURES);
}

function getAmount() {
  return randomInRangeUpTo(AMOUNT_MIN, AMOUNT_MAX, AMOUNT_PRECISION);
}

function getPrice() {
  return randomInRange(PRICE_MIN, PRICE_MAX, PRICE_PRECISION);
}

function getWeight() {
  return randomInRange(WEIGHT_MIN, WEIGHT_MAX, WEIGHT_PRECISION);
}

function getRating() {
  var rating = {};
  rating.value = getRatingValue();
  rating.number = getRatingNumber();
  return rating;
}

function getNutritionFacts() {
  var nutritionFacts = {};
  nutritionFacts.sugar = getSugar();
  nutritionFacts.energy = getEnergy();
  nutritionFacts.contents = getContents();
  return nutritionFacts;
}

function getSugar() {
  var result = getRandomItemFromList(SUGARS);
  return result;
}

function getEnergy() {
  return randomInRangeUpTo(ENERGY_MIN, ENERGY_MAX);
}

function getContents() {
  var randomContents = getRandomListFromList(CONTENTS);
  var result = randomContents.join('; ');
  result += '.';
  return result;
}

function getRatingValue() {
  return randomInRangeUpTo(RATING_VALUE_MIN, RATING_VALUE_MAX);
}

function getRatingNumber() {
  return randomInRangeUpTo(RATING_NUMBER_MIN, RATING_NUMBER_MAX);
}


/*
 * Make DOM from the catalog of goods
 */

function createDomOfGoodsFromTemplate(goods, templateHtmlId) {
  var domElements = [];
  for (var i = 0; i < goods.length; i++) {
    var domElement = createDomOfCommodityFromTemplate(goods[i], templateHtmlId);
    domElements.push(domElement);
  }
  return domElements;
}

function createDomOfCommodityFromTemplate(commodity, templateHtmlId) {
  var template = document.querySelector('#' + templateHtmlId);
  var newDom = template.content.cloneNode(true);

  setCommodityName(newDom, commodity.name);
  setCommodityImage(newDom, commodity.picture, commodity.name);
  setCommodityPrice(newDom, commodity.price);
  setCommodityWeight(newDom, commodity.weight);
  setCommodityStockAmount(newDom, commodity.amount);
  setCommodityRating(newDom, commodity.rating);
  setCommodityNutritionFacts(newDom, commodity.nutritionFacts);
  return newDom;
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
    htmlClass = 'card-little';
  } else if (data === 0) {
    htmlClass = 'card-soon';
  }

  var element = dom.querySelector('.catalog__card');
  element.classList.remove('card--in-stock');
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


/*
 * Render DOM of the catalog of goods
 */

function renderGoods(domElements, htmlClass) {
  for (var i = 0; i < domElements.length; i++) {
    renderItemInGoods(domElements[i], htmlClass);
  }
}

function renderItemInGoods(domElement, htmlClass) {
  var htmlTag = '.' + htmlClass;
  var addTo = document.querySelector(htmlTag);
  addTo.appendChild(domElement);
}


/*
 * Generate trolley content from the list of goods
 */

function fulfillTrolley(list, count) {
  var goodsInTrolley = [];
  for (var i = 0; i < count; i++) {
    var newGood = getRandomItemFromList(list);
    goodsInTrolley.push(newGood);
  }
  return goodsInTrolley;
}


/*
 * Make DOM from the trolley content
 */

function createDomOfTrolleyGoodsFromTemplate(goods, templateHtmlId) {
  var domElements = [];
  for (var i = 0; i < goods.length; i++) {
    var domElement = createDomOfTrolleyCommodityFromTemplate(goods[i], templateHtmlId);
    domElements.push(domElement);
  }
  return domElements;
}

function createDomOfTrolleyCommodityFromTemplate(commodity, templateHtmlId) {
  var htmlTag = '#' + templateHtmlId;
  var template = document.querySelector(htmlTag);
  var newDom = template.content.cloneNode(true);

  setTrolleyCommodityName(newDom, commodity.name);
  setTrolleyCommodityImage(newDom, commodity.picture);
  setTrolleyCommodityPrice(newDom, commodity.price);

  return newDom;
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

function renderTrolley(domElements, htmlClass) {
  for (var i = 0; i < domElements.length; i++) {
    renderItemInTrolley(domElements[i], htmlClass);
  }
}

function renderItemInTrolley(domElement, htmlClass) {
  var htmlTag = '.' + htmlClass;
  var addTo = document.querySelector(htmlTag);
  addTo.appendChild(domElement);
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

function randomInRangeUpTo(from, upTo, precision) {
  var to = upTo + 1;
  return randomInRange(from, to, precision);
}

function randomInRange(from, to, precision) {
  if (precision === undefined) {
    precision = 0;
  }

  var result = (Math.random(to - from) * to + from);
  if (precision === 0) {
    return Math.floor(result);
  }

  result = result.toFixed(precision) / 1;
  if (result > to) {
    result = to;
  }
  if (result < from) {
    result = from;
  }
  return result;
}
