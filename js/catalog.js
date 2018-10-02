'use strict';


/*
 * Catalog of goods
 */

(function () {

  var IMG_PATH = '/img/cards/';

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
      this.goods[id].favorite = !this.getItem(id).favorite;
    };

    this.optimize = function () {
      this.goods.forEach(function (item, index) {
        item.picture = IMG_PATH + item.picture;
        item.id = index;
      });
    };

    // Costructor of the class
    this.goods = loadGoods();
    this.optimize();
  };

})();
