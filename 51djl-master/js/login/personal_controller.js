angular.module('myApp.controllers')
	.controller('personalRegisterCtrl', ['$scope','$http','$location', 
        function($scope,$http,$location) {
            $scope.apply = true;
            $scope.personalSubmit = function () {
                alert("submit");
            }

            $scope.getCheckCode = function (){
                alert("get check code");
            };


    }]);