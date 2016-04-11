
angular.module('myApp.controllers',[])
  .controller('findLawyerIndexCtrl', ['$scope','$http','$location', function($scope,$http,$location) {
        $scope.bannerVar = true;
        $scope.errorTip = false;
        var ctgSelFlag = false;
        var defautCity = "北京"
        //搜索关键字临时cache
        var tmpCtgKey ={
            type:"ctg",
            name:""
        };
        var tmpAreaKey ={
            type:"area",
            name:""
        };
        //加载菜单数据
        $http.get("data/indexMenu.json")
            .success(function(data) {
                $scope.list = data;
            });

        //加载城市数据
        $http.get("data/city.json")
            .success(function(data) {
                $scope.area = data;
                $scope.provinces = data;
            });

        //初始化页面数据
        $scope.firstLvlMenu = null; 
        $scope.secondLvlMenu = null;
        $scope.provincesFlag = false;
        $scope.citysFlag = false;
        $scope.searchCategory = "";
        $scope.searchArea="";
        $scope.searchKeys="";
        $scope.curArea = defautCity;

        $scope.hideBanner = function() {
            $scope.bannerVar = false;
        }
        //地域选择
        $scope.areaSelect = function() {
            //51djl_jquery 
            $scope.area = $scope.provinces
            $scope.provincesFlag = false;
            $scope.citysFlag = false;
            $('.city').toggleClass('hidden');
            $('.panel').toggleClass('hidden');
            $('.first-list').addClass('hidden');
        };
        //选择省
        $scope.provinceSelect = function(data) {
            $scope.area = data;
            $scope.provincesFlag = false;
            $scope.citysFlag = false;
        };
        //选择市
        $scope.citySelect = function(data) {
            $scope.area = data;
            $scope.provincesFlag = true;
            $scope.citysFlag = false;
        };

        //选择区（县）
        $scope.getSubAreas = function(data) {
            $scope.curArea = data.name;
            if (data.city == 'null') {
                if (data.level == 2) {
                    $scope.searchArea = $scope.provinceName;
                } else if( data.level == 3) {
                   $scope.searchArea = $scope.provinceName+($scope.provinceName == $scope.cityName?"":$scope.cityName)+(data.name == $scope.cityName?"":data.name);
                } else {
                    //$scope.searchArea = $scope.provinceName+($scope.provinceName == $scope.cityName?"":$scope.cityName)+data.name;    
                }
                
                $('.city').toggleClass('hidden');
                $('.panel').toggleClass('hidden');
            } else {
                if (data.level == 1) {
                    $scope.citys = data.city;
                    $scope.provinceName = data.name;
                    $scope.provincesFlag = true;
                } else if (data.level == 2) {
                    $scope.cityName = data.name;
                    $scope.citysFlag = true;
                } 
                $scope.area = data.city;
            }
            //$scope.searchKeys = $scope.searchCategory + " " + $scope.searchArea;
            setSearchKey($scope.searchArea,tmpAreaKey);
        };

        //瀑布流标题中一级标题点击事件
        $scope.lvl1TitleClick = function (data) {
            var lv0MenuIndex = data.index.split('.')[0];
            $scope.firstLvlMenu = data.subCategories;
            $('.second-list').addClass('hidden');
            $('.first-list').eq(lv0MenuIndex).removeClass('hidden');  
            $scope.searchCategory = data.categoryName;
            //$scope.searchKeys = data.categoryName + " " + $scope.searchArea; 
            setSearchKey(data.categoryName,tmpCtgKey);
            ctgSelFlag = true;
        }

        //一级菜单-点击事件
        $scope.flm_select = function (data) {
            $scope.bannerVar = false;
            var lv0MenuIndex = data.index.split('.')[0];

            $scope.subMenuTitlelv1 = data.categoryName;

            var newMenuList = data.subCategories;
            //51djl_jquery
            $('.second-list').addClass('hidden');

            $scope.lvl1Menus = data;
            $scope.searchCategory = data.categoryName;
            //$scope.searchKeys = data.categoryName + " " + $scope.searchArea;
            setSearchKey(data.categoryName,tmpCtgKey);
            if (newMenuList == null) {
                $('.first-list').addClass('hidden');
                return;
            }

            if ($scope.firstLvlMenu == newMenuList) {
                 $('.first-list').eq(lv0MenuIndex).toggleClass('hidden');
            } else {
                $scope.firstLvlMenu = newMenuList;
                $('.first-list').addClass('hidden');
                $('.first-list').eq(lv0MenuIndex).removeClass('hidden');   
            }

            ctgSelFlag = true;
        };

        //二级菜单-点击事件
        $scope.slm_select = function(data) {
            var lv0MenuIndex = data.index.split('.')[0];

            $scope.subMenuTitlelv2 = data.categoryName;
            $scope.searchCategory = data.categoryName;
            var newMenuList = data.subCategories;
            //51djl_jquery
            $('.first-list').addClass('hidden');

            //$scope.searchKeys = data.categoryName + " " + $scope.searchArea;
            setSearchKey(data.categoryName,tmpCtgKey);
            if (newMenuList == null) {
                $('.second-list').addClass('hidden');
                return;
            }

            $scope.secondLvlMenu = newMenuList;
            
            $('.second-list').eq(lv0MenuIndex).removeClass('hidden');

            ctgSelFlag = true;
        };

        //三级菜单-点击事件
        $scope.tlm_select = function(data) { 
            //51djl_jquery
            $('.first-list').addClass('hidden');
            $('.second-list').addClass('hidden');

            $scope.searchCategory = data.categoryName;

            //$scope.searchKeys = $scope.searchCategory + " " + $scope.searchArea;
            setSearchKey(data.categoryName,tmpCtgKey);

            ctgSelFlag = true;
        }

        $scope.toLawyerList = function (searchKeys) {
            $location.url('/findLawyer/list');
        };

        

        //搜索关键词变更
        function setSearchKey(newKey,tmpKey) {
            if ($scope.searchKeys != "") {
                if (tmpKey.name!="") {
                    if ($scope.searchKeys.indexOf(tmpKey.name)>-1)
                        $scope.searchKeys = $scope.searchKeys.replace(tmpKey.name, newKey);
                    else 
                        $scope.searchKeys += (" "+ newKey);
                } else {
                     $scope.searchKeys += (" "+ newKey);
                }
            } else {
                $scope.searchKeys = newKey;
            }
            tmpKey.type=='ctg'?tmpCtgKey.name=newKey:tmpAreaKey.name=newKey;
        }

        $scope.searchLawyer = function () {
            var kw = $scope.searchKeys;
            if (ctgSelFlag && kw.indexOf(" ")<0) {
                kw = kw + " "+defautCity;
            }
            $http.get("data/lawyerList.json?kw="+kw).success(function(dat) {
             if (dat.code == 1) {
                    $location.path('/findLawyer/list/'+kw);
                } else {
                    $scope.errorTip = true;
                }
            })
        };

}]);