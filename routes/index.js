app = require('../app');
auth = require('./authenticate');
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

app.post('/register',auth.reg);

app.get('/', function(req, res) {
  res.render(
    'index',
    {
      partials:
      {
        header: 'header',
        footer: 'footer',
        scripts: 'scripts'
      }
    }
  );
});

app.get('/signin', function(req, res) {
  res.render(
    'signin',
    {
      partials:
      {
        header: 'header',
        footer: 'footer'
      }
    }
  );
});
