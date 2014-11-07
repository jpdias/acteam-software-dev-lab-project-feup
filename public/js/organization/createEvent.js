/* Form field validation on the creation of events*/

$(document).ready(function(){
  $("#createEvent").bootstrapValidator(
    {
      message: "This form is not valid",
      feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
      },
      fields:{
        name: {
            message: 'The event name is not valid',
            validators: {
                notEmpty: {
                    message: 'The event name is required'
                },
                stringLength: {
                    max: 50,
                    message: 'The event name must be less than 50 characters long'
                },
            }
        },
        startDate: {
            validators: {
                notEmpty: {
                    message: 'The startDate is required'
                },
                callback: {
                    message: 'The startDate is not in the range',
                    callback: function(value, validator) {
                        var m = new moment(value, 'DD/MM/YYYY', true);
                        if (!m.isValid()) {
                            return false;
                        }
                        // Check if the date in our range
                        return m.isAfter(moment().format('L'));
                    }
                }
            }
        },
        endDate: {
            validators: {
                notEmpty: {
                    message: 'The endDate is required'
                },
                callback: {
                    message: 'The endDate is not in the range',
                    callback: function(value, validator) {
                        var m = new moment(value, 'DD/MM/YYYY', true);
                        if (!m.isValid()) {
                            return false;
                        }
                        // Check if the date in our range
                        return m.isAfter(moment().format('L'));
                    }
                }
            }
        },
        description: {
            message: 'The description is not valid',
            validators: {
                notEmpty: {
                    message: 'The description is required'
                },
                stringLength: {
                    max: 350,
                    message: 'The description must be less than 350 characters long'
                },
            }
        },
        address: {
            message: 'The address is not valid',
            validators: {
                stringLength: {
                    max: 150,
                    message: 'The address must be  less than 150 characters long'
                },
            }
        },
        municipality: {
            message: 'The municipality is not valid',
            validators: {
                stringLength: {
                    max: 100,
                    message: 'The municipality must be less than 100 characters long'
                },
            }
        },
        district: {
          message: 'The district is not valid',
          validators: {
              stringLength: {
                  max: 100,
                  message: 'The district must be less than 100 characters long'
              },
          }
        }
      }
    }
  );
});
