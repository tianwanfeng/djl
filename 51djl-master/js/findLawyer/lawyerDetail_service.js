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
        "cases": [],
        "cots":[],
        "ctgs":[]
    };

    djl.myd3chart = {
        drwBarChart: function (id,data) {
            var margin = {top: 10, right: 0, bottom: 14, left: 20}
                height = 150,
                width = document.body.clientWidth * 0.92  - margin.left - margin.right;
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
                    .call(xAxis)
                    .append("text")
                    .text("案由")
                    .attr({"class":"x-text", "x":width, "y":0, "dx":"-1.4em", "dy":"1.4em"});
                    //.append("text")
                    //.attr("transform", "translate(" + 10 + ",0)")
                    //.text("案由")
                    ;

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -18)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("案件数(件)")
                    .attr({"class":"y-text","dx":"-1em"});

                var bars = svg.append("g")
                    .attr("class", "bar_g")
                    .selectAll(".bar").data(data.data).enter()
                    .append("g").attr("class", "bar");

                var barWid = Math.min(x.rangeBand(),20);
                console.log(x.rangeBand());
                bars.append("rect")
                    .attr("x", function(d) { return x(d.letter); })
                    .attr("width", barWid)
                    .attr("y", function(d) { return y(d.count); })
                    .attr("height", function(d) { return height - y(d.count); })
                    .attr("fill", function(d) {return d.color});

                bars.append("text")
                    .text(function(d){ return d.count})
                    .attr("x", function(d) { return x(d.letter) + barWid/2; })
                    .attr("y", function(d) { return y(d.count) - 5; })
                    .attr("fill", "#898989")
                    .attr("text-anchor", "middle");

                var line = d3.svg.line()
                    .x(function(d) { return x(d.letter) + barWid/2; })
                    .y(function(d) { return y(d.count / 2); });

                var lines = svg.append("g")
                    .attr("class", "line_g");

                var circle  = lines.selectAll(".line")
                    .data(data.data).enter()
                    .append("g").attr("class", "line");

                circle.append("circle")
                    .attr("class","points")
                    .attr("cx",function(d){ return x(d.letter) + barWid/2; })
                    .attr("cy",function(d){ return y(d.count / 2); })
                    .attr("r",2)
                    .attr("fill", "#ff3a00");

                circle.append("text")
                    .attr("class", "text_persent")
                    .text(function(d){ return d.persent + '%'})
                    .attr("x", function(d) { return x(d.letter) + barWid/2; })
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
            var width = document.body.clientWidth * 0.92 * 0.6,
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
                    .style("fill", function(d,i){return djl.chart.colors(i);})
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
                            pos[0] = (radius-10) * (midAngle(d2) < Math.PI ? 1 : -1);
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
                            pos[0] = (radius-10) * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
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
            "zone":{"wdt": document.body.clientWidth*0.92, "hgt": 150, "margin": {"top": 0, "right": 10, "bottom": 20, "left": 20}},
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
        "drawBar": function(cid, dat, type) {
            var cf = this.barConf, wdt = cf.zone.wdt-cf.zone.margin.left-cf.zone.margin.right, hgt = cf.zone.hgt-cf.zone.margin.top-cf.zone.margin.bottom;
            barPadding = (dat) ? cf.bar.span*dat.length/wdt : 0;
            
            var x = d3.scale.ordinal().rangeBands([0, wdt], barPadding);
            var y = d3.scale.linear().range([hgt, 0]);
            
            var xAxis = d3.svg.axis().scale(x).orient("bottom").outerTickSize(0);
            var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0).tickFormat("");
            
            var c = document.getElementById(cid);
            var zone = d3.select(c).append("svg").attr({"class": "gragh-ctg-item svg", "width": cf.zone.wdt, "height": cf.zone.hgt})
                .append("g").attr("transform", "translate("+cf.zone.margin.left+","+cf.zone.margin.top+")");
                
            x.domain(dat.map(function(d){ return d.letter; }));
            y.domain([0, d3.max(dat, function(d){ return d.num; })]);
            
            var xXAxis = zone.append("g").attr({"class": "x axis", "transform": "translate(0,"+(hgt+1)+")"}).call(xAxis);
            xXAxis.append("text").text(type).attr({"class":"x-text", "x":wdt, "y":0, "dx":"-1.4em", "dy":"1.4em"});
            var yYAxis = zone.append("g").attr({"class": "y axis","transform": "translate(-1,0)"}).call(yAxis);
            yYAxis.append("text").text("案件数(件)").attr({"class":"y-text","dx":"-1em"});
            
            var yHgtTransfor = function(v){return cf.bar.minHgt + (hgt-y(v))*cf.bar.maxHgt;};
            var yTransform = function(v){return hgt-yHgtTransfor(v);};
            var percentCalc = function(datItem){
                if (!datItem) {return 0;}
                var r = 0;
                if (!datItem.num) {return r;}
                else {return new Number(datItem.win*100/datItem.num);}
            };
            
            var drawBar = function(){
                var barGs = zone.selectAll(".barG").data(dat).enter().append("g")
                    .attr("class", "barG").attr("transform", function(d) {return "translate("+x(d.letter)+","+yTransform(d.num)+")"});
                barGs.append("rect")
                    .attr({"class": "bar", "fill": function(d,i){return djl.chart.colors(i);}, "width": cf.bar.wdt, "height": function(d){return yHgtTransfor(d.num);}})
                    .attr({"x": function(d){return (x.rangeBand()-cf.bar.wdt)/2;}, "y": 0})
                barGs.append("text")
                    .attr({"class":"bar-tag", "text-anchor":"middle", "x":function(d){return x.rangeBand()/2;}, "y":"-5px"})
                    .text(function(d){return d.num;});
            }();
            
            var drawLine = function(){
                var line = d3.svg.line().interpolate("linear")
                    .x(function(d){return x.rangeBand()/2+x(d.letter);}).y(function(d){return hgt-yHgtTransfor(d.win);});
                zone.append("path").datum(dat).attr("class", "line").attr("d", line);
                //add circle
                zone.selectAll("circle").data(dat).enter().append("circle")
                    .attr("cx", function(d){return x.rangeBand()/2+x(d.letter);}).attr("cy", function(d){return hgt-yHgtTransfor(d.win);})
                    .attr("r",3).attr('class', 'circle');
                // show data detail
                dat.forEach(function (datum, index) {
                    var p = percentCalc(datum), dy = (p >= 50)?"1.4em":"-0.7em";
                    zone.append("g").attr("transform", "translate("+(x.rangeBand()/2+x(datum.letter))+","+(hgt-yHgtTransfor(datum.win)) + ")")
                        .append("text").text(p.toFixed(0)+"%").attr({"class":"line-text", "text-anchor":"middle", "dy":dy});
                });
            }();
        },
        "categoryList": function(cid, dat) {
            if (dat) {
                $("#"+cid).append("<dl class='dl-horizontal' id='ctgNameList'></dl>");
                var target = $("#ctgNameList"), maxLength = 0;
                $.each(dat, function(i,e){
                    var name = e.name || ""; 
                    maxLength = Math.max(maxLength, name.length);
                    target.append("<dt>"+e.letter+"</dt><dd class='text-overflow' title='"+name+"'>"+name+"</dd>");
                });
                target.css("width", Math.min(21, maxLength+4.3)+"em");
            }
        },
        "pieConf": {
            "zone":{"wdt":document.body.clientWidth * 0.92 * 0.6, "hgt":170},
            "pie":{"outRadius":60, "inRadius":48},
            "line":{"radius":120, "wdt":0},
            "wordWdt":12
        },
        "drawPie": function(cid, dat) {
            var cf = this.pieConf;
            var centerX = cf.zone.wdt/2, centerY = cf.zone.hgt/2;
            var svg = d3.select("#"+cid).append("svg").attr({"width": cf.zone.wdt, "height": cf.zone.hgt, "class": "svg gragh-ctg-rate"});
    //      svg.append("line").attr({"stroke":"#f00", "stroke-width":"1px", "x1":0, "x2":cf.zone.wdt, "y1":centerY, "y2":centerY});
            var text = svg.append("text").attr({"x":centerX, "y":centerY, "text-anchor":"middle"});
            text.append("tspan").attr({"x":centerX, "y":centerY-18, "text-anchor":"middle", "class":"pie-tit"}).text("占律师");
            text.append("tspan").attr({"x":centerX, "y":centerY+5, "text-anchor":"middle", "class":"pie-tit"}).text("所有案件");
            text.append("tspan").attr({"x":centerX, "y":centerY+28, "text-anchor":"middle", "class":"pie-tit"}).text("的比例");
            
            var pie = d3.layout.pie().value(function(d){return d.num;}).sort(function(d1,d2){return d1.letter.localeCompare(d2.letter);});
            var dataset = pie(dat);
            var radius = Math.min(cf.zone.wdt,cf.zone.hgt)/2;
            cf.pie.outRadius = radius*0.8;
            cf.pie.inRadius = radius*0.5;
            cf.line.radius = radius*0.9;
            var arc = d3.svg.arc().outerRadius(cf.pie.outRadius).innerRadius(cf.pie.inRadius);
            
            var arcs = svg.selectAll("g").data(dataset).enter().append("g").attr({"transform": "translate("+centerX+","+centerY+")"});
            arcs.append("path").attr("fill", function(d,i){return djl.chart.colors(i);}).attr("d", function(d){return arc(d);});
                
            var lineOutArc = d3.svg.arc().outerRadius(cf.line.radius).innerRadius(cf.line.radius);
            var lineInArc = d3.svg.arc().outerRadius(cf.pie.outRadius).innerRadius(cf.pie.outRadius);
            var midAngle = function(d) { return (d.endAngle+d.startAngle)/2; };
            
            arcs.append("polyline").attr("class","arc-line").attr("points", function(d) {
                var direction = midAngle(d) < Math.PI;
                var p0 = lineInArc.centroid(d), p1 = lineOutArc.centroid(d), p2 = [p1[0]+(direction ? cf.line.wdt : -cf.line.wdt), p1[1]];
                return [p0, p1, p2];
            });
            var texts = arcs.append("text").attr({"class":"arc-txt", "x":function(d){return arc.centroid(d)[0];}, "y":function(d){return arc.centroid(d)[1];}});
            texts.append("tspan").text(function(d){return d.data.letter;}).attr({"class":"ctg-name"})
                .attr("dx", function(d){return midAngle(d)<Math.PI?"-0.2em":"-0.4em";})
                .attr("dy", function(d){return midAngle(d)<Math.PI?"0.2em":"0.4em";});
            texts.append("tspan").text(function(d){return d.data.rate;}).attr("class", "ctg-rate")
                .attr("x", function(d){return lineOutArc.centroid(d)[0];})
                .attr("y", function(d){return lineOutArc.centroid(d)[1]-5;})
                .attr("dx", function(d){return midAngle(d)<Math.PI?"0.2em":"-0.2em";})
                .attr("text-anchor", function(d){return midAngle(d) < Math.PI ? "start" : "end";});
        },
        "courtInit": function(data) {
            data = this.datProcess(data);
            var chart = this.dataTransform(data);
            //djl.myd3chart.drwBarChart("#chart_1",chart);
            djl.chart.court.barConf.zone.wdt = document.body.clientWidth*0.92;
            djl.chart.court.pieConf.zone.wdt = document.body.clientWidth*0.92 * 0.6;
            $('#pie_1').empty();
            $('#chart_1').empty();
            djl.myd3chart.drwPie("#pie_1",chart);
            djl.data.cots = chart;
            //djl.myd3chart.courtList("cotNameList",chart);
            this.drawBar("chart_1", data.items,"法院");
            //this.courtList("cotName", data.items);
            //this.drawPie("pie_1", data.items);
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
            djl.chart.court.barConf.zone.wdt = document.body.clientWidth*0.92;
            djl.chart.court.pieConf.zone.wdt = document.body.clientWidth*0.92 * 0.6;
            $('#pie_2').empty();
            $('#chart_2').empty();
            //djl.myd3chart.drwBarChart("#chart_2",chart);
            djl.myd3chart.drwPie("#pie_2",chart);
            //djl.myd3chart.courtList("ctgNameList",chart);
            djl.data.ctgs = chart;
            djl.chart.court.drawBar("chart_2", data.items,"案由");
            /*this.categoryList("ctgName", data.items);
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
        djl.interact.data.cases = [];
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
        djl.interact.data.books = [];
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
        this.filter(dat);
    },
    "getInteractyData": function (){
        return djl.interact.data;
    }
    };
    return djl;

});