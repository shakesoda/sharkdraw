function sharkdraw(el, hookfn) {
	this.init(el, hookfn)
}

sharkdraw.prototype = {
	previous: null,
	options: null,
	points: null,
	bounds: null,
	lastwidth: 0,
	updateRects: function() {
		this.position = this.canvas.getBoundingClientRect()
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
		this.updateRects()
	},
	init: function(el, hookfn) {
		this.options = {}
		this.bounds = { min: null, max: null }
		this.canvas = document.getElementById(el);
		this.ctx = this.canvas.getContext("2d")
		this.points = []
		this.resizeHook = hookfn

		this.resizeHook(this)

		// event callbacks
		this.canvas.addEventListener("mousedown", this.start.bind(this))
		document.body.addEventListener("mousemove", this.draw.bind(this))
		document.body.addEventListener("mouseup", this.stop.bind(this))

		var dummy = this

		// need to recalculate bounds when window size changes
		window.addEventListener("resize", function(){
			hookfn(dummy)
		})
	},
	save: function() {
		var c = this.ctx

		// TODO: partial updates?
		this.imageData = c.getImageData(0, 0,
			this.options.width, this.options.height)
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

		this.bounds.min = position
		this.bounds.max = position

		// timestamps should come in handy
		position.timestamp = Date.now()
		this.previous = position

		// clear points from previous stroke
		this.points = []
		this.points.push(position)

		// save canvas state so the last stroke can be redrawn
		this.save()

		this.painting = true
		this.draw(e)
	},
	stop: function(e) {
//		this.finish()
		this.painting = false
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

		// store points so lines can be recalculated
		this.points.push(pos)

		var c = this.ctx

		c.lineWidth = 5;
		c.lineCap = "round";

		c.beginPath();
		c.moveTo(last.x, last.y)

		// WebKit doesn't draw zero-size lines.
		c.lineTo(pos.x+0.1, pos.y+0.1)
		c.stroke();
	}
}

$(function() {
	function hook(obj) {
		var width = $("#container").innerWidth() - $("#sidebar").outerWidth(true) - 15
		var height = Math.max($(window).innerHeight() - 75, $("#sidebar").outerHeight(true))
		obj.setSize(width, height)
	}
	var canvas = new sharkdraw("sd_canvas", hook)
})
