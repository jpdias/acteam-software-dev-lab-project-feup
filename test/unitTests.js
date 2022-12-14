var request = require('supertest'),
  express = require('express'),
  expect = require('chai').expect;

var server = request.agent('http://localhost');

var app = express();

var request1 = request('http://localhost');

//Login de uma conta de tipo Member
function loginUser() {
  return function(done) {
    server
      .get('/login')
      .send({
        username: 'jpdias@live.com',
        password: '123456789'
      })
      .expect(200)
      .end(onResponse);

    function onResponse(err, res) {
      if (err) return done(err);
      return done();
    }
  };
}

//Login de uma conta de tipo Organization
function loginOrg() {
  return function(done) {
    server
      .get('/login')
      .send({
        username: 'teste@teste.com',
        password: '123456789'
      })
      .expect(200)
      .end(onResponse);

    function onResponse(err, res) {
      if (err) return done(err);
      return done();
    }
  };
}

//------------------------ Testes que precisam de conta iniciada (logged in)  ----------------------------------//

describe('GET /profileuser', function() {
  it('login', loginUser());
  it('uri that requires user to be logged in', function(done) {
    server
      .get('/profileuser')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });
});

describe('GET /userhistory', function() {
  it('login', loginUser());
  it('uri that requires user to be logged in', function(done) {
    server
      .get('/userhistory')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });
});

describe('GET /configureuser', function() {
  it('login', loginUser());
  it('uri that requires user to be logged in', function(done) {
    server
      .get('/configureuser')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });
});

describe('GET /profileorg', function() {
  it('login', loginUser());
  it('uri that requires user to be logged in', function(done) {
    server
      .get('/profileorg?org=AMI Portugal')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });
});

describe('GET /events', function() {
  it('login', loginOrg());
  it('uri that requires user to be logged in', function(done) {
    server
      .get('/events')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });
});

describe('GET /configureorg', function() {
  it('login', loginOrg());
  it('uri that requires user to be logged in', function(done) {
    server
      .get('/configureorg')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });
});

describe('GET /searchorg', function() {
  it('login', loginUser());
  it('uri that requires user to be logged in', function(done) {
    server
      .get('/searchorg')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });
});

describe('GET /searchorg', function() {
  it('login', loginOrg());
  it('uri that requires user to be logged in', function(done) {
    server
      .get('/searchorg')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });
});

describe('GET /searchuser', function() {
  it('login', loginOrg());
  it('uri that requires user to be logged in', function(done) {
    server
      .get('/searchuser')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });
});

describe('GET /recruitment', function() {
  it('login', loginOrg());
  it('uri that requires user to be logged in', function(done) {
    server
      .get('/recruitment')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });
});

describe('GET /members', function() {
  it('login', loginOrg());
  it('uri that requires user to be logged in', function(done) {
    server
      .get('/members')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });
});

describe('POST /configuser', function() {
  it('login', loginUser());
  it('uri that requires user to be logged in', function(done) {
    server
      .post('/configuser')
      .type('form')
      .send({
        email: "jpdias@live.com",
        account: {
          address: "Porto"
        }
      })
      .end(function(err, res) {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.text).to.contain('{\n  "success": true,\n  "message": "sucess"\n');
        done();
      });

  });
});

//------------------------ Testes que n??o precisam de conta iniciada (logged in)  ----------------------------------//

describe('GET /', function() {
  it('login', loginOrg());
  it('uri that requires user to be logged in', function(done) {
    request1
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });
});

describe('GET /profileuser', function() {
  it('login', loginOrg());
  it('uri that requires user to be logged in', function(done) {
    request1
      .get('/profileuser')
      .expect(500)
      .expect('Content-Type', /html/)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });
});

describe('GET /signin', function() {
  it('login', loginOrg());
  it('uri that requires user to be logged in', function(done) {
    request1
      .get('/signin')
      .expect(200)
      .expect('Content-Type', /html/)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });
});

describe('GET /registerorg', function() {
  it('login', loginOrg());
  it('uri that requires user to be logged in', function(done) {
    request1
      .get('/registerorg')
      .expect(200)
      .expect('Content-Type', /html/)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });
});

describe('GET /searchorg', function() {
  it('login', loginOrg());
  it('uri that requires user to be logged in', function(done) {
    request1
      .get('/searchorg')
      .expect(500)
      .expect('Content-Type', /html/)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });
});

describe('GET /searchuser', function() {
  it('login', loginOrg());
  it('uri that requires user to be logged in', function(done) {
    request1
      .get('/searchuser')
      .expect(500)
      .expect('Content-Type', /html/)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });
});

describe('GET /members', function() {
  it('login', loginOrg());
  it('uri that requires user to be logged in', function(done) {
    request1
      .get('/members')
      .expect(500)
      .expect('Content-Type', /html/)
      .end(function(err, res) {
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });
});