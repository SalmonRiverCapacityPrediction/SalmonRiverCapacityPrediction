const express = require('express'),
    hbs = require('hbs'),
    bodyParser = require('body-parser'),
    request = require('request'),
    _ = require('lodash'),
    calculate = require('./controllers/calculation')
    rivers = require('./models/rivers')
const port = process.env.PORT || 8080;

let app = express();
let currentRiver = {
    "riverName": '',
    "riverInformation": {}
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

app.get('/calculateN', (request, response) => {
    let riverList = new rivers.Rivers()
    riverList.loadFromDirectory('./data').then((result) => {
        console.log(result)
        let n = riverList.calculateN('Alouette', 'North');
        //console.log("Calculate population: ", riverList.calculateN2("Alouette","North"));
        response.send(n.toString())
        do_fetching();
    })
});

app.get('*', function(request, response){
    response.render('404.hbs');
});

app.post('/getBranchList', (request, response) => {
    let riverName = request.body.riverName;
    let riverList = new rivers.Rivers();
    riverList.loadFromDirectory('./data').then((result) => {
        if (riverName in riverList.riverList) {
            currentRiver = {
                'riverName': riverName,
                'riverinformation': riverList.riverList[riverName]
            }
            response.send(JSON.stringify(currentRiver))
        }
        else response.sendStatus(500)
    })
})

app.post('/getRiverList', (request, response) => {
    let riverList = new rivers.Rivers()
    riverList.loadFromDirectory('./data').then((result) => {
        let riverArray = riverList.getRiverList();
        response.send(riverArray)
    })
})

app.post('/updateBranchData', (request, response) => {
    console.log(request.body)
    response.send(200)
})

app.post('/calculateBranchImpact', (request, response) => {
    let riverName = decodeURIComponent(request.body.riverName);
    let branchName = decodeURIComponent(request.body.branchName);
    let riverList = new rivers.Rivers()
    console.log(riverName, branchName)
    riverList.loadFromDirectory('./data').then((result) => {
        riverList.calculateBranchImpact(riverName, branchName).then((result) => {
            response.send(JSON.stringify(result))
        }).catch((error) => {
            console.log(error)
        })
    })
})

app.post('/saveRiver', (request, response) => {
    //Save data as JSON object. Populate the branches.
    //Readfile first, add data then.
    //Convert branches to array
    var newData = {
            "riverName" : request.body.riverName,
            "branches" : {}
    };
    newData["branches"][request.body.streamName] = {
        branchName: request.body.streamName,
        "sweeps": [5, 3, 3]
    }

    let riverList = new rivers.Rivers();
    riverList.loadFromDirectory('./data').then((result) => {
        riverList.saveRiverToFile(request.body.riverName, newData)
        response.render('index.hbs')
    })
    
});

app.listen(port, () => {
    console.log(`Server is up on port 8080`);
});