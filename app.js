$(document).ready(function(){
	var url = "https://myapi.profstream.com/api/10445f/wines";
	//Compile templates on DOM load
	if ($("#page_id").val() === "index") {
		var source = $("#wines-template").html();
		//wineTemplate is a function that accepts one arg, returns appropriate html
		var wineTemplate = Handlebars.compile(source);
	}

	function getWines(){
		if(window.location.href.indexOf("index.html") > -1) {
			$.ajax({
				url: url,
				type: "GET",
				dataType: 'json',
				crossDomain : true,
				success: function(wines) {
					//we use $ in front of var to remind ourselves that this is just a jquery selector (just a covention)
					var $wineContainer = $(".container");
					wines.forEach(function (wine) {
						$wineContainer.append(wineTemplate(wine));
					})
				},
				error: function() {
					alert("Cannot get data!");
				}
			});
		}
	}
	// Prepop values on edit form
	if(window.location.href.indexOf("edit.html") > -1) {
		//get the ID from URL
		var id = window.location.href.match(/#(.*)/)[1];
		$.ajax({
			url: url + "/" + id,
			type: "GET",
			dataType: 'json',
			crossDomain : true,
			success: function(wine) {
				$("#name").val(wine.name);
				$("#year").val(wine.year);
				$("#picture").val(wine.picture);
				$("#grapes").val(wine.grapes);
				$("#country").val(wine.country);
				$("#region").val(wine.region);
				$("#price").val(wine.price);
				$("#description").val(wine.description);
			},
			error: function() {

			}
		});
		// DELETE
		$("#delete").on("click", function(event){
			event.preventDefault();
			$.ajax({
				url: url + "/" + id,
				type: "DELETE",
				success: function(wine) {
					alert('Wine ' + id + ' was deleted successfully!');
					window.location.href = "index.html";
				},
				error: function() {

				}
			});
		});
	}
	// EDIT
	$("#edit-wine-form").on("submit", function(event){
		event.preventDefault();
		var id = window.location.href.match(/#(.*)/)[1];
		var wineData = { 
			name: $("#name").val(),
			year: $("#year").val(),
			picture: $("#picture").val(),
			grapes: $("#grapes").val(),
			country: $("#country").val(),
			region: $("#region").val(),
			price: $("#price").val(),
			description: $("#description").val()
		};
		$.ajax({
			url: url + "/" + id,
			type: "PUT",
			data : wineData,
			success: function(wine) {
				alert('Wine ' + id + ' was edited successfully!');
				window.location.href = "index.html";
			},
			error: function() {
				alert('cannot edit!');
			}
		});
	});
	// ADD
	$("#new-wine-form").on("submit", function(event){
		//prevents whatever the default action is, works for anchor tags too for example
		event.preventDefault();
		var wineData = { 
			name: $("#name").val(),
			year: $("#year").val(),
			picture: $("#picture").val(),
			grapes: $("#grapes").val(),
			country: $("#country").val(),
			region: $("#region").val(),
			price: $("#price").val(),
			description: $("#description").val()
		};
		console.log(wineData);
		$.ajax({
			type: "POST",
			url: url,
			data : wineData,
			success: function() {
				$(".container").append(wineTemplate(wineData));
				//hide modal window
				$("#add-wine-modal").modal("hide");
				$("#new-wine-form")[0].reset();
				location.reload(true);
			},
			error: function () {
				alert ('Did not post!');
			}
		});
	});

	getWines();
});