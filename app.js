const express = require('express'),
    hbs = require('hbs'),
    bodyParser = require('body-parser'),
    request = require('request'),
    _ = require('lodash');
var fs = require('fs');
var calculate = require('./calculation.js')
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

app.post('/stream_results', (request, response) => {
    console.log('river_name is: ',request.body.river_name);
    console.log('stream_name is: ',request.body.stream_name);
    console.log('sweep_number is: ',request.body.sweep_number);
    console.log('fish_caught is: ',request.body.fish_caught);
    console.log('cumulative_number is: ',request.body.cumulative_number);
    var river_name = request.body.river_name;
    var sweep_number = request.body.sweep_number;
    var fish_caught = request.body.fish_caught;
    var cumulative_number = request.body.cumulative_number;
    var stream_name = request.body.stream_name;
    var user_data = [{
            "river_name" : river_name,
            "branches" : [{
            "stream_name": stream_name,
            "sweep_number": sweep_number,
            "fish_caught": fish_caught,
            "cumulative_number": cumulative_number
        }]        
    }];

    //save_data_to_file(user_data);
    check_river_name(user_data);
    response.render('index.hbs');
});

var save_data_to_file = (user_data) => {
    console.log("It works");
    check_river_name(user_data);
    fs.readFile("streams.json", function (err, result) {
        if (err) throw err;
        console.log('reading file');
        var json = JSON.parse(result);
        json.push(user_data);
        console.log(json)
        fs.writeFileSync("streams.json", JSON.stringify(json))
    });
};

var check_river_name = (data) => {
    var river_name = data[0].river_name;
    var name_found = false;
    console.log(river_name);
    fs.readFile("streams.json", (err, result) => {
        if (err) throw err;
        var json = JSON.parse(result);
        for(i = 0;i<json.length;i++){
            if (json[i].river_name==river_name){
                var new_data = data[0].branches;
                console.log(json[i].branches);
                json[i].branches.push(new_data);
                console.log(json);
                fs.writeFileSync("streams.json", JSON.stringify(json));
                name_found = true;
                break;
            }
        }
        if (!name_found) {
            json.push(data);
            console.log(json);
            fs.writeFileSync("streams.json", JSON.stringify(json))            
        }
    });
}

var calculate_n = (river,branch) =>{    
    var k = 0;
    var t = 0;
    var x = 0;
    fs.readFile("streams.json",(err, result) => {
        if (err) throw err;
        var json = JSON.parse(result);
        for(j=0;j<json.length;j++){
            if (json[j].river_name==river){
                //k = json[j].branch
            }
        }
        
    });
    calculate.porbability_of_capture()
}


app.listen(port, () => {
    console.log(`Server is up on port 8080`);
});