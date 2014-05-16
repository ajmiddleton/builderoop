'use strict';
var users = global.nss.db.collection('users');
var Mongo = require('mongodb');
var _ = require('lodash');

class User{
  constructor(username){
    this.username = username;
    this.wood = 0;
    this.cash = 0;
    this.items = [];
  }

  static login(username, fn){
    username = username.trim().toLowerCase();

    users.findOne({username:username}, (e, user)=>{
      if(user){
        user = _.create(User.prototype, user);
        fn(user);
      }else{
        user = new User(username);
        users.save(user, ()=>fn(user));
      }
    });
  }

  static findById(userId, fn){
    userId = Mongo.ObjectID(userId);
    users.findOne({_id:userId}, (e, user)=>{
      user = _.create(User.prototype, user);
      fn(user);
    });
  }

  save(fn){
    users.save(this, ()=>fn());
  }

  purchase(item){
    if(item.cost <= this.cash){
      this.cash -= item.cost;
      this.items.push(item._id);
    }
  }

  get isAutoGrowAvailable(){
    return this.cash >= 50000;
  }

  sellWood(amt){
    amt *= 1;
    if(amt <= this.wood){
      this.wood -= amt;
      this.cash += amt/5;
    }
  }
}

module.exports = User;
