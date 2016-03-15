//详情页数据解析，格式化service
var lawyerDetailServices = angular.module('lawyerDetailServices', []);

lawyerDetailServices.factory('lyrpageChart', function(){
    var ctx = 'ctx';//修改
    var djl = {
    };
    djl.math = {
        "divide":function (e,d,f){
            var c=parseFloat(e),h=parseFloat(d),g=parseInt(f);
            if(isNaN(c)||isNaN(h)||h==0){
                return NaN;
            }
            if(isNaN(g)){
                g=2;
            }
            return Number((c/h).toFixed(g));
        },
        'divideTopercent' :function(e,d,f){
            var c=parseFloat(e),h=parseFloat(d),g=parseInt(f);
            if(isNaN(c)||isNaN(h)||h==0){
                return"";
            }
            if(isNaN(g)){
                g=2;
            }
            return Number(c*100/h).toFixed(g)+"%";
        }
    };

    djl.data = {
        "cases": []
    };

    djl.myd3chart = {
        drwBarChart: function (id,data) {
            var margin = {top: 10, right: 0, bottom: 14, left: 20}
                height = 150,
                width = window.screen.width * 0.92  - margin.left - margin.right;
            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .tickSize(0,0)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .ticks(0)
                .orient("left");

            var svg = d3.select(id).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var allCount = 0;
                data.data.forEach(function(d){
                    allCount += d.count
                });
                data.data.forEach(function(d){
                    d.persent =  (Math.round(d.count / allCount * 10000) / 100).toFixed(1);
                });

                x.domain(data.data.map(function(d) { return d.letter; }));
                y.domain([0, d3.max(data.data, function(d) { return d.count + 4; })]);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -18)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("（件）数件案");

                var bars = svg.append("g")
                    .attr("class", "bar_g")
                    .selectAll(".bar").data(data.data).enter()
                    .append("g").attr("class", "bar");

                bars.append("rect")
                    .attr("x", function(d) { return x(d.letter); })
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) { return y(d.count); })
                    .attr("height", function(d) { return height - y(d.count); })
                    .attr("fill", function(d) {return d.color});

                bars.append("text")
                    .text(function(d){ return d.count})
                    .attr("x", function(d) { return x(d.letter) + x.rangeBand()/2; })
                    .attr("y", function(d) { return y(d.count) - 5; })
                    .attr("fill", "#898989")
                    .attr("text-anchor", "middle");

                var line = d3.svg.line()
                    .x(function(d) { return x(d.letter) + x.rangeBand()/2; })
                    .y(function(d) { return y(d.count / 2); });

                var lines = svg.append("g")
                    .attr("class", "line_g");

                var circle  = lines.selectAll(".line")
                    .data(data.data).enter()
                    .append("g").attr("class", "line");

                circle.append("circle")
                    .attr("class","points")
                    .attr("cx",function(d){ return x(d.letter) + x.rangeBand()/2; })
                    .attr("cy",function(d){ return y(d.count / 2); })
                    .attr("r",2)
                    .attr("fill", "#ff3a00");

                circle.append("text")
                    .attr("class", "text_persent")
                    .text(function(d){ return d.persent + '%'})
                    .attr("x", function(d) { return x(d.letter) + x.rangeBand()/2; })
                    .attr("y", function(d) { return y(d.count / 2) - 8; })
                    .attr("fill", "#444")
                    .attr("text-anchor", "middle");

                lines.append("path")
                    .datum(data.data)
                    .attr("class", "line")
                    .attr("d", line)
                    .attr("fill", "none")
                    .attr("stroke", "#ff3a00")
                    .attr("stroke-width", "1px");
            
        },
        drwPie: function (id,data) {
            var width = window.screen.width * 0.92 * 0.6,
                height = 140,
                radius = Math.min(width, height) / 2;

            var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) {
                    return d.count;
                });

            var arc = d3.svg.arc()
                .outerRadius(radius * 0.8)
                .innerRadius(radius * 0.5);

            var onArc = d3.svg.arc()
                .outerRadius(radius * 0.8)
                .innerRadius(radius * 0.8);

            var outerArc = d3.svg.arc()
                .innerRadius(radius * 0.94)
                .outerRadius(radius * 0.94);

            var svg = d3.select(id).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            svg.append("g")
                .attr("class", "slices");
            svg.append("g")
                .attr("class", "labels");
            svg.append("g")
                .attr("class", "lines");

            var key = function(d){return d.data.count; };

                var allCount = 0;
                var colorArr = [];
                var persentArr = [];
                data.data.forEach(function(d){
                    allCount += d.count;
                });
                data.data.forEach(function(d){
                    d.persentOrigin = d.count / allCount;
                    d.persent =  (Math.round(d.count / allCount * 10000) / 100).toFixed(1);
                });
                data.data.forEach(function(d){
                    colorArr.push(d.color);
                    persentArr.push(d.count);
                });

                var color = d3.scale.ordinal()
                    .domain(persentArr)
                    .range(colorArr);

                /*------- PIE SLICES -------*/
                var slice = svg.select(".slices").selectAll("path.slice")
                    .data(pie(data.data));

                slice.enter()
                    .insert("path")
                    .style("fill", function(d) { return color(d.data.count); })
                    .attr("class", "slice");

                slice
                    .transition().duration(1000)
                    .attrTween("d", function(d) {
                        this._current = this._current || d;
                        var interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function(t) {
                            return arc(interpolate(t));
                        };
                    });

                slice.exit().remove();

                /*------- TEXT LABELS -------*/
                var text = svg.select(".labels").selectAll("text")
                    .data(pie(data.data));

                text.enter()
                    .append("text")
                    .attr("dy", ".35em")
                    .text(function(d) {return d.data.persent + '%'; });
                
                function midAngle(d){
                    return d.startAngle + (d.endAngle - d.startAngle)/2;
                }

                text.transition().duration(1000)
                    .attrTween("transform", function(d) {
                        this._current = this._current || d;
                        var interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function(t) {
                            var d2 = interpolate(t);
                            var pos = outerArc.centroid(d2);
                            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                            return "translate("+ pos +")";
                        };
                    })
                    .styleTween("text-anchor", function(d){
                        this._current = this._current || d;
                        var interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function(t) {
                            var d2 = interpolate(t);
                            return midAngle(d2) < Math.PI ? "start":"end";
                        };
                    });

                text.exit().remove();

                /* ------- SLICE TO TEXT POLYLINES -------*/
                var polyline = svg.select(".lines").selectAll("polyline")
                    .data(pie(data.data));
                
                polyline.enter()
                    .append("polyline");
                var letterPos = [];
                polyline.transition().duration(1000)
                    .attrTween("points", function(d){
                        this._current = this._current || d;
                        var interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function(t) {
                            var d2 = interpolate(t);
                            var pos = outerArc.centroid(d2);
                            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                            if(letterPos.length < data.data.length){
                                letterPos.push(arc.centroid(d2));
                                d.data.letterPos = arc.centroid(d2);
                            }
                            return [onArc.centroid(d2), outerArc.centroid(d2), pos];
                        };          
                    });
                
                polyline.exit().remove();



                /* ------- SLICE TO TEXT -------*/
                var letter = svg.select(".lines").selectAll("text");
                setTimeout(function () {
                    letter.data(data.data).enter()
                        .append("text")
                        .attr("dy", ".35em")
                        .text(function(d) {return d.letter; })
                        .attr("x", function(d) { return d.letterPos[0] })
                        .attr("y", function(d) { return d.letterPos[1] })
                        .attr("fill", "#fff")
                        .attr("text-anchor", "middle");
                },100)

        },
        "courtList": function(cid, dat) {
                if (dat) {
                    
                    var target = $("#"+cid), maxLength = 0;
                    $.each(dat.data, function(i,e){
                        var name = e.name || ""; 
                        maxLength = Math.max(maxLength, name.length);
                        target.append("<li>"+e.letter+"&nbsp;&nbsp;&nbsp;"+name+"</li>");
                    });
                }
            }
    };

    djl.chart = { 
    "colors": function(i){
        var cls = ["#9adaff", "#66c1f8", "#01a3f4", "#00e1ff", "#ffcf8d", "#feb775", "#ff9000", "#ff6b01", "#cacdd7", "#96aab5", "#968a8a"];
        return cls[i%11];
    },
    "letters": function(i){
        return String.fromCharCode("A".charCodeAt()+i);
    },
    "court": {
        "barConf": {
            "zone":{"wdt": 470, "hgt": 320, "margin": {"top": 0, "right": 10, "bottom": 20, "left": 20}},
            "bar": {"wdt": 25, "minHgt": 16, "maxHgt": 0.75, "span": 10},
        },
        "dataTransform":function (data) {
            var newItems = {"data":[]};
            
            for (var i=0; i<data.items.length; i++) {
                var newItem = {};
                newItem.letter = data.items[i].letter;
                newItem.count = data.items[i].num;
                newItem.name = data.items[i].name;
                newItem.color = djl.chart.colors(i);
                newItems.data.push(newItem);
            }

            return newItems;

        },
        "datProcess": function(dat) {
            var r = {"total":0, "items":[]};/*{"total":int, "items":[{"name":"北京市朝阳区人民1法院", "letter":"A", "num":20, "rate":"0%", "rateNum":0, "win":20}]}*/
            var rItems = [], rTotal = 0, rItemInd = {};
            if (!dat) {return r;}
            for (var i=0; i<dat.length; i++) {
                var e = dat[i]||{}, ind = rItemInd[e.caseCourt];
                
                if (e.wincaseAmount && e.wincaseAmount < 0) {continue;}/*排除掉胜诉率小于0的数据*/
                
                if (ind == undefined) {
                    ind = rItems.length; rItemInd[e.caseCourt] = ind;
                    var name=(e.caseCourt||""), num=(e.caseAmount||0), win=(e.wincaseAmount||0);
                    rItems.push({"name":name, "num":num, "rate":"0%", "rateNum":0, "win":win});
                } else {
                    var item = rItems[ind];
                    item.num += (e.caseAmount||0);
                    item.win += (e.wincaseAmount||0);
                }
                rTotal += (e.caseAmount||0);
            }
            
            var hasOth = false, delItemInds = [], critical = 0.03, othItem = {"name":"其他", "num":num, "rate":"0%", "rateNum":0, "win":0}
            for (var i=0; i<rItems.length; i++) {
                var e = rItems[i];
                e.rateNum = djl.math.divide(e.num, rTotal);
                if (e.rateNum < critical) {
                    hasOth = true;
                    othItem.num += e.num;
                    othItem.win += e.win;
                    othItem.rate = djl.math.divideTopercent(othItem.num, rTotal, 0);
                    othItem.rateNum = djl.math.divide(othItem.num, rTotal);
                    
                    delItemInds.push(i);
                } else {
                    e.rate = djl.math.divideTopercent(e.num, rTotal, 0);
                    e.rateNum = djl.math.divide(e.num, rTotal);
                }
            }
            if (hasOth) {
                delItemInds.sort(function(a,b){return b-a;});
                for (var i=0; i<delItemInds.length; i++) { 
                    rItems.splice(delItemInds[i], 1); 
                }
                rItems.push(othItem);
            }
            for (var i=0; i<rItems.length; i++) { rItems[i].letter = djl.chart.letters(i); }
            
            r.total = rTotal;
            r.items = rItems;
            
            return r;
        },
        
        "courtInit": function(data) {
            data = this.datProcess(data);
            var chart = this.dataTransform(data);
            djl.myd3chart.drwBarChart("#chart_1",chart);
            djl.myd3chart.drwPie("#pie_1",chart);
            djl.myd3chart.courtList("cotNameList",chart);
            /*this.drawBar("cotGraphCasenum", data.items);
            this.courtList("cotName", data.items);
            this.drawPie("cotGraphCaserate", data.items);*/
        }
    },
    "category": {
        "barConf": {
            "zone":{"wdt": 470, "hgt": 320, "margin": {"top": 0, "right": 10, "bottom": 20, "left": 20}},
            "bar": {"wdt": 25, "minHgt": 16, "maxHgt": 0.75, "span": 10},
        },
        "dataTransform":function (data) {
            var newItems = {"data":[]};
            
            for (var i=0; i<data.items.length; i++) {
                var newItem = {};
                newItem.letter = data.items[i].letter;
                newItem.count = data.items[i].num;
                newItem.name = data.items[i].name;
                newItem.color = djl.chart.colors(i);
                newItems.data.push(newItem);
            }

            return newItems;

        },
        "datProcess": function(dat) {
            var r = {"total":0, "items":[]};/*{"total":int, "items":[{"name":"债权债务概括转移合同纠纷", "letter":"A", "num":20, "rateNum":0, "rate":"0%", "win":20}]}*/
            var rItems = [], rTotal = 0, rItemInd = {};
            if (!dat) {return r;}
            for (var i=0; i<dat.length; i++) {
                var e = dat[i]||{}, ind = rItemInd[e.caseCategory];
                
                if (e.wincaseAmount && e.wincaseAmount < 0) {continue;}/*排除掉胜诉率小于0的数据*/
                
                if (ind == undefined) {
                    ind = rItems.length; rItemInd[e.caseCategory] = ind;
                    var name=(e.caseCategory||""), letter=djl.chart.letters(ind), num=(e.caseAmount||0), win=(e.wincaseAmount||0);
                    rItems.push({"name":name, "rateNum":0, "num":num, "rate":"0%", "win":win});
                } else {
                    var item = rItems[ind];
                    item.num += (e.caseAmount||0);
                    item.win += (e.wincaseAmount||0);
                }
                rTotal += (e.caseAmount||0);
            }
            
            var hasOth = false, delItemInds = [], critical = 0.03, othItem = {"name":"其他", "num":num, "rate":"0%", "rateNum":0, "win":0}
            for (var i=0; i<rItems.length; i++) {
                var e = rItems[i];
                e.rateNum = djl.math.divide(e.num, rTotal);
                if (e.rateNum < critical) {
                    hasOth = true;
                    othItem.num += e.num;
                    othItem.win += e.win;
                    othItem.rate = djl.math.divideTopercent(othItem.num, rTotal, 0);
                    othItem.rateNum = djl.math.divide(othItem.num, rTotal);
                    
                    delItemInds.push(i);
                } else {
                    e.rate = djl.math.divideTopercent(e.num, rTotal, 0);
                    e.rateNum = djl.math.divide(e.num, rTotal);
                }
            }
            if (hasOth) {
                delItemInds.sort(function(a,b){return b-a;});
                for (var i=0; i<delItemInds.length; i++) { 
                    rItems.splice(delItemInds[i], 1); 
                }
                rItems.push(othItem);
            }
            for (var i=0; i<rItems.length; i++) { rItems[i].letter = djl.chart.letters(i); }
            
            r.total = rTotal;
            r.items = rItems;
            return r;
        },
        
        "categoryInit": function(data) {
            data = this.datProcess(data);
            var chart = this.dataTransform(data);
            djl.myd3chart.drwBarChart("#chart_2",chart);
            djl.myd3chart.drwPie("#pie_2",chart);2
            djl.myd3chart.courtList("ctgNameList",chart);

            /*this.drawBar("ctgGraphCasenum", data.items);
            this.categoryList("ctgName", data.items);
            this.drawPie("ctgGraphCaserate", data.items);*/
        }
    },
    "init": function(data) {
        this.court.courtInit(data);
        this.category.categoryInit(data);
    }
    };
    djl.interact = {
        "data": {
        "category":[],
        "area":[],
        "court":[],
        "cases":[],
        "books":[],
        "total":0
    },
    "conds":{
        "type": ["category", "area", "court"],
        "cache":[],
    },
    "datProcess": function(dat, intType){
        var r = [];
        if (!dat) { return r; }
        for (var i=0; i<dat.length; i++) {
            var e = dat[i];
            if (intType==1 && e.caseLocation) {
                var arr = e.caseLocation.split("-");
                if (arr.length == 1) { 
                    var caseObj = {};
                    caseObj.name = arr[0];
                    caseObj.count = e.caseAmount;
                    r.push(caseObj);
                }
                else if (arr.length >= 2) {
                    var caseObj = {};
                    caseObj.name = arr[1];
                    caseObj.count = e.caseAmount;
                    r.push(caseObj);
                }
            } else if (intType==0 && e.caseCategory) {
                var caseObj = {};
                caseObj.name = e.caseCategory;
                caseObj.count = e.caseAmount;
                r.push(caseObj);
            } else if (intType==2 && e.caseCourt) {
                var caseObj = {};
                caseObj.name = e.caseCourt;
                caseObj.count = e.caseAmount;
                r.push(caseObj);
            }
        }
        r.sort(function(a,b){
            var a_name = a.name;
            var b_name = b.name;
            return a_name.localeCompare(b_name);
        });
        var filterArr = [], tmp = "";
        for (var i=0; i<r.length; i++) {
            if (r[i].name==tmp) {
                var count = r[i].count;

                for (var j=0; j<filterArr.length; j++) {
                    if (r[i].name == filterArr[j].name) {
                        filterArr[j].count += count;
                    } 
                }
            }
            else {
                filterArr.push(r[i]);
                tmp = r[i].name;
            }
        }
        return filterArr;
    },
    "loadChsingConds": function(dat){
        $.each(this.conds.type, function(i){
            var $c = $(".chsing-itms[data-t='"+i+"']");
            var arr = djl.interact.datProcess(dat, i);
            if (i == 0)
                djl.interact.data.category = arr;
            if (i == 1)
                djl.interact.data.area = arr;
            if (i == 2)
                djl.interact.data.court = arr;
            
        });
    },
    "filter": function(dat) {
        dat = dat || djl.data.cases;
        if (!dat) {return;}
        var r = [], total = 0, chsdConds = djl.interact.conds.cache;
        $.each(dat, function(i, itm){
            if (itm.wincaseAmount>=0) { total += itm.caseAmount||0; }/*当胜诉案件小于0时，不进行累计*/
            if (!chsdConds || chsdConds.length == 0) {r.push(itm);}
            else {
                var isFilter0, isFilter1, isFilter2;
                $.each(chsdConds, function(j, e){
                    if (e.typ==0 && !isFilter0){
                        isFilter0 = itm.caseCategory==e.val;
                    } else if (e.typ == 1 && !isFilter1){
                        isFilter1 = itm.caseLocation.indexOf(e.val)>=0;
                    } else if (e.typ == 2 && !isFilter2){
                        isFilter2 = itm.caseCourt==e.val;
                    }
                });
                if ((isFilter0==undefined || isFilter0) && (isFilter1==undefined || isFilter1) && (isFilter2==undefined || isFilter2)) {r.push(itm);}
            }
        });
        r.sort(function(a, b){return a.caseCategory.localeCompare(b.caseCategory);});
        
        djl.interact.data.total = total;
        this.loadTable(r, total);
        this.loadBook(r);
    },
    "loadTable": function(r, total){
        var $table = $(".lyr-interact .rts-table");
        $table.find("tbody").remove();
        $.each(r, function(i, e){
            var Case = {};

            var ctg = e.caseCategory||"", cot = e.caseCourt||"", num = e.caseAmount||0, win = e.wincaseAmount||0,
                rate = djl.math.divideTopercent(num, total, 0), winRate = djl.math.divideTopercent(win, num, 0);
            Case.ctg = ctg
            Case.cot = cot;
            Case.num = num;
            Case.rate = (win>=0?rate:"-");
            Case.winRate = (win>=0?winRate:"-");           
           
            djl.interact.data.cases.push(Case);
        });
    },
    "loadBook": function(r, startPg){
        var $casebk = $("#casebk"), preCtg = "", bgStyArr = ["icon-ctgbg-r", "icon-ctgbg-b"], bgSty = bgStyArr[1];
        
        var step = 10, startIndex = (startPg||0)*step, endIndex = startIndex+step;
        
        if (startIndex == 0) {
            $casebk.empty();
            $("#bookMore").remove();
        }
        
        var count = 0, isContinue = true;
        $.each(r, function(i, e){
            if (!isContinue) {return false;}
            
            var details = [], ctg = e.caseCategory||"", cot = e.caseCourt||"";
            
            try {details = eval("("+e.caseDetail+")");} catch(e) {details = [];}
            if (!details || details.length==0){return true;}
            bgSty = preCtg==ctg?bgSty:(bgStyArr[0]==bgSty?bgStyArr[1]:bgStyArr[0]);
            preCtg = ctg;
            
            for (var j=0; j<details.length; j++) {
                //if (startIndex > count) {count++; continue;}
                //if (endIndex <= count) {isContinue = false; break;}
                
                var book = {};
                var t = details[j], tit = t.caseTitle||"", link = t.url?(ctx+"document/"+t.url):"javascript:", day = t.caseDate||""; 
                book.bgSty = bgSty;
                book.count = (++count);
                book.ctg = ctg;
                book.link = link;
                book.tit = tit;
                book.cot = cot;
                book.day = day;

                djl.interact.data.books.push(book);
                /*
                */
            }
        });
        
    },
    "init": function(dat){
        this.loadChsingConds(dat);
        
        /*$(".lyr-interact .conds .chsing-type").click(function(){
            var $me = $(this), t = $me.data("t"), $p = $me.parent(), $pSiblings = $p.siblings();
            $me.find("i").addClass("icon-dn1").removeClass("icon-rt1");
            $p.addClass("active");
            $pSiblings.removeClass("active");
            $pSiblings.find("i").addClass("icon-rt1").removeClass("icon-dn1");
            $(".lyr-interact .conds .chsing-itms").each(function(){
                if ($(this).data("t")==t) { $(this).removeClass("hide"); } else { $(this).addClass("hide"); }
            });
        });*/
        
        this.filter(dat);
    },
    "getInteractyData": function (){
        return djl.interact.data;
    }
    };
    return djl;

});