'use strict';

/*
 * Trolley of goods
 */

(function () {

  window.Trolley = function (catalog) {

    this.fillItem = function (commodityItem) {
      var item = Object.assign({}, commodityItem);
      item.amount = 0;
      return item;
    };

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
      var result = this.getGoods().reduce(function (accu, item) {
        return item.amount > 0 ? ++accu : accu;
      }, 0);
      return result.toFixed(0);
    };

    this.getTotalOrderedSum = function () {
      var result = this.getGoods().reduce(function (accu, item) {
        accu += item.amount * item.price;
        return accu;
      }, 0);
      return result.toFixed(0);
    };

    this.setFavoriteStatus = function (id, favoriteStatus) {
      this.getItem(id).favorite = favoriteStatus;
      return favoriteStatus;
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
      return this.goods.every(function (item) {
        return item.amount <= 0;
      });
    };

    // Beginning of the Constructor
    this.goods = catalog.getGoods().map(this.fillItem);
    return;
  };

})();
