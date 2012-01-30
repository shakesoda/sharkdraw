function sd(el, mode) {
	this.canvas = document.getElementById(el);
	this.ctx = this.canvas.getContext("2d")
	this.options = {}
	this.setSize(512, 512)

	// event callbacks
	this.canvas.onmousemove = this.stroke.bind(this)
	this.canvas.onmousedown = this.start.bind(this)
	this.canvas.onmouseup = this.stop.bind(this)

	this.previous = { x: 0, y: 0 }
	this.firstUpdate = true
}

sd.prototype.start = function(e) {
	this.previous.x = e.pageX
	this.previous.y = e.pageY
	this.firstUpdate = false
	this.painting = true
	this.stroke(e)
}

sd.prototype.stop = function(e) {
	this.painting = false
}

sd.prototype.stroke = function(e) {
	if (!this.painting)
		return

	var c = this.ctx
	c.lineWidth = 15;
	c.lineCap = "round";
	c.beginPath();

	// prevent line from 0,0 on first update
	if (!this.firstUpdate)
		c.moveTo(this.previous.x, this.previous.y);
	else {
		c.moveTo(e.pageX+1, e.pageY+1)
		this.firstUpdate = false
	}

	c.lineTo(e.pageX,e.pageY);
	this.previous.x = e.pageX
	this.previous.y = e.pageY
	c.stroke();
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

