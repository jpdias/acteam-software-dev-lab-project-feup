/* Form field validation on the edition of a users configuration */
$(document).ready(function(){

/*  var oldCauses = "{{causes}}".split(",");
  for(var j=0;j < oldCauses.length; j++)
    document.getElementById(oldCauses[j]).checked = true;
*/

  $("#editInfo").bootstrapValidator(
    {
      message: "This form is not valid",
      feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
      },
      fields:{
        workplace: {
            message: 'The description is not valid',
            validators: {
                stringLength: {
                    max: 350,
                    message: 'The school or workplace designation must be less than 350 characters long'
                }
            }
        },
        cv: {
            message: 'The link to CV is not valid',
            validators: {
                stringLength: {
                    max: 350,
                    message: 'The link to CV must be less than 350 characters long'
                }
            }
        },
        address: {
            message: 'The address is not valid',
            validators: {
                stringLength: {
                    max: 150,
                    message: 'The address must be  less than 150 characters long'
                }
            }
        },
        municipality: {
            message: 'The municipality is not valid',
            validators: {
                stringLength: {
                    max: 100,
                    message: 'The municipality must be less than 100 characters long'
                }
            }
        },
        district: {
          message: 'The district is not valid',
          validators: {
              stringLength: {
                  max: 100,
                  message: 'The district must be less than 100 characters long'
                }
          }
        }/*,
        skype: {
          message: 'The skype is not valid',
          validators: {
              stringLength: {
                  max: 100,
                  message: 'The skype must be less than 100 characters long'
                }
          }
        },
        facebook: {
          message: 'The facebook is not valid',
          validators: {
              stringLength: {
                  max: 100,
                  message: 'The facebook must be less than 100 characters long'
                }
          }
        },
        flickr: {
          message: 'The flickr is not valid',
          validators: {
              stringLength: {
                  max: 100,
                  message: 'The flickr must be less than 100 characters long'
                }
          }
        },
        instagram: {
          message: 'The instagram is not valid',
          validators: {
              stringLength: {
                  max: 100,
                  message: 'The instagram must be less than 100 characters long'
                }
          }
        },
        linkedin: {
          message: 'The linkedin is not valid',
          validators: {
              stringLength: {
                  max: 100,
                  message: 'The linkedin must be less than 100 characters long'
                }
          }
        },
        twitter: {
          message: 'The twitter is not valid',
          validators: {
              stringLength: {
                  max: 100,
                  message: 'The twitter must be less than 100 characters long'
                }
          }
        },
        github: {
          message: 'The github is not valid',
          validators: {
              stringLength: {
                  max: 100,
                  message: 'The github must be less than 100 characters long'
                }
          }
        },
        gplus: {
          message: 'The gplus is not valid',
          validators: {
              stringLength: {
                  max: 100,
                  message: 'The gplus must be less than 100 characters long'
                }
          }
        }*/
      }
    })
      .on('success.form.bv', function(e){
        // Prevent form submission
        e.preventDefault();

        var frm = $(target.e);
        var frmdata = frm.serializeArray();
        //console.log(frmdata);
        var boxes = $(":checkbox:checked");
        var causes = new Array();

        for(var i=0;i < boxes.length; i++)
            causes.push(boxes[i].defaultValue);
        //console.log(causes);
        var acc = {
            address: {
              address: frmdata[0].value,
              municipality: frmdata[1].value,
              district: frmdata[2].value
            },
            workplace: frmdata[3].value,
            cv: frmdata[4].value,
            networks:{
              skype: frmdata[5].value,
              facebook: frmdata[6].value,
              flickr: frmdata[7].value,
              instagram: frmdata[8].value,
              linkedin: frmdata[9].value,
              twitter: frmdata[10].value,
              github: frmdata[11].value,
              gplus:frmdata[12].value
            },
            causes: causes
        };

        //console.log(acc);
          $.ajax({
              url: '/configuser',
              type: 'POST',
              data: {
                email: user,
                account: acc
              },
              datatype: 'json'
          });

        e.preventDefault();

        //TODO alterar os checks na checkbox logo(aceder directamente a bd antes de usar a session)
        //location.reload();
    });
});
