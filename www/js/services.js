angular.module('starter.services', [])

.service('Auth', function($firebaseAuth, User) {
  this.fromGoogle = function(){
    console.log("attempting to authenticate user via Google+ API...");

    var authRef = new Firebase("https://jordansdemo.firebaseio.com");
    var auth = $firebaseAuth(authRef);
    auth.$onAuth(function(authData){
      if(authData){
        User.set(authData.google.email, authData.google.displayName, authData.google.profileImageURL);
      }
      else{
        auth.$authWithOAuthRedirect("google", {scope: 'email'});
      }
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


