'use strict';


/*
 * Catalog of goods
 */

(function () {

  var IMG_PATH = 'img/cards/';

  window.Catalog = function (loadGoods) {

    this.getGoods = function () {
      return this.goods;
    };

    this.getItem = function (id) {
      return this.getGoods()[id];
    };

    this.getAmount = function (id) {
      return this.getItem(id).amount;
    };

    this.getCategoryCount = function (category) {
      return this.getGoods().reduce(function (accu, item) {
        return item.kind === category ? ++accu : accu;
      }, 0);
    };

    this.getUnfilteredCount = function () {
      var filteredCount = this.getGoods().reduce(function (accu, item) {
        return item.filtered ? ++accu : accu;
      }, 0);
      return this.getCount() - filteredCount;
    };

    this.getIngredientsCount = function (ingredient) {
      return this.getGoods().reduce(function (accu, item) {
        if (ingredient === 'sugar-free' && !item.nutritionFacts.sugar) {
          accu++;
        }
        if (ingredient === 'gluten-free' && !item.nutritionFacts.gluten) {
          accu++;
        }
        if (ingredient === 'vegetarian' && item.nutritionFacts.vegetarian) {
          accu++;
        }
        return accu;
      }, 0);
    };

    this.getFavoriteCount = function () {
      return this.getGoods().reduce(function (accu, item) {
        return item.favorite ? ++accu : accu;
      }, 0);
    };

    this.getCount = function () {
      return this.getGoods().length;
    };

    this.getInStockCount = function () {
      return this.getGoods().reduce(function (accu, item) {
        return item.amount > 0 ? ++accu : accu;
      }, 0);
    };

    this.getFavoriteStatus = function (id) {
      return this.getItem(id).favorite;
    };

    this.getPrices = function () {
      return this.getGoods().map(function (item) {
        return item.price;
      });
    };

    this.getMinPrice = function () {
      var value = window.utils.listMin(this.getPrices());
      return value;
    };

    this.getMaxPrice = function () {
      var value = window.utils.listMax(this.getPrices());
      return value;
    };

    this.putItem = function (id, amount) {
      this.getItem(id).amount += amount;
    };

    this.takeItem = function (id, amount) {
      var actualAmount = amount;
      if (amount === undefined) {
        actualAmount = 1;
      }
      if (this.getItem(id).amount < actualAmount) {
        return 0;
      }
      this.getItem(id).amount -= actualAmount;
      return actualAmount;
    };

    this.toggleFavorite = function (id) {
      this.getItem(id).favorite = !this.getItem(id).favorite;
    };

    this.filterItem = function (id) {
      this.getItem(id).filtered = true;
    };

    this.unfilterItem = function (id) {
      this.getItem(id).filtered = false;
    };

    this.isFiltered = function (id) {
      return this.getItem(id).filtered;
    };

    this.canBeFiltered = function (id, categories, ingredients, favorite, inStock, min, max) {
      var item = this.getItem(id);
      if (
        inStock.includes('in-stock') && item.amount <= 0 ||
        favorite.includes('favorite') && !item.favorite ||
        categories.length > 0 && !categories.includes(item.kind) ||
        ingredients.includes('sugar-free') && item.nutritionFacts.sugar ||
        ingredients.includes('gluten-free') && item.nutritionFacts.gluten ||
        ingredients.includes('vegetarian') && !item.nutritionFacts.vegetarian ||
        !window.utils.isInRangeUpTo(item.price, min, max)
      ) {
        return true;
      }
      return false;
    };

    this.applyFilter = function (categories, ingredients, favorite, inStock, min, max) {
      for (var i = 0; i < this.getCount(); i++) {
        if (this.canBeFiltered(i, categories, ingredients, favorite, inStock, min, max)) {
          this.filterItem(i);
        } else {
          this.unfilterItem(i);
        }
      }
    };

    this.tuneData = function () {
      this.goods.forEach(function (item, index) {
        item.picture = IMG_PATH + item.picture;
        item.id = index;
        item.filtered = false;
      });
    };


    // Costructor of the class
    this.goods = loadGoods();
    this.tuneData();
  };

})();
