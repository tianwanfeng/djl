
angular.module('myApp.controllers')
  .controller('enterpriseIndexCtrl', ['$scope','$http','$location', 
    function($scope,$http,$location) {
        $scope.judgeVar = true;
        $http.get("data/judge.json")
            .success(function(data) {
                if (data.code == 1) {
                    $scope.judges = data.info;
                }
            });
}]);