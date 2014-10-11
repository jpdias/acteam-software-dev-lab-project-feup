
$( "#registerOrgform" ).submit( function(event){

  var frm = $('#registerOrgform');
  var frmdata = frm.serializeArray();
  console.log(frmdata);

  if (frmdata[9].value === ""){
    frmdata[10].value = "";
  }
  var temp_causes=[];
  for(var i=0;i<frmdata.length;i++){
    if(frmdata[i].name==="volunteeringInterestsParam"){
      temp_causes.push(frmdata[i].value);
      console.log(frmdata[i]);
    }
  }
  console.log(temp_causes);
  var account = {
      name: frmdata[0].value,
      email: frmdata[2].value,
      website: frmdata[1].value,
      password: frmdata[4].value,
      address: {
        address: frmdata[5].value,
        municipaly: frmdata[6].value,
        district: frmdata[7].value},
      about: frmdata[8].value,
      birthdate: frmdata[9].value,
      causes: temp_causes,
      role:"organization"
  };

  $.ajax({
      url: '/register',
      type: 'POST',
      data: account,
      datatype: 'json'
  });
  alert("done");
  event.preventDefault();
});
