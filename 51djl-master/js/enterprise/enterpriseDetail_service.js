//详情页数据解析，格式化service
var enterpriseDetailServices = angular.module('enterpriseDetailServices', []);

enterpriseDetailServices.factory('enterprisePageChart', function(){
    var djl = {};
    var ctx="";
    djl.common = {
        moneySimple: function(e, h, g, f) {
            var d = parseFloat(e),
            i = parseFloat(h),
            a = parseFloat(g);
            if (isNaN(d) || isNaN(i) || isNaN(a) || !a) {
                return e
            }
            if (d > i) {
                return Number((d / a).toFixed(f))
            } else {
                return e
            }
        }
    };
    djl.chart_quarterCaseAmount = {
        "conf": {
            "width": 1100, /*宽度*/
            "height": 280,  /*高度*/
            "margin": {"t": 25, "r": 80, "b": 25, "l": 80}, /*绘图区域外留白*/
            "detail": {"width": 0, "height": 14, "margin": {"t": 10, "r": 10, "b": 10, "l": 10}},   /*说明内容大小样式*/
            "xaxisExplainWidth": 42,    /*x轴说明宽度*/
            "yaxisExplainHeight": 14    /*y轴说明高度*/
        }
    };
    djl.chart_quarterCaseAmount.drwLineArea = function (id, dat) {
        var margin = {top: 10, right: 0, bottom: 14, left: 16}
            height = 100,
            width = document.body.clientWidth * 0.92,
            xaxisExplainWidth = 42, /*x轴说明宽度*/
            yaxisExplainHeight = 14;
        var data = dat;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width - 20], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickSize(4)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .tickSize(0)
            .ticks(0)
            .orient("left");

        

        var svg = d3.select(id).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "quarter_svg")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(data.map(function(d) { return d.x; }));
        y.domain([0, d3.max(data, function(d) { return d.y + 10; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("y", 4)
            .attr("x", width)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("年/季度");

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(5,0)")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("（件）数件案");

        var line = d3.svg.line()
                .x(function(d) { return x(d.x) + x.rangeBand()/2; })
                .y(function(d) { return y(d.y); });

        var area = d3.svg.area().interpolate("linear")
                .x(function(d){return x(d.x) + x.rangeBand()/2;})
                .y0(height - 1)
                .y1(function(d){return y(d.y);});

        var lines = svg.append("g")
            .attr("class", "line_g")
            .append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", "#7acfff")
            .attr("stroke-width", "1px");
        var area = svg.append("g")
            .attr("class", "area_g")
            .append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area)
            .attr('fill', "#e5f6fe");

        var circle = svg.append("g")
            .attr("class", "circle_g")
            .selectAll("circle")
            .data(data).enter()
            .append("circle")
            .attr("cx", function(d){return x(d.x) + x.rangeBand()/2;;})
            .attr("cy", function(d) {return y(d.y);})
            .attr("r",2)
            .attr('class', 'circle')
            .attr('fill', '#2db0ff');

        var text = svg.append("g")
            .attr("class", "text_g")
            .selectAll("text")
            .data(data).enter()
            .append("text")
            .attr("class", "text_persent")
            .text(function(d){ return d.y + '件'})
            .attr("x", function(d) { return x(d.x) + x.rangeBand()/2; })
            .attr("y", function(d) { return y(d.y) - 8; })
            .attr("fill", "#1b1a20")
            .attr("text-anchor", "middle");
    },
    djl.chart_quarterCaseAmount.dataProcess = function(data) {
        var arr = [];
        /*对data进行合并*/
        if (data) {
            var len = 0;
            for (var k in data) {
                var date = "".concat(k.split("Q")[0], "年", k.split("Q")[1], "季度");
                arr.push({"x": date, "y": data[k]});
                len++;
            }
            if (len > 11) {
                arr = [];
                var addups = {};
                for (var k in data) {
                    var year = "".concat(k.split("Q")[0], "年"), addup = addups[year];
                    if (addup != undefined) {
                        addups[year] = addup + data[k];
                    } else { addups[year] = data[k]; }
                }
                for (var k in addups) { arr.push({"x": k, "y": addups[k]}); }
            }
        }
        
        arr.sort(function(a, b){return a.x.localeCompare(b.x);});
        return arr;
    };
    djl.chart_quarterCaseAmount.draw = function(elementId, conf, data) {
        var container = document.getElementById(elementId);
        var svg = d3.select(container).attr("width", conf.width).attr("height", conf.height).attr("class", "quarter-svg");
        //x axis
        var xScale = d3.scale.linear()
            .domain([0, (data.length - 1)])
            .range([conf.margin.l, conf.width - conf.margin.r]);
        var xAxisScale = d3.scale.linear()
            .domain([0, (data.length - 1)])
            .range([0, conf.width]);
        var xDataAxis = d3.svg.axis().scale(xScale).ticks(data.length).tickValues(data.map(function(d, i){return i;}));
        var xAxis = d3.svg.axis().scale(xAxisScale).ticks(data.length).tickSize(0).tickFormat("");
        //y axis
        var yScale = d3.scale.linear()
            .domain([0, d3.max(data, function(d){ return d.y; })])
            .range([conf.height - conf.margin.b, conf.margin.t]);
        var yAxisScale = d3.scale.linear()
            .domain([0, d3.max(data, function(d){ return d.y; })])
            .range([conf.height - conf.margin.b, 0]);
        var yAxis = d3.svg.axis().scale(yAxisScale).orient("left").ticks(d3.max(data, function(d){ return d.y; })).tickSize(0).tickFormat("");
        //line
        var line = d3.svg.line().interpolate("linear").x(function(d, i){return xScale(i);}).y(function(d){return yScale(d.y);}); 
        //area
        var area = d3.svg.area().interpolate("linear")
            .x(function(d,i){return xScale(i);})
            .y0(conf.height - conf.margin.b - 1).y1(function(d){return yScale(d.y);});

        svg.append("g").call(xAxis).attr("class", "xAxis").attr("transform", "translate(0," + (conf.height-conf.margin.b) + ")")
            .append("text").attr("class", "xAxis-data").text("年/季度").attr("transform", "translate("+(conf.width-conf.xaxisExplainWidth)+",-5)");
        svg.append("g").call(xDataAxis).attr("class", "xDatAxis").attr("transform", "translate(0," + (conf.height-conf.margin.b) + ")");
        svg.selectAll(".xDatAxis .tick").selectAll("text").text(function(d){return data[d].x;});
            
        svg.append("g").call(yAxis).attr("class", "yAxis").attr("transform", "translate(1,0)")
            .append("text").attr("class", "yAxis-data").text("案件数").attr("transform", "translate(5,"+conf.yaxisExplainHeight+")");  
        
        svg.append("path").datum(data).attr("class", "line").attr("d", line);
        
        svg.append("path").datum(data).attr("class", "area").attr("d", area);
        
        //add circle
        svg.selectAll("circle").data(data).enter().append("circle")
            .attr("cx", function(d,i){return xScale(i);})
            .attr("cy", function(d) {return yScale(d.y);})
            .attr("r",3).attr('class', 'circle');
        // show data detail
        data.forEach(function (datum, index) {
            svg.append("g").attr("transform", "translate(" + (xScale(index)-conf.detail.width/2) + "," + (yScale(datum.y) - conf.detail.height) + ")")
                .append("text").text(datum.y + "件").attr("class", "explain-text");
        });
    };
    djl.chart_quarterCaseAmount.handle = function(corpName) {
        if (corpName) {
            $.ajax({
                "type": "POST", "cache": false, "async": true, "dataType": "json",
                "url": ctx + "enterprise/credit/quarterCaseAmount", 
                "data": {"enterpriseName": corpName},
                "error": function(e) { try{console.log(e);}catch(err){} },
                "success": function(dat) {
                    if (dat.code == 1) {
                        var data = djl.chart_quarterCaseAmount.dataProcess(dat.info);
                        djl.chart_quarterCaseAmount.draw("svgQuarterCaseChart", djl.chart_quarterCaseAmount.conf, data);
                    }
                }
            });
        }
    };

    djl.caseCategory = {
        "format":function (data){
            var formatData = [];

            for (var item in data) {
                var obj = {};
                obj.name = item;
                obj.count = data[item];
                formatData.push(obj);
            }
            return formatData;   
        },
        "handle": function(corpName) {
            if (corpName) {
                $.ajax({
                    "type": "POST", "cache": false, "async": true, "dataType": "json",
                    "url": ctx + "enterprise/credit/caseCategories", 
                    "data": {"enterpriseName": corpName},
                    "error": function(e) { try{console.log(e);}catch(err){} },
                    "success": function(dat) {
                        if (dat.code == 1) {
                            var data = dat.info || {};
                            var container1 = $("#caseCategory"), container2 = $("#relCaseCategory");
                            for (var item in data) {
                                container1.append("<li><a class='case-cond' role='button' data-type='category' data-val='"+item+"'>"+item+"("+data[item]+"件)</a></li>");
                                container2.append("<li><a class='rel-cond' role='button' data-type='category' data-val='"+item+"'>"+item+"</a></li>");
                            }
                        }
                    }
                });
            }
        }
    };

    djl.caseArea = {
        "format": function(data) {
            var formatData = [];
            var areas = [];
            for (var area in data) { areas.push(area); }
            areas.sort(function(a, b){ return a.localeCompare(b); });
            for (var i in areas) {
                var item = {};

                var area = areas[i];
                item.area = area;
                item.counts = [];
                var courts = data[area] || {}, areaCaseAmount = 0;
                for (var court in courts) {
                    var courtAmount = courts[court] || 0;
                    areaCaseAmount += courtAmount;
                    var obj = {};
                    obj.name = court;
                    obj.count = courtAmount

                    //item.counts.push(obj);
                    formatData.push(obj);
                }
                //formatData.push(item);
            }

            return formatData;
        },
        "handle": function(corpName) {
            if (corpName) {
                $.ajax({
                    "type": "POST", "cache": false, "async": true, "dataType": "json",
                    "url": ctx + "enterprise/credit/caseAreas", 
                    "data": {"enterpriseName": corpName},
                    "error": function(e) { try{console.log(e);}catch(err){} },
                    "success": function(dat) {
                        if (dat.code == 1) {
                            var data = dat.info || {};
                            var container = $("#caseArea");
                            var areas = [];
                            for (var area in data) { areas.push(area); }
                            areas.sort(function(a, b){ return a.localeCompare(b); });
                            for (var i in areas) {
                                var area = areas[i];
                                var courtHtml = "<ul class='case-sort list-unstyled'>";
                                var courts = data[area] || {}, areaCaseAmount = 0;
                                for (var court in courts) {
                                    var courtAmount = courts[court] || 0;
                                    areaCaseAmount += courtAmount;
                                    courtHtml += "<li><a class='case-cond' role='button' data-type='court' data-area='"+area+"' data-val='"+court+"'>"+court+"("+courtAmount+"件)</a></li>";
                                }
                                courtHtml += "</ul>";
                                var html = 
                                    "<div class='case-area-grp'>" + 
                                        "<i class='glyphicon glyphicon-minus'></i>" + 
                                        "<span><a class='case-cond' data-type='area' data-val='"+area+"'>"+area+"("+areaCaseAmount+"件)</a></span>" + 
                                        courtHtml + 
                                    "</div>";
                                
                                container.append(html);
                            }
                        }
                    }
                });
            }
        }
    };

    djl.chart_timing = {
        "conf": {
            "visWdt": 350, /*可见宽度*/
            "mgn": {"t": 0, "r": 0, "b": 0, "l": 0}, /*绘图区域留白*/
            "xAxisHgt": 2, /*X轴高度*/
            "itemWdt": 140, /*案件宽度*/
            "itemHgt": 60, /*案件高度*/
            "itemMgn": {"t": 0, "r": 10, "b": 10, "l": 10}, /*案件区域留白*/
            "itemBaseMgn": 35, /*案件距离坐标轴最小距离*/
            "layers": 3 /*设置最高堆叠层数*/
        },
        "dataProcess": function(data) {
            var obj = {};
            var dateArr = [];
            for (var i in data) {
                var x = data[i].caseDate || "";
                var date = x.length>10 ? x.substring(0, 10) : "";
                
                dateArr.push(date);
                
                var dateGrp = obj[date] ? obj[date] : [];
                dateGrp.push(data[i]);
                obj[date] = dateGrp;
            }
            dateArr = d3.set(dateArr).values();
            
            /*针对同一天案件太多的情况，将一天的数据拆分成多组*/
            var grpMaxCount = Math.max(this.conf.layers*2, 1), delDayArr = [], delDayIndexArr = [], addDayGrp = {};
            for (var i in dateArr) {
                var day = dateArr[i], grp = obj[day], grpNo = Math.ceil(grp.length/grpMaxCount);
                if (grpNo > 1) {
                    delDayArr.push(day);
                    delDayIndexArr.push(i);
                    for (var j=0; j<grpNo; j++) {
                        var subGrp = grp.slice(j*grpMaxCount, (j==grpNo-1 ? grp.length : (j+1)*grpMaxCount));
                        addDayGrp[day+"T"+j] = subGrp;
                    }
                }
            }
            for (var day in delDayArr) { delete obj[delDayArr[day]]; }
            delDayIndexArr.sort(function(a,b){return b-a;});
            for (var i in delDayIndexArr) { dateArr.splice(delDayIndexArr[i], 1); }
            for (var day in addDayGrp) { 
                dateArr.push(day);
                obj[day] = addDayGrp[day];
            }
            
            dateArr.sort(function(a,b){return a.localeCompare(b);});
            obj["date"] = dateArr;
            
            return obj;
        },
        "genArrByStep": function(max, step) {
            var arr = [];
            for (var i = 0; i < max; i+=step) { arr.push(i); }
            return arr;
        },
        "arrSubstract": function(arr1, arr2) {
            if (!arr1 || !arr2) { return arr1; }
            var arr = [];
            for (var i in arr1) {
                var isExist = false;
                for (var j in arr2) {
                    if (arr1[i] == arr2[j]) { isExist = true; break; }
                }
                if (!isExist) { arr.push(arr1[i]); }
            }
            return arr;
        },
        "inter": function(evt) {
            var svgDoc = evt.currentTarget;
            svgDoc.setAttribute("class", "chs");
        },
        "outer": function(evt) {
            var svgDoc = evt.currentTarget;
            svgDoc.setAttribute("class", "desc");
        },
        "detail": function(evt) {
            var svgDoc = evt.currentTarget;
            var caseCode = svgDoc.attributes["d_code"].value, caseId = svgDoc.attributes["d_id"].value, caseDocUrl = svgDoc.attributes["d_uri"].value;
            //$("#docView").data("custom", { "title": caseCode, "url": ctx + caseDocUrl});
            //$("#docView").modal();
            var a = document.createElement("a");
            a.setAttribute("target", "_blank");
            a.setAttribute("href", ctx+caseDocUrl);
        },
        "amountText": function(amount) {
            var txt = "";
            if (amount != undefined && amount != null) {
                if (amount == 0) {
                    txt = "无涉案金额";
                } else if (amount==-1) {
                    txt = "涉案金额不明";
                } else if (amount == -2) {
                    txt = "程序性裁定";
                } else if (amount==-3) {
                    txt = "不计涉案金额";
                } else {
                    txt = "涉案金额"+amount+"元左右";
                }
            }
            return txt;
        },
        "drawCase": function(svg, conf, x, y, xAxisHgt, data, hasLine) {
            var rectY;
            var lineX = conf.itemMgn.l + conf.itemWdt / 2, lineY1, lineY2 = xAxisHgt - y;
            if (xAxisHgt > y) {
                rectY = conf.itemMgn.t + 1;
                lineY1 = conf.itemMgn.t + conf.itemHgt;
            } else {
                rectY = conf.itemMgn.b - 1;
                lineY1 = conf.itemMgn.b;
            }
            var textHgt = 22, textBaseX = conf.itemWdt/2 - conf.itemMgn.l;
            
            var color = data.role==0?"#ff3a00":(data.role==1?"#00a3ff":"#96aab4");

            var g = svg.append("g").attr("transform", "translate(" + x + "," + y + ")");
            g.append("rect").attr("class", "rect")
                .attr({"width": conf.itemWdt, "height": conf.itemHgt, "x": conf.itemMgn.l, "y": rectY, "stroke": color});
            if (x == 0) {
                lineX = conf.itemWdt+10;
                lineY1 = 0.5*conf.itemHgt + 5;
                lineX2 = lineX + conf.itemBaseMgn+10;
            } else {
                lineX = -1*conf.itemBaseMgn;
                lineX2 = 10;
                lineY1 = 0.5*conf.itemHgt + 5;
            }
            if (hasLine)
                g.append("line").attr("class", "line").attr({"x1": lineX, "y1": lineY1, "x2": lineX2, "y2": lineY1, "stroke": color});
            
            var text = g.append("a").attr({"xlink:href": ctx+"document/"+data.uri, "target":"_blank"})
                .append("text").attr("class", "desc").attr('text-anchor', 'middle').attr("transform", "translate(" + textBaseX + ",0)")
    //          .attr("onclick", "djl.chart_timing.detail(evt)")
                .attr("onmouseover", "djl.chart_timing.inter(evt)").attr("onmouseout", "djl.chart_timing.outer(evt)");
    //          .attr({"d_code": data.caseCode, "d_id": data.caseId, "d_uri": data.uri});
            var showCsCode = (data.caseCode && data.caseCode.length>17) ? data.caseCode.substring(0,17)+"..." : data.caseCode;
            text.append("tspan").text(showCsCode).attr({"class": "case-code", "title":data.caseCode, "x":conf.itemMgn.l*2, "y":rectY+textHgt});
            text.append("tspan").text(data.category).attr("class", "case-category")
                .attr('x', conf.itemMgn.l*2).attr('y', rectY + textHgt*2);
            text.append("tspan").text(this.amountText(data.amount)).attr("class", "case-amount")
                .attr('x', conf.itemMgn.l*2).attr('y', rectY + textHgt*3);
        }
    };
    djl.chart_timing.posCalculate = function(conf, data) {
        var positionResult = {};

        var grpWdt = conf.itemWdt + conf.itemMgn.l + conf.itemMgn.r;
        var grpSize = data["date"].length;
        var minGap = grpWdt/4;
        var expectGrpGap = grpSize > 1 ? Math.max(minGap, (conf.visWdt - grpWdt)/(grpSize - 1)) : conf.visWdt;
        
        positionResult.expectGrpGap = expectGrpGap;
        
        var yArr = djl.chart_timing.genArrByStep(conf.layers, 1);
        var dataPositions = []/*{"x":x, "direction":true/false, "yUp":[], "yDown":[]}*/, prePos, consume = 0;
        positionResult.arr = dataPositions;
        for (var i = 0; i < grpSize; i++) {
            var grp = data[data["date"][i]];
            
            var curLayers = Math.ceil(grp.length / 2);
            if (i == 0) {
                var yUp = djl.chart_timing.genArrByStep(curLayers, 1);
                var yDown = [];
                if (grp.length % 2 == 0) {
                    yDown = djl.chart_timing.genArrByStep(curLayers, 1);
                } else {
                    yDown = djl.chart_timing.genArrByStep(curLayers - 1, 1);
                }
                
                prePos = {"x":0, "direction":true, "yUp":yUp, "yDown":yDown};
            } else {
                var x = prePos.x + expectGrpGap;
                if (consume > 0 && expectGrpGap > minGap) {
                    var repair = expectGrpGap - minGap;
                    if (repair > consume) {
                        x = prePos.x + minGap + (repair - consume);
                        consume = 0;
                    } else {
                        x = prePos.x + minGap;
                        consume -= repair;
                    }
                }
                var direction = !prePos.direction;
                var yUp = [], yDown = [];
                if (expectGrpGap >= grpWdt) {
                    if (grp.length % 2 == 0) {
                        yUp = djl.chart_timing.genArrByStep(curLayers, 1);
                        yDown = djl.chart_timing.genArrByStep(curLayers, 1);
                    } else {
                        if (direction == true) {
                            yUp = djl.chart_timing.genArrByStep(curLayers, 1);
                            yDown = djl.chart_timing.genArrByStep(curLayers - 1, 1);
                        } else {
                            yUp = djl.chart_timing.genArrByStep(curLayers - 1, 1);
                            yDown = djl.chart_timing.genArrByStep(curLayers, 1);
                        }
                    }
                } else if (expectGrpGap >= grpWdt/2) {/*如果间距小于案件宽度并且大于案件宽度的一半，会重叠*/
                    var canUsedYUp = djl.chart_timing.arrSubstract(yArr, prePos.yUp), canUsedYDown = djl.chart_timing.arrSubstract(yArr, prePos.yDown);
                    if (grp.length > canUsedYUp.length + canUsedYDown.length) {/*空间不够*/
                        x = prePos.x + grpWdt;
                        consume += (grpWdt - expectGrpGap);
                        if (grp.length % 2 == 0) {
                            yUp = djl.chart_timing.genArrByStep(curLayers, 1);
                            yDown = djl.chart_timing.genArrByStep(curLayers, 1);
                        } else {
                            if (direction == true) {
                                yUp = djl.chart_timing.genArrByStep(curLayers, 1);
                                yDown = djl.chart_timing.genArrByStep(curLayers - 1, 1);
                            } else {
                                yUp = djl.chart_timing.genArrByStep(curLayers - 1, 1);
                                yDown = djl.chart_timing.genArrByStep(curLayers, 1);
                            }
                        }
                    } else {/*空间够*/
                        var posDirection = direction;
                        for (var j = 0; j < grp.length; j++) {
                            if (posDirection == true) {
                                var pos = canUsedYUp.shift();
                                if (pos != undefined) {
                                    yUp.push(pos);
                                } else {
                                    pos = canUsedYDown.shift();
                                    if (pos) { yDown.push(pos); }
                                }
                            } else {
                                var pos = canUsedYDown.shift();
                                if (pos != undefined) {
                                    yDown.push(pos);
                                } else {
                                    pos = canUsedYUp.shift();
                                    if (pos) { yUp.push(pos); }
                                }
                            }
                            posDirection = !posDirection;
                        }
                    }
                } else {/*如果间距小于案件宽度的1/2并且大于案件宽度的1/4，会受到上上个案件的影响，会重叠*/
                    var canUsedYUp = djl.chart_timing.arrSubstract(yArr, prePos.yUp), canUsedYDown = djl.chart_timing.arrSubstract(yArr, prePos.yDown);
                    var doubleCanUsedYUp = canUsedYUp, doubleCanUsedYDown = canUsedYDown;
                    if (i > 1) {
                        if ((dataPositions[i-2].x + expectGrpGap + minGap) < prePos.x) {
                            /*上层已经偏移,并且移动距离大于最小间距，因此上层空间足够*/
                        } else {
                            doubleCanUsedYUp = djl.chart_timing.arrSubstract(canUsedYUp, dataPositions[i-2].yUp);
                            doubleCanUsedYDown = djl.chart_timing.arrSubstract(canUsedYDown, dataPositions[i-2].yDown);
                        }
                    }
                    
                    if (grp.length > canUsedYUp.length + canUsedYDown.length) { /*上层空间已经不够*/
                        x = prePos.x + grpWdt;
                        consume += (grpWdt - expectGrpGap);
                        if (grp.length % 2 == 0) {
                            yUp = djl.chart_timing.genArrByStep(curLayers, 1);
                            yDown = djl.chart_timing.genArrByStep(curLayers, 1);
                        } else {
                            if (direction == true) {
                                yUp = djl.chart_timing.genArrByStep(curLayers, 1);
                                yDown = djl.chart_timing.genArrByStep(curLayers-1, 1);
                            } else {
                                yUp = djl.chart_timing.genArrByStep(curLayers-1, 1);
                                yDown = djl.chart_timing.genArrByStep(curLayers, 1);
                            }
                        }
                    } else if (grp.length > doubleCanUsedYUp.length+doubleCanUsedYDown.length
                        || (prePos.yUp.length+prePos.yDown.length>1) || grp.length>1) { 
                        /*当上组的空间足够，遇到下列3种情况需要移动1/2组宽：
                            1、上组及上上组空间已经不够；
                            2、上组为多个案件的情况；
                            3、当前组为多个案件的情况*/
                        x = prePos.x + grpWdt/2;
                        consume += (grpWdt/2 - expectGrpGap);
                        
                        var curUsedYUp = canUsedYUp, curUsedYDown = canUsedYDown;
                        /*如果本组为多个，上组为一个，移动1/2组宽，仍然可能会与上上组重叠，故需要排除上上组*/
                        if (grp.length > 1 && i > 1 && (prePos.yUp.length+prePos.yDown.length==1)
                                && (dataPositions[i-2].x+grpWdt)>x) {
                            curUsedYUp = djl.chart_timing.arrSubstract(canUsedYUp, dataPositions[i-2].yUp);
                            curUsedYDown = djl.chart_timing.arrSubstract(canUsedYDown, dataPositions[i-2].yDown);
                            if (curUsedYUp.length+curUsedYDown.length < grp.length) {
                                x = dataPositions[i-2].x+grpWdt;
                                curUsedYUp = canUsedYUp;
                                curUsedYDown = canUsedYDown;
                            }
                        }
                        
                        var posDirection = direction;
                        for (var j = 0; j < grp.length; j++) {
                            if (posDirection == true) {
                                var pos = curUsedYUp.shift();
                                if (pos != undefined) {
                                    yUp.push(pos);
                                } else {
                                    pos = curUsedYDown.shift();
                                    if (pos != undefined) { yDown.push(pos); }
                                }
                            } else {
                                var pos = curUsedYDown.shift();
                                if (pos != undefined) {
                                    yDown.push(pos);
                                } else {
                                    pos = curUsedYUp.shift();
                                    if (pos != undefined) { yUp.push(pos); }
                                }
                            }
                            posDirection = !posDirection;
                        }
                    } else {/*空间够*/
                        var posDirection = direction;
                        for (var j = 0; j < grp.length; j++) {
                            if (posDirection == true) {
                                var pos = doubleCanUsedYUp.shift();
                                if (pos != undefined) {
                                    yUp.push(pos);
                                } else {
                                    pos = doubleCanUsedYDown.shift();
                                    if (pos != undefined) { yDown.push(pos); }
                                }
                            } else {
                                var pos = doubleCanUsedYDown.shift();
                                if (pos != undefined) {
                                    yDown.push(pos);
                                } else {
                                    pos = doubleCanUsedYUp.shift();
                                    if (pos != undefined) { yUp.push(pos); }
                                }
                            }
                            posDirection = !posDirection;
                        }
                    }
                }
                prePos = {"x":x, "direction":direction, "yUp":yUp, "yDown":yDown};
            }
            dataPositions.push(prePos);
        }
        return positionResult;
    };
    djl.chart_timing.draw = function(docId, conf, data, position) {
        //x轴上下两个方向最大的y值
        var maxYUp = d3.max(position.arr.map(function (d) {return d3.max(d.yUp);})), maxYDown = d3.max(position.arr.map(function (d) {return d3.max(d.yDown);}));
        //最大的x坐标
        var maxX = d3.max(position.arr.map(function (d) {return d.x;}));
        maxX = maxX == undefined ? 0 : maxX;
        //单个矩形高/宽
        var itemWrapHgt = conf.itemHgt + conf.itemMgn.t + conf.itemMgn.b, itemWrapWdt = conf.itemWdt + conf.itemMgn.l + conf.itemMgn.r;
        
        var yUpHgt = (maxYUp != undefined) ? (maxYUp + 1) * itemWrapHgt + conf.itemBaseMgn : 0;
        var yDownHgt = (maxYDown != undefined) ? (maxYDown + 1) * itemWrapHgt + conf.itemBaseMgn : 0;
        var realHgt = conf.mgn.t + conf.mgn.b + yUpHgt + conf.xAxisHgt + yDownHgt;/*图像真实高度*/
        var realWdt = Math.max(maxX + itemWrapWdt, conf.visWdt);/*图像真实宽度*/
        
        var e = document.getElementById(docId);
        $(e).html("");
        realWdt = 400;
        realHgt = 200+data["date"].length*65;
        var svg = d3.select(e).append("svg").attr("id", "caseChart").attr("class", "timing-svg").attr("width", realWdt).attr("height", realHgt);
        
        svg.append("line").attr("class", "xAxis").attr("x1", 195).attr("y1", 0).attr("x2", 195).attr("y2", realHgt);
        var dateArr = data["date"];
        var offset = 0;
        for (var i = 0; i < dateArr.length; i++) {
            var grpData = data[dateArr[i]], grpPostion = position.arr[i];
            var direction = grpPostion.direction;
            


            var x = grpPostion.x;
            if (position.expectGrpGap > itemWrapWdt) {
                var move = (position.expectGrpGap-itemWrapWdt)/2;
                if (i+1 < (dateArr.length+1)/2 || dateArr.length==1) {x += move;}
                else if (i+1 > (dateArr.length+1)/2) {x -= move;}
            }
            
            var dateY = direction ? (yUpHgt-5) : (yUpHgt+15);
            /*svg.append("text").text(dateArr[i].substring(0,10)).attr("class", "case-date")
                .attr("transform", "translate("+(x+conf.itemWdt/2+conf.itemMgn.l+5)+","+dateY+")");*/
            
            for (var j = 0; j < grpData.length; j++) {
                var y;
                if (direction == true) {
                    var yPos = grpPostion.yUp.shift();
                    if (yPos != undefined) {
                        y = (maxYUp - yPos) * itemWrapHgt;
                    } else {
                        yPos = grpPostion.yDown.shift();
                        if (yPos != undefined) { y = (yUpHgt + conf.xAxisHgt + conf.itemBaseMgn) + yPos * itemWrapHgt; }
                    }
                } else {
                    var yPos = grpPostion.yDown.shift();
                    if (yPos != undefined) {
                        y = (yUpHgt + conf.xAxisHgt + conf.itemBaseMgn) + yPos * itemWrapHgt;
                    } else {
                        yPos = grpPostion.yUp.shift();
                        if (yPos != undefined) { y = (maxYUp - yPos) * itemWrapHgt; }
                    }
                }
                var hasLine = (j < 2);
                if (direction) {
                    x = 0;
                } else {
                    x = 400-conf.itemWdt -35;
                }
                
                y = (i+j+offset)*(conf.itemHgt+10);
                if (j>0) {
                    offset ++;
                }
                svg.append("text").text(dateArr[i].substring(0,10)).attr("class", "case-date")
                .attr("transform", "translate("+(165)+","+(y+30)+")");

                djl.chart_timing.drawCase(svg, conf, x, y, yUpHgt, grpData[j], hasLine);
                direction = !direction;
            }
        }
    };
    djl.chart_timing.processAmount = function (data){
        var obj = {};
        var defCsSum = data.defendantCaseSum || "";
        var ndefCsSum = djl.common.moneySimple(defCsSum, 100000, 10000, 2);
        var priCsSum = data.plaintiffCaseSum || "";
        var npriCsSum = djl.common.moneySimple(priCsSum, 100000, 10000, 2);
        var othCsSum = data.otherCaseSum || "";
        var nothCsSum = djl.common.moneySimple(othCsSum, 100000, 10000, 2);
        
        obj.defCaseSum = (ndefCsSum + ((defCsSum!=ndefCsSum)?"万":"")+"元");
        obj.defCaseAmount = ((data.defendantCaseAmount || "")+"件");
        obj.plaCaseSum = (npriCsSum + ((priCsSum!=npriCsSum)?"万":"")+"元");
        obj.plaCaseAmount = ((data.plaintiffCaseAmount || "")+"件");
        obj.othCaseSum = (nothCsSum + ((othCsSum!=nothCsSum)?"万":"")+"元");
        obj.othCaseAmount = ((data.otherCaseAmount || "")+"件");

        return obj;
    },
    djl.chart_timing.handle = function(corpName, filter) {
        if (corpName) {
            var param = {"enterpriseName": corpName};
            $.extend(param, filter);
            $.ajax({
                "type": "POST", "cache": false, "async": true, "dataType": "json",
                "url": ctx + "enterprise/credit/caseSummary", 
                "data": param,
                "error": function(e) { try{console.log(e);}catch(err){} },
                "success": function(dat) {
                    if (dat.code == 1) {
                        var data = dat.info || {};
                        
                        var defCsSum = data.defendantCaseSum || "";
                        var ndefCsSum = djl.common.moneySimple(defCsSum, 100000, 10000, 2);
                        var priCsSum = data.plaintiffCaseSum || "";
                        var npriCsSum = djl.common.moneySimple(priCsSum, 100000, 10000, 2);
                        var othCsSum = data.otherCaseSum || "";
                        var nothCsSum = djl.common.moneySimple(othCsSum, 100000, 10000, 2);
                        
                        $("#defCaseSum").text(ndefCsSum + ((defCsSum!=ndefCsSum)?"万":"")+"元");
                        $("#defCaseAmount").text((data.defendantCaseAmount || "")+"件");
                        $("#plaCaseSum").text(npriCsSum + ((priCsSum!=npriCsSum)?"万":"")+"元");
                        $("#plaCaseAmount").text((data.plaintiffCaseAmount || "")+"件");
                        $("#othCaseSum").text(nothCsSum + ((othCsSum!=nothCsSum)?"万":"")+"元");
                        $("#othCaseAmount").text((data.otherCaseAmount || "")+"件");
                        
                        var processedData = djl.chart_timing.dataProcess(data.caseInfos || []);
                        var position = djl.chart_timing.posCalculate(djl.chart_timing.conf, processedData);
                        djl.chart_timing.draw("caseTimingChart", djl.chart_timing.conf, processedData, position);
                    }
                }
            });
        }
    };

    djl.caseConditions = {
        "startDate": "",
        "endDate": "",
        "fragmentedDate": 0,
        "category": [],
        "area": [],
        "court": []
    };
    djl.caseConditions.refresh = function() {
        $(".analy .case-cond").removeClass("choosed");
        $("#startDate").val("");
        $("#endDate").val("");
        
        var html = "";
        if (djl.caseConditions.startDate) {
            $("#startDate").val(djl.caseConditions.startDate);
            html += "<a class='case-chs radius' role='button' data-type='startDate' data-val='"+djl.caseConditions.startDate+"'>"+djl.caseConditions.startDate+"<i class='cls cus-icon icon-cls-def'></i></a>";
        }
        if (djl.caseConditions.endDate) {
            $("#endDate").val(djl.caseConditions.endDate);
            html += "<a class='case-chs radius' role='button' data-type='endDate' data-val='"+djl.caseConditions.endDate+"'>"+djl.caseConditions.endDate+"<i class='cls cus-icon icon-cls-def'></i></a>";
        }
        if (djl.caseConditions.fragmentedDate) {
            var target = $("#fragmentedDate a[data-val='"+djl.caseConditions.fragmentedDate+"']");
            html += "<a class='case-chs radius' role='button' data-type='fragmentedDate' data-val='"+djl.caseConditions.fragmentedDate+"'>"+target.text()+"<i class='cls cus-icon icon-cls-def'></i></a>";
            target.addClass("choosed");
        }
        if (djl.caseConditions.category) {
            $.each(djl.caseConditions.category, function(i, e){
                var target = $("#caseCategory a[data-val='"+e+"']");
                target.addClass("choosed");
                html += "<a class='case-chs radius' role='button' data-type='category' data-val='"+e+"'>"+e+"<i class='cls cus-icon icon-cls-def'></i></a>";
            });
        }
        if (djl.caseConditions.area) {
            $.each(djl.caseConditions.area, function(i, e){
                var target = $("#caseArea a[data-val='"+e+"']");
                target.addClass("choosed");
                html += "<a class='case-chs radius' role='button' data-type='area' data-val='"+e+"'>"+e+"<i class='cls cus-icon icon-cls-def'></i></a>";
            });
        }
        if (djl.caseConditions.court) {
            $.each(djl.caseConditions.court, function(i, e){
                var target = $("#caseArea a[data-val='"+e+"']");
                target.addClass("choosed");
                html += "<a class='case-chs radius' role='button' data-type='court' data-val='"+e+"'>"+e+"<i class='cls cus-icon icon-cls-def'></i></a>";
            });
        }
        $("#conditions").html(html);
        
        djl.chart_timing.handle(djl.corpName, {
            "startDate": djl.caseConditions.startDate, 
            "endDate": djl.caseConditions.endDate, 
            "fragmentedDate": djl.caseConditions.fragmentedDate, 
            "categories": djl.caseConditions.category.join("#"), 
            "areaes": djl.caseConditions.area.join("#"), 
            "courts": djl.caseConditions.court.join("#")});
    };
    djl.caseConditions.timeChartFormat = function (name,data) {
        return {
            "enterpriseName":name,
            "startDate": data.startDate, 
            "endDate": data.endDate, 
            "fragmentedDate": data.fragmentedDate, 
            "categories": data.category.join("#"), 
            "areaes": data.area.join("#"), 
            "courts": data.court.join("#")};
    },
    djl.caseConditions.timeChartFormat2 = function (name,data) {

        var ret = "enterpriseName="+ name+
            "&startDate="+ data.startDate+ 
            "&endDate="+ data.endDate+
            "&fragmentedDate="+ data.fragmentedDate+ 
            "&categories="+ data.category.join("#")+
            "&areaes="+ data.area.join("#")+ 
            "&courts="+ data.court.join("#");

        return ret;
    },
    djl.caseConditions.add = function(type, condition) {
        var flag = false;
        if (type == "startDate") {
            if (djl.caseConditions.startDate != condition) {
                djl.caseConditions.startDate = condition;
                djl.caseConditions.fragmentedDate = 0;
                flag = true;
            }
        } else if (type == "endDate") {
            if (djl.caseConditions.endDate != condition) {
                djl.caseConditions.endDate = condition;
                djl.caseConditions.fragmentedDate = 0;
                flag = true;
            }
        } else if (type == "fragmentedDate") {
            djl.caseConditions.fragmentedDate = condition;
            djl.caseConditions.startDate = "";
            djl.caseConditions.endDate = "";
            flag = true;
        } else if (type == "category") {
            var ind = $.inArray(condition, djl.caseConditions.category);
            if (ind < 0) {
                djl.caseConditions.category.push(condition);
                flag = true;
            }
        } else if (type == "court") {
            var ind = $.inArray(condition, djl.caseConditions.court);
            if (ind < 0) {
                djl.caseConditions.court.push(condition);
                flag = true;
            }
        } else if (type == "area") {
            var ind = $.inArray(condition, djl.caseConditions.area);
            if (ind < 0) {
                djl.caseConditions.area.push(condition);
                flag = true;
            }
        }
        if (flag) { djl.caseConditions.refresh(); }
        return flag;
    };
    djl.caseConditions.del = function(type, condition, trigger) {
        var flag = false;
        if (type == "startDate") {
            djl.caseConditions.startDate = "";
            flag = true;
        } else if (type == "endDate") {
            djl.caseConditions.endDate = "";
            flag = true;
        } else if (type == "fragmentedDate") {
            djl.caseConditions.fragmentedDate = 0;
            flag = true;
        } else if (type == "category") {
            var ind = $.inArray(condition, djl.caseConditions.category);
            if (ind >= 0) {
                djl.caseConditions.category.splice(ind, 1);
                flag = true;
            }
        } else if (type == "court") {
            var ind = $.inArray(condition, djl.caseConditions.court);
            if (ind >= 0) {
                djl.caseConditions.court.splice(ind, 1);
                flag = true;
            }
        } else if (type == "area") {
            var ind = $.inArray(condition, djl.caseConditions.area);
            if (ind >= 0) {
                djl.caseConditions.area.splice(ind, 1);
                flag = true;
            }
        }
        
        trigger = trigger === undefined ? true : trigger;
        if (trigger) { djl.caseConditions.refresh(); }
        
        return flag;
    };

    djl.chart_relation = {
        "conf": {
            "width": 400, /*svg宽度*/
            "hgt": {"ratio":35, "min":200, "max":3200}, /*svg高度系数/最小高度/最大高度*/
            "height": 200,  /*svg高度*/
            "nodeRadius": {"items": [30, 36, 40, 45, 50], "min": 30, "max": 50}, /*节点半径参数*/
            "layout": {"linkDistance": 170, "charge": -2000}
        },
        "containNode": function(arr, jo) {
            if (!arr) { return null; }
            for (var i in arr) {
                if (arr[i].name == jo.name && arr[i].direction == jo.direction) { return arr[i]; }
            }
            return null;
        },
        "draw": function(docId, conf, data) {
            $(docId).html("");
            
            var svgHgt = Math.min(conf.height, conf.hgt.max);
            
            var svg = d3.select(docId).append("svg").attr("class", "rel").attr("width",window.screen.width).attr("height", svgHgt);
            
            var force = d3.layout.force()
                .nodes(data.nodes).links(data.edges)
                .linkDistance(conf.layout.linkDistance).charge(conf.layout.charge)
                .linkStrength(1)
                .size([conf.width, svgHgt])
                .start();
                    
            var drag = force.drag().on("dragstart", function(d) { d.fixed = true; });

            var lines = svg.selectAll("line")
                .data(data.edges).enter().append("line")
                .attr("class", "rel-line");
            var bgNodes = svg.selectAll(".bg-circle")
                .data(data.nodes).enter().append("circle")
                .attr("r", function(d) {
                    if (d.name.length <=4) {return conf.nodeRadius.min;}
                    else if (d.name.length <=10) {return conf.nodeRadius.items[1];}
                    else if (d.name.length <=15) {return conf.nodeRadius.items[2];}
                    else if (d.name.length <=20) {return conf.nodeRadius.items[3];}
                    else {return conf.nodeRadius.max;}
                }).attr("class", function(d) {
                    var clz = "";
                    if (d.direction) {
                        if (d.name == data.main) { clz = "rel-nod-posmain"; } else { clz = "rel-nod-pos"; }
                    } else {
                        if (d.name == data.main) { clz = "rel-nod-negmain"; } else { clz = "rel-nod-neg"; }
                    }
                    return clz + " bg-circle";
                });
            
            var nodeTexts = svg.selectAll(".rel-nod-txt").data(data.nodes).enter().append("g")
                    .attr("class", "rel-nod-txt").attr("transform", function(d) { return "translate("+d.x+","+d.y+")"; });
            var nodeTextItems = nodeTexts.append("text").attr("text-anchor", "middle").attr("class", function(d,i){return "rel-name-"+i;})
                .attr("class", function(d, i){
                    var clz = "rel-name-"+i+" ";
                    clz += (d.name==data.main)?"txt-main":"txt-other";
                    return clz;
                });
            nodeTextItems.each(function(d, i){
                var name = d.name, c = d3.select(docId+" .rel-name-"+i);
                
                var html = "";
                if (name.length <= 4) { 
                    c.append("tspan").attr({"x":0, "y":5,}).text(name);
                } else if (d.name.length <= 10) {
                    var s = Math.ceil(name.length/2);
                    c.append("tspan").attr({"x":0, "y":-5,}).text(name.substring(0, s));
                    c.append("tspan").attr({"x":0, "y":12,}).text(name.substring(s, name.length));
                } else if (d.name.length <=15) {
                    var s = Math.ceil(name.length/3);
                    c.append("tspan").attr({"x":0, "y":-11,}).text(name.substring(0, s));
                    c.append("tspan").attr({"x":0, "y":5,}).text(name.substring(s, 2*s));
                    c.append("tspan").attr({"x":0, "y":21,}).text(name.substring(2*s, name.length));
                } else if (d.name.length <=20) {
                    var s = Math.ceil(name.length/4);
                    c.append("tspan").attr({"x":0, "y":-16,}).text(name.substring(0, s));
                    c.append("tspan").attr({"x":0, "y":-2,}).text(name.substring(s, 2*s));
                    c.append("tspan").attr({"x":0, "y":12,}).text(name.substring(2*s, 3*s));
                    c.append("tspan").attr({"x":0, "y":26,}).text(name.substring(3*s, name.length));
                } else {
                    var s = Math.ceil(name.length/5);
                    c.append("tspan").attr({"x":0, "y":-24,}).text(name.substring(0, s));
                    c.append("tspan").attr({"x":0, "y":-10,}).text(name.substring(s, 2*s));
                    c.append("tspan").attr({"x":0, "y":4,}).text(name.substring(2*s, 3*s));
                    c.append("tspan").attr({"x":0, "y":18,}).text(name.substring(3*s, 4*s));
                    c.append("tspan").attr({"x":0, "y":32,}).text(name.substring(4*s, name.length));
                }
            });
            
            var nodes = svg.selectAll(".fg-circle")
                .data(data.nodes).enter().append("circle")
                .attr("r", function(d) {
                    if (d.name.length <=4) {return conf.nodeRadius.min;}
                    else if (d.name.length <=10) {return conf.nodeRadius.items[1];}
                    else if (d.name.length <=15) {return conf.nodeRadius.items[2];}
                    else if (d.name.length <=20) {return conf.nodeRadius.items[3];}
                    else {return conf.nodeRadius.max;}
                }).attr({"class":"fg-circle", "fill":"transparent"}).call(drag);
            
    //      nodes.on("mouseover", function(){
    //          d3.select(".rel-tooltip").style("left", (d3.event.pageX)+"px").style("top", (d3.event.pageY)+"px").style("opacity", 1);
    //      }).on("mouseout", function(){
    //          d3.select(".rel-tooltip").style("left", (d3.event.pageX)+"px").style("top", (d3.event.pageY)+"px").style("opacity", 0);
    //      }).on("mousemove", function(){
    //          d3.select(".rel-tooltip").style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY + 20) + "px");  
    //      });
            nodes.on("click", function(d){
                $("#docView").removeClass("hidden");
                $("#nodeName").text(d.name);
                $("#nodeBookNum").text("相关文书列表（共"+ d.cases.length+"篇）");
                var $c = $("#relbookList");
                $c.empty();
                $.each(d.cases, function(i, e){
                    $c.append("<li><a target='_blank' href='"+ctx+"document/"+d.urls[i]+"' title='【"+d.codes[i]+"】"+d.titles[i]+"'>"+"<span>"+(i+1)+
                            "、</span>"+d.titles[i]+"</a><span class='time'>"+ d.codes[i] +"</span></li>")
                });
            });
            
            force.on("tick", function() {
                /*限制结点的边界*/
                data.nodes.forEach(function(d, i) {
                    d.x = (d.x-conf.nodeRadius.max) < 0 ? conf.nodeRadius.max+2 : d.x;
                    d.x = (d.x+conf.nodeRadius.max) > conf.width ? (conf.width-conf.nodeRadius.max-2) : d.x;
                    d.y = (d.y-conf.nodeRadius.max) < 0 ? conf.nodeRadius.max+2 : d.y;
                    d.y = (d.y+conf.nodeRadius.max) > conf.height ? (conf.height-conf.nodeRadius.max-2) : d.y;
                });
                
                /*更新连接线的位置*/
                lines.attr("x1", function(d) { return d.source.x; });
                lines.attr("y1", function(d) { return d.source.y; });
                lines.attr("x2", function(d) { return d.target.x; });
                lines.attr("y2", function(d) { return d.target.y; });
                
                /*更新结点坐标*/
                nodes.attr("cx", function(d) { return d.x; });
                nodes.attr("cy", function(d) { return d.y; });
                
                /*更新背景结点坐标*/
                bgNodes.attr("cx", function(d) { return d.x; });
                bgNodes.attr("cy", function(d) { return d.y; });
                
                /*更新结点文字坐标*/
                nodeTexts.attr("transform", function(d) { return "translate("+d.x+","+d.y+")"; });
            });
            
            force.on("end", function() {
                data.nodes.forEach(function(d, i) { d.fixed = true; });
            });
            while (force.alpha() > 0.005) { force.tick(); }
            force.stop();
        },
        "tooltip": {
            "init": function() {
                var tooltip = d3.select("body").append("div").attr("class", "rel-tooltip").style("opacity", 0.0);
                var title = tooltip.append("div").attr("class", "title");
                var ul = tooltip.append("div").attr("class", "content");
            }
        }
    };
    djl.chart_relation.dataProcess = function(data) {
        /*  main: ""
            node: {"no": int, "name": enterpriseName, "direction": boolean, "cases": [int...], "urls":[url,...], "titles":[]}
            edge: {"source": int, "target": int}
        */
        var construct = {"main": "", "nodes": [], "edges": []};
        if (data) {
            construct.main = data.enterpriseName;
            if (data.relations) {
                var no = 0;
                for (var i in data.relations) {
                    var csIds = data.caseIds[i]||[], urls = [], titles = [], codes = [];
                    $.each(csIds, function(ind,v){
                        if (data.caseUrls && data.caseUrls[v]){ urls.push(data.caseUrls[v]); }
                        if (data.caseTitles && data.caseTitles[v]){ titles.push(data.caseTitles[v]); }
                        if (data.caseCodes && data.caseCodes[v]) { codes.push(data.caseCodes[v]); }
                    });
                    var plaintiffNode = {"no": no, "name": i, "direction": true, "cases": csIds, "urls":urls, "titles":titles, "codes":codes};
                    if (!djl.chart_relation.containNode(construct["nodes"], plaintiffNode)) {
                        construct["nodes"].push(plaintiffNode);
                        no++;
                    }
                    
                    var defendants = data.relations[i];
                    if (defendants) {
                        for (var j in defendants) {
                            var defendantName = defendants[j];
                            var dcsIds = data.caseIds[defendantName]||[], durls = [], dtitles = [], dcodes = [];
                            $.each(dcsIds, function(ind,v){
                                if (data.caseUrls && data.caseUrls[v]){ durls.push(data.caseUrls[v]); }
                                if (data.caseTitles && data.caseTitles[v]){ dtitles.push(data.caseTitles[v]); }
                                if (data.caseCodes && data.caseCodes[v]){ dcodes.push(data.caseCodes[v]); }
                            });
                            
                            var defendantNode = {"no": no, "name": defendantName, "direction": false, "cases": data.caseIds[defendantName], "urls":durls, "titles":dtitles, "codes":dcodes};
                            var existJo = djl.chart_relation.containNode(construct["nodes"], defendantNode);
                            if (!existJo) {
                                construct["nodes"].push(defendantNode);
                                no++;
                            }
                            
                            var edge = {"source": plaintiffNode.no, "target": (existJo ? existJo.no : defendantNode.no)};
                            construct["edges"].push(edge);
                        }
                    }
                }
            }
        }
        return construct;
    };
    djl.chart_relation.formatPlaintiffs = function (processedData,corpName){
        var names = [], isExistMe = false;
        $.each(processedData.nodes, function(i, e){
            if (e.direction) {
                if (e.name == corpName) { isExistMe = true; }
                else { names.push(e.name); }
            }
        });
        names.sort(function(a,b){return b.length - a.length;});
        if (isExistMe) { names.unshift(corpName); }
        return names;
    },
    djl.chart_relation.handle = function(corpName, filter) {
        if (corpName) {
            var param = {"enterpriseName": corpName};
            $.extend(param, filter);
            $.ajax({
                "type": "POST", "cache": false, "async": true, "dataType": "json",
                "url": ctx + "enterprise/credit/roleSummary", 
                "data": param,
                "error": function(e) { try{console.log(e);}catch(err){} },
                "success": function(dat) {
                    if (dat.code == 1) {
                        var processedData = djl.chart_relation.dataProcess(dat.info);
                        
                        var container = $("#plaintiffs");
                        if (container.find("li").length < 1) {
                            var names = [], isExistMe = false;
                            $.each(processedData.nodes, function(i, e){
                                if (e.direction) {
                                    if (e.name == corpName) { isExistMe = true; }
                                    else { names.push(e.name); }
                                }
                            });
                            names.sort(function(a,b){return b.length - a.length;});
                            if (isExistMe) { names.unshift(corpName); }
                            $.each(names, function(i, e){
                                container.append("<li><a class='rel-cond' role='button' data-type='plaintiff' data-val='"+e+"'>"+e+"</a></li>");
                            });
                        }
                        
                        djl.chart_relation.conf.height = 
                            djl.chart_relation.conf.hgt.min + processedData.nodes.length * djl.chart_relation.conf.hgt.ratio;
                        djl.chart_relation.draw("#relation", djl.chart_relation.conf, processedData);
                    }
                }
            });
        }
    }

    djl.relConditions = {
        "relStart": "",
        "relEnd": "",
        "relFragment": 0,
        "plaintiffs": [],
        "categorys": []
    };
    djl.relConditions.paramFormat = function (name,data) {
        return {
            "enterpriseName":name,
            "relStart": data.relStart, 
            "relEnd": data.relEnd, 
            "relFragment": data.relFragment, 
            "plaintiffs": data.plaintiffs.join("#"), 
            "categorys": data.category.join("#")};
    },
    djl.relConditions.paramFormat2 = function (name,data) {

        var ret = "enterpriseName="+ name+
            "&relStart="+ data.relStart+ 
            "&relEnd="+ data.relEnd+
            "&relFragment="+ data.relFragment+ 
            "&plaintiffs="+ data.plaintiffs.join("#")+
            "&categorys="+ data.category.join("#");

        return ret;
    },
    djl.relConditions.refresh = function() {
        $(".rel .rel-cond").removeClass("choosed");
        $("#relStart").val("");
        $("#relEnd").val("");
        
        var html = "";
        if (djl.relConditions.relStart) {
            $("#relStart").val(djl.relConditions.relStart);
            html += "<a class='rel-chs radius' role='button' data-type='relStart' data-val='"+djl.relConditions.relStart+"'>"+djl.relConditions.relStart+"<i class='cls cus-icon icon-cls-def'></i></a>";
        }
        if (djl.relConditions.relEnd) {
            $("#relEnd").val(djl.relConditions.relEnd);
            html += "<a class='rel-chs radius' role='button' data-type='relEnd' data-val='"+djl.relConditions.relEnd+"'>"+djl.relConditions.relEnd+"<i class='cls cus-icon icon-cls-def'></i></a>";
        }
        if (djl.relConditions.relFragment) {
            var target = $("#relFragment a[data-val='"+djl.relConditions.relFragment+"']");
            html += "<a class='rel-chs radius' role='button' data-type='relFragment' data-val='"+djl.relConditions.relFragment+"'>"+target.text()+"<i class='cls cus-icon icon-cls-def'></i></a>";
            target.addClass("choosed");
        }
        if (djl.relConditions.plaintiffs) {
            $.each(djl.relConditions.plaintiffs, function(i, e){
                var target = $("#plaintiffs a[data-val='"+e+"']");
                target.addClass("choosed");
                html += "<a class='rel-chs radius' role='button' data-type='plaintiffs' data-val='"+e+"'>"+e+"<i class='cls cus-icon icon-cls-def'></i></a>";
            });
        }
        if (djl.relConditions.categorys) {
            $.each(djl.relConditions.categorys, function(i, e){
                var target = $("#relCaseCategory a[data-val='"+e+"']");
                target.addClass("choosed");
                html += "<a class='rel-chs radius' role='button' data-type='categorys' data-val='"+e+"'>"+e+"<i class='cls cus-icon icon-cls-def'></i></a>";
            });
        }
        $("#relConds").html(html);
        
        djl.chart_relation.handle(djl.corpName, {
            "relStart": djl.relConditions.relStart,
            "relEnd": djl.relConditions.relEnd, 
            "relFragment": djl.relConditions.relFragment, 
            "plaintiffs": djl.relConditions.plaintiffs.join("#"),
            "categorys": djl.relConditions.categorys.join("#")
        });
    };
    djl.relConditions.add = function(type, condition) {
        var flag = false;
        if (type == "relStart") {
            if (djl.relConditions.relStart != condition) {
                djl.relConditions.relStart = condition;
                djl.relConditions.relFragment = 0;
                flag = true;
            }
        } else if (type == "relEnd") {
            if (djl.relConditions.relEnd != condition) {
                djl.relConditions.relEnd = condition;
                djl.relConditions.relFragment = 0;
                flag = true;
            }
        } else if (type == "relFragment") {
            djl.relConditions.relFragment = condition;
            djl.relConditions.relStart = "";
            djl.relConditions.relEnd = "";
            flag = true;
        } else if (type == "plaintiffs") {
            var ind = $.inArray(condition, djl.relConditions.plaintiffs);
            if (ind < 0) {
                djl.relConditions.plaintiffs.push(condition);
                flag = true;
            }
        } else if (type == "categorys") {
            var ind = $.inArray(condition, djl.relConditions.categorys);
            if (ind < 0) {
                djl.relConditions.categorys.push(condition);
                flag = true;
            }
        }
        if (flag) { djl.relConditions.refresh(); }
        return flag;
    };
    djl.relConditions.del = function(type, condition, trigger) {
        var flag = false;
        if (type == "relStart") {
            djl.relConditions.relStart = "";
            flag = true;
        } else if (type == "relEnd") {
            djl.relConditions.relEnd = "";
            flag = true;
        } else if (type == "relFragment") {
            djl.relConditions.relFragment = 0;
            flag = true;
        } else if (type == "plaintiffs") {
            var ind = $.inArray(condition, djl.relConditions.plaintiffs);
            if (ind >= 0) {
                djl.relConditions.plaintiffs.splice(ind, 1);
                flag = true;
            }
        } else if (type == "categorys") {
            var ind = $.inArray(condition, djl.relConditions.categorys);
            if (ind >= 0) {
                djl.relConditions.categorys.splice(ind, 1);
                flag = true;
            }
        }
        
        trigger = trigger === undefined ? true : trigger;
        if (trigger) { djl.relConditions.refresh(); }
        
        return flag;
    };

    djl.siblingOrgs = {
        "handle": function(corpName) {
            if (corpName) {
                $.ajax({
                    "type": "POST", "cache": false, "async": true, "dataType": "json",
                    "url": ctx + "enterprise/credit/siblingOrgs", 
                    "data": {"enterpriseName": corpName},
                    "error": function(e) { try{console.log(e);}catch(err){} },
                    "success": function(dat) {
                        if (dat.code == 1) {
                            var data = dat.info || [];
                            $.each(data, function(i, e){
                                $("#orgList").append("<li><a href='"+ctx+"enterprise/credit?enterpriseName="+e.relatedEnterprise+"'>"+e.relatedEnterprise+"</a></li>");
                            });
                        }
                    }
                });
            }
        }
    };

    djl.regist = function() {
        if (!djl.isContain) {djl.tip.danger("#tipInfo", 
                "<div style='text-align:left'>很抱歉，没有找到您搜索企业的诉讼信息，可能因为：<br>" +
                "1、企业名称输入错误（您可以核对企业名称后重新搜索或在记不清楚全称时采用关键字搜索...）；<br>" +
                "2、该企业没有发生过诉讼；<br>" +
                "3、基于人民法院未将该企业诉讼信息上传互联网，导致搜索不到。</div>");}
        
        var searchAction = function() {
            var corpName = $("#iptSearch").val().trim();
            if (corpName) {
                $("#btnQry").prop("disabled", true);
                window.location = ctx + "enterprise/credit/page?enterpriseName="+corpName;
            } else {
                djl.tip.danger("#tipInfo", "请输入您想要搜索的企业名称");
            }
        };
        /*搜索按钮*/
        $("#btnQry, #iptSearch").bind("click keypress", function(event){
            if (event.keyCode == "13") {searchAction();}
            else if (event.type=="click" && $(this).attr("id")=="btnQry") {searchAction();}
        });
        
        /*时间控件*/
        $(".datepicker").datetimepicker({"lang": "zh", "format": "Y-m-d", "timepicker": false, "scrollInput": false});
        /*案件筛选选择条件*/
        $("#conditions").on("mouseover", "a", function(){
            $(this).find("i").removeClass("icon-cls-def").addClass("icon-cls-cur");
        });
        $("#conditions").on("mouseout", "a", function(){
            $(this).find("i").addClass("icon-cls-def").removeClass("icon-cls-cur");
        });
        $("#conditions").on("click", "i", function(){
            var target = $(this).parent(), type = target.data("type"), val = target.data("val");
            djl.caseConditions.del(type, val);
        });
        /*案件筛选条件-开始时间*/
        $("#startDate").on("change", function(){
            djl.caseConditions.add("startDate", $(this).val());
        });
        /*案件筛选条件-结束时间*/
        $("#endDate").on("change", function(){
            djl.caseConditions.add("endDate", $(this).val());
        });
        /*案件筛选条件-时间范围*/
        $("#fragmentedDate").on("click", "a", function(){
            djl.caseConditions.add("fragmentedDate", $(this).data("val"));
        });
        /*案件筛选条件-案由*/
        $("#caseCategory").on("click", "a", function(){
            djl.caseConditions.add("category", $(this).data("val"));
        });
        /*案件筛选条件-地域/法院*/
        $("#caseArea").on("click", "a", function(){
            var type = $(this).data("type"), val = $(this).data("val");
            if (type == "area") {
                $("#caseArea a[data-area='"+val+"']").each(function(){
                    var itemType = $(this).data("type"), itemVal = $(this).data("val");
                    djl.caseConditions.del(itemType, itemVal, false);
                });
            } else if (type == "court") {
                djl.caseConditions.del("area", $(this).data("area"), false);
            }
            
            djl.caseConditions.add(type, val);
        });
        
        /*关系筛选选择条件*/
        $("#relConds").on("mouseover", "a", function(){
            $(this).find("i").removeClass("icon-cls-def").addClass("icon-cls-cur");
        });
        $("#relConds").on("mouseout", "a", function(){
            $(this).find("i").addClass("icon-cls-def").removeClass("icon-cls-cur");
        });
        $("#relConds").on("click", "i", function(){
            var target = $(this).parent(), type = target.data("type"), val = target.data("val");
            djl.relConditions.del(type, val);
        });
        /*关系筛选条件-开始时间*/
        $("#relStart").on("change", function(){
            djl.relConditions.add("relStart", $(this).val());
        });
        /*关系筛选条件-结束时间*/
        $("#relEnd").on("change", function(){
            djl.relConditions.add("relEnd", $(this).val());
        });
        /*关系筛选条件-时间范围*/
        $("#relFragment").on("click", "a", function(){
            djl.relConditions.add("relFragment", $(this).data("val"));
        });
        /*关系筛选条件-案由*/
        $("#relCaseCategory").on("click", "a", function(){
            djl.relConditions.add("categorys", $(this).data("val"));
        });
        /*关系筛选条件-原告*/
        $("#plaintiffs").on("click", "a", function(){
            djl.relConditions.add("plaintiffs", $(this).data("val"));
        });
        /*关系右边条件Fix*/
        $(window).scroll(function(event){
            var scorllTop = $(document).scrollTop();
            var zoneOffsetTop = $(".rel").offset().top, zoneHeight = $(".rel").height();
            var fixHeight = $(".rel-edge").height();
            if (scorllTop > zoneOffsetTop && scorllTop < (zoneOffsetTop + zoneHeight)) {
                $(".rel-edge").css({"position":"fixed", "top": 0});
                var topHeight = zoneOffsetTop + zoneHeight - fixHeight;
                if (scorllTop > topHeight) {
                    $(".rel-edge").css({"position":"absolute", "top": topHeight});
                }
            } else { $(".rel-edge").css({"position":"", "top": ""}); }
            /*
             * 将左边的最小高度设置成与右边平齐的高度，防止出现异常的滚动
             */
            $(".rel-body").css("min-height", $(".rel-edge").height());
        });
        
        /*滚动条注册*/
    //  $(".scroll").niceScroll({"cursorborderradius":0, "autohidemode":true, "cursorfixedheight":60});
    };

    djl.focus = function(corpName) {
        $("#focus").bind("click", function(){
            var $btn = $(this), isFocus = $btn.hasClass("plus");
            $.ajax({
                "type": "POST", "cache": false, "async": true, "dataType": "json",
                "url": ctx + "enterprise/credit/focus", 
                "data": {"enterpriseName": corpName, "isFocus": isFocus?1:0},
                "error": function(e) { try{console.log(e);}catch(err){} },
                "success": function(dat) {
                    if (dat.code == 1) {
                        if (isFocus) {
                            $btn.addClass("minus").removeClass("plus");
                            $btn.html("取消关注");
                        } else {
                            $btn.addClass("plus").removeClass("minus");
                            $btn.html("<i class='glyphicon glyphicon-plus'></i>&#8194;<span>关注</span>");
                        }
                    } else {
                        djl.tip.danger("#tipInfo", dat.msg || (!isFocus?"取消":""+"关注操作失败"));
                    }
                }
            });
            if ($(this).hasClass("plus")) { djl.focus.plus($(this), corpName); } else { djl.focus.minus($(this), corpName); }
        });
    };

    djl.loadDetail = function () {
        djl.regist();
    
        if (djl.isContain) {
            djl.chart_quarterCaseAmount.handle(djl.corpName);
            djl.caseCategory.handle(djl.corpName);
            djl.caseArea.handle(djl.corpName);
            djl.chart_timing.handle(djl.corpName);
            djl.chart_relation.handle(djl.corpName);
            djl.siblingOrgs.handle(djl.corpName);
            
            djl.focus(djl.corpName);
        }
    };

    return djl;

});