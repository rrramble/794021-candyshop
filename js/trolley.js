'use strict';


/*
 * Trolley of goods
 */

(function () {

  window.Trolley = function (catalog) {
    this.getGoods = getGoods;
    this.getItem = getItem;
    this.getAmount = getAmount;
    this.getCount = getCount;
    this.getTotalOrderedSum = getTotalOrderedSum;
    this.setFavoriteStatus = setFavoriteStatus;
    this.putItem = putItem;
    this.takeItem = takeItem;
    this.isEmpty = isEmpty;

    this.goods = catalog.getGoods().map(fillItem);
    return;

    // End of constructor

    function fillItem(commodityItem) {
      var item = Object.assign({}, commodityItem);
      item.amount = 0;
      return item;
    }

    function getGoods() {
      return this.goods;
    }

    function getItem(id) {
      return this.getGoods()[id];
    }

    function getAmount(id) {
      return this.getItem(id).amount;
    }

    function getCount() {
      var result = this.getGoods().reduce(function (accu, item) {
        return item.amount > 0 ? ++accu : accu;
      }, 0);
      return result.toFixed(0);
    }

    function getTotalOrderedSum() {
      var result = this.getGoods().reduce(function (accu, item) {
        accu += item.amount * item.price;
        return accu;
      }, 0);
      return result.toFixed(0);
    }

    function setFavoriteStatus(id, favoriteStatus) {
      this.getItem(id).favorite = favoriteStatus;
      return favoriteStatus;
    }

    function putItem(id, amount) {
      var actualAmount = amount;
      if (!actualAmount) {
        actualAmount = 1;
      }
      this.getItem(id).amount += actualAmount;
      return actualAmount;
    }

    function takeItem(id, amount) {
      if (this.getItem(id).amount < amount) {
        return 0;
      }
      this.getItem(id).amount -= amount;
      return amount;
    }

    function isEmpty() {
      return this.goods.every(function (item) {
        return item.amount <= 0;
      });
    }
  };

})();
