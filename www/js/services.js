angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  }
})

.service('Auth', function($firebaseAuth, User) {
  this.fromGoogle = function(){
    console.log("attempting to authenticate user via Google+ API...");

    var authRef = new Firebase("https://jordansdemo.firebaseio.com");
    var auth = $firebaseAuth(authRef);

    auth.$authWithOAuthPopup("google", { scope: 'email' }).then(function(authData) {
      User.set(authData.google.email, authData.google.displayName, authData.google.profileImageURL);
    }).catch(function(error) {
      console.error("Authentication failed:", error);
    });
  }
})

.service('User', function($rootScope) {
  var _email = null;
  var _name = null;
  var _profileImage = null;
  this.set = function (email, name, profileImage) {
    console.log("Setting user data in user Service");
    _email = email;
    _name = name;
    _profileImage = profileImage;
    $rootScope.$broadcast('AUTHED-USER-DATA-READY');
  };
  this.get = function () {
    console.log("returning fetched user data");
    return {email: _email, name: _name, profileImage: _profileImage};
  };
});


