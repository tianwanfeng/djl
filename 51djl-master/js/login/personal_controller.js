angular.module('myApp.controllers')
	.controller('personalRegisterCtrl', ['$scope','$http','$location','$interval', 
        function($scope,$http,$location,$interval) {
            $scope.apply = true;
            $scope.loginStatus = 1;
            $scope.loginErr = false;
            $scope.paracont = "获取验证码";
            $scope.paraclass = "but_null";
            $scope.paraevent = true;
            $scope.second = 60;
            var timePromise = undefined;
            
            $scope.personalSubmit = function () {
                //register/lawyer/action
                var param = {
                    "name":$scope.name,
                    "phone":$scope.phone, 
                    "phoneValidNo":$scope.code,
                    "password":$scope.pwd1,
                    "confirmPassword":$scope.pwd2
                };
                $http.post("data/register_suc.json",param)
                    .success(function(dat){
                        if (dat.code == 1){
                            alert("submitSuc");
                            $location.path("/findLawyer/index");
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
                            timePromise = $interval(function(){
                                if($scope.second<=0){
                                    $interval.cancel(timePromise);
                                    timePromise = undefined;

                                    $scope.second = 60;
                                    $scope.paracont = "重发验证码";
                                    $scope.paraclass = "but_null";
                                    $scope.paraevent = true;
                                }else{
                                    $scope.paracont = $scope.second + "秒后可重发";
                                    $scope.paraclass = "not but_null";
                                    $scope.second--;
                                }
                            },1000,100);
                        }else {
                            alert("get check code error");
                        }
                    });    
                }
                
            };



        

    }]);