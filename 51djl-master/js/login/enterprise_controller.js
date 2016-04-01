angular.module('myApp.controllers')
	.controller('enterpriseRegisterCtrl', ['$scope','$http','$location', function($scope,$http,$location) {
	       $scope.apply = true;
           $scope.loginStatus = 3;
           $scope.loginErr = false;

            $scope.personalSubmit = function () {
                //register/lawyer/action
                var param = {
                    "enterpriseName":$scope.name,
                    "phone":$scope.phone, 
                    "phoneValidNo":$scope.code,
                    "password":$scope.pwd1,
                    "confirmPassword":$scope.pwd2
                };
                $http.post("data/register_err.json",param)
                    .success(function(dat){
                        if (dat.code == 1){
                            alert("submitSuc");
                        }else {
                            $scope.errorMsg = dat.msg;
                            $scope.loginErr = true;
                        }
                    });
            }

            $scope.getCheckCode = function (){
                //base/mobileValidateCode
                $http.get("data/code.json?mobile="+$scope.phone)
                    .success(function(dat){
                        if (dat.code == 1){
                            alert("get check code");
                        }else {
                            alert("get check code error");
                        }
                    });
            };
    }]);