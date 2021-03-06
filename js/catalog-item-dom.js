'use strict';

/*
 * Class for DOM of one commodity
 */

(function () {

  var COMMODITY_HTML_ID_HEAD = 'commodity';
  var Selector = {
    MAIN_SELECTOR: '.catalog__card',
    NAME: '.card__title',
    IMAGE: '.card__img',
    PRICE: '.card__price',
    CURRENCY: '.card__currency',
    WEIGHT: '.card__weight'
  };

  window.CatalogItemDom = function (commodity, templateNode) {

    var setId = function (node, commodityId) {
      var subNode = window.utils.querySelectorIncludingSelf(node, Selector.MAIN_SELECTOR);
      subNode.id = COMMODITY_HTML_ID_HEAD + commodityId;
    };

    var setName = function (node, name) {
      window.utils.setDomTextContent(node, Selector.NAME, name);
    };

    var setImage = function (node, url, alt) {
      window.utils.setDomImage(node, Selector.IMAGE, url, alt);
    };

    var setPrice = function (node, price) {
      var priceNode = node.querySelector(Selector.PRICE);
      var currencyNode = node.querySelector(Selector.CURRENCY);
      var weightNode = node.querySelector(Selector.WEIGHT);
      priceNode.textContent = price + ' ';
      priceNode.appendChild(currencyNode);
      priceNode.appendChild(weightNode);
    };

    var setWeight = function (node, weight) {
      var weightFormatted = '/ ' + weight + ' Г';
      window.utils.setDomTextContent(node, Selector.WEIGHT, weightFormatted);
    };

    var setStockAmount = function (node, amount) {
      var htmlClass = 'card--in-stock';
      if (amount >= 1 && amount <= 5) {
        htmlClass = 'card--little';
      } else if (amount <= 0) {
        htmlClass = 'card--soon';
      }
      var subNode = window.utils.querySelectorIncludingSelf(node, Selector.MAIN_SELECTOR);
      subNode.classList.remove('card--in-stock');
      subNode.classList.remove('card--little');
      subNode.classList.remove('card--soon');
      subNode.classList.add(htmlClass);
    };

    var setRating = function (node, rating) {
      var htmlClass = 'stars__rating--zero';
      var textRating = 'Рейтинг: ноль звёзд';
      switch (true) {
        case window.utils.isInRange(rating.value, 4.5, Infinity):
          htmlClass = 'stars__rating--five';
          textRating += 'Рейтинг: 5 звёзд';
          break;
        case window.utils.isInRange(rating.value, 3.5, 4.5):
          htmlClass = 'stars__rating--four';
          textRating += 'Рейтинг: 4 звeзды';
          break;
        case window.utils.isInRange(rating.value, 2.5, 3.5):
          htmlClass = 'stars__rating--three';
          textRating += 'Рейтинг: 3 звeзды';
          break;
        case window.utils.isInRange(rating.value, 1.5, 2.5):
          htmlClass = 'stars__rating--two';
          textRating += 'Рейтинг: 2 звeзды';
          break;
        case window.utils.isInRange(rating.value, 0.5, 1.5):
          htmlClass = 'stars__rating--one';
          textRating += 'Рейтинг: 1 звeзда';
      }
      var fortmattedNumber = '(' + rating.number + ')';
      var element = node.querySelector('.stars__rating');
      element.classList.remove('stars__rating--five');
      element.classList.add(htmlClass);
      window.utils.setDomTextContent(node, '.stars__rating', textRating);
      window.utils.setDomTextContent(node, '.star__count', fortmattedNumber);
    };

    var setNutritionFacts = function (node, nutrition) {
      window.utils.setDomTextContent(node, '.card__composition-list', nutrition.contents);
      var sugarAndEnergy = (nutrition.sugar ? 'С сахаром.' : 'Без сахара.') +
        nutrition.energy + ' ккал';
      window.utils.setDomTextContent(node, '.card__characteristic', sugarAndEnergy);
    };

    var setFavorite = function (node, isFavorite) {
      var favorite = node.querySelector('.card__btn-favorite');
      if (isFavorite) {
        favorite.classList.add('card__btn-favorite--selected');
      } else {
        favorite.classList.remove('card__btn-favorite--selected');
      }
    };

    // Beginning of the Constructor
    var baseNode = templateNode.content.cloneNode(true);
    setId(baseNode, commodity.id);
    setName(baseNode, commodity.name);
    setImage(baseNode, commodity.picture, commodity.name);
    setPrice(baseNode, commodity.price);
    setWeight(baseNode, commodity.weight);
    setStockAmount(baseNode, commodity.amount);
    setRating(baseNode, commodity.rating, commodity.number);
    setNutritionFacts(baseNode, commodity.nutritionFacts);
    setFavorite(baseNode, commodity.favorite);
    return baseNode;
  };

})();
