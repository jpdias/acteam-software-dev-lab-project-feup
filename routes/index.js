app = require('../app');
models = require('../models/models');

//Error handling !
app.use(function(req, res, next){
  res.status(404);
  res.send({ error: 'Not found' });
  return;
});

app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.send({ error: err.message });
  return;
});
//End of error handling

app.get('/', function(req, res) {
    res.render('index');
});

app.post('/user', function(req,res) {
  var User = req.body;
  var kitty = new models.Users(User);

  kitty.save(function (err) {
    if (err) // ...
      console.log('meow');
  });
  res.send(200);
});