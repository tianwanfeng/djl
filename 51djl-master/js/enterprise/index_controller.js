
angular.module('myApp.controllers')
  .controller('enterpriseIndexCtrl', ['$scope','$http','$location', 
    function($scope,$http,$location) {
        $scope.errorTip = false;
        $scope.judgeVar = false;

        $scope.searchEnterprise  = function () {
            $http.get("data/judge.json?enterprise=+$scope.searchKeys")
            .success(function(data) {
                if (data.code == 1) {
                    if (data.info.length == 1) {
                        $location.path('#/enterprise/detail/'+$scope.searchKeys);
                    } else if (data.info.length == 0) {
                       $scope.errorTip = true;
                    } else {
                        $scope.judges = data.info;
                        $scope.judgeVar = true; 
                    }          
                }
            });
        };
        
}]);