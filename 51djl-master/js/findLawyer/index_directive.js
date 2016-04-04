var flyrIndexDirective = angular.module('flyrIndexDirective', []);

flyrIndexDirective.directive('myTouchstart', [function() {
    return function(scope, element, attr) {

        element.on('touchstart', function(event) {
            scope.$apply(function() { 
              scope.activeVar = true;
              scope.$eval(attr.myTouchstart);
            });
        });
    };
}]).directive('myTouchend', [function() {
    return function(scope, element, attr) {

        element.on('touchend', function(event) {
            scope.$apply(function() { 
              scope.activeVar = false;
              scope.$eval(attr.myTouchend);
            });
        });
    };
}]).directive('myFocused', [function() {
  return function(scope, element, attr) {

  element.bind('focus', function(event) {
          scope.$apply(function() { 
            scope.focusVar2 = 1;
            scope.$eval(attr.myFocused);
          });
        }).bind('blur', function(evt) {
            scope.focusVar = 0;
            scope.focusVar2 = 0;
        });;
    };
}]).directive('panelmenu', function() {
    return {
        restrict: 'E',
        templateUrl: 'html/login/panelMenu.html',
        transclude: true,
        controller:function($scope,$http){
            $http.get("data/name_img.json").success(function(data){
               $scope.slideMenu = {};
               if(data.code ==1) {
                  $scope.slideMenu.img = data.info.photoLg;
                  $scope.slideMenu.name = data.info.name;
                  $scope.slideMenu.loginStatus = data.info.loginStatus;
                  $scope.slideMenu.userType = data.info.userType;
               }
            });
          }
      }
}).directive('lyrfooter', function() {
    return {
        restrict: 'E',
        templateUrl: 'html/login/footer.html',
      }
});