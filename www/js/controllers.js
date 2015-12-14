angular.module('starter.controllers', [])

.controller('NavCtrl', function($scope, User, $firebaseObject, $state) {
  var ref = new Firebase('https://jordansdemo.firebaseio.com/users');
  var obj = $firebaseObject(ref);

  var checkIfNewUser = function(){
    var userExists = false;
    obj.$loaded().then(function () {
      $scope.users = obj;
      $scope.users.forEach(function (user) {
        if (user.email == $scope.authedUserInfo.email) userExists = true;
      });
      if (!userExists) {
        var FBnewref = ref.push();
        FBnewref.set({
          name: $scope.authedUserInfo.name,
          email: $scope.authedUserInfo.email,
          imageURL: $scope.authedUserInfo.profileImage
        });
      }
    });
  };

  //In case NavCtrl isn't ready in time for broadcast
  $scope.authedUserInfo = User.get();
  console.log($scope.authedUserInfo);
  if($scope.authedUserInfo.name != null){
    console.log("user already authed. checking if new user...");
    checkIfNewUser();
  }

  //In case NavCtrl is loaded before broadcast
  $scope.$on('AUTHED-USER-DATA-READY', function () {
    console.log("broadcast received. checking if new user...");
    $scope.authedUserInfo = User.get();
    checkIfNewUser();
  });

  ref.on('value', function (snapshot) {
    $scope.$apply(function () {
      $scope.users = snapshot.val();
    });
  });

  $scope.navCtrl = 'in the nav controller';
  $scope.viewTransactions = function (user) {
    $state.go('main', {friend: user});
  };
})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('MainCtrl', function ($scope, $stateParams, $state, $firebaseObject, User) {
    //we don't want you here if you havent selected a user
  if(!$stateParams.friend){
    $state.go('nav');
  }
  $scope.friend = $stateParams.friend;
    $scope.authedUserInfo = User.get();

  //Bind the firebase location of our Friend
  var FBFriendOwesRef = new Firebase('https://jordansdemo.firebaseio.com/items/' + $scope.friend + "/owes");
  var FBFriendOwesObj = $firebaseObject(FBFriendOwesRef);
  FBFriendOwesObj.$bindTo($scope, "itemsFriendOwes");

  //TODO
  //Bind the firebase location of the user         NOTE: change the "Jordan" here to the app user
  var FBUserOwesRef = new Firebase('https://jordansdemo.firebaseio.com/items/' + $scope.authedUserInfo.name + "/owes");
  var FBUserOwesObj = $firebaseObject(FBUserOwesRef);
  FBUserOwesObj.$bindTo($scope, "itemsUserOwes");

  $scope.toggleInspection = function (item) {
    item.isInspecting = !item.isInspecting;
    console.log($scope.itemsUserOwes);
  };

  $scope.updateQuantity = function (key, qty, addingItemsUserOwes) {
    if (addingItemsUserOwes) {
      var FBUserOwesItem = FBUserOwesRef.child(key);
      FBUserOwesItem.update({qty: qty});
    }
    else {
      var FBFriendOwesItem = FBFriendOwesRef.child(key);
      FBFriendOwesItem.update({qty: qty});
    }
  };

  $scope.removeItem = function (key, removingItemsUserOwes)  {
    if (removingItemsUserOwes) {
      var FBUserItem = FBUserOwesRef.child(key);
      FBUserItem.remove();
    }
    else {
      var FBFriendItem = FBFriendOwesRef.child(key);
      FBFriendItem.remove();
    }
  };

  $scope.addItem = function(qty, item, user, addingItemsUserOwes)  {
    console.log(user);
    if (addingItemsUserOwes) {
      var FBUsernewref = FBUserOwesRef.push();
      FBUsernewref.set({name: item, qty: parseInt(qty), to: user});
    }
    else {
      var FBnewref = FBFriendOwesRef.push();
      FBnewref.set({name: item, qty: parseInt(qty), to: $scope.authedUserInfo.name});
    }
  };
});
