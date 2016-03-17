var enterpriseDetailDirective = angular.module('enterpriseDetailDirective', []);

enterpriseDetailDirective.directive('tsDatepicker',function(){

                return {
                    restrict : 'EA',
                    scope:{
                                    model:"=ngModel"
                            },
                    link : function(scope,element,attrs,ctrl){
                        var currYear = (new Date()).getFullYear();  
                        var opt={};
                        opt.date = {preset : 'date'};
                        opt.datetime = {preset : 'datetime'};
                        opt.time = {preset : 'time'};
                        opt.default = {
                            theme: 'android-ics light', //皮肤样式
                            display: 'modal', //显示方式 
                            mode: 'scroller', //日期选择模式
                            dateFormat: 'yyyy-mm-dd',
                            lang: 'zh',
                            showNow: true,
                            nowText: "今天",
                            startYear: currYear - 50, //开始年份
                            endYear: currYear + 10 //结束年份
                        };        
                        var datepicker1 = $(element).mobiscroll($.extend(opt['date'], opt['default']))
                        
                            
                    }   
                }
            }).directive('teDatepicker',function(){

                return {
                    restrict : 'EA',
                    scope:{
                                    model:"=ngModel"
                            },
                    link : function(scope,element,attrs,ctrl){
                        var currYear = (new Date()).getFullYear();  
                        var opt={};
                        opt.date = {preset : 'date'};
                        opt.datetime = {preset : 'datetime'};
                        opt.time = {preset : 'time'};
                        opt.default = {
                            theme: 'android-ics light', //皮肤样式
                            display: 'modal', //显示方式 
                            mode: 'scroller', //日期选择模式
                            dateFormat: 'yyyy-mm-dd',
                            lang: 'zh',
                            showNow: true,
                            nowText: "今天",
                            startYear: currYear - 50, //开始年份
                            endYear: currYear + 10 //结束年份
                        };        
                        var datepicker1 = $(element).mobiscroll($.extend(opt['date'], opt['default']))
                        
                            
                    }   
                }
            })