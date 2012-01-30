function sd(el, mode) {
	this.canvas = document.getElementById(el);
	this.ctx = this.canvas.getContext("2d")
	this.options = {}
	this.setSize(512, 512)

	// event callbacks
	this.canvas.addEventListener("mousedown", this.start.bind(this))
	document.body.addEventListener("mousemove", this.draw.bind(this))
	document.body.addEventListener("mouseup", this.stop.bind(this))

	this.previous = { x: 0, y: 0, width: 0 }
	this.position = this.canvas.getBoundingClientRect()
}

sd.prototype.start = function(e) {
	this.previous.x = e.pageX - this.position.left
	this.previous.y = e.pageY - this.position.top
	this.painting = true
	this.draw(e)
}

sd.prototype.stop = function(e) {
	this.painting = false
}

sd.prototype.draw = function(e) {
	if (!this.painting)
		return

	var pos = { x: e.pageX - this.position.left, y: e.pageY - this.position.top }
	var diff = [ Math.abs(this.previous.x - pos.x), Math.abs(this.previous.y - pos.y) ]
	var speed = Math.sqrt(diff[0] * diff[0] + diff[1] * diff[1])

	if (speed > 25) {
		// substeps needed when moving fast or lines get blocky
		console.log("needs steps")
	}

	var c = this.ctx

	c.lineWidth = 10;
	c.lineCap = "round";

	// badly needs interpolation to be usable
	if (this.options.speedScaling)
	{
		var scale = speed / 10
		scale = Math.max(scale, 5)
		scale = Math.min(scale, 20)

		c.lineWidth = scale
		this.previous.width = scale
	}

	c.beginPath();
	c.moveTo(this.previous.x, this.previous.y);
	c.lineTo(pos.x, pos.y);
	c.stroke();

	this.previous.x = pos.x
	this.previous.y = pos.y
}

sd.prototype.clear = function() {
	var c = this.ctx
	var color = c.fillStyle

	c.fillStyle = "#fff"
	c.fillRect(0, 0, this.options.width, this.options.height)
	c.fillStyle = color
}

sd.prototype.setSize = function(x, y) {
	this.options.width = x
	this.options.height = y

	this.canvas.setAttribute("width", x)
	this.canvas.setAttribute("height", y)
}

function init() {
	var canvas = new sd("sd_canvas")
	canvas.setSize(854, 480)
	canvas.clear()
}

$(init)

