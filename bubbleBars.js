function bubbleBars(){


	var options = {
			w: 300,
			h: 400,
			data: [],
			first: {
				x: 50,
				y: 0,
			},
			line: {
				h:60,
				padding: { bottom: 20 }
			},
			bubble:{
				r: null,
				y: 0,
				padding: {left:50}
			},
			bars:{
				padding:{ left: 20, right: 10 }
			},
			arrows: {
				w:10
			},
			isDebug: true
		};

	function getBarLeft(){
		return options.bubble.padding.left + options.bubble.r + options.bars.padding.left;
	}
	function getBarMiddle(d,i){
		return getRowTop(d,i) + (options.line.h * .05);
	}
	function getBarHeight(){
		return options.line.h * .9;
	}
	function getRowTop(d,i){
			if (i <= 0) {
				return options.first.y;
			}
			else {
				return options.first.y + ((options.line.h + options.line.padding.bottom) *i);
			}
	}
	function getRowMiddle(d,i){
		return getRowBottom(d,i) - options.bubble.r;
	}
	function getRowBottom(d,i){
		return getRowTop(d,i) + options.line.h;
	}
	function getBarWidth(){
		return options.w - getBarLeft() - options.bars.padding.right;
	}

	function getArrowPos(d,i){
		var x =  getBarLeft() - options.arrows.w, // 10% de margem de ajuste.
			w = getBarLeft(),
			h = 15;

		return 'M' +  x + ',' + getRowMiddle(d,i) + 'L' + w + ',' + (getRowMiddle(d,i) + h) + ' L' + w + ',' + (getRowMiddle(d,i) - h) + ' Z';
	}

	function setNewOptions(newOptions){
		// TODO: fazer de um forma descente.
		if (newOptions.w)
			options.w = newOptions.w;
		if (newOptions.h)
			options.h = newOptions.h;
		if (newOptions.bubble) {
			if (newOptions.bubble.padding.left)
				options.bubble.padding.left = newOptions.bubble.padding.left;
			if (newOptions.bubble.y)
				options.bubble.y = newOptions.bubble.y;
			if (newOptions.bubble.r)
				options.bubble.r = newOptions.bubble.r;
			if (newOptions.bubble.padding.left)
				options.bubble.padding = newOptions.bubble.padding;
		}

		if (newOptions.bars) {
			if (newOptions.bars.padding){
				if (newOptions.bars.padding.left)
					options.bars.padding.left  = newOptions.bars.padding.left;

				if (newOptions.bars.padding.right)
					options.bars.padding.right = newOptions.bars.padding.right;
			}
		}

		if (newOptions.data)
			options.data = newOptions.data
	}

	var svg, groups, bubbles, texts, barsBg, bars, arrows;

	function draw() {
		svg = d3.select('#chart')
			.append('svg')
			.attr('width', options.w)
			.attr('height', options.h);

		groups = svg.selectAll('g')
			.data(options.data)
			.enter()
			.append('g')
			.attr('class', 'group');

		bubbles = groups
			.append('circle')
			.attr('class', 'bubble')
			.attr('r', options.bubble.r)
			.attr('cx', options.bubble.padding.left)
			.attr('cy', getRowMiddle)
			.attr('style', function(d) {
				if (d.bubble.fill)
					return 'fill:' + d.bubble.fill;
				else
					return "fill: hsl(" + Math.random() * 360 + ",100%,50%)";
			});

		texts = groups
			.append('text')
			.attr('dy', '.3em')
			.attr('class', 'bubbleText')
			.attr('style', function(d) {
				if (d.bubble.color)
					return 'fill:' + d.bubble.color + ';'
				else
					return 'fill: rgb(0, 0, 0);'
			})
			.attr('x', options.bubble.padding.left)
			.attr('y', getRowMiddle)
			.text(function (d) { return d.bubble.name; });

			// <text dy=".3em" style="text-anchor: middle; fill: rgb(0, 0, 0);">Incidente</text>

		barsBg = groups
			.append('rect')
			.attr('class', 'barBg')
			.attr('x', getBarLeft)
			.attr('y', getBarMiddle)
			.attr('width', getBarWidth)
			.attr('height', getBarHeight);

		bars = groups
			.append('rect')
			.attr('class', 'bar')
			.attr('x', getBarLeft)
			.attr('y', getBarMiddle)
			.attr('width', function(d) { return getBarWidth() * d.bar.percentage;})
			.attr('height', getBarHeight);

			// <rect class="bar" x="320" y="100" width="450" height="60" marker-end="url(#end-arrow)"></rect>

		arrows = groups
			.append('path')
			.attr('class', 'arrow')
			.attr('d', getArrowPos);


	}

	function drawDebug(){

		//  Points an lines guide
		var guides = groups
			.append('line')
			.attr('x1', 0)
			.attr('y1', getRowTop)
			.attr('x2', options.w)
			.attr('y2', getRowTop)
			.attr('style', 'stroke:rgb(255,0,0);stroke-width:2');


		var guides2 = groups
			.append('line')
			.attr('x1', 0)
			.attr('y1', getRowBottom)
			.attr('x2', options.w)
			.attr('y2', getRowBottom)
			.attr('style', 'stroke:rgb(255,0,0);stroke-width:2');

		var guidesMiddle = groups
			.append('line')
			.attr('x1', 0)
			.attr('y1', getRowMiddle)
			.attr('x2', options.w)
			.attr('y2', getRowMiddle)
			.attr('style', 'stroke:blue;stroke-width:.5');


		groups
			.append('circle')
			.attr('cx', getBarLeft() - options.arrows.w)
			.attr('cy', getRowMiddle)
			.attr('r', 3)
			.attr('fill', 'red')
			.attr('stroke', 'red');

		groups
			.append('circle')
			.attr('cx', getBarLeft() )
			.attr('cy', function(d,i) { return getRowMiddle(d,i) + 15 ; })
			.attr('r', 3)
			.attr('fill', 'blue')
			.attr('stroke', 'blue');

		groups
			.append('circle')
			.attr('cx', getBarLeft())
			.attr('cy', function(d,i) { return getRowMiddle(d,i) - 15 ; })
			.attr('r', 3)
			.attr('fill', 'green')
			.attr('stroke', 'green');

		// <circle id="pointA" cx="310" cy="250" r="3" fill="red" stroke="red"/>
	}

	return {
		init: function (newOptions){

			if (newOptions)
				setNewOptions(newOptions);

			options.bubble.r = options.line.h/2;

			draw();

			if (options.isDebug){
				//drawDebug();
			}
		}
	};
}
