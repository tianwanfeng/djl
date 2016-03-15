
angular.module('myApp.controllers')
  .controller('findLawyerDetailCtrl', ['$scope','$http','$routeParams','lyrpageChart','$rootScope','$location',
    function($scope,$http,$routeParams,lyrpageChart,$rootScope,$location) {
        $scope.id = $routeParams.id;
        
        var djl = lyrpageChart;
        //更新：$scope.id 为律师id
        $http.get("data/lawyerDetailData.json")
            .success(function(dat) {
                //初始化页面所需数据
                if (dat.code == 1 && dat.info) 
                {
                    djl.chart.init(dat.info);
                    djl.interact.init(dat.info);
                    $scope.category = djl.interact.getInteractyData().category;
                    $scope.books = djl.interact.getInteractyData().books;
                    $scope.cases = djl.interact.getInteractyData().cases;
                    $scope.court = djl.interact.getInteractyData().court;
                    $scope.area = djl.interact.getInteractyData().area;
                    $scope.total = djl.interact.getInteractyData().total; 

                    $scope.categorytotal = $scope.total;
                    //文书-查看更多按钮显隐
                    $scope.moreVar = $scope.maxBookSize < $scope.categorytotal;

                }
            });

        $scope.detailBodyVar = true;

        //交互分析/综合分析tab切换处理
        $scope.tabVar = 1;
        
        $scope.tabSelected1 = function () {
            $scope.tabVar = 1;
        };

        $scope.tabSelected2 = function () {
            $scope.tabVar = 2;
        };

        //文书-查看更多
        $scope.maxBookSize = 10;
        $scope.filterBookSize = 0;
        $scope.getMoreBook = function () {
            $scope.maxBookSize +=10;
            $scope.moreVar = $scope.maxBookSize < $scope.showbooks.length;
        }

        //案由选择
        $scope.categorySelVar = false;
        $scope.CategoryFilter = [];
        $scope.tmpCategoryFilter = [];
        $scope.$on('categorySelAdd', function(d,data) {
            for (var i = 0;i < $scope.tmpCategoryFilter.length; i++) {
                if ($scope.tmpCategoryFilter[i] == data.name) {
                    return;
                }
            }
            $scope.tmpCategoryFilter.push(data.name);
            $scope.filterBookSize += data.count;  
            console.log($scope.tmpCategoryFilter+$scope.tmpCotFilter);       
        }); 
        $scope.$on('categorySelDel', function(d,data) {  
            for (var i = 0;i < $scope.tmpCategoryFilter.length; i++) {
                if ($scope.tmpCategoryFilter[i] == data.name) {
                    $scope.tmpCategoryFilter.splice(i, 1);
                }
            }
            $scope.filterBookSize -= data.count;
            console.log($scope.tmpCategoryFilter+$scope.tmpCotFilter);      
        }); 
        //案由选择-右上角确定按钮-点击事件
        $scope.categorySure = function (){
            $scope.CategoryFilter = $scope.tmpCategoryFilter;
            $scope.CotFilter = [];
            $scope.categorySelVar = false;
            $scope.caseSelected = getCaseSelected();
            $scope.maxBookSize = 10;
            $scope.moreVar = $scope.maxBookSize < $scope.filterBookSize;
            $scope.detailBodyVar = true;
            $rootScope.defaultFooterVar = false;
        };
        //案由选择-取消-点击事件
        $scope.ctgCancel = function (){
            $scope.CategoryFilter = [];
            $scope.categorySelVar = false;
        };
        //交互分析-基于案由的filter
        $scope.categoryFilter = function (item) {
            var ctgs = $scope.CategoryFilter;

            if (ctgs.length == 0) 
                return true;

            for (var i = 0; i < ctgs.length ;i++) {
                if (ctgs[i] == item.ctg) {
                    return true;
                }
            }

            return false;
        };
        //案由按钮-点击事件
        $scope.ctgShow = function () {
            $scope.categorySelVar = true;
            $scope.cotSelVar = false;
            $scope.$broadcast('ctgShow', ''); 
            $scope.CategoryFilter = [];
            $scope.tmpCategoryFilter = []; 
            $scope.filterBookSize = 0;
            $scope.detailBodyVar = false;
            $rootScope.defaultFooterVar = true;
        };

        //区域选择
        $scope.cotSelVar = false;
        $scope.CotFilter = [];
        $scope.tmpCotFilter = [];
        $scope.$on('CotSelAdd', function(d,data) {
            for (var i = 0;i < $scope.tmpCotFilter.length; i++) {
                if ($scope.tmpCotFilter[i] == data.name) {
                    return;
                }
            }
            $scope.tmpCotFilter.push(data.name);
            $scope.filterBookSize += data.count;

            console.log($scope.tmpCategoryFilter+$scope.tmpCotFilter);       
        }); 
        $scope.$on('CotSelDel', function(d,data) {  
            for (var i = 0;i < $scope.tmpCotFilter.length; i++) {
                if ($scope.tmpCotFilter[i] == data.name) {
                    $scope.tmpCotFilter.splice(i, 1);
                }
            }
            $scope.filterBookSize -= data.count;
            console.log($scope.tmpCategoryFilter+$scope.tmpCotFilter);      
        }); 

        //地域选择-确认按钮-点击事件
        $scope.cotSure = function (){
            $scope.CotFilter = $scope.tmpCotFilter;
            $scope.CategoryFilter = [];
            $scope.cotSelVar = false;
            $scope.caseSelected = getCaseSelected();
            $scope.maxBookSize = 10;
            $scope.moreVar = $scope.maxBookSize < $scope.filterBookSize;
            $scope.detailBodyVar = true;
            $rootScope.defaultFooterVar = false;
        };
        //地域选择-取消按钮-点击事件
        $scope.cotCancel = function (){
            $scope.CotFilter = [];
            $scope.cotSelVar = false;
        };
        //交互分析-基于地域的filter
        $scope.courtFilter = function (item) {
            var cots = $scope.CotFilter;

            if (cots.length == 0) 
                return true;

            for (var i = 0; i < cots.length ;i++) {
                if (cots[i] == item.cot) {
                    return true;
                }
            }

            return false;
        };

        //地域按钮-点击事件
        $scope.cotShow = function () {
            $scope.categorySelVar = false;
            $scope.cotSelVar = true;
            $scope.$broadcast('cotShow', ''); 
            $scope.CotFilter = [];
            $scope.tmpCotFilter = []; 
            $scope.filterBookSize = 0;
            $scope.detailBodyVar = false;
            $rootScope.defaultFooterVar = true;
        };


        var getCaseSelected = function  () {
            var caseSelected = [];

            caseSelected = $scope.CategoryFilter.concat($scope.CotFilter);
            
            if (caseSelected.length == 0) {
                caseSelected.push("全部");
            }
            return caseSelected;
        };

        $scope.caseSelected = getCaseSelected();

        $scope.goBackPage = function () {
            window.history.go(-1);
        };

        $scope.goFindLawyerIndex = function () {
            $location.path('/findLawyer/index');
        };
        
  }])
  .controller('categorySelCtrl',['$scope',
    function($scope){
        //案由选择页面列表处理
        $scope.categoryClickVar = false;
        $scope.categorySel = function (data) {
            $scope.categoryClickVar = !$scope.categoryClickVar;
            if ($scope.categoryClickVar) {
                $scope.$emit('categorySelAdd', data);  
            }
            else {
                $scope.$emit('categorySelDel', data);
            }
        }
        $scope.$on('ctgShow', function(d,data) {  
            $scope.categoryClickVar = false; 
        }); 
    }])
    .controller('ctgSelCtrl',['$scope',
    function($scope){
        //地域选择页面列表处理
        $scope.cotClickVar = false;
        $scope.cotSel = function (data) {
            $scope.cotClickVar = !$scope.cotClickVar;
            if ($scope.cotClickVar) {
                $scope.$emit('CotSelAdd', data);  
            }
            else {
                $scope.$emit('CotSelDel', data);
            }
        }
        $scope.$on('cotShow', function(d,data) {  
            $scope.cotClickVar = false; 
        });
    }]);

