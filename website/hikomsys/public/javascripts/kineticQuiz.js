function mouseDownOnPackage(packageGroup){
	firstSelectedPackage = findPackageById(packageGroup.getId());
	firstSelectedPackage.highlightPackage("lightblue",5); 
}

function mouseUpOnPackage(packageGroup) {
	if(typeof firstSelectedPackage !== 'undefined' ){
		var toPackage = findPackageById(packageGroup.getId());
		
		if(firstSelectedPackage.text == toPackage.text){
			$('#repeat-alert').css('z-index', 0);
			$('#loop-alert').css('z-index', 1).fadeIn(500);
			return;
		}
		var id = firstSelectedPackage.text + "_" + toPackage.text;

		if(findArrowById(id) === -1){
			var arrow = new Arrow(firstSelectedPackage,toPackage,id);
			arrows.push(arrow);
			arrow.draw();
		}
		else {
			$('#loop-alert').css('z-index', 0);
			$('#repeat-alert').css('z-index', 1).fadeIn(500);
		}

		firstSelectedPackage.highlightBox.remove();
		toPackage.highlightBox.remove();
		firstSelectedPackage = undefined;
		stage.draw();
	}
}

function switchMode(){
	drawingEnabled = !drawingEnabled;
	var groups = packageLayer.get('Group');
	for (var i = 0; i < groups.length; i++){
		groups[i].setDraggable(!drawingEnabled);
	}
	resetFirstSelectedPackage();
	removeIfExists(tmpArrow);
	stage.draw();
}

/* =============================================================== Eventhandler ============================================================== */
stage.on("mousemove", function (e) {
	removeIfExists(tmpArrow);
	if(typeof firstSelectedPackage !== 'undefined' && drawingEnabled) {
		followMe();
		stage.draw();
	}
});

stage.on("mouseup", function (e) {
	resetFirstSelectedPackage();
	removeIfExists(tmpArrow);
	stage.draw();
});

/* ------  Buttons ------*/
$('#draw').click(function(){
	clicked($(this));
	switchMode();
});

$('#move').click(function(){
	clicked($(this));
	switchMode();
});

$('#reset').click(function(){
	resetDependencies();
	$('.alert-box').fadeOut(500);
});

$('#submit').click(function(){
	output = createJSON();
	quizId = document.getElementById('quizId').value;
	$.ajax({
		url : '/hikomsys/quizzes/create-result',
		type : 'post',
		data : {"packages": output, "quizId" : quizId},
		success : function(data){
			window.location.href = '/hikomsys/quizzes/'+quizId
		}
	});
});

function createJSON(){
	var output = [];
	for(var i = 0; i < allPackages.length; i = i + 1 ) {
		var p;
		var position = {"X" : allPackages[i].position().x, "Y" : allPackages[i].position().y};
		name = allPackages[i].text;
		var dep =[];
		for(var j = 0; j < arrows.length; j++){
			currentPackage = arrows[j];
			if(currentPackage.from.text == name){
				toName = currentPackage.to.text;
				thisDep = {"to" : toName};
				dep.push(thisDep);
			}
			
		}
		if (dep.length !== 0){
			p={"name" : name, "dependencies" : dep, "position": position };
		}
		else{
			p={"name" : name, "position": position};
		}
		output.push(p);
	}
	return JSON.stringify(output);
}

function followMe(){
	var mousePos = getRelativePointerPosition();
	tmpArrow = new Arrow(firstSelectedPackage, mousePos, "tmpArrow");
	tmpArrow.draw();
}

function resetFirstSelectedPackage(){
	if(typeof firstSelectedPackage !== 'undefined'){
		firstSelectedPackage.highlightBox.remove();
		firstSelectedPackage = undefined;
	}
}

function resetDependencies(){
	for(var i = 0; i < arrows.length; i++){
		arrows[i].deleteArrow();
	}
	arrows = [];
	stage.draw();
}

$('.alert-box').click(function(){
	$('.alert-box').fadeOut(500);
});
//ALT key soll temporär mode wechseln still not that important but nice to have
/*$(window).on("keydown", function(event) {
    if (event.which === 18) {
        switchMode();
    }
}).on("keyup", function(event) {
	switchMode();
});*/

var randomSaveMove = function(packageGroup){
	var xCoordinate = 1 + Math.floor(Math.random() * (CONTAINER_WIDTH-packageGroup.rect.getWidth()));
	var yCoordinate = 1 + Math.floor(Math.random() * (480-packageGroup.rect.getHeight()))
	packageGroup.group.move({x: xCoordinate , y: yCoordinate});
	
	//This is not working 
	/*var overlapping = true;
	while(overlapping){
		overlapping = false;

		for(var i = 0; i < allPackages.length; i++){
			//console.log(allPackages[i].rect.getAbsolutePosition() );
			positionToCheck = allPackages[i].rect.getAbsolutePosition();
			if(isRectCollide(xCoordinate, yCoordinate, packageGroup.rect, allPackages[i].rect)){
				overlapping = true;
				i = allPackages.length - 1;
			}
		}
	}*/
}

var isRectCollide = function(rect1, rect2) {
	if (rect1.x - rect1.width  >= rect2.x + rect2.width  &&
		rect1.y - rect1.height >= rect2.y + rect2.height &&
		rect1.x + rect1.width  <= rect2.x + rect2.width  &&
		rect1.x + rect1.height <= rect2.y - rect2.height )
		return false;
	else
		return true;
}

$(document).ready(function(){
	for(var i = 0; i < allPackages.length; i++){
		allPackages[i].create();
		randomSaveMove(allPackages[i]);				
	}	
	stage.draw();
});