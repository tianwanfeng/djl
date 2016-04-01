
angular.module('myApp.controllers')
  .controller('enterpriseIndexCtrl', ['$scope','$http','$location', 
    function($scope,$http,$location) {
        $scope.errorTip = false;
        $scope.errorTip2 = false;
        $scope.judgeVar = false;

        $scope.searchEnterprise  = function () {
            $scope.judges = [];            
            $http.get("data/name_img.json").success(function(data){
               if(data.code ==1 && data.info.loginStatus == 1) {
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
               } else {
                    $scope.errorTip2 = true;
               }
           });
        }
}]);