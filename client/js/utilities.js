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

