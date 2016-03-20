var lyrD3Directive = angular.module('lyrD3Directive', []);

lyrD3Directive.directive('pie', function ($parse) {
      return {
         restrict: 'E',
         //replace: true,
         //template: '<div id="chart"></div>',
         link: function (scope, element, attrs) {
           
            var width = 42;
            var height = 42;
            var dataset = [100-attrs.data,attrs.data];
            var id = attrs.id;

            var html = "<div id='chart" + attrs.id + "'  class='d3'></div>"; // the HTML to be produced
                        var newElem = $(html);
                        element.replaceWith(newElem); 

            var svg = d3.select("#chart"+id).append("svg")
                        .attr("width",width)
                        .attr("height",height);
            
            var pie = d3.layout.pie();
            
            var outerRadius = width / 2;
            var innerRadius = width / 4;
            var arc = d3.svg.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius);
            
            var color = ['#e8e8e8','#ff3a00'];
            
            var arcs = svg.selectAll("g")
                    .data(pie(dataset))
                    .attr("class","svg_persent")
                    .enter()
                    .append("g")
                    .attr("transform","translate("+outerRadius+","+outerRadius+")");
                    
            arcs.append("path")
              .attr("fill",function(d,i){
                return color[i];
              })
              .attr("d",function(d){
                return arc(d);
              });
            
            arcs.append("text")
              .attr("transform",function(d){
                return "translate(" + arc.centroid(d) + ")";
              })
              .attr("text-anchor","middle");



      }
    }
   });