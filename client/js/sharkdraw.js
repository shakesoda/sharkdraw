function sd(el, mode) {
	this.canvas = document.getElementById(el);
	this.ctx = this.canvas.getContext("2d")
	this.options = {}
	this.setSize(512, 512)

	// event callbacks
	this.canvas.addEventListener("mousedown", this.start.bind(this))
	document.body.addEventListener("mousemove", this.draw.bind(this))
	document.body.addEventListener("mouseup", this.stop.bind(this))

	this.previous = { x: 0, y: 0 }
}

sd.prototype.start = function(e) {
	this.previous.x = e.pageX
	this.previous.y = e.pageY
	this.painting = true
	this.draw(e)
}

sd.prototype.stop = function(e) {
	this.painting = false
}

sd.prototype.draw = function(e) {
	if (!this.painting)
		return

	var c = this.ctx

	c.lineWidth = 10;
	c.lineCap = "round";

	c.beginPath();
	c.moveTo(this.previous.x, this.previous.y);
	c.lineTo(e.pageX,e.pageY);
	c.stroke();

	this.previous.x = e.pageX
	this.previous.y = e.pageY
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

