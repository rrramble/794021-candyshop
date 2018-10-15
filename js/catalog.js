'use strict';


/*
 * Catalog of goods
 */

(function () {

  var IMG_PATH = 'img/cards/';

  window.Catalog = function (loadGoods) {

    var sortDefault = function (first, second) {
      return first.id - second.id;
    };

    var sortCheap = function (first, second) {
      return first.price - second.price;
    };

    var sortExpensive = function (first, second) {
      return second.price - first.price;
    };

    var sortRating = function (first, second) {
      if (second.rating.value > first.rating.value) {
        return 1;
      }
      if (first.rating.value > second.rating.value) {
        return -1;
      }
      return second.rating.number - first.rating.number;
    };

    var Sorting = {
      'popular': sortDefault,
      'cheap': sortCheap,
      'expensive': sortExpensive,
      'rating': sortRating
    };


    // Methods of the Class

    this.getGoods = function () {
      return this.goods;
    };

    this.getItem = function (id) {
      var result = this.getGoods().filter(function (commodity) {
        return commodity.id.toString() === id.toString();
      });
      return result[0];
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
        if (
          (ingredient === 'sugar-free' && !item.nutritionFacts.sugar) ||
          (ingredient === 'gluten-free' && !item.nutritionFacts.gluten) ||
          (ingredient === 'vegetarian' && item.nutritionFacts.vegetarian)
        ) {
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
      var value = window.utils.getListMin(this.getPrices());
      return value;
    };

    this.getMaxPrice = function () {
      var value = window.utils.getListMax(this.getPrices());
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

    this.applyFilter = function (categories, ingredients, favorite, inStock, min, max, sortingType) {
      this.sort(sortingType);
      for (var i = 0; i < this.getCount(); i++) {
        if (this.canBeFiltered(i, categories, ingredients, favorite, inStock, min, max)) {
          this.filterItem(i);
        } else {
          this.unfilterItem(i);
        }
      }
    };

    this.sort = function (sortingType) {
      if (
        this.sortingType === sortingType ||
        !window.utils.isClassIncludesKey(Sorting, sortingType)
      ) {
        return;
      }
      this.sortingType = sortingType;
      var sortingFunction = Sorting[sortingType];
      this.goods.sort(sortingFunction);
    };

    this.tuneData = function () {
      this.goods.forEach(function (item, index) {
        item.picture = IMG_PATH + item.picture;
        item.id = index;
        item.filtered = false;
      });
    };

    // Beginning of the constructor
    this.goods = loadGoods();
    this.tuneData();
    // End of the constructor

  };


})();
