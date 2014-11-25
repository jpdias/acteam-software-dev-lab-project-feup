var region = "All";
var defaultshow = 10;
$(document).ready(function() {
  $(function() {
    $(".dropdown-menu li a").click(function() {
      $(".drop:first-child").text($(this).text());
      $(".drop:first-child").val($(this).text());

    });
  });

});


$('#searchButton').on('click', function(e) {
$('#pages').empty();
$('#searchRes').empty();
  $.ajax({
    url: '/searchorg',
    type: 'POST',
    data: {
      name: $('#searchText').val(),
      cause: $(".drop:first-child").val(),
      location: $(".active :first-child")[0].value,
    },
    datatype: 'json',
    success: function(data) {
		var size = data.length;
		
		for(var k = 0; k < Math.ceil(size/defaultshow); k++){
			$('#pages').append('<li class="active"><a href="#">'+k +'<span class="sr-only">(current)</span></a></li>');
		}
		showResults(data,0);
    }
  });
  e.preventDefault();
});


function showResults(data,current){
	var size = data.length;
	var showed = current*defaultshow;
	
	for(var k = showed; k < defaultshow && k<size; k++){
		
		$("#searchRes").append('<ol><li>' + data[k].name + '</li></ol>');
	}
};