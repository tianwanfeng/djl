
angular.module('myApp.controllers')
  .controller('enterpriseDetailCtrl', ['$scope','$http','$routeParams','$rootScope','$location','enterprisePageChart',
	function($scope,$http,$routeParams,$rootScope,$location,enterprisePageChart) {
		$scope.id = $routeParams.id;
		$scope.tFgd = 0;
		$scope.tend = '';
		$scope.tstart = '';
		$scope.reFgd = 0;
		$scope.reend = '';
		$scope.restart = '';
		$scope.detailBodyVar = true;
		$scope.category = [];
		$scope.bookListVar = false;
		$scope.tConditions = "全部";
		$scope.rConditions = "全部";
		$scope.focusVar = 0;
		$scope.amount = {

		}
		$scope.timeparams = {
			"startDate": "",
			"endDate": "",
			"fragmentedDate": "",
			"category": [],
			"area": [],
			"court": []
		};
		var tmpTimeparams = {
			"startDate": "",
			"endDate": "",
			"fragmentedDate": "",
			"category": [],
			"area": [],
			"court": []
		};
		var getTCondtions = function ( params) {
			var fragmentedDateArr = ['最近一年半','最近半年','今年至今','有记录至今'];
			var ret = "";
			if (params.court.length != 0)
				ret += (" 法院："+ params.court);
			if (params.area.length != 0)
				ret += (" 地域："+ params.area);
			if (params.category.length != 0)
				ret += (" 案由："+ params.category);
			if (params.fragmentedDate != 0)
				ret += (" 时间："+ fragmentedDateArr[params.fragmentedDate-1]);
			else if (params.endDate ==''&&params.startDate==''){}
			else if (params.endDate =='')
				ret += (" 时间：从"+ params.startDate+"至今");
			else if (params.startDate=='')
				ret += (" 时间:到"+params.endDate);
			else 
				ret += (" 时间：从"+ params.startDate+"到"+params.endDate);
			
			if (ret == '')
				ret = '全部';
			return ret;

		};
		

	   $scope.relation = {
			"relStart": "",
			"relEnd": "",
			"relFragment": 0,
			"plaintiffs": [],
			"category": []
		};
		$scope.tmpRelation = {
			"relStart": "",
			"relEnd": "",
			"relFragment": 0,
			"plaintiffs": [],
			"category": []
		};
		var getReCondtions = function ( params) {
			var fragmentedDateArr = ['最近一年半','最近半年','今年至今','有记录至今'];
			var ret = "";
			if (params.plaintiffs.length != 0)
				ret += (" 原告："+ params.plaintiffs);
			if (params.category.length != 0)
				ret += (" 案由："+ params.category);
			if (params.relFragment != 0)
				ret += (" 时间："+ fragmentedDateArr[params.relFragment-1]);
			else if (params.relEnd ==''&&params.relStart==''){}
			else if (params.relEnd =='')
				ret += (" 时间：从"+ params.relStart+"至今");
			else if (params.relStart=='')
				ret += (" 时间:到"+params.relEnd);
			else 
				ret += (" 时间：从"+ params.relStart+"到"+params.relEnd);

			if (ret == '')
				ret = '全部';

			return ret;

		};
		
		var djl = enterprisePageChart;

		//表格，条件初始化
		var loadCaseStatChart = function () {
			$http.get("data/quarterCaseAmount.json?enterpriseName="+$scope.id)
				.success(function(dat) {
				 if (dat.code == 1) {
					var data = djl.chart_quarterCaseAmount.dataProcess(dat.info);
					//djl.chart_quarterCaseAmount.draw("svgQuarterCaseChart", djl.chart_quarterCaseAmount.conf, data);
					djl.chart_quarterCaseAmount.drwLineArea("#case_statistic_wrap",data);

					$(window).scroll(function(){ 
			            //获取窗口的滚动条的垂直位置 
			            var s = $(window).scrollTop(); 
			            //当窗口的滚动条的垂直位置大于页面的最小高度时，让返回顶部元素渐现，否则渐隐 
			            if( s > 500){ 
			                $("#scrollVar").fadeIn(100); 
			            }else{ 
			                $("#scrollVar").fadeOut(200); 
			            }; 
			        }); 
				}
			});
		};
		
		var loadTimingChart = function () {
			$http.get("data/caseSummary.json?enterpriseName="+$scope.id)
				.success(function(dat) {
				 if (dat.code == 1) {
					var data = dat.info || {};
					var processedData = djl.chart_timing.dataProcess(data.caseInfos || []);
					var position = djl.chart_timing.posCalculate(djl.chart_timing.conf, processedData);
					var nums = data.caseInfos.length;
					djl.chart_timing.draw("caseTimingChart", djl.chart_timing.conf, processedData, position,nums);
					$scope.amount = djl.chart_timing.processAmount(data);
				}
			});
		};
		

		var loadRelationChart = function () {
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
		};
		

		loadRelationChart();
        loadTimingChart();
        loadCaseStatChart();

		//判断手机横竖屏状态：
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
            djl.chart_relation.conf.width = document.body.clientWidth * 0.92;
            //djl.chart_timing.conf.width = document.body.clientWidth * 0.92;
            loadRelationChart();
            loadTimingChart();
            loadCaseStatChart();
        }, false);

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
		$scope.case_timeSelShow = function () {
			$scope.timingDateSelVar = true;
			$scope.detailBodyVar = false;
		};
		$scope.case_ctgSelShow = function () {
			$scope.ctgSelVar = true;
			$scope.detailBodyVar = false;
		};
		$scope.case_cotSelShow = function () {
			$scope.cotSelVar = true;
			$scope.detailBodyVar = false;
		};
		$scope.rel_plnSelShow = function () {
			$scope.plaintiffrelVar = true;
			$scope.detailBodyVar = false;
		};
		$scope.rel_ctgSelShow = function () {
			$scope.rectgSelVar = true;
			$scope.detailBodyVar = false;
		};
		$scope.rel_timeSelShow = function (){
			$scope.reDateSelVar = true;
			$scope.detailBodyVar = false;
		};
		//时间轴图-日期选择
		$scope.titouchStart = function (x) {
			$scope.tiActiveVar = x;
		};
		$scope.fgdSel = function (x) {
			$scope.tiActiveVar = 0;
			$('.time_sel_check li').removeClass('right');
			tmpTimeparams.endDate = "";
			$scope.tend = '';
			tmpTimeparams.startDate = "";
			$scope.tstart = '';
			
			if ($scope.tFgd != x) {
				$scope.tFgd = x;
				$('.time_sel_check li[f='+x+']').addClass('right');
				tmpTimeparams.fragmentedDate = x;
			} else {
				$scope.tFgd = 0;
				tmpTimeparams.fragmentedDate = 0;
			}
			
		}
		$scope.$watch('tstart',function(newValue,oldValue, scope){
			tmpTimeparams.startDate = newValue;
			tmpTimeparams.fragmentedDate = 0;
			$scope.tFgd = 0;
		});
		$scope.$watch('tend',function(newValue,oldValue, scope){
			tmpTimeparams.endDate = newValue;
			tmpTimeparams.fragmentedDate = 0;
			$scope.tFgd = 0;
		});
		//时间轴图-地域选择
		$scope.$on ('CotSelAdd',function(d,data) {
			for (var i = 0;i < tmpTimeparams.court.length; i++) {
				if (tmpTimeparams.court[i] == data.name) {
					return;
				}
			}
			tmpTimeparams.court.push(data.name);
			console.log(tmpTimeparams.court);
		}); 

		$scope.$on ('CotSelDel',function(d,data) {
			for (var i = 0;i < tmpTimeparams.court.length; i++) {
				if (tmpTimeparams.court[i] == data.name) {
					tmpTimeparams.court.splice(i, 1);
				}
			}
			console.log(tmpTimeparams.court);
		}); 
		

		//时间轴图-案由选择
		$scope.$on ('ctgSelAdd',function(d,data) {
			for (var i = 0;i < tmpTimeparams.category.length; i++) {
				if (tmpTimeparams.category[i] == data.name) {
					return;
				}
			}
			tmpTimeparams.category.push(data.name);
			console.log(tmpTimeparams.category);
		}); 

		$scope.$on ('ctgSelDel',function(d,data) {
			for (var i = 0;i < tmpTimeparams.category.length; i++) {
				if (tmpTimeparams.category[i] == data.name) {
					tmpTimeparams.category.splice(i, 1);
				}
			}
			console.log(tmpTimeparams.category);
		}); 
		//时间轴图-刷新数据
		
		$scope.time_refreshTimeChart = function () {
			$scope.timeparams.fragmentedDate = tmpTimeparams.fragmentedDate;
			$scope.timeparams.startDate = tmpTimeparams.startDate;
			$scope.timeparams.endDate = tmpTimeparams.endDate;
			refreshTimeChart();
		};

		$scope.ctg_refreshTimeChart = function () {
			$scope.timeparams.category = tmpTimeparams.category;
			refreshTimeChart();
		};

		$scope.cot_refreshTimeChart = function () {
			$scope.timeparams.court = tmpTimeparams.court;
			refreshTimeChart();
		};

		var refreshTimeChart = function () {
			$scope.ctgSelVar = false;
			$scope.cotSelVar = false;
			$scope.timingDateSelVar = false;
			$scope.detailBodyVar = true;
			//post
			 var params = djl.caseConditions.timeChartFormat($scope.id,$scope.timeparams);
			//get
			var params2 = djl.caseConditions.timeChartFormat2($scope.id,$scope.timeparams);
			$http.post("data/caseSummary2.json?",params)
				.success(function(dat) {
				 if (dat.code == 1) {
					var data = dat.info || {};
					var processedData = djl.chart_timing.dataProcess(data.caseInfos || []);
					var position = djl.chart_timing.posCalculate(djl.chart_timing.conf, processedData);
					djl.chart_timing.draw("caseTimingChart", djl.chart_timing.conf, processedData, position,data.caseInfos.length);
					$scope.amount = djl.chart_timing.processAmount(data);
					$scope.tConditions = getTCondtions($scope.timeparams);
				}
			});
		}
		//时间轴图-取消选择
		$scope.timingCancel = function () {
			$scope.ctgSelVar = false;
			$scope.cotSelVar = false;
			$scope.timingDateSelVar = false;
			$scope.detailBodyVar = true;
		}

		//关系图-日期选择
		$scope.tFocused = function(x) {
			$scope.focusVar = x;
		};

		$scope.rtouchStart = function (x) {
			$scope.relActiveVar = x;
		};

		$scope.refgdSel = function (x) {
			$scope.relActiveVar = 0;
			$('.time_sel_check li').removeClass('right');
			$scope.tmpRelation.relEnd = "";
			$scope.reend = '';
			$scope.tmpRelation.relStart = "";
			$scope.restart = '';
			
			if ($scope.reFgd!=x) {
				$scope.reFgd = x;
				$scope.tmpRelation.relFragment = x;
				$('.time_sel_check li[r='+x+']').addClass('right');
			} else {
				$scope.reFgd = 0;
				$scope.tmpRelation.relFragment = 0;
			}
		}
		$scope.$watch('restart',function(newValue,oldValue, scope){
			$scope.tmpRelation.relStart = newValue;
			$scope.tmpRelation.relFragment = 0;
			$scope.tFgd = 0;
		});
		$scope.$watch('reend',function(newValue,oldValue, scope){
			$scope.tmpRelation.relEnd = newValue;
			$scope.tmpRelation.relFragment = 0;
			$scope.tFgd = 0;
		});
		//关系图-原告选择
		$scope.$on ('PlnSelAdd',function(d,data) {
			for (var i = 0;i < $scope.tmpRelation.plaintiffs.length; i++) {
				if ($scope.tmpRelation.plaintiffs[i] == data) {
					return;
				}
			}
			$scope.tmpRelation.plaintiffs.push(data);
			console.log($scope.tmpRelation.plaintiffs);
		}); 

		$scope.$on ('PlnSelDel',function(d,data) {
			for (var i = 0;i < $scope.tmpRelation.plaintiffs.length; i++) {
				if ($scope.tmpRelation.plaintiffs[i] == data) {
					$scope.tmpRelation.plaintiffs.splice(i, 1);
				}
			}
			console.log($scope.tmpRelation.plaintiffs);
		}); 
		//关系图-案由选择
		$scope.$on ('rectgSelAdd',function(d,data) {
			for (var i = 0;i < $scope.tmpRelation.category.length; i++) {
				if ($scope.tmpRelation.category[i] == data.name) {
					return;
				}
			}
			$scope.tmpRelation.category.push(data.name);
			console.log($scope.tmpRelation.category);
		}); 

		$scope.$on ('rectgSelDel',function(d,data) {
			for (var i = 0;i < $scope.tmpRelation.category.length; i++) {
				if ($scope.tmpRelation.category[i] == data.name) {
					$scope.tmpRelation.category.splice(i, 1);
				}
			}
			console.log($scope.tmpRelation.category);
		});
		//关系图-取消选择
		$scope.reCancel = function (){
			$scope.rectgSelVar = false;
			$scope.plaintiffrelVar = false;
			$scope.reDateSelVar = false;
			$scope.detailBodyVar = true;
		};

		//关系图-刷新数据
		$scope.time_refreshRelationChart = function () {
			$scope.relation.relFragment = $scope.tmpRelation.relFragment;
			$scope.relation.relEnd = $scope.tmpRelation.relEnd;
			$scope.relation.relStart = $scope.tmpRelation.relStart;
			refreshRelationChart();
		}
		$scope.plf_refreshRelationChart = function () {
			$scope.relation.plaintiffs = $scope.tmpRelation.plaintiffs;
			refreshRelationChart();
		}
		$scope.ctg_refreshRelationChart = function () {
			$scope.relation.category = $scope.tmpRelation.category;
			refreshRelationChart();
		}
		var refreshRelationChart = function () {
			$scope.rectgSelVar = false;
			$scope.plaintiffrelVar = false;
			$scope.reDateSelVar = false;
			$scope.detailBodyVar = true;
			//$scope.relation = $scope.tmpRelation;
			//post $http.get("data/roleSummary2.json",params).success(...)
			 var params = djl.relConditions.paramFormat($scope.id,$scope.relation);
			
			//get
			var params2 = djl.relConditions.paramFormat2($scope.id,$scope.relation);
			$http.post("data/roleSummary2.json?",params)
				.success(function(dat) {
				 if (dat.code == 1) {
					var processedData = djl.chart_relation.dataProcess(dat.info);        
					djl.chart_relation.conf.height = 
					djl.chart_relation.conf.hgt.min + processedData.nodes.length * djl.chart_relation.conf.hgt.ratio;
					djl.chart_relation.draw("#relation", djl.chart_relation.conf, processedData);
					$scope.rConditions = getReCondtions($scope.relation);
				}
			});
		}

		$scope.bookCancel = function (){
			$("#docView").addClass("hidden");
		};

		$scope.goBackPage = function () {
            window.history.go(-1);
        };

        $scope.goFindLawyerIndex = function () {
            $location.path('/findLawyer/index');
        };
        
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

