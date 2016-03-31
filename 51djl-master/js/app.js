// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'myApp.controllers',
  'ngRoute',
  'lawyerDetailServices',
  'lawyerListServices',
  'infinite-scroll',
  'enterpriseDetailServices',
  'enterpriseDetailDirective',
  'lyrD3Directive',
  'onfocusDirective',
  'flyrIndexDirective',
  'ngCookies'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/findLawyer/index', {
        templateUrl: 'html/findLawyer/index.html',
        controller: 'findLawyerIndexCtrl'
    })
    .when('/findLawyer/list/:kw', {
        templateUrl: 'html/findLawyer/lawyerList.html',
        controller: 'findLawyerListCtrl'    
    })
    .when('/findLawyer/detail/:id', {
        templateUrl: 'html/findLawyer/lawyerDetail.html',
        controller: 'findLawyerDetailCtrl'    
    })
    .when('/enterprise/index', {
        templateUrl: 'html/enterprise/index.html',
        controller: 'enterpriseIndexCtrl'    
    })
    .when('/enterprise/detail/:id', {
        templateUrl: 'html/enterprise/enterpriseDetail.html',
        controller: 'enterpriseDetailCtrl'    
    })
    .when('/register/personal', {
        templateUrl: 'html/login/register_personal.html',
        controller: 'personalRegisterCtrl'    
    })
    .when('/register/enterprise', {
        templateUrl: 'html/login/register_enterprise.html',
        controller: 'enterpriseRegisterCtrl'    
    })
    .when('/register/lawyer', {
        templateUrl: 'html/login/register_lawyer.html',
        controller: 'lawyerRegisterCtrl'
    })
    .when('/login', {
        templateUrl: 'html/login/login.html',
        controller: 'loginCtrl'
    });
  $routeProvider.otherwise({redirectTo: '/register/personal'});
}]);