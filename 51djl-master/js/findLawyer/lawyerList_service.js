//列表页数据解析，格式化service
var lawyerListServices = angular.module('lawyerListServices', []);

lawyerListServices.factory('lyrListChart', function(){
    var ctx = '';
    var djl = {
    };
    djl.data = {
        "info":[]
    };
    djl.getData = function () {
        return djl.data;
    };
    djl.query = {
        "cache": "",
        "resultProcess": function(dat) {
            if (!dat || !dat.dat || !dat.dat.list || dat.dat.list==0) {

                return;
            }
            var year = dat.year, listPage = dat.dat, list = listPage.list;

            for (var i=0; i<list.length; i++) {
                var datItem = list[i];

                var lawyerItem = {};
                lawyerItem = this.lyBaseHtml(datItem[0], datItem[1], datItem[3], year);

                lawyerItem.caseAreaData = djl.chart.caseArea.processCaseAreaData(datItem[2]);
                lawyerItem.caseCtgData = {
                    "dat":datItem[3],
                    "detail": datItem[2],
                    "hitCount":datItem[5]
                };
                //djl.chart.caseCtg.init("ctgChart"+i, datItem[3], datItem[2], datItem[5]);
                djl.data.info.push(lawyerItem);
            }
            
        },
        "lyBaseHtml": function(basic, detail, summary, year) {
            var lawyer = {};
            var bas = basic || {}, det = detail || {}, summary = summary || {};
            var name = (summary.lawyerName || ""), gender = (det.gender!=undefined)?(det.gender==0?"男":"女"):"", experience = "", photo = ctx+"views/img/default.jpg";
            
            var fieldProcess = function(fields) {
                if (!fields) {return "";}
                var arr = fields.split(",");
                var r = "";
                for (var i=0; i<arr.length; i++) {
                    if (i>0) {r += "<br>";}
                    if (arr[i].indexOf("-")>0) {r += arr[i].substring(0, arr[i].indexOf("-"));}
                    else {r += arr[i];}
                }
                return r;
            };
            var areaProcess = function(area) {
                if (!summary.workArea) {return "";}
                return summary.workArea.replace(/-/g,"").replace(/,/g,",<br>");
            };
            var wkArea = areaProcess(summary.workArea), wkField = fieldProcess(summary.workField), wkOffice = summary.lawOffice || "", knowMe = ctx+"lawyer/detail?id="+summary.lawyerId,id=summary.lawyerId;
            var hasV = (bas.isVerified == 1);
            if (det.careerStart) {try {
                experience = (year - parseInt(det.careerStart.substring(0, 4)));
            } catch(e){ experience = ""; }}
            if (det.photos) {
                try {
                    var photoArr = eval("("+det.photos+")");
                    if (photoArr.length > 0) {
                        var flag = 0;
                        for (var i=0; i<photoArr.length; i++) {
                            if (photoArr[i].indexOf("160×160")>0) {
                                photo = fileDomain + photoArr[i];
                                flag = 1;
                                break;
                            }
                        }
                        if (!flag) {photo = fileDomain + photoArr[0];}
                    }
                } catch(e) {photo = ctx + "views/img/default.jpg"}
            }
            lawyer.id = id;
            lawyer.name = name;
            lawyer.photo = photo;
            lawyer.hasV = hasV;
            lawyer.knowMe = knowMe;
            lawyer.gender = gender;
            lawyer.experience = experience;
            lawyer.wkField = wkField;
            lawyer.wkArea = wkArea;
            lawyer.wkOffice = wkOffice;

            return lawyer;
        },
    };
    djl.chart = {};
    djl.chart.caseArea = {
        "datProcess": function(dat) {
            var aux = [], r = [];
            if (!dat) {return r;}
            for (var i=0; i<dat.length; i++) {
                var city = "";
                if (dat[i].caseLocation){
                    var arr = dat[i].caseLocation.split("-");
                    if (arr.length == 1) {city = arr[0];}
                    else if (arr.length > 1) {city = arr[1];}
                }
                
                var court = dat[i].caseCourt, num = dat[i].caseAmount || 0, win = dat[i].wincaseAmount || 0;
                var index = aux[city], item;
                if (index == undefined) {
                    item = {"city":city, "nums":0, "courts":[], "wins":0};
                    aux[city] = r.length;
                    r.push(item);
                } else {
                    item = r[index];
                }
                
                item.nums += num;
                item.wins += win;
                item.winDot = item.nums==0 ? 0 : item.wins*100/item.nums;
                
                var target = null;
                for (var j=0; j<item.courts.length; j++) {
                    if (item.courts[j].court == court) {
                        target = item.courts[j];
                        break;
                    }
                }
                if (!target) {
                    target = {"court":court, "num":0, "win":0, "winRate":"0.00%"};
                    item.courts.push(target);
                }
                target.num += num;
                target.win += win;
                
                target.winDot = target.num==0 ? 0 : target.win*100/target.num;
                target.winRate = target.winDot.toFixed(0)+"%";
                
                item.maxCotWinDot = Math.max(target.winDot, (item.maxCotWinDot||0));
            }
            return r;
        },
        "datFilter": function(dat) {
            var r = [];
            dat.sort(function(a,b){return b.winDot-a.winDot;});
            var maxCourts=9, counts = Math.min(dat.length, maxCourts), itemMaxCourts = maxCourts - counts + 1;
            for (var i=0; i<counts; i++) {
                var item = dat[i], courts = item.courts;
                if (courts) {
                    courts.sort(function(a, b){return b.winDot-a.winDot;});
                    
                    var arr = courts.slice(0, Math.min(itemMaxCourts, maxCourts));
                    maxCourts = maxCourts - arr.length;
                    
                    item.courts = arr;
                    
                    var nums=0, wins=0;
                    for (var j=0; j<arr.length; j++) {
                        nums += arr[j].num;
                        wins += arr[j].win;
                    }
                    item.nums = nums;
                    item.wins = wins;
                
                    r.push(item);
                }
            }
            return r;
        },
        "processCaseAreaData": function(dat) {
            dat = djl.chart.caseArea.datProcess(dat);
            dat = djl.chart.caseArea.datFilter(dat);

            return dat;
            //djl.chart.caseArea.draw(containerId, djl.chart.caseArea.conf, dat);
        }
    };
    return djl;
});