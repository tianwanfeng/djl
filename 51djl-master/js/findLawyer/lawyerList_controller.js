
angular.module('myApp.controllers')
  .controller('findLawyerListCtrl', ['$scope','$http', '$routeParams','lyrListChart','$location',
        function($scope,$http, $routeParams,lyrListChart,$location) {
        
        $scope.searchKeys = $routeParams.kw;
        $scope.pageNo = 0;
        var djl = lyrListChart;
        //更新：$scope.pageNo-当前页，$scope.searchKeys-搜索词
        $http.get("data/lawyerList.json?pageNo="+$scope.pageNo).success(function(dat) {
             if (dat.code == 1) {
                if (dat.info) {
                    $scope.isLastPageVar = dat.info.dat.lastPage;
                    //$scope.isLastPageVar = false;//恢复注释，一直显示"查看更多"按钮
                    
                    djl.query.resultProcess(dat.info);
                    $scope.lawyerList = djl.getData().info;


                }
            }
        });
        //查询更多按钮 点击事件
        $scope.getMoreLawyers = function () {
            $scope.pageNo ++ ;
            //更新：$scope.pageNo-当前页，$scope.searchKeys-搜索词
            $http.get("data/lawyerList.json?pageNo="+$scope.pageNo).success(function(dat) {
                if (dat.code == 1) {
                    if (dat.info) {
                        $scope.isLastPageVar = dat.info.dat.lastPage;
                        //$scope.isLastPageVar = false;//恢复注释，一直显示"查看更多"按钮
                      
                        djl.query.resultProcess(dat.info);
                        $scope.lawyerList = djl.getData().info;
                    }
                }
            });
        };

        $scope.goBackPage = function () {
            window.history.go(-1);
        };

        $scope.goFindLawyerIndex = function () {
            $location.path('/findLawyer/index');
        };

  }])
.controller('lawyerliCtrl', ['$scope',
    function($scope) {
        // 律师列表展开（收起）按钮操作

        $scope.maxShow = 1;
        $scope.showVar = true;
        $scope.toggleShowMore = function (lawyer){
            $scope.showVar = !$scope.showVar;
            if ($scope.showVar) {
                $scope.maxShow = 1;
            } else {
                 $scope.maxShow = lawyer.caseAreaData.length;
            }
        }
}]);