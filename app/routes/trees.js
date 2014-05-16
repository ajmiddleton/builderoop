/* jshint unused:false */
'use strict';
var traceur = require('traceur');
var Tree = traceur.require(__dirname + '/../models/tree.js');
var User = traceur.require(__dirname + '/../models/user.js');
var Mongo = require('mongodb');

exports.plant = (req, res)=>{
  Tree.plant(req.body.userId, tree=>res.render('trees/tree', {tree:tree}));
};

exports.forest = (req, res)=>{
  Tree.findByUser(req.query.userId, trees=>res.render('trees/forest', {trees:trees}));
};

exports.grow = (req, res)=>{
  Tree.findById(req.params.treeId, tree=>{
    tree.grow();
    tree.save(()=>res.render('trees/tree', {tree:tree}));
   });
};

exports.chop = (req, res)=>{
  Tree.findById(req.params.treeId, tree=>{
    User.findById(tree.userId, user=>{
      tree.chop(user);
      user.save(()=>{});
      tree.save(()=>{
        res.render('trees/tree', {tree:tree}, (e, treeHTML)=>{
          res.render('users/dashboard', {user:user}, (er, userHTML)=>res.send({treeHTML:treeHTML, userHTML: userHTML}));
        });
      });
    });
  });
};
