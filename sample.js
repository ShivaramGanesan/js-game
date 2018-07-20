

var gamePiece;
var obstacle = [];
var obstacleSpeed = 0;

score = document.getElementById('points');
startButton = document.getElementById('start');
startButton.onclick = function(){
	startButton.disabled = true;
	if(startButton.innerHTML == 'reset game'){
		startButton.innerHTML = 'start game!';
	}
	startGame();
}
	

function startGame(){
	myGameArea.start();
	gamePiece = new component(25, 25, 10, 120, "red", 'image');

	//console.log("player created");
	//obstacle.push(new component(50, 100, 400, 100, "blue"));
	//obstacle.push(new component(50, 100, 300, 100, "green"));
	
	
}

var myGameArea = {
	canvas : document.createElement("canvas"),
	start : function(){
		this.canvas.width = 480;
		this.canvas.height = 270;
		this.context = this.canvas.getContext('2d');
		this.frameNo = 0;
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(updateGameArea, 20);
	},
	clear : function(){
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop : function(){
		clearInterval(this.interval);
		
	}
}

function everyInterval(n){
	if((myGameArea.frameNo / n)%1 == 0){
		return true;
	}
	return false;
}



function component(width, height, x, y, color, type){
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.type = type;
	if(type == 'image'){
		this.image = new Image();
		this.image.src = 'smiley1.png';
	}
	this.color = color;
	this.speedX = 0;
	this.speedY = 0;
	this.update = function(){
		context = myGameArea.context;
		if(this.type == 'image'){
			context.drawImage(this.image, this.x, this.y, this.width, this.height);
		}
		else{
			context.fillStyle = color;
			context.fillRect(this.x, this.y, this.width, this.height);
		}
	}
	this.newPos = function(){
		
		this.x += this.speedX;
		this.y += this.speedY;
		this.hitBottom();
	}
	this.hitBottom = function(){
		if(this.height > 270){
			this.height = 270;
		}	
	}
	this.crashWith = function(otherobj){
		var myLeft = this.x;
		var myRight = this.x +(this.width);
		var myTop = this.y;
		var myBottom = this.y + this.height;

		var otherLeft = otherobj.x;
		var otherRight = otherobj.x +(otherobj.width);
		var otherTop = otherobj.y;
		var otherBottom = otherobj.y + otherobj.height;
		var crash = true;
		
		
		if ((myBottom < otherTop) || (myTop > otherBottom) || (myRight < otherLeft) || (myLeft > otherRight)) {
       		crash = false;
        }
	    
        return crash;
	}
	this.crashWall = function(){
		var myLeft = this.x;
		var myRight = this.x +(this.width);
		var myTop = this.y;
		var myBottom = this.y + this.height;
		var wallWidth = 480;
		var wallHeight = 270;
		//console.log(wallHeight);
		if(myLeft<0 || myTop<0 || myRight>wallWidth ){
			return true;
		}
		return false;
	}
}

function updateGameArea(){
	var x, y, minHeight, maxHeight, minGap, maxGap, height, gap;
	for(i = 0; i<obstacle.length; i += 1){
		if(gamePiece.crashWith(obstacle[i]) || gamePiece.crashWall()){
			myGameArea.stop();
			alert("game over!\n You scored:"+score.innerHTML);
			document.getElementById('start').innerHTML='reset game';
			startButton.disabled = false;
			return;
		}
	}
		

	myGameArea.clear();
	myGameArea.frameNo += 1;
	points.innerHTML = myGameArea.frameNo;
	if(myGameArea.frameNo == 1 || everyInterval(150)){
		minHeight=20;
		maxHeight = 200;
		height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
		minGap = 50;
		maxGap = 100;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
		x = myGameArea.canvas.width;
		y = myGameArea.canvas.height-200;
		obstacle.push(new component(10, height, x, 0, "green", "rect"));
        obstacle.push(new component(10, x - height - gap, x, height + gap,  "green", "rect"));
	}
	for(j = 0; j<obstacle.length; j +=1 ){
		obstacle[j].x -= 1+obstacleSpeed;
		obstacle[j].update();
		obstacleSpeed += 0.0005;
	}
	
	gamePiece.newPos();
	gamePiece.update();
	
}






document.addEventListener('keydown', function(event){
	
	//up 87
	//left 65
	//right 68
	//down 83
	if(event.keyCode == 87){ // up
		gamePiece.speedY -= 1;
		
	}
	if(event.keyCode == 65){ // left
		gamePiece.speedX -= 1;	
		
	}
	if(event.keyCode == 68){ // right
		gamePiece.speedX += 1;
		
	}
	if(event.keyCode == 83){ // down
		gamePiece.speedY += 1;
		
	}
});