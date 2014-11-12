/* Form field validation on the edition of a users configuration */
$(document).ready(function(){

  $("#editInfo").bootstrapValidator(
    {
      message: "This form is not valid",
      feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
      },
      fields:{
        orgName: {
            message: 'The organization name is not valid',
            validators: {
                stringLength: {
                    min: 6,
                    max: 30,
                    message: 'The organization name must be more than 6 and less than 30 characters long'
                },
                regexp: {
                    regexp: /^[^0-9]+$/,
                    message: 'The organization name can only consist of alphabetical and number'
                }
            }
        },
        website: {
                validators: {
                    uri: {
                        message: 'The website address is not valid'
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
        about: {
            message: 'The about is not valid',
            validators: {
                stringLength: {
                    max: 350,
                    message: 'The about section must be less than 350 characters long'
                }
            }
        },
        image1: {
                validators: {
                    uri: {
                        message: 'The image address is not valid'
                    }
                }
        },
        image2: {
                validators: {
                    uri: {
                        message: 'The image address is not valid'
                    }
                }
        },
        image3: {
                validators: {
                    uri: {
                        message: 'The image address is not valid'
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
      .on('success.form.bv', function(e){

        e.preventDefault();

        var frm = $(e.target);
        var frmdata = frm.serializeArray();

        var boxes = $(":checkbox:checked");
        var causes = [];

        for(var i=0;i < boxes.length; i++)
            causes.push(boxes[i].defaultValue);
        //console.log(causes);
        var acc = {
            name: frmdata[0].value,
            website: frmdata[1].value,
            address: {
              address:  frmdata[2].value,
              municipality: frmdata[3].value,
              district: frmdata[4].value
            },
            images:[frmdata[6].value,frmdata[7].value,frmdata[8].value],
            about: frmdata[5].value,
            networks:{
              skype: frmdata[9].value,
              facebook: frmdata[10].value,
              flickr: frmdata[11].value,
              instagram: frmdata[12].value,
              linkedin: frmdata[13].value,
              twitter: frmdata[14].value,
              github: frmdata[15].value,
              gplus:frmdata[16].value
            },
            causes: causes
        };
        $.ajax({
              url: '/configorg',
              type: 'POST',
              data: {
                account: acc
              },
              datatype: 'json'
          });

        e.preventDefault();
        swal({allowOutsideClick:true,title: "Done!",text:"Account updated with success.", type:"success"});
    });
});
