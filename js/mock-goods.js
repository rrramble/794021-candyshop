'use strict';

/*
 * Generate mock catalog of goods for the Candyshop project
 */


(function () {

/*
 * Constants
 */

  var MOCK_GOODS_COUNT = 20;

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


/*
 * Main
 */

  window.mockGoods = {};

  window.mockGoods.get = function () {
    var goods = [];
    for (var i = 0; i < MOCK_GOODS_COUNT; i++) {
      var commodity = fulfillCommodity({});
      commodity.id = i;
      goods.push(commodity);
    }
    return goods;
  };


/*
 * Miscelaneous
 */

  function fulfillCommodity(commodity) {
    commodity.name = window.utils.getRandomItemFromList(NAMES);
    commodity.picture = window.utils.getRandomItemFromList(PICTURES);
    commodity.amount = window.utils.randomInRangeUpTo(
        AMOUNT_MIN, AMOUNT_MAX
    );
    commodity.trolleyAmount = 0;
    commodity.price = window.utils.randomInRangeUpTo(PRICE_MIN, PRICE_MAX);
    commodity.weight = window.utils.randomInRangeUpTo(WEIGHT_MIN, WEIGHT_MAX);
    commodity.rating = getRating();
    commodity.nutritionFacts = getNutritionFacts();
    commodity.favorite = false;
    return commodity;
  }

  function getRating() {
    var rating = {};
    rating.value = window.utils.randomInRangeUpTo(RATING_VALUE_MIN, RATING_VALUE_MAX);
    rating.number = window.utils.randomInRangeUpTo(RATING_NUMBER_MIN, RATING_NUMBER_MAX);
    return rating;
  }

  function getNutritionFacts() {
    var nutritionFacts = {};
    nutritionFacts.sugar = window.utils.getRandomItemFromList(SUGARS);
    nutritionFacts.energy = window.utils.randomInRangeUpTo(ENERGY_MIN, ENERGY_MAX);
    nutritionFacts.contents = getContents();
    return nutritionFacts;
  }

  function getContents() {
    var randomContents = window.utils.getRandomListFromList(CONTENTS);
    var result = randomContents.join('; ');
    result += '.';
    return result;
  }

})();
