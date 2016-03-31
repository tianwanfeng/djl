angular.module('myApp.controllers')
    .controller('loginCtrl', ['$cookieStore','$scope','$http','$location', function($cookieStore,$scope,$http,$location) {
           $scope.errorVar = false;
           $scope.loginStatus = 0;

           $scope.autologin = $cookieStore.get("djl.autologin");
           if ($scope.autologin == 1) {
                $scope.account = $cookieStore.get("djlUser").account;
                $scope.password = $cookieStore.get("djlUser").password;
           } else {
                $scope.account = "";
                $scope.password = "";
                $scope.autologin = 0;
           }

           $scope.apply = true;
            $scope.loginSubmit = function () {
                //register/lawyer/action
                var param = {
                    "account":$scope.account,
                    "password":$scope.password,
                    "app":"app" ,
                    "autologin":$scope.autologin, 
                };
                $http.post("data/register_suc.json",param)
                    .success(function(dat){
                        if (dat.code == 1){
                            alert("submitSuc");
                            $cookieStore.put("djlUser", {
                                account: $scope.account,
                                password: $scope.password,
                                autologin:$scope.autologin, 
                            });
                            $cookieStore.put("djl.autologin",$scope.autologin);
                        }else {
                            $scope.errorVar = true;
                        }
                    });
            }

            $scope.togglePwd = function () {
                if ($scope.autologin == 1) {
                    $scope.autologin = 0;
                } else {
                    $scope.autologin = 1;
                }
            }
    }]);