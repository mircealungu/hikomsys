var WIDTHGREEN = 1;
var WIDTHORANGE = 3;
var WIDTHRED = 5;

var allPackages = [];

var moreInfosEnabled = true;

var moving, draggable = false;

function switchMode() {
    draggable = !draggable;
    var groups = packageLayer.find('.packageGroup');
    for (var i = 0; i < groups.length; i++) {
        groups[i].setDraggable(draggable);
    }
}

function switchDependencies(color) {
    for (var i = 0; i < arrows.length; i++) {
        if (arrows[i].color == color) {
            arrows[i].changeVisibility();
        }
    }
}

/* =============================================================== Eventhandler ============================================================== */
// this requests gets all the information from the PROJECTNAMEResults table
$(document).ready(function() {
    //document.oncontextmenu = function() {return false;};
    quizId = document.getElementById('quizId').value;
    $.post('sendJSON', {
        'quizId': quizId
    })
        .done(function(data) {
            data = $.parseJSON(data);
            for (var i = 0; i < data.length; i++) {
                infos = [];
                infos['classes'] = data[i].classes;
                infos['children'] = data[i].children;
                infos['allDependencies'] = data[i].allDependencies;
                var thisPackage = new PackageGroup(data[i].name, data[i].color, infos);
                allPackages.push(thisPackage);
                thisPackage.create();
                thisPackage.group.setX(data[i].position.X)
                    .setY(data[i].position.Y);
                thisPackage.group.setDraggable(draggable);
            }
            for (var i = 0; i < data.length; i++) {
                var thisPackage = findPackageById(data[i].name);
                var dependencies = data[i].dependencies;
                if (dependencies) {
                    for (var j = 0; j < dependencies.length; j++) {
                        var to = findPackageById(dependencies[j]['to']);
                        var id = thisPackage.text + '_' + to.text;
                        var arrow = new Arrow(thisPackage, to, id);
                        arrow.color = dependencies[j]['color'];
                        arrows.push(arrow);
                        arrow.draw();
                    }
                }
            }
            for (var i = 0; i < arrows.length; i++) {
                if (arrows[i].color == 'red' || arrows[i].color == 'orange') {
                    arrows[i].changeVisibility();
                }
            }
            stage.draw();
        });

    moreInfosEnabled = false;
});

/* ------  Buttons ------*/
$('#move').click(function() {
    switchMode();
});

var clicks = 0;
$('#continue').click(function() {
    if(clicks == 0){
        for (var i = 0; i < arrows.length; i++) {
            if (arrows[i].color == 'orange') {
                arrows[i].changeVisibility();
            }
        }
    }else if(clicks == 1){
        for (var i = 0; i < arrows.length; i++) {
            if (arrows[i].color == 'red') {
                arrows[i].changeVisibility();
            }
        }
    }else{
        window.location.href = '/hikomsys/quizzes/success';
    }
    ++clicks;
});

$('.btn').click(function() {
    normalClick($(this));
});

//Currently not used
$('.arrowbtn').click(function() {
    color = $(this).attr('id').replace('Arrow', '');
    switchDependencies(color);
});

//Currently not used
$('#infosEnabled').click(function() {
    moreInfosEnabled = !moreInfosEnabled;
    for (var i = 0; i < allPackages.length; i++) {
        allPackages[i].removeInfos();
    }
});



/* FLIPBOX */
var points = 0;
var red, orange, green = false;

$('#green').click(function(){
    green = !green;
    greenPoints = (green ? document.getElementById('green-points').value : 0);
    redPoints = (red ? document.getElementById('red-points').value : 0);
    points = parseFloat(greenPoints)+parseFloat(redPoints);

    $("#flipped").flip({
        direction:'tb',
        color: '#FF8D2C',
        content: '<p>Points: '+points+' (+'+greenPoints+')</p>',
        onAnimation: function(){
            for (var i = 0; i < arrows.length; i++) {
                if (arrows[i].color == 'green') {
                    arrows[i].changeVisibility();
                }
            }   
        },
        onEnd: function(){
            if(green){
                $('#green > span').text('Hide Correct');
            }
            else{
                $('#green > span').text('Show Correct');
            }
        }
    })

})

$('#orange').click(function(){
    orange = !orange

    $("#flipped").flip({
        direction:'rl',
        color: '#FF8D2C',
        content: '<p>Points: '+points+' (+0)</p>',
        onAnimation: function(){
            for (var i = 0; i < arrows.length; i++) {
                if (arrows[i].color == 'orange') {
                    arrows[i].changeVisibility();
                }
            }   
        },
        onEnd: function(){
            if(green){
                $('#orange > span').text('Hide Missing');
            }
            else{
                $('#orange > span').text('Show Missing');
            }
        }
    })
})

$('#red').click(function(){
    red = !red;
    greenPoints = (green ? document.getElementById('green-points').value : 0);
    redPoints = (red ? document.getElementById('red-points').value : 0);
    points = parseFloat(greenPoints)+parseFloat(redPoints);

    $("#flipped").flip({
        direction:'bt',
        color: '#FF8D2C',
        content: '<p>Points: '+points+' (+'+redPoints+')</p>',
        onAnimation: function(){
            for (var i = 0; i < arrows.length; i++) {
                if (arrows[i].color == 'red') {
                    arrows[i].changeVisibility();
                }
            }   
        },
        onEnd: function(){
            if(green){
                $('#red > span').text('Hide Wrong');
            }
            else{
                $('#red > span').text('Show Wrong');
            }
        }
    })
})
