const fs = require('fs');
const calculate = require('../controllers/calculation');

class Rivers {
    constructor() {
        this.riverList = {}
    }

    loadFromDirectory(directory) {
        return new Promise((resolve, reject) => {
            fs.readdir(directory, (err, files) => {
                if (err) {
                    reject([])
                }
                files.forEach(file => {
                    this.loadFromFile(`./data/${file}`).then((result) => {
                        this.riverList[result.riverName] = result
                        if (Object.keys(this.riverList).length == files.length) resolve(this.riverList)
                    })
                });
            })
        })
    }

    loadFromFile(filePath) {
        return new Promise ((resolve, reject) => {
            fs.readFile(filePath, (err, result) => {
                if (err) reject(err);
                let data = JSON.parse(result);
                resolve(data);
            });
        })
    }

    displayRiverList() {
        let displayString = '';
        Object.keys(this.riverList).forEach(river => {
            displayString += '<div class="card blue-grey darken-1">\n'
            displayString += '<div class="card-content white-text">\n'
            displayString += `<span class="card-title"> ${this.riverList[river].riverName} </span>\n`
            displayString += '</div>\n'
            displayString += '</div>\n'
        })
        return displayString;
    }

    saveRiverToFile(riverName, data) {
        //Go throught the list of files in directory and check if riverName exists
        //If yes -> readFile and append new data
        //IF no ->
        fs.readdir('./data', (err,result) => {
            if (err) throw err;
            else {
                let fileArr = [];
                result.forEach(file => {
                    console.log("FILE: ",file);
                    if(file==riverName+".json"){
                        console.log("Match");
                        let newData = data.branches;
                        console.log(newData);
                        loadFromFile(file).then()
                    }
                    //fileArr.push(file);
                });
            }

        });
        fs.writeFileSync(`./data/${riverName}.json`, JSON.stringify(data, null, 4));
    }

    calculateN(riverName, branchName) {
        // let culmulativeFishCount = 0
        // for (let i = 1; i <= this.riverList[riverName].branches[branchName].sweeps.length; i++) {
        //     let k = i;
        //     let t = this.riverList[riverName].branches[branchName].sweeps[i - 1];
        //     let x = culmulativeFishCount + t
        //     var populationSize = calculate.nNumber(k, t, x);
        //     console.log(populationSize)
        // }
        // return populationSize
        let culmulativeFishCount = 0
        for (let i = 1; i <= this.riverList[riverName].branches[branchName].sweeps.length; i++) {
            let k = i;
            let t = this.riverList[riverName].branches[branchName].sweeps[i - 1];
            let x = culmulativeFishCount + t
            var populationSize = calculate.nNumber(k, t, x);
            console.log(populationSize)
        }
        return populationSize
    }
}

module.exports = {
    Rivers
}