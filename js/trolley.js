'use strict';


/*
 * Trolley with goods
 */

(function () {

  window.Trolley = function (catalog) {

    this.getGoods = function () {
      return this.goods;
    };

    this.getItem = function (id) {
      return this.getGoods()[id];
    };

    this.getAmount = function (id) {
      return this.getItem(id).amount;
    };

    this.getPrice = function (id) {
      return this.getItem(id).price;
    };

    this.getCount = function () {
      var result = this.getGoods().reduce(function(accu, item) {
        return item.amount > 0 ? ++accu : accu;
      }, 0);
      return result.toFixed(0);
    };

    this.getTotalOrderedSum = function () {
      var result = this.getGoods().reduce(function(accu, item) {
        return accu += item.amount * item.price;
      }, 0);
      return result.toFixed(0);
    };

    this.setFavoriteStatus = function (id, favoriteStatus) {
      return this.getItem(id).favorite = favoriteStatus;
    };

    this.putItem = function (id, amount) {
      var actualAmount = amount;
      if (!actualAmount) {
        actualAmount = 1;
      }
      this.getItem(id).amount += actualAmount;
      return actualAmount;
    };

    this.takeItem = function (id, amount) {
      if (this.getItem(id).amount < amount) {
        return 0;
      }
      this.getItem(id).amount -= amount;
      return amount;
    };

    this.isEmpty = function () {
      return this.goods.every(function(item) {
        return item.amount <= 0;
      });
    }

    // Constructor

    this.goods = catalog.getGoods().map(fillItem);


    // Miscelaneous functions

    function fillItem (commodityItem) {
      var item = Object.assign({}, commodityItem);
      item.amount = 0;
      return item;
    };

  }
})();
