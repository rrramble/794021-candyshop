'use strict';


/*
 * Catalog of goods
 */

(function () {

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

    this.getCount = function () {
      return this.getGoods().length;
    };

    this.getFavoriteStatus = function (id) {
      return this.getItem(id).favorite;
    };

    this.getPrices = function () {
      return this.getGoods().map(function (item) {
        return item.price;
      });
    };

    this.getMinPrice = function (id) {
      var value = window.utils.listMin(this.getPrices());
      return value;
    };

    this.getMaxPrice = function (id) {
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
      this.goods[id].favorite = !this.getItem(id).favorite;
    };


    // Costructor of the class
    this.goods = loadGoods();
  };

})();
