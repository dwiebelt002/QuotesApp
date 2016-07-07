var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
var app = express();

//Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(process.cwd() + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'quotes_db'
});



connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    };
    console.log('connected as id ' + connection.threadId);
})


//app.gets lists all quotes on homepage
app.get('/', function(req,res) {
    connection.query('SELECT * FROM quotes;', function(err, data) {
      if (err) throw err;

      res.render('index', {quotes: data});

    });
});


//app.get lists single quote on own page
app.get('/quotes/:num?', function (req, res) {
    var quoteNum = req.params.num;
    connection.query('select * from quotes where id = ?', [quoteNum], function( err, result) {
    if (err) throw err; 
    res.render('single_quote', result[0])

    })
    
})


app.post('/create', function(req,res){
    
    connection.query('INSERT INTO quotes (author, quote) VALUES (?, ?)', [req.body.author, req.body.quote], function(err, result) {
      if (err) throw err;
      res.redirect('/');
    });
});

app.put('/update', function(req,res){
    console.log('id: ' + req.body.id);
    console.log('author: ' + req.body.author);
    console.log('quote: ' + req.body.quote);
    connection.query('UPDATE quotes SET author = ?, quote = ? WHERE id = ?', [req.body.author, req.body.quote, req.body.id], function(err, result) {
      if (err) throw err;
      res.redirect('/');
    });
});


app.delete('/delete', function(req,res){
    
    connection.query('DELETE FROM quotes WHERE id = ?', [req.body.id], function(err, result) {
      if (err) throw err;
      res.redirect('/');
    });
});



//Express and MySQL code should go here//

var port = 3000;
app.listen(port, function() {
    console.log("Listening on PORT " + port);
});