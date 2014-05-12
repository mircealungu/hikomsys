$(document).ready(function(){
	$("#package_list").jstree({
		"core" : 
		{
			"check_callback" : true,
			"themes" : 
			{ 
				"stripes" : true,
				"dots" : true,
				"icons" : false
			},
			"checkbox" : 
			{
				"three_state" : false
			},
		},
		"contextmenu" : {
			items : { 

					"expand" : {
						label: "Expand", 
						action: function (obj) { console.log(obj)}
					}
					// },
					// "close" : {
					// 	label: "Close", 
					// 	"action" : console.log(node)
					// }
				}

		},
		"plugins" : ["checkbox", "sort", "state", "wholerow", "contextmenu"]
	});

	$("#package_list").jstree(true).clear_state();

});

$('form').submit(function (e) {
	stuff = $("#package_list").jstree("get_selected", true, false);
	var array = [];
	$.each(stuff, function(idx, obj) {
		array.push(obj.id);
	});
	var $hidden = $("<input type='hidden' name='selected'/>");
	$hidden.val(JSON.stringify(array));
	$(this).append($hidden);
});

$("#package_list").bind("dblclick.jstree", function (event) {
	var node = $(event.target).closest("li");
	var data = node.data("jstree");
	var id = node[0].id;
	uncheckChilds(id);
	if(node.hasClass('jstree-open')){
		$("#package_list").jstree("close_all",id);
 	}
	else{
		$("#package_list").jstree("open_all",id);
	}
});

function uncheckChilds(id){
	$("#package_list").jstree("deselect_node",id);
	var children = $("#package_list").jstree("get_children_dom", id);
	for(var i = 0; i < children.length;	 i++){
		uncheckChilds(children[i].id);
	}
}