
angular.module('myApp.controllers')
  .controller('findLawyerDetailCtrl', ['$scope','$http','$routeParams','lyrpageChart','$rootScope','$location',
    function($scope,$http,$routeParams,lyrpageChart,$rootScope,$location) {
        $scope.id = $routeParams.id;
        $scope.itemShowMax = 7;
        $scope.cotsMax = $scope.itemShowMax;
        $scope.showCotsVar = true;
        $scope.ctgsMax = $scope.itemShowMax;
        $scope.showCtgsVar = true;
        $scope.gotoRegisterVar = false;
        var djl = lyrpageChart;
        //更新：$scope.id 为律师id
        $http.get("data/lawyerInfo.json")
            .success(function(dat) {
                //初始化页面所需数据
                if (dat.code == 1 && dat.info) {
                    $scope.lawyerInfo = dat.info;
                    $("body").scrollTop(0);

                    /*if (dat.info.summary.isRegist == 0) {
                        $http.get("data/name_img.json").success(function(data){
                            if(data.code ==1 && data.info.loginStatus == 0) {
                                $scope.gotoRegisterVar = true;
                            }
                        });
                    }*/

                    if (!dat.info.loginStatus && dat.info.summary.isRegist == 0) {
                        $scope.gotoRegisterVar = true;
                    }
                }
            });


        $http.get("data/lawyerDetailData.json")
            .success(function(dat) {
                //初始化页面所需数据
                if (dat.code == 1 && dat.info) {
                    $scope.chartData = dat.info;
                    djl.chart.init(dat.info);
                    djl.interact.init(dat.info);
                    $scope.category = djl.interact.getInteractyData().category;
                    $scope.books = djl.interact.getInteractyData().books;
                    $scope.cases = djl.interact.getInteractyData().cases;
                    $scope.court = djl.interact.getInteractyData().court;
                    $scope.area = djl.interact.getInteractyData().area;
                    $scope.total = djl.interact.getInteractyData().total; 

                    $scope.categorytotal = $scope.total;
                    $scope.chartCots = djl.data.cots;
                    $scope.chartCtgs = djl.data.ctgs;
                    //文书-查看更多按钮显隐
                    $scope.moreVar = $scope.maxBookSize < $scope.categorytotal;

                }
            });

        //判断手机横竖屏状态：
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
            djl.chart.init($scope.chartData);
            djl.interact.init($scope.chartData);
        }, false);

        $scope.detailBodyVar = true;

        //交互分析/综合分析tab切换处理
        $scope.tabVar = 2;
        
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
        var CategoryFilter = new Array();
        var tmpCategoryFilter = new Array();
        var dftCategoryFilter = new Array();
        $scope.$on('categorySelAdd', function(d,data) {
            for (var i = 0;i < tmpCategoryFilter.length; i++) {
                if (tmpCategoryFilter[i] == data.name) {
                    return;
                }
            }
            tmpCategoryFilter = tmpCategoryFilter.concat([data.name]);
            $scope.filterBookSize += data.count;  
            console.log(tmpCategoryFilter+tmpCotFilter);       
        }); 
        $scope.$on('categorySelDel', function(d,data) {  
            for (var i = 0;i < tmpCategoryFilter.length; i++) {
                if (tmpCategoryFilter[i] == data.name) {
                    tmpCategoryFilter = tmpCategoryFilter.slice(0,i).concat(tmpCategoryFilter.slice(i+1));
                }
            }
            $scope.filterBookSize -= data.count;
            console.log(tmpCategoryFilter+tmpCotFilter);      
        }); 
        //案由选择-右上角确定按钮-点击事件
        $scope.categorySure = function (){
            dftCategoryFilter = CategoryFilter = tmpCategoryFilter;
            //CotFilter = [];
            $scope.categorySelVar = false;
            $scope.caseSelected = getCaseSelected();
            $scope.maxBookSize = 10;
            $scope.moreVar = $scope.maxBookSize < $scope.filterBookSize;
            $scope.detailBodyVar = true;
            $rootScope.defaultFooterVar = false;
        };
        //案由选择-取消-点击事件
        $scope.ctgCancel = function (){
            CategoryFilter = dftCategoryFilter;
            $scope.categorySelVar = false;
            $scope.detailBodyVar = true;
            $rootScope.defaultFooterVar = false;
            //$scope.$broadcast('dftCtgShow', dftCategoryFilter); 
        };
        $scope.$watch('dftCategoryFilter',function(newValue,oldValue, scope){
            console.log(newValue+"|"+oldValue);
        });
        //交互分析-基于案由的filter
        $scope.categoryFilter = function (item) {
            var ctgs = CategoryFilter;

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
            /*CategoryFilter = [];
            tmpCategoryFilter = [];*/ 
            $scope.filterBookSize = 0;
            $scope.detailBodyVar = false;
            $rootScope.defaultFooterVar = true;
        };

        //区域选择
        $scope.cotSelVar = false;
        var CotFilter = [];
        var tmpCotFilter = [];
        var dftCotFilter = [];
        $scope.$on('CotSelAdd', function(d,data) {
            for (var i = 0;i < tmpCotFilter.length; i++) {
                if (tmpCotFilter[i] == data.name) {
                    return;
                }
            }
            tmpCotFilter = tmpCotFilter.concat([data.name]);
            $scope.filterBookSize += data.count;

            console.log(tmpCategoryFilter+tmpCotFilter);       
        }); 
        $scope.$on('CotSelDel', function(d,data) {  
            for (var i = 0;i < tmpCotFilter.length; i++) {
                if (tmpCotFilter[i] == data.name) {
                    tmpCotFilter = tmpCotFilter.slice(0,i).concat(tmpCotFilter.slice(i+1));
                }
            }
            $scope.filterBookSize -= data.count;
            console.log(tmpCategoryFilter+tmpCotFilter);      
        }); 

        //地域选择-确认按钮-点击事件
        $scope.cotSure = function (){
            dftCotFilter = CotFilter = tmpCotFilter;
            //CategoryFilter = [];
            $scope.cotSelVar = false;
            $scope.caseSelected = getCaseSelected();
            $scope.maxBookSize = 10;
            $scope.moreVar = $scope.maxBookSize < $scope.filterBookSize;
            $scope.detailBodyVar = true;
            $rootScope.defaultFooterVar = false;
        };
        //地域选择-取消按钮-点击事件
        $scope.cotCancel = function (){
            CotFilter = dftCotFilter;
            $scope.cotSelVar = false;
            $scope.detailBodyVar = true;
            $rootScope.defaultFooterVar = false;
        };
        //交互分析-基于地域的filter
        $scope.courtFilter = function (item) {
            var cots = CotFilter;

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
            /*CotFilter = [];
            tmpCotFilter = []; */
            $scope.filterBookSize = 0;
            $scope.detailBodyVar = false;
            $rootScope.defaultFooterVar = true;
        };


        var getCaseSelected = function  () {
            var caseSelected = [];

            caseSelected = CategoryFilter.concat(CotFilter);
            
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

        $scope.toggleShowCots = function (data) {
            $scope.showCotsVar = !$scope.showCotsVar;
            if ($scope.showCotsVar) {
                $scope.cotsMax = $scope.itemShowMax;
            } else {
                 $scope.cotsMax = data.length;
            }
        };

        $scope.toggleShowCtgs = function (data) {
            $scope.showCtgsVar = !$scope.showCtgsVar;
            if ($scope.showCtgsVar) {
                $scope.ctgsMax = $scope.itemShowMax;
            } else {
                 $scope.ctgsMax = data.length;
            }
        };

        $scope.gotoRegister = function () {
            $location.path("#/register/lawyer");
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
        $scope.$on('dftCtgShow', function(d,data) {  
            //$scope.categoryClickVar = false; 
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
            //$scope.cotClickVar = false; 
        });
    }]);

