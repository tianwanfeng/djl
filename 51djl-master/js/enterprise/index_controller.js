
angular.module('myApp.controllers')
  .controller('enterpriseIndexCtrl', ['$scope','$http','$location', 
    function($scope,$http,$location) {

        $http.get("data/city.json")
            .success(function(data) {
                $scope.area = data;
                $scope.provinces = data;
            });
}]);