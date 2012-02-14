function sd_controller(canvas) {
	this.init(canvas)
}

$.extend($.gritter.options, { 
	position: 'top-right',
	fade_in_speed: 'fast',
	fade_out_speed: 'medium',
	time: 2000,
});

sd_controller.prototype = {
	init: function(canvas) {
		this.parent = canvas
		this.build()
	},
	build: function() {
		var sd = $(this.parent.element)

		// controller
		var controls = document.createElement("div")
		controls.id = "sd_controller"

		// form
		var form = document.createElement("form")
		form.id = "sd_hooks"

		var elements = [
			{ name: "clear", type: "button", label: "Clear", callback: 'clear', message: "Canvas Cleared." },
			{ name: "bigger", type: "button", label: "+", callback: 'bigger', message: "" },
			{ name: "smaller", type: "button", label: "-", callback: 'smaller', message: "" }
		]
		
		for (i in elements) {
			var el = document.createElement('input')
			el.name = elements[i].name
			el.type = elements[i].type
			el.value = elements[i].label
			el.xCallback = elements[i].callback
			el.xMessage = elements[i].message

			var that = this
			el.onclick = function(){
				that.parent[this.xCallback]()
				$.gritter.add({ title: "Information", text: this.xMessage })
			}
			form.appendChild(el)
		}

		controls.appendChild(form)
		sd.append(controls)
		
		var toggle = document.createElement("div")
		toggle.id = "sd_toggle"
		toggle.innerHTML = "<span class='options'>Options</span>"
		sd.append(toggle)

		var height = $("#sd_controller").innerHeight();
		$("#sd_controller").toggle(false)

		$("#sd_toggle").state = true
		$("#sd_toggle").click(function(){
			var state = '-='
			this.state = !this.state
			if (this.state)
				state = '+='
			$("#sd_controller").stop().slideToggle('fast');
			$("#sd_toggle").stop().animate({
				top: state+height+'px',
			}, 'fast')
		})
	}
}

function sharkdraw(el, hookfn) {
	this.init(el, hookfn)
}

sharkdraw.prototype = {
	brushSize: 1,
	updateRects: function() {
		this.position = this.canvas.getBoundingClientRect()
	},
	clear: function() {
		this.ctx.clearRect(0, 0, this.options.width, this.options.height)
	},
	setSize: function(x, y) {
		this.options.width = x
		this.options.height = y

		this.save()
		this.canvas.setAttribute("width", x)
		this.canvas.setAttribute("height", y)
		this.finish()

		this.updateRects()
	},
	bigger: function(){
		this.brushSize++
		console.log(this.brushSize)
	},
	smaller: function(){
		this.brushSize--
		console.log(this.brushSize)
	},
	build: function() {
		var sd = this.element
		this.canvas = document.createElement("canvas")
		this.canvas.id = "sd_canvas"
		sd.append(this.canvas)
		
		this.ctx = this.canvas.getContext("2d")
		this.controller = new sd_controller(this)
	},
	init: function(el, hookfn) {
		this.element = $(el)
		this.build()

		// default settings
		this.options = {}
		this.bounds = { min: null, max: null }
		this.points = []
		this.resizeHook = hookfn
		this.resizeHook(this)

		// event callbacks
		this.canvas.addEventListener("mousedown", this.start.bind(this))
		document.body.addEventListener("mousemove", this.draw.bind(this))
		document.body.addEventListener("mouseup", this.stop.bind(this))
		window.addEventListener("resize", hookfn.bind(this))

		this.clear()
	},
	save: function() {
		var c = this.ctx

		this.imageData = c.getImageData(0, 0, this.options.width,
			this.options.height)
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
		//this.save()

		this.painting = true

		this.draw(e)
	},
	stop: function(e) {
		this.save()
		this.painting = false
	},
	draw: function(e) {
		e.preventDefault()

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

		c.lineWidth = this.brushSize
		c.lineCap = "round"

		c.beginPath();
		c.moveTo(last.x, last.y)

		// WebKit doesn't draw zero-size lines.
		c.lineTo(pos.x+0.1, pos.y+0.1)
		c.stroke();
	}
}

$(function() {
	// Add canvas and controller to the DOM
	new sharkdraw("#sharkdraw", function resize_hook() {
		var width = $("#container").innerWidth()
		var height = $("#container").innerHeight()
		this.setSize(width, height)
	})
})
