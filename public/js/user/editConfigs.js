/* Form field validation on the edition of a users configuration */
$(document).ready(function() {

  /*  var oldCauses = "{{causes}}".split(",");
    for(var j=0;j < oldCauses.length; j++)
      document.getElementById(oldCauses[j]).checked = true;
  */

  $("#editInfo").bootstrapValidator({
      message: "This form is not valid",
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
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
        },
        skype: {
          message: 'The skype is not valid',
          validators: {
            stringLength: {
              min: 6,
              message: 'The skype name must be more than 6 characters long'
            },
          }
        },
        facebook: {
          message: 'The facebook is not valid',
          validators: {
            uri: {
              message: 'The facebook address is not valid. The address should be simillar with \'http://teste.com/something\''
            }
          }
        },
        flickr: {
          message: 'The flickr is not valid',
          validators: {
            uri: {
              message: 'The flickr address is not valid. The address should be simillar with \'http://teste.com/something\''
            }
          }
        },
        instagram: {
          message: 'The instagram is not valid',
          validators: {
            uri: {
              message: 'The instagram address is not valid. The address should be simillar with \'http://teste.com/something\''
            }
          }
        },
        linkedin: {
          message: 'The linkedin is not valid',
          validators: {
            uri: {
              message: 'The linkedin address is not valid. The address should be simillar with \'http://teste.com/something\''
            }
          }
        },
        twitter: {
          message: 'The twitter is not valid',
          validators: {
            uri: {
              message: 'The twitter address is not valid. The address should be simillar with \'http://teste.com/something\''
            }
          }
        },
        github: {
          message: 'The github is not valid',
          validators: {
            uri: {
              message: 'The github address is not valid. The address should be simillar with \'http://teste.com/something\''
            }
          }
        },
        gplus: {
          message: 'The gplus is not valid',
          validators: {
            uri: {
              message: 'The gplus address is not valid. The address should be simillar with \'http://teste.com/something\''
            }
          }
        }
      }
    })
    .on('success.form.bv', function(e) {
      // Prevent form submission
      e.preventDefault();

      var frm = $('#editInfo');
      var frmdata = frm.serializeArray();
      //console.log(frmdata);
      var boxes = $(":checkbox:checked");
      var causes = [];

      for (var i = 0; i < boxes.length; i++)
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
        networks: {
          skype: frmdata[5].value,
          facebook: frmdata[6].value,
          flickr: frmdata[7].value,
          instagram: frmdata[8].value,
          linkedin: frmdata[9].value,
          twitter: frmdata[10].value,
          github: frmdata[11].value,
          gplus: frmdata[12].value
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
        datatype: 'json',
        success: function(message) {
          if (message.success) {
            swal({
              allowOutsideClick: true,
              title: "Done!",
              text: "Account updated with success.",
              type: "success"
            });
          }
          else {
            swal({
              allowOutsideClick: true,
              title: "Fail!",
              text: "An error occured, account unsuccessfully updated.",
              type: "error"
            });
          }
        }
      });

      e.preventDefault();

      //location.reload();
    });
});
