var chart = {
  	drwBarChart: function (id, dat) {
    	var margin = {top: 10, right: 0, bottom: 14, left: 16}
    		height = 150,
    		width = document.body.clientWidth * 0.92  - margin.left - margin.right;
    	

		

		d3.json("../data/chart.json", function(error, data) {
  			if (error) throw error;

  			var allCount = 0;
  			var dataLength = data.data.length;
  			data.data.forEach(function(d){
  				allCount += d.count
  			});
  			data.data.forEach(function(d){
  				d.persent =  (Math.round(d.count / allCount * 10000) / 100).toFixed(1);
  			});

  			var xAxis_width = width / 15 * dataLength;
  			var x = d3.scale.ordinal()
	        	.rangeRoundBands([0, xAxis_width - 20], .1);

	    	var y = d3.scale.linear()
	        	.range([height, 0]);

	        var xAxis = d3.svg.axis()
			    .scale(x)
			    .tickSize(0,0)
			    .orient("bottom");

			var yAxis = d3.svg.axis()
			    .scale(y)
			    .tickSize(0)
			    .ticks(0)
			    .orient("left");

  			var svg = d3.select(id).append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  	.append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  			x.domain(data.data.map(function(d) { return d.letter; }));
			y.domain([0, d3.max(data.data, function(d) { return d.count + 4; })]);

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis)
				.append("text")
				.attr("y", 4)
				.attr("x", xAxis_width)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("法院");

			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", -12)
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
				.attr("fill", function(d) {return "#" + d.color});

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
  		})
  	},
  	drwPie: function (id, dat) {
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

		d3.json("../data/chart.json", function(error, data) {
  			if (error) throw error;

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
				.style("fill", function(d) { return "#" + color(d.data.count); })
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

  		})
  	},
  	drwPersent: function (id, dat) {
  		var width = 42,
		    height = 42,
		    radius = Math.min(width, height) / 2;

		var pie = d3.layout.pie()
		    .value(function(d) { return d.count; })
		    .sort(null);

		var arc = d3.svg.arc()
		    .innerRadius(radius - 1)
		    .outerRadius(radius - 8);

		var svg = d3.select(id).append("svg")
			.attr("class","svg_persent")
		    .attr("width", width)
		    .attr("height", height)
		  	.append("g")
		    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		var data = [{
			"count": 20,
			"color": 'e8e8e8'
		},{
			"count": 80,
			"color": 'ff3a00'
		}]

		var path = svg.datum(data).selectAll("path")
		    	.data(pie)
		    	.enter().append("path")
		      	.attr("fill", function(d) { console.log(d); return '#' + d.data.color; })
		      	.attr("d", arc);

  	},
  	lineAreaData: [{
  		'time': '2013年4季度',
  		'count': 9
  	},{
  		'time': '2014年1季度',
  		'count': 5
  	},{
  		'time': '2014年2季度',
  		'count': 10
  	},{
  		'time': '2014年3季度',
  		'count': 12
  	},{
  		'time': '2014年4季度',
  		'count': 22
  	},{
  		'time': '2015年1季度',
  		'count': 5
  	},{
  		'time': '2015年2季度',
  		'count': 5
  	},{
  		'time': '2015年3季度',
  		'count': 75
  	},{
  		'time': '2015年4季度',
  		'count': 5
  	}],
  	drwLineArea: function (id, dat) {
  		var margin = {top: 10, right: 0, bottom: 14, left: 16}
    		height = 100,
    		width = document.body.clientWidth * 0.92,
    		xaxisExplainWidth = 42,	/*x轴说明宽度*/
			yaxisExplainHeight = 14;
	    // var svg = d3.select(id)
	    // 	.append("svg")
	    // 	.attr("width", width)
	    // 	.attr("height", height)
	    // 	.attr("class", "quarter-svg")
	    // 	.append("g")
		   //  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;
		//x axis
		var data = chart.lineAreaData;

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

		x.domain(data.map(function(d) { return d.time; }));
		y.domain([0, d3.max(data, function(d) { return d.count + 10; })]);

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

		// var xScale = d3.scale.linear()
		// 	.domain([0, (data.length - 1)])
		// 	.range([0, width - margin.right]);
		// var xAxisScale = d3.scale.linear()
		// 	.domain([0, (data.length - 1)])
		// 	.range([0, width]);
		// var xDataAxis = d3.svg.axis()
		// 		.scale(xScale)
		// 		.ticks(data.length)
		// 		.tickValues(data.map(function(d, i){return i;}));
		// var xAxis = d3.svg.axis()
		// 		.scale(xAxisScale)
		// 		.ticks(data.length)
		// 		.tickSize(0)
		// 		.tickFormat("");
		//y axis
		// var yScale = d3.scale.linear()
		// 	.domain([0, d3.max(data, function(d){ return d.count; })])
		// 	.range([height - margin.bottom, margin.top]);
		// var yAxisScale = d3.scale.linear()
		// 	.domain([0, d3.max(data, function(d){ return d.count; })])
		// 	.range([height - margin.bottom, 0]);
		// var yAxis = d3.svg.axis()
		// 		.scale(yAxisScale)
		// 		.orient("left")
		// 		.ticks(d3.max(data, function(d){ return d.count; }))
		// 		.tickSize(0).tickFormat("");
		//line
		// var line = d3.svg.line()
		// 		.interpolate("linear")
		// 		.x(function(d, i){return xScale(i);})
		// 		.y(function(d){return yScale(d.count);}); 
		var line = d3.svg.line()
			    .x(function(d) { return x(d.time) + x.rangeBand()/2; })
			    .y(function(d) { return y(d.count); });
		//area
		// var area = d3.svg.area().interpolate("linear")
		// 		.x(function(d,i){return xScale(i);})
		// 		.y0(height - margin.bottom - 1)
		// 		.y1(function(d){return yScale(d.count);});
		var area = d3.svg.area().interpolate("linear")
				.x(function(d){return x(d.time) + x.rangeBand()/2;})
				.y0(height - 1)
				.y1(function(d){return y(d.count);});

	 //    svg.append("g").call(xAxis)
	 //    	.attr("class", "xAxis")
	 //    	.attr("transform", "translate(0," + (height - margin.bottom) + ")")
		// 	.append("text").attr("class", "xAxis-data")
		// 	.text("年/季度")
		// 	.attr("transform", "translate("+(width - xaxisExplainWidth)+",-5)");
		// svg.append("g").call(xDataAxis)
		// 	.attr("class", "xDatAxis")
		// 	.attr("transform", "translate(0," + (height - margin.bottom) + ")");
		// svg.selectAll(".xDatAxis .tick")
		// 	.selectAll("text")
		// 	.text(function(d){return data[d].time;});
			
		// svg.append("g")
		// 	.call(yAxis)
		// 	.attr("class", "yAxis")
		// 	.attr("transform", "translate(1,0)")
		// 	.append("text")
		// 	.attr("class", "yAxis-data")
		// 	.text("案件数")
		// 	.attr("transform", "translate(5," + yaxisExplainHeight + ")");	
		
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
		
		//add circle
		// var circle  = lines.selectAll(".line")
		// 		.data(data.data).enter()
  //               .append("g").attr("class", "line");

		// 	circle.append("circle")
		// 		.attr("class","points")
		// 		.attr("cx",function(d){ return x(d.letter) + x.rangeBand()/2; })
		// 		.attr("cy",function(d){ return y(d.count / 2); })
		// 		.attr("r",2)
		// 		.attr("fill", "#ff3a00");
		var circle = svg.append("g")
			.attr("class", "circle_g")
			.selectAll("circle")
			.data(data).enter()
			.append("circle")
			.attr("cx", function(d){return x(d.time) + x.rangeBand()/2;;})
			.attr("cy", function(d) {return y(d.count);})
			.attr("r",2)
			.attr('class', 'circle')
			.attr('fill', '#2db0ff');

		var text = svg.append("g")
			.attr("class", "text_g")
			.selectAll("text")
			.data(data).enter()
			.append("text")
			.attr("class", "text_persent")
			.text(function(d){ return d.count + '件'})
			.attr("x", function(d) { return x(d.time) + x.rangeBand()/2; })
			.attr("y", function(d) { return y(d.count) - 8; })
			.attr("fill", "#1b1a20")
			.attr("text-anchor", "middle");
		// show data detail
		// data.forEach(function (datum, index) {
		// 	svg.append("g").attr("transform", "translate(" + (xScale(index)) + "," + (yScale(datum.count) - 8) + ")")
		// 		.append("text")
		// 		.text(datum.count + "件")
		// 		.attr("class", "explain-text")
		// 		.attr("text-anchor", "middle");
	 //    });
  	}
}