class Noeud {
	constructor(x,y,w,h) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.neighbors = [];
		this.state = "empty"; // Not burned, not protected
		// this.state = "deploying"; // Scheduled protection
		// this.state = "protected"; // Protected
		// this.state = "recently burned"; // Recently burned
		// this.state = "burned"; // Burned
	}
	
	change_center(x,y) {
		this.x = x;
		this.y = y;
	}
	
	change_size(w,h) {
		this.width=w;
		this.height=h;
	}
	
	burn() {
		if(this.state == "empty") {
			this.state = "recently burned";
		}
	}
	
	protect() {
		if(this.state == "empty") {
			this.state = "deploying";
			return true;
		}
		return false;
	}
	
	add_neighbor(neighbor) {
		append(this.neighbors,neighbor);
	}
	
	draw() {
		if(this.state == "empty") {
			fill(230,230,230);
		} else if(this.state == "deploying") {
			fill(0,255,0);
		}
		else if(this.state == "protected") {
			fill(0,150,0);
		}
		else if(this.state == "recently burned") {
			fill(255,0,0);
		}
		else if(this.state == "burned") {
			fill(150,0,0);
		}
			
		rect(this.x-this.width/2,this.y-this.height/2,this.width,this.height);
		noFill();
		stroke(0);
		rect(this.x-this.width/2,this.y-this.height/2,this.width,this.height);
	}
}