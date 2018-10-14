'use strict';


/*
 * Catalog of goods
 */

(function () {

  var IMG_PATH = 'img/cards/';
  var Sorting = {
    'popular': sortDefault,
    'cheap': sortCheap,
    'expensive': sortExpensive,
    'rating': sortRating
  };

  window.Catalog = function (loadGoods) {
    // Initialization of the functions
    this.getGoods = getGoods;
    this.getItem = getItem;
    this.getAmount = getAmount;
    this.getCategoryCount = getCategoryCount;
    this.getUnfilteredCount = getUnfilteredCount;
    this.getIngredientsCount = getIngredientsCount;
    this.getFavoriteCount = getFavoriteCount;
    this.getCount = getCount;
    this.getInStockCount = getInStockCount;
    this.getFavoriteStatus = getFavoriteStatus;
    this.getPrices = getPrices;
    this.getMinPrice = getMinPrice;
    this.getMaxPrice = getMaxPrice;
    this.putItem = putItem;
    this.takeItem = takeItem;
    this.toggleFavorite = toggleFavorite;
    this.filterItem = filterItem;
    this.unfilterItem = unfilterItem;
    this.isFiltered = isFiltered;
    this.canBeFiltered = canBeFiltered;
    this.applyFilter = applyFilter;
    this.sort = sort;
    this.tuneData = tuneData;

    // Costructor of the class
    this.goods = loadGoods();
    this.tuneData();
    return;
  }; // End of the class


  function getGoods() {
    return this.goods;
  }

  function getItem(id) {
    var result = this.getGoods().filter(function (commodity) {
      return commodity.id.toString() === id.toString();
    });
    return result[0];
  }

  function getAmount(id) {
    return this.getItem(id).amount;
  }

  function getCategoryCount(category) {
    return this.getGoods().reduce(function (accu, item) {
      return item.kind === category ? ++accu : accu;
    }, 0);
  }

  function getUnfilteredCount() {
    var filteredCount = this.getGoods().reduce(function (accu, item) {
      return item.filtered ? ++accu : accu;
    }, 0);
    return this.getCount() - filteredCount;
  }

  function getIngredientsCount(ingredient) {
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
  }

  function getFavoriteCount() {
    return this.getGoods().reduce(function (accu, item) {
      return item.favorite ? ++accu : accu;
    }, 0);
  }

  function getCount() {
    return this.getGoods().length;
  }

  function getInStockCount() {
    return this.getGoods().reduce(function (accu, item) {
      return item.amount > 0 ? ++accu : accu;
    }, 0);
  }

  function getFavoriteStatus(id) {
    return this.getItem(id).favorite;
  }

  function getPrices() {
    return this.getGoods().map(function (item) {
      return item.price;
    });
  }

  function getMinPrice() {
    var value = window.utils.getListMin(this.getPrices());
    return value;
  }

  function getMaxPrice() {
    var value = window.utils.getListMax(this.getPrices());
    return value;
  }

  function putItem(id, amount) {
    this.getItem(id).amount += amount;
  }

  function takeItem(id, amount) {
    var actualAmount = amount;
    if (amount === undefined) {
      actualAmount = 1;
    }
    if (this.getItem(id).amount < actualAmount) {
      return 0;
    }
    this.getItem(id).amount -= actualAmount;
    return actualAmount;
  }

  function toggleFavorite(id) {
    this.getItem(id).favorite = !this.getItem(id).favorite;
  }

  function filterItem(id) {
    this.getItem(id).filtered = true;
  }

  function unfilterItem(id) {
    this.getItem(id).filtered = false;
  }

  function isFiltered(id) {
    return this.getItem(id).filtered;
  }

  function canBeFiltered(id, categories, ingredients, favorite, inStock, min, max) {
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
  }

  function applyFilter(categories, ingredients, favorite, inStock, min, max, sortingType) {
    this.sort(sortingType);
    for (var i = 0; i < this.getCount(); i++) {
      if (this.canBeFiltered(i, categories, ingredients, favorite, inStock, min, max)) {
        this.filterItem(i);
      } else {
        this.unfilterItem(i);
      }
    }
  }

  function sort(sortingType) {
    if (
      this.sortingType === sortingType ||
      !window.utils.isClassIncludesKey(Sorting, sortingType)
    ) {
      return;
    }
    this.sortingType = sortingType;
    var sortingFunction = Sorting[sortingType];
    this.goods.sort(sortingFunction);
  }

  function tuneData() {
    this.goods.forEach(function (item, index) {
      item.picture = IMG_PATH + item.picture;
      item.id = index;
      item.filtered = false;
    });
  }

  function sortDefault(first, second) {
    return first.id - second.id;
  }

  function sortCheap(first, second) {
    return first.price - second.price;
  }

  function sortExpensive(first, second) {
    return second.price - first.price;
  }

  function sortRating(first, second) {
    if (second.rating.value > first.rating.value) {
      return 1;
    }
    if (first.rating.value > second.rating.value) {
      return -1;
    }
    return second.rating.number - first.rating.number;
  }

})();
