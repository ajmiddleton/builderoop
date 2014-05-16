'use strict';
var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Item = traceur.require(__dirname + '/../models/item.js');

exports.login = (req, res)=>{
  User.login(req.body.username, user=>{
    res.render('users/dashboard', {user:user});
  });
};

exports.sellWood = (req, res)=>{
  User.findById(req.params.userId, user=>{
    user.sellWood(req.body.amount);
    user.save(()=>res.render('users/dashboard', {user:user}));
  });
};

exports.autogrow = (req, res)=>{
  User.findById(req.params.userId, user=>{
    var autogrow = new Item('autogrow');
    autogrow.save(()=>{
      user.purchase(autogrow);
      user.save(()=>{
        res.render('users/dashboard', {user:user});
      });
    });
  });
};
