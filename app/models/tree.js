/* jshint unused:false */
'use strict';
var trees = global.nss.db.collection('trees');
var Mongo = require('mongodb');
var _ = require('lodash');
var traceur = require('traceur');

class Tree{
  constructor(userId){
    this.userId = userId;
    this.height = 0;
    this.isHealthy = true;
    this.isChopped = false;
  }

  static findById(treeId, fn){
    treeId = Mongo.ObjectID(treeId);
    trees.findOne({_id:treeId}, (e, tree)=>{
      tree = _.create(Tree.prototype, tree);
      fn(tree);
    });
  }

  static plant(userId, fn){
    userId = Mongo.ObjectID(userId);
    var tree = new Tree(userId);
    trees.save(tree, ()=>fn(tree));
  }

  static findByUser(userId, fn){
    userId = Mongo.ObjectID(userId);

    trees.find({userId:userId}).toArray((e, records)=>{
      var forest = records.map(rec=>_.create(Tree.prototype, rec));
      fn(forest);
    });
  }

  chop(user){
    user.wood += this.height / 2;
    this.height = -1;
    this.isHealthy = false;
    this.isChopped = true;
  }

  grow(){
    if(this.height > -1){
      var max = this.isAdult ? this.height *0.1 : 2;
      var min = 200;
      if(this.isAdult){
        min = 200 - ((this.height/12)*0.1) <= 10 ? 10 : 200-((this.height/12)*0.1);
      }
      this.height += _.random(0, max, true);
      this.isHealthy = _.random(0, min, true) > 1;
    }
  }

  get isBeanstalk(){
    return (this.height / 12) > 10000;
  }

  save(fn){
    trees.save(this, ()=>fn());
  }

  get isGrowable(){
    return this.isHealthy && !this.isBeanstalk;
  }

  get isChoppable(){
    return this.isAdult && this.isHealthy && !this.isBeanstalk;
  }

  get isAdult(){
    return this.height >= 48;
  }

  getClass(){
    var classes = [];
    if(this.height === -1){
      classes.push('stump');
    }else if(this.height === 0){
      classes.push('seed');
    }else if(this.height < 24){
      classes.push('sapling');
    }else if(!this.isAdult){
      classes.push('treenager');
    }else{
      classes.push('adult');
    }

    if(!this.isHealthy){
      classes.push('dead');
    }
    if(this.isChopped){
      classes.push('chopped');
    }

    if(this.isBeanstalk){
      classes.push('beanstalk');
    }
    return classes.join(' ');
  }
}

module.exports = Tree;
