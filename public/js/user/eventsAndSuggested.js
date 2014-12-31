$(document).ready(function(){
  console.log("Start!");
  $.ajax({
    url: '/promotedorgs',
    type: 'GET',
    dataType: "json",
    success: function(data) {
      console.log("Done!");
      console.log(data);
    },
    error: function(err) {
      console.log(err);
    }
  });
});
