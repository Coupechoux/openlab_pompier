var nodes = [];
var N = 101;
var pix_size = 450;
var node_size = 100;
var x_min = 20;
var x_max = 30;
var y_min = 25;
var y_max = 30;
var xc = (x_min+x_max)/2;
var yc = (y_min+y_max)/2;
var emax = (x_max-x_min>y_max-y_min)?x_max-x_min:y_max-y_min;
var sc = pix_size/((emax+1)*node_size);
var button_validate;
var availableFirefightersTextArea;
var scoreTextArea;
var availableFirefighters;

function setup() {
	createCanvas(pix_size,pix_size);
	for(var i=1; i<=N; i++) {
		var y = i*node_size-node_size/2;
		for(var j=1; j<=N; j++) {
			var x = j*node_size-node_size/2;
			var index = (i-1)*N+j-1;
			append(nodes, new Noeud(x,y,node_size,node_size));
			if(i>1) {
				var index2 = (i-2)*N+j-1;
				nodes[index2].add_neighbor(nodes[index]);
				nodes[index].add_neighbor(nodes[index2]);
			}
			if(j>1) {
				var index2 = (i-1)*N+j-2;
				nodes[index2].add_neighbor(nodes[index]);
				nodes[index].add_neighbor(nodes[index2]);
			}
		}
	}
	availableFirefighters = 2;
	button_validate = createButton("Valider");
	button_validate.mousePressed(newTurn);
	button_validate.position(pix_size/2,pix_size+20);
	availableFirefightersTextArea=createElement('h3',"");
	scoreTextArea=createElement('h3',"");
	setAvailableFirefightersText();
	//nodes[int(N*N/2+N/2)].burn();
	// nodes[int(nodes.length/2)].burn();
	nodes[25*51+25].burn();
}

function draw() {
	background(255);
	
	scale(sc);
	translate(-(xc-emax/2)*node_size,-(yc-emax/2)*node_size);
	
	for(var i=0; i<nodes.length; i++) {
		var x = i%N;
		var y = Math.floor(i/N);
		nodes[i].draw();
	}
}

function mousePressed() {
	var i = map(mouseY,0,height,yc-(emax+1)/2,yc+(emax+1)/2);
	var j = map(mouseX,0,width,xc-(emax+1)/2,xc+(emax+1)/2);
	console.log(i,j);
	console.log(emax);
	i = Math.round(i);
	j = Math.round(j);
	var index = i*N+j;
	
	if(i>=0 && i<N && j>=0 && j<N) {
		state = nodes[index].state;
		if(state == "empty" && availableFirefighters > 0) {
			nodes[index].state = "deploying";
			availableFirefighters--;
		}
		if(state == "deploying") {
			nodes[index].state = "empty";
			availableFirefighters ++;
		}
		setAvailableFirefightersText();
	}
}

function mouseWheel(event) {
	if(event.delta < 0) {
		x_min += 0.5;
		x_max -= 0.5;
		y_min += 0.5;
		y_max -= 0.5;
		console.log("Ok !");
	} else if(event.delta > 0) {
		x_min -= 0.5;
		x_max += 0.5;
		y_min -= 0.5;
		y_max += 0.5;
	}
	updateCoords();
}

function setAvailableFirefightersText() {
	var plural = "";
	if(availableFirefighters >1) {
		plural = "s";
	}
	var s=availableFirefighters+" pompier"+plural;
	s += " disponible"+plural;
	availableFirefightersTextArea.elt.innerHTML = s;
}

function setScoreText(n) {
	var plural = "";
	if(n >1) {
		plural = "s";
	}
	var s="Score : "+n+" case"+plural;
	s += " brûlée"+plural;
	scoreTextArea.elt.innerHTML = s;
}

function newTurn() {
	var newBurned = propagate();
	if(newBurned == 0) {
		var totalBurned=0;
		for(var i=0; i<nodes.length; i++) {
			if(nodes[i].state == "burned") {
				totalBurned++;
			}
		}
		setScoreText(totalBurned)
	}
}

function keyPressed() {
	switch(keyCode) {
		case ENTER:
		case 32:
			newTurn();
			break;
		case UP_ARROW:
			y_min -= 1;
			y_max -= 1;
			break;
		case LEFT_ARROW:
			x_min -= 1;
			x_max -= 1;
			break;
		case DOWN_ARROW:
			y_min += 1;
			y_max += 1;
			break;
		case RIGHT_ARROW:
			x_min += 1;
			x_max += 1;
			break;
	}
	updateCoords();
}

function updateCoords() {
	xc = (x_min+x_max)/2;
	yc = (y_min+y_max)/2;
	emax = (x_max-x_min>y_max-y_min)?x_max-x_min:y_max-y_min;
	sc = pix_size/((emax+1)*node_size);
}

function propagate() {
	var newBurned = [];
	for(var i=0; i<nodes.length; i++) {
		if(nodes[i].state == "recently burned") {
			for(var j=0; j<nodes[i].neighbors.length; j++) {
				append(newBurned,nodes[i].neighbors[j]);
			}
			nodes[i].state = "burned";
		}
		if(nodes[i].state == "deploying") {
			nodes[i].state = "protected";
			availableFirefighters++;
		}
	}
	for(var i=0; i<newBurned.length;i++) {
		newBurned[i].burn();
	}
	
	
	setAvailableFirefightersText();
	return newBurned.length;
}
