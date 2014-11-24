var region = "All";
var type = "Organization";

$(document).ready(function() {
  $(function() {
    $(".dropdown-menu li a").click(function() {
      $(".drop:first-child").text($(this).text());
      $(".drop:first-child").val($(this).text());

    });
  });
 
});


$('#searchButton').on('click', function(e) {

	$.ajax({
		url: '/searchorg',
		type: 'POST',
		data: {
			name: $('#searchText').val(),
			cause: $(".drop:first-child").val(),
			location: $(".active :first-child")[0].value,
			type: $(".active :first-child")[1].value
		},
    datatype: 'json',
    success: function(data) {
		
		for ( var i = 0; i < data.length; i++ ) {
			document.getElementById("searchRes").innerHTML = '<ol><li>'+data[i].name+'</li></ol>';
		}
    }
  });
  e.preventDefault();
});