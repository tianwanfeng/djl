
angular.module('myApp.controllers')
  .controller('enterpriseDetailCtrl', ['$scope','$http','$routeParams','$rootScope','$location','enterprisePageChart',
    function($scope,$http,$routeParams,$rootScope,$location,enterprisePageChart) {
        $scope.id = $routeParams.id;
/*        $scope.ctgSelVar = true;
        $scope.cotSelVar = true;
        $scope.plaintiffrelVar = true;
        $scope.rectgSelVar = true;*/
        $scope.category = [];

        $scope.amount = {

        }
        $scope.timeparams = {
            "startDate": "",
            "endDate": "",
            "fragmentedDate": 0,
            "category": [],
            "area": [],
            "court": []
        };

       $scope.relation = {
            "relStart": "",
            "relEnd": "",
            "relFragment": 0,
            "plaintiffs": [],
            "category": []
        };
        //alert($scope.id);
        //更新：$scope.id 为律师id
        var djl = enterprisePageChart;

        //表格，条件初始化
        $http.get("data/quarterCaseAmount.json?enterpriseName="+$scope.id)
            .success(function(dat) {
             if (dat.code == 1) {
                var data = djl.chart_quarterCaseAmount.dataProcess(dat.info);
                //djl.chart_quarterCaseAmount.draw("svgQuarterCaseChart", djl.chart_quarterCaseAmount.conf, data);
                djl.chart_quarterCaseAmount.drwLineArea("#case_statistic_wrap",data);
            }
        });

        $http.get("data/caseSummary.json?enterpriseName="+$scope.id)
            .success(function(dat) {
             if (dat.code == 1) {
                var data = dat.info || {};
                var processedData = djl.chart_timing.dataProcess(data.caseInfos || []);
                var position = djl.chart_timing.posCalculate(djl.chart_timing.conf, processedData);
                djl.chart_timing.draw("caseTimingChart", djl.chart_timing.conf, processedData, position);
                $scope.amount = djl.chart_timing.processAmount(data);
            }
        });


        $http.get("data/roleSummary.json?enterpriseName="+$scope.id)
            .success(function(dat) {
             if (dat.code == 1) {
                var processedData = djl.chart_relation.dataProcess(dat.info);        
                djl.chart_relation.conf.height = 
                djl.chart_relation.conf.hgt.min + processedData.nodes.length * djl.chart_relation.conf.hgt.ratio;
                djl.chart_relation.draw("#relation", djl.chart_relation.conf, processedData);
                $scope.plaintiffs = djl.chart_relation.formatPlaintiffs(processedData,$scope.id);
            }
        });

        $http.get("data/caseCategories.json?enterpriseName="+$scope.id)
            .success(function(dat) {
             if (dat.code == 1) {
                $scope.category = djl.caseCategory.format(dat.info);
                $scope.recategory = djl.caseCategory.format(dat.info);
            }
        });

        $http.get("data/caseAreas.json?enterpriseName="+$scope.id)
            .success(function(dat) {
             if (dat.code == 1) {
                $scope.court = djl.caseArea.format(dat.info);
            }
        });      

        //案件分析/关系图谱tab切换处理
        $scope.tabVar = 1;
        
        $scope.tabSelected1 = function () {
            $scope.tabVar = 1;
        };

        $scope.tabSelected2 = function () {
            $scope.tabVar = 2;
        };
        $scope.case_ctgSelShow = function () {
            $scope.ctgSelVar = true;
        }
        $scope.case_cotSelShow = function () {
            $scope.cotSelVar = true;
        }
        $scope.rel_plnSelShow = function () {
            $scope.plaintiffrelVar = true;
        }
        $scope.rel_ctgSelShow = function () {
            $scope.rectgSelVar = true;
        }

        //时间轴图-地域选择
        $scope.$on ('CotSelAdd',function(d,data) {
            for (var i = 0;i < $scope.timeparams.court.length; i++) {
                if ($scope.timeparams.court[i] == data.name) {
                    return;
                }
            }
            $scope.timeparams.court.push(data.name);
            console.log($scope.timeparams.court);
        }); 

        $scope.$on ('CotSelDel',function(d,data) {
            for (var i = 0;i < $scope.timeparams.court.length; i++) {
                if ($scope.timeparams.court[i] == data.name) {
                    $scope.timeparams.court.splice(i, 1);
                }
            }
            console.log($scope.timeparams.court);
        }); 

        //时间轴图-案由选择
        $scope.$on ('ctgSelAdd',function(d,data) {
            for (var i = 0;i < $scope.timeparams.category.length; i++) {
                if ($scope.timeparams.category[i] == data.name) {
                    return;
                }
            }
            $scope.timeparams.category.push(data.name);
            console.log($scope.timeparams.category);
        }); 

        $scope.$on ('ctgSelDel',function(d,data) {
            for (var i = 0;i < $scope.timeparams.category.length; i++) {
                if ($scope.timeparams.category[i] == data.name) {
                    $scope.timeparams.category.splice(i, 1);
                }
            }
            console.log($scope.timeparams.category);
        }); 
        //时间轴图-刷新数据
        $scope.refreshTimeChart = function () {
            $scope.ctgSelVar = false;
            $scope.cotSelVar = false;
            //post $http.get("data/caseSummary2.json",params).success(...)
             var params = djl.caseConditions.timeChartFormat($scope.id,$scope.timeparams);
            
            //get
            var params2 = djl.caseConditions.timeChartFormat2($scope.id,$scope.timeparams);
            $http.get("data/caseSummary2.json?"+params2)
                .success(function(dat) {
                 if (dat.code == 1) {
                    var data = dat.info || {};
                    var processedData = djl.chart_timing.dataProcess(data.caseInfos || []);
                    var position = djl.chart_timing.posCalculate(djl.chart_timing.conf, processedData);
                    djl.chart_timing.draw("caseTimingChart", djl.chart_timing.conf, processedData, position);
                }
            });
        }

        //关系图-原告选择
        $scope.$on ('PlnSelAdd',function(d,data) {
            for (var i = 0;i < $scope.relation.plaintiffs.length; i++) {
                if ($scope.relation.plaintiffs[i] == data) {
                    return;
                }
            }
            $scope.relation.plaintiffs.push(data);
            console.log($scope.relation.plaintiffs);
        }); 

        $scope.$on ('PlnSelDel',function(d,data) {
            for (var i = 0;i < $scope.relation.plaintiffs.length; i++) {
                if ($scope.relation.plaintiffs[i] == data.name) {
                    $scope.relation.plaintiffs.splice(i, 1);
                }
            }
            console.log($scope.relation.plaintiffs);
        }); 
        //关系图-案由选择
        $scope.$on ('rectgSelAdd',function(d,data) {
            for (var i = 0;i < $scope.relation.category.length; i++) {
                if ($scope.relation.category[i] == data.name) {
                    return;
                }
            }
            $scope.relation.category.push(data.name);
            console.log($scope.relation.category);
        }); 

        $scope.$on ('rectgSelDel',function(d,data) {
            for (var i = 0;i < $scope.relation.category.length; i++) {
                if ($scope.relation.category[i] == data.name) {
                    $scope.relation.category.splice(i, 1);
                }
            }
            console.log($scope.relation.category);
        });
        //关系图-刷新数据
        $scope.refreshRelationChart = function () {
            $scope.plaintiffrelVar = false;
            $scope.rectgSelVar = false;
            //post $http.get("data/roleSummary2.json",params).success(...)
             var params = djl.relConditions.paramFormat($scope.id,$scope.relation);
            
            //get
            var params2 = djl.relConditions.paramFormat2($scope.id,$scope.relation);
            $http.get("data/roleSummary2.json?"+params2)
                .success(function(dat) {
                 if (dat.code == 1) {
                    var processedData = djl.chart_relation.dataProcess(dat.info);        
                    djl.chart_relation.conf.height = 
                    djl.chart_relation.conf.hgt.min + processedData.nodes.length * djl.chart_relation.conf.hgt.ratio;
                    djl.chart_relation.draw("#relation", djl.chart_relation.conf, processedData);
                }
            });
        }
}])
.controller('ctgSelCtrl',['$scope',
    function($scope){
        //案由选择页面列表处理
        $scope.ctgClickVar = false;
        $scope.ctgSel = function (data) {
            $scope.ctgClickVar = !$scope.ctgClickVar;
            if ($scope.ctgClickVar) {
                $scope.$emit('ctgSelAdd', data);  
            }
            else {
                $scope.$emit('ctgSelDel', data);
            }
        }
        $scope.$on('ctgShow', function(d,data) {  
            //$scope.ctgClickVar = false; 
        }); 
    }])
    .controller('cotSelCtrl',['$scope',
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
    }])
    .controller('plaintifflCtrl',['$scope',
    function($scope){
        //地域选择页面列表处理
        $scope.plaintiffClickVar = false;
        $scope.plaintiffSel = function (data) {
            $scope.plaintiffClickVar = !$scope.plaintiffClickVar;
            if ($scope.plaintiffClickVar) {
                $scope.$emit('PlnSelAdd', data);  
            }
            else {
                $scope.$emit('PlnSelDel', data);
            }
        }
        $scope.$on('cotShow', function(d,data) {  
            //$scope.cotClickVar = false; 
        });
    }])
    .controller('rectgSelCtrl',['$scope',
    function($scope){
        //案由选择页面列表处理
        $scope.rectgClickVar = false;
        $scope.rectgSel = function (data) {
            $scope.rectgClickVar = !$scope.rectgClickVar;
            if ($scope.rectgClickVar) {
                $scope.$emit('rectgSelAdd', data);  
            }
            else {
                $scope.$emit('rectgSelDel', data);
            }
        }
        $scope.$on('ctgShow', function(d,data) {  
            //$scope.ctgClickVar = false; 
        }); 
    }]);

