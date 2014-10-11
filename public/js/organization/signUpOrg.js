/*Fields verifications for the register process using Bootstrap validator*/

$(document).ready(function() {
    $( "#registerOrgform").bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                message: 'The username is not valid',
                validators: {
                    notEmpty: {
                        message: 'The username is required and cannot be empty'
                    },
                    stringLength: {
                        min: 6,
                        max: 30,
                        message: 'The username must be more than 6 and less than 30 characters long'
                    },
                    regexp: {
                        regexp: /^[^0-9]+$/,
                        message: 'The username can only consist of alphabetical and number'
                    },
                    different: {
                        field: 'password',
                        message: 'The username and password cannot be the same as each other'
                    }
                }
            },
            website: {
                message: 'The website is not valid',
                validators: {
                    notEmpty: {
                        message: 'The website address is required and cannot be empty'
                    },
                    regexp: {
                        regexp: /^.+\.[a-zA-Z]+(\.[a-zA-Z]+)*(\\[a-zA-Z]+)*$/,
                        message: 'The input is not a valid website address'
                    },
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'The email is required and cannot be empty'
                    },
                    emailAddress: {
                        message: 'The input is not a valid email address'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'The password is required and cannot be empty'
                    },
                    different: {
                        field: 'username',
                        message: 'The password cannot be the same as username'
                    },
                    stringLength: {
                        min: 8,
                        message: 'The password must have at least 8 characters'
                    }
                }
            },
            password_confirmation: {
              triger:'focus blur',
                validators: {
                    notEmpty: {
                        message: 'The confirmation password is required and cannot be empty'
                    },
                    identical: {
                        field: 'password',
                        message: 'The password confirmation must be the same as the password'
                    }
                }
            },
            address: {
                message: 'The address is not valid',
                validators: {
                    notEmpty: {
                        message: 'The address is required and cannot be empty'
                    },
                    stringLength: {
                        max: 150,
                        message: 'The address must be  less than 150 characters long'
                    },
                }
            },
            municipality: {
                message: 'The municipality is not valid',
                validators: {
                    notEmpty: {
                        message: 'The municipality is required and cannot be empty'
                    },
                    stringLength: {
                        max: 100,
                        message: 'The municipality must be less than 100 characters long'
                    },
                }
            },
            district: {
                message: 'The district is not valid',
                validators: {
                    notEmpty: {
                        message: 'The district is required and cannot be empty'
                    },
                    stringLength: {
                        max: 100,
                        message: 'The district must be less than 100 characters long'
                    },
                }
            },
            about: {
                message: 'The about is not valid',
                validators: {
                    stringLength: {
                        max: 350,
                        message: 'The about must be less than 350 characters long'
                    },
                }
            },
            birthdate: {
                validators: {
                    notEmpty: {
                        message: 'The birthdate is required and cannot be empty'
                    }
                }
            }
        }
    })
        .on('success.form.bv', function(e) {
            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            var $form = $(e.target);
            var account;
            var frmdata = $form.serializeArray();

            var temp_causes=[];
            for(var i=0;i<frmdata.length;i++){
              if(frmdata[i].name==="volunteeringInterestsParam"){
                temp_causes.push(frmdata[i].value);
              }
            }

            account = {
                name: frmdata[0].value,
                email: frmdata[1].value,
                website: frmdata[2].value,
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


            // Get the BootstrapValidator instance
            var bv = $form.data('bootstrapValidator');

            // Use Ajax to submit form data
            $.post('/register', account, function(result) {
                event.preventDefault();
                location.reload();
            }, 'json');
        });
});
