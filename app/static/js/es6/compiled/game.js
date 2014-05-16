(function() {
  'use strict';
  $(document).ready(init);
  function init() {
    $('#login').click(login);
    $('body').on('click', '#plant', plant);
    $('body').on('click', '#getForest', forest);
    $('#forest').on('click', '.grow', grow);
    $('#forest').on('click', '.chop', chop);
    $('body').on('click', '#sellWood', sellWood);
    $('body').on('click', '#purchase-autogrow', purchaseAutogrow);
    preloadAssests();
  }
  var audioChop,
      audioBeanstalk,
      audioGrow;
  function purchaseAutogrow() {
    var userId = $('#user').attr('data-id');
    ajax(("/users/" + userId + "/purchase/autogrow"), 'PUT', {}, (function(res) {
      $('#dashboard').replaceWith(res);
    }));
  }
  function preloadAssests() {
    audioChop = $('<audio>')[0];
    audioChop.src = '/audios/treefall.mp3';
    audioBeanstalk = $('<audio>')[0];
    audioBeanstalk.src = '/audios/button-09.mp3';
    audioGrow = $('<audio>')[0];
    audioGrow.src = '/audios/button-5.mp3';
  }
  function sellWood() {
    var userId = $('#user').attr('data-id');
    var amt = $('#woodAmt').val();
    ajax(("/users/" + userId + "/sellwood"), 'PUT', {amount: amt}, (function(res) {
      return $('#dashboard').replaceWith(res);
    }));
  }
  function chop() {
    audioChop.play();
    var tree = $(this).closest('.tree-container');
    var treeId = tree.attr('data-id');
    ajax(("/trees/" + treeId + "/chop"), 'PUT', {}, (function(res) {
      tree.replaceWith(res.treeHTML);
      $('#dashboard').replaceWith(res.userHTML);
    }), 'json');
  }
  function grow() {
    var tree = $(this).closest('.tree-container');
    var treeId = tree.attr('data-id');
    ajax(("/trees/" + treeId + "/grow"), 'PUT', {}, (function(res) {
      tree.replaceWith(res);
      if ($(res).find('.tree').hasClass('beanstalk')) {
        audioBeanstalk.play();
      }
    }));
  }
  function forest() {
    var userId = $('#user').attr('data-id');
    ajax(("/trees?userId=" + userId), 'get', {}, (function(res) {
      $('#forest').empty().append(res);
    }));
  }
  function plant() {
    var userId = $('#user').attr('data-id');
    ajax('/trees/plant', 'POST', {userId: userId}, (function(res) {
      return $('#forest').append(res);
    }));
  }
  function login() {
    var username = $('#username').val();
    ajax("/login", 'POST', {username: username}, (function(res) {
      $('#dashboard').replaceWith(res);
    }));
  }
  function ajax(url, type) {
    var data = arguments[2] !== (void 0) ? arguments[2] : {};
    var success = arguments[3] !== (void 0) ? arguments[3] : (function(res) {
      return console.log(res);
    });
    var dataType = arguments[4] !== (void 0) ? arguments[4] : 'html';
    $.ajax({
      url: url,
      type: type,
      data: data,
      dataType: dataType,
      success: success
    });
  }
})();

//# sourceMappingURL=game.map
