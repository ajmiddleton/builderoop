/* jshint unused:false */
'use strict';
var items = global.nss.db.collection('items');
var Mongo = require('mongodb');
var _ = require('lodash');

class Item{
  constructor(type){
    this.type = type;
    this.getProperties(type);
  }

  getProperties(type){
    switch(type){
    case 'autogrow':
      this.cost = 50000;
      this.image = '/img/autogrow.jpg';
      break;
    case 'autoseed':
      this.cost = 10;
      this.image = '/img/autoseed.jpg';
      break;
    }
  }

  save(fn){
    items.save(this, ()=>fn());
  }
}

module.exports = Item;
