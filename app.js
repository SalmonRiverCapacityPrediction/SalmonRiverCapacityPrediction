const express = require('express'),
    hbs = require('hbs'),
    bodyParser = require('body-parser'),
    request = require('request'),
    _ = require('lodash');

const port = process.env.PORT || 8080;

let app = express();
let currentUser = {
    "username": '',
    "userScore": 0,
    "currentStreak": 0,
    "highestStreak": 0
};

let currentQuestionList = undefined;

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

hbs.registerHelper('dummy', () => {
    return undefined;
});

app.get('/', (request, response) => {
    response.render('index.hbs');
});

app.get('/leaderboard', (request, response) => {
    response.render('leaderboard.hbs', {
        list_of_user_data: user.getUsers(user.sortScores("scoreData"))
    })
});

app.get('/about', (request, response) => {
    response.render('about.hbs');
});

app.get('*', function(request, response){
    response.render('404.hbs');
});

app.listen(port, () => {
    console.log(`Server is up on port 8080`);
});