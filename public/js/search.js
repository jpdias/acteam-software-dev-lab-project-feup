var region = "All";
var defaultshow = 5;
$(document).ready(function() {
  $(function() {
    $(".dropdown-menu li a").click(function() {
      $(".drop:first-child").text($(this).text());
      $(".drop:first-child").val($(this).text());

    });
  });

});

var currentResults;

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
      currentResults = data;
      for (var k = 0; k < Math.ceil(size / defaultshow); k++) {
        $('#pages').append('<li ><a href="javascript:void(0)" data-id="' + k + '" class="currentpage">' + k + '<span class="sr-only">(current)</span></a></li>');
      }
      $('.currentpage').on("click", function() {
        $('#searchRes').empty();
        showResults(currentResults, $(this).data("id"));
      });
      showResults(currentResults, 0);
    }
  });
  e.preventDefault();
});

function showResults(data, current) {
  var size = data.length;
  var showed = current * defaultshow;

  for (var k = showed; k < defaultshow * (current + 1) && k < size; k++) {
    var temp = '<a href="profileorg?org=' + data[k].name + '"><div class="panel panel-primary"> <div class="panel-heading"> <h3 class="panel-title"> ' + data[k].name + ' </h3> </div> <div class="panel-body"> ' + data[k].about + ' <br> Location: ' + data[k].address.address + ',' + data[k].address.municipality + ', ' + data[k].address.district + ' </div> </div > </a>';
    $("#searchRes").append(temp);
  }
}