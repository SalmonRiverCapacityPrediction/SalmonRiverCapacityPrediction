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

    getRiverList() {
        return Object.keys(this.riverList);
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
        let population = 0;
        let x = 0;
        let k = 0;
        let p = 0;
        let t = 0;
        for (let i = 0; i < this.riverList[riverName].branches[branchName].sweeps.length; i++) {
            k = i;
            t = this.riverList[riverName].branches[branchName].sweeps[i];
            x = x + t
            p = (-k*3*t*x + k*3*3*x)/(k*3*x*x - 3*3*x*x)
            // console.log('sweep ' + i + ': ' + p)
            // var populationSize = calculate.nNumber(k, t, x);
            // console.log(populationSize)
        }
        population = (3*t + p*3*x)/(k*p)
        // console.log('N: ' + population)
        return population
    }

    calculateBranchImpact(riverName, branchName) {
        return new Promise((resolve, reject) => {
            if (this.riverList[riverName].branches[branchName] == null) {
                reject ({
                    "error": "No such river or branch in database"
                })
            }
            let branchPopulation = this.calculateN(riverName, branchName);
            let impactOnRiverPopulation = branchPopulation/this.riverList[riverName].riverPopulation;
            let connectedBranches = this.riverList[riverName].branches[branchName].connections;
            let impactOnConnectedBranches = {};
            if (connectedBranches.length == 0) {
                resolve ({
                    "riverName": riverName,
                    "branchName": branchName,
                    "lostBranchPopulation": branchPopulation,
                    "impactOnRiverPopulation": (impactOnRiverPopulation*100).toPrecision(4) + '%',
                    "impactOnConnectedBranches": impactOnConnectedBranches
                });
            }
            for (let i = 0; i < connectedBranches.length; i++) {
                let connectedBranchPopulation = this.calculateN(riverName, connectedBranches[i]);
                if (branchPopulation/(branchPopulation + connectedBranchPopulation) < 0.025) {
                    impactOnConnectedBranches.push(0);
                } else {
                    impactOnConnectedBranches[connectedBranches[i]] = connectedBranchPopulation*(branchPopulation/(branchPopulation + connectedBranchPopulation));
                }
                if (i == connectedBranches.length - 1) {
                    resolve ({
                        "riverName": riverName,
                        "branchName": branchName,
                        "lostBranchPopulation": branchPopulation,
                        "impactOnRiverPopulation": (impactOnRiverPopulation*100).toPrecision(4) + '%',
                        "impactOnConnectedBranches": impactOnConnectedBranches
                    });
                }
            }
        })
    }
}

module.exports = {
    Rivers
}