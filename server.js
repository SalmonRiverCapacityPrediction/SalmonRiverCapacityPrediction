const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const hbs = require('hbs');

var app = express();
const port = process.env.PORT || 8080;

hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'hbs');

app.get('/', (request, response) => {
    response.render('index.hbs');
});

app.post('/', (request, response) => {
	console.log('Width is: ',request.body.river_width);
	console.log('Depth is: ',request.body.river_depth);
	response.render('index.hbs', {
                    username: 3
                });
})

app.get('/404', (request, response) => {
    response.send({
        error: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on the port 8080');
});