angular.module('myApp.controllers')
	.controller('lawyerRegisterCtrl', ['$scope','$http','$location', function($scope,$http,$location) {
	       $scope.apply = true;
           $scope.loginStatus = 2;
           $scope.loginErr = false;

            $scope.personalSubmit = function () {
                //register/lawyer/action
                var param = {
                    "name":$scope.name,
                    "office":$scope.office,
                    "license":$scope.license,
                    "phone":$scope.phone, 
                    "phoneValidNo":$scope.code,
                    "password":$scope.pwd1,
                    "confirmPassword":$scope.pwd2
                };
                $http.post("data/register_err.json",param)
                    .success(function(dat){
                        if (dat.code == 1){
                            alert("submitSuc");
                            $location.path("#/findLawyer/index");
                        }else {
                            $scope.errorMsg = dat.msg;
                            $scope.loginErr = true;
                        }
                    });
            }

            $scope.getCheckCode = function (){
                //base/mobileValidateCode
                if($scope.myForm.phone.$valid) {
                $http.get("data/code.json?mobile="+$scope.phone)
                    .success(function(dat){
                        if (dat.code == 1){
                            alert("get check code");
                        }else {
                            alert("get check code error");
                        }
                    });
                }
            };
    }]);