// maybe not be the most efficient, but convenient.
function vec(x, y)
{
	this.x = x
	this.y = y
}

vec.prototype = {
	dot: function(input) {
		return this.x*input.y + this.y*input.y
	},
	length: function() {
		return Math.sqrt(this.x*this.x + this.y*this.y)
	},
	add: function(input) {
		return new vec(this.x + input.x, this.y + input.y)
	},
	sub: function(input) {
		return new vec(this.x - input.x, this.y - input.y)
	},
	mul: function(input) {
		return new vec(this.x * input.x, this.y * input.y)
	},
	div: function(input) {
		// prevent divide by zero
		input.x = Math.max(0.001, input.x)
		input.y = Math.max(0.001, input.y)
		return new vec(this.x / input.x, this.y / input.y)
	},
	normalize: function() {
		return this.div(new vec(this.length(), this.length()))
	},
	toString: function() {
		return "x: " + this.x + " y: " + this.y
	}
}

function sharkdraw(el) {
	this.init(el)
}

sharkdraw.prototype = {
	previous: null,
	lastwidth: 0,
	options: {},
	points: null,
	extents: {
		min: null, max: null
	},
	updateRects: function() {
		this.position = this.canvas.getBoundingClientRect()
	},
	init: function(el) {
		this.canvas = document.getElementById(el);
		this.ctx = this.canvas.getContext("2d")
		this.setSize(512, 512)
		this.updateRects()
		this.points = []

		// event callbacks
		this.canvas.addEventListener("mousedown", this.start.bind(this))
		document.body.addEventListener("mousemove", this.draw.bind(this))
		document.body.addEventListener("mouseup", this.stop.bind(this))

		// need to recalculate bounds when window size changes
		window.addEventListener("resize", this.updateRects.bind(this))
	},
	save: function() {
		var c = this.ctx

		// TODO: partial updates (calculate stroke bounds while drawing!)
		this.imageData = c.getImageData(0, 0,
			this.options.width, this.options.height)

		// recalculate (smooth) line from points
		// XXX: eventually, this should happen as the line is drawn.
	},
	finish: function() {
		var c = this.ctx
		c.putImageData(this.imageData, 0, 0)
	},
	start: function(e) {
		var position = new vec(
			e.pageX - this.position.left,
			e.pageY - this.position.top
		)
		position.timestamp = Date.now()
		this.extents.min = new vec(position)
		this.previous = position
		this.points.push(position)
		this.painting = true
//		this.save()
		this.draw(e)
	},
	stop: function(e) {
//		this.finish()
		this.painting = false
		this.points = []
	},
	draw: function(e) {
		if (!this.painting)
			return

		var last = this.points[this.points.length-1]
		var pos = new vec(
			e.pageX-this.position.left,
			e.pageY-this.position.top
		)
		pos.timestamp = Date.now()
		this.points.push(pos)
		
		var c = this.ctx

		c.lineWidth = 20;
		c.lineCap = "round";

		// badly needs interpolation to be usable
		if (this.options.speedScaling)
		{
			var scale = speed / 10
			scale = Math.max(scale, 5)
			scale = Math.min(scale, 20)

			c.lineWidth = scale
			this.lastwidth = scale
		}

		c.beginPath();
		c.moveTo(last.x, last.y)

		// WebKit doesn't draw zero-size lines.
		c.lineTo(pos.x+0.1, pos.y+0.1)
		c.stroke();
	},
	clear: function() {
		var c = this.ctx
		var color = c.fillStyle

		c.fillStyle = "#fff"
		c.fillRect(0, 0, this.options.width, this.options.height)
		c.fillStyle = color
	},
	setSize: function(x, y) {
		this.options.width = x
		this.options.height = y

		this.canvas.setAttribute("width", x)
		this.canvas.setAttribute("height", y)
		
		this.clear()
	}
}

$(function() {
	var canvas = new sharkdraw("sd_canvas")
	canvas.setSize(854, 480)
})
