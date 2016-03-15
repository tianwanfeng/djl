
angular.module('myApp.controllers')
  .controller('enterpriseDetailCtrl', ['$scope','$http','$routeParams','$rootScope','$location','enterprisePageChart',
    function($scope,$http,$routeParams,$rootScope,$location,enterprisePageChart) {
        $scope.id = $routeParams.id;
        $scope.ctgSelVar = true;
        $scope.cotSelVar = true;
        $scope.category = [];
        //alert($scope.id);
        //更新：$scope.id 为律师id
        var djl = enterprisePageChart;
        var ctg = "管辖权异议";
        $http.get("data/quarterCaseAmount.json?categories="+ ctg +"&enterpriseName="+$scope.id)
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
            }
        });


        $http.get("data/roleSummary.json?enterpriseName="+$scope.id)
            .success(function(dat) {
             if (dat.code == 1) {
                var processedData = djl.chart_relation.dataProcess(dat.info);        
                djl.chart_relation.conf.height = 
                djl.chart_relation.conf.hgt.min + processedData.nodes.length * djl.chart_relation.conf.hgt.ratio;
                djl.chart_relation.draw("#relation", djl.chart_relation.conf, processedData);
            }
        });

        $http.get("data/caseCategories.json?enterpriseName="+$scope.id)
            .success(function(dat) {
             if (dat.code == 1) {
                $scope.category = djl.caseCategory.format(dat.info);
            }
        });

        $http.get("data/caseAreas.json?enterpriseName="+$scope.id)
            .success(function(dat) {
             if (dat.code == 1) {
                $scope.court = djl.caseArea.format(dat.info);
            }
        });       
}])
.controller('cotSelCtrl',['$scope',
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
            $scope.cotClickVar = false; 
        });
    }]);

