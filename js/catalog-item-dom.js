'use strict';

/*
 * Class for DOM of one commodity
 */

(function () {

  var COMMODITY_HTML_SELECTOR_HEAD = '#commodity';
  var COMMODITY_HTML_ID_HEAD = 'commodity';

  window.CatalogItemDom = function (commodity, templateNode) {


    // Constructor body

    var node = templateNode.content.cloneNode(true);
    setId(node, commodity.id);
    setName(node, commodity.name)
    setImage(node, commodity.picture, commodity.name);
    setPrice(node, commodity.price);
    setWeight(node, commodity.weight);
    setStockAmount(node, commodity.amount);
    setRating(node, commodity.rating, commodity.number);
    setNutritionFacts(node, commodity.nutritionFacts);
    setFavorite(node, commodity.favorite);
    return node;

    // End of constructor body


    function setId(node, commodityId) {
      var subNode = window.utils.querySelectorIncludingSelf(node, '.catalog__card');
      subNode.id = COMMODITY_HTML_ID_HEAD + commodityId;
    }

    function setName(node, name) {
      window.utils.setDomTextContent(node, '.card__title', name);
    }

    function setImage(node, url, alt) {
      window.utils.setDomImage(node, '.card__img', url, alt)
    }

    function setPrice(node, price) {
      var priceNode = node.querySelector('.card__price');
      var currencyNode = node.querySelector('.card__currency');
      var weightNode = node.querySelector('.card__weight');
      priceNode.textContent = price + ' ';
      priceNode.appendChild(currencyNode);
      priceNode.appendChild(weightNode);
    }

    function setWeight(node, weight) {
      var weightFormatted = '/ ' + weight + ' Г';
      window.utils.setDomTextContent(node, '.card__weight', weightFormatted);
    }

    function setStockAmount(node, amount) {
      var htmlClass = 'card--in-stock';
      if (amount >= 1 && amount <= 5) {
        htmlClass = 'card--little';
      } else if (amount <= 0) {
        htmlClass = 'card--soon';
      }
      var subNode = window.utils.querySelectorIncludingSelf(node, '.catalog__card');
      subNode.classList.remove('card--in-stock');
      subNode.classList.remove('card--little');
      subNode.classList.remove('card--soon');
      subNode.classList.add(htmlClass);
    }

    function setRating(node, rating) {
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
    }

    function setNutritionFacts(node, nutrition) {
      window.utils.setDomTextContent(node, '.card__composition-list', nutrition.contents);
      var sugarAndEnergy = (nutrition.sugar ? 'С сахаром.' : 'Без сахара.') +
        nutrition.energy + ' ккал';
      window.utils.setDomTextContent(node, '.card__characteristic', sugarAndEnergy);
    }

    function setFavorite(node, isFavorite) {
      var favorite = node.querySelector('.card__btn-favorite');
      if (isFavorite) {
        favorite.classList.add('card__btn-favorite--selected');
      } else {
        favorite.classList.remove('card__btn-favorite--selected');
      }
    }

    function update(commodityId) {
      var amount = catalog.getAmount(commodityId);
      var commodityNode = trolleyDomNodeFromCommodityId(commodityId);
      setCommodityStockAmount(commodityNode, amount);
    }

  }
})();
