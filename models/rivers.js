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
        }
        population = (3*t + p*3*x)/(k*p)
        return population
    }

    calculateNRedds(L, D50, D84){
        var nRedds = 0;
        nRedds = 100*Math.pow((3.3*Math.pow((L/600),2.3))*1+Math.pow(Math.E,-1.702*((Math.log(115)/Math.log(10)+0.62*Math.log(L/600)/Math.log(10)-Math.log(D50)/Math.log(10))/(Math.log(D84)/Math.log(10)/Math.log(D50)/Math.log(10)))),-1)
        return nRedds;
    }

    calculateParrSurvivingNumber(numberOfEggs,numberOfEggsToSurvive){ //Add E, const for demo purpose
        var E = 0.946;
        var D = numberOfEggs;
        var Dm = numberOfEggsToSurvive; //increase and get worse results
        var P = D/Dm;
        console.log("P is: ",P);
        var eggToParrSurvivingRate = 0.079*Math.pow(P,-0.699)*Math.pow(Math.E,E);
        var parrSurvivedNumber = D*eggToParrSurvivingRate;
        console.log("eggToParrSurvivingRate is: ",eggToParrSurvivingRate);
        console.log("Number of Parr survive: ",D*eggToParrSurvivingRate);
        console.log("Number of Parr died: ", D*(1-eggToParrSurvivingRate));
        return parrSurvivedNumber;
    }

    calculateSmoltsSurvivingRate(){ //Add the number of smolts, and E, and C. They are constants for demo purpose
        var E = 0.48;
        var W = 20 //channel width
        var G = 2//gradient (slope) of the river in percent
        var B = 0.1 //biver damns per km
        var L = 0.02// arc sine square root transformation of the percent of pool in the reach
        var C = (0.4 - 0.0682*Math.log(W) - 0.0330*G + 0.1030*B + 0.2020*L)^2//smolt density
        var smoltSurvivingRate = 0.1361*(Math.log(C))+0.487;
        console.log("smoltSurvivingRate is: ",smoltSurvivingRate);
        return smoltSurvivingRate;
    }

    // calculateAdultSurvivingNumber(){
    //     var mortalityRate = 0.12 //according to the http://www.fraserriverkeeper.ca/600000_farmed_salmon_die_of_disease_in_bc_annually
    //     var marineSurvivingRate = 0.10 //according to the http://library.state.or.us/repository/2011/201108261007475/index.pdf
    //     var adultSalmonNumber = 
    // }

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
                    "impactOnRiverPopulation": impactOnRiverPopulation*100,
                    "impactOnConnectedBranches": impactOnConnectedBranches
                });
            }
            for (let i = 0; i < connectedBranches.length; i++) {
                let connectedBranchPopulation = this.calculateN(riverName, connectedBranches[i]);
                if (branchPopulation/(branchPopulation + connectedBranchPopulation) < 0.025) {
                    impactOnConnectedBranches[connectedBranches[i]] = 0;
                } else {
                    impactOnConnectedBranches[connectedBranches[i]] = connectedBranchPopulation*(branchPopulation/(branchPopulation + connectedBranchPopulation));
                }
                if (i == connectedBranches.length - 1) {
                    resolve ({
                        "riverName": riverName,
                        "branchName": branchName,
                        "lostBranchPopulation": branchPopulation,
                        "impactOnRiverPopulation": impactOnRiverPopulation*100,
                        "impactOnConnectedBranches": impactOnConnectedBranches
                    });
                }
            }
        })
    }


    calculateImpactByClosingMultipleRivers (riverName) {        
        return new Promise((resolve, reject) => {
            let cumulativeImpactOnRiver = 0;
            let cumulativeImpactOnBranches = 0;
            let nRedds = this.calculateNRedds(600,64,84);
            let eggsNumber = nRedds * 3000; //3000 is eggs number
            let nParrs = this.calculateParrSurvivingNumber(eggsNumber*5,eggsNumber); //1st arg: layed eggs; 2nd ard: need to survive
            let smoltsNumber = nParrs*this.calculateSmoltsSurvivingRate();
            console.log(smoltsNumber);
            let mortalityRate = 0.12 //according to the http://www.fraserriverkeeper.ca/600000_farmed_salmon_die_of_disease_in_bc_annually
            let marineSalmonSurvivingRate = 0.10 //according to the http://library.state.or.us/repository/2011/201108261007475/index.pdf
            let adultSalmonNumber = marineSalmonSurvivingRate * smoltsNumber;
            console.log(adultSalmonNumber);
            if (this.riverList[riverName] == null) {
                reject ({
                    "error": "No such river or branch in database"
                })
            }        

            let riverBranches = this.riverList[riverName].branches;
            Object.keys(riverBranches).forEach(branch => {            
                let branchName = riverBranches[branch].branchName;
                this.calculateBranchImpact(riverName,branchName).then((result) => {
                    cumulativeImpactOnRiver+=result.impactOnRiverPopulation;
                    cumulativeImpactOnBranches+=result.lostBranchPopulation
                    if (Object.keys(riverBranches).indexOf(branch) == (Object.keys(riverBranches).length - 1)) {
                        resolve({
                            'cumulativeImpactOnRiver': cumulativeImpactOnRiver,
                            'cumulativeImpactOnBranches': cumulativeImpactOnBranches,
                            "nRedds": nRedds,
                            "smoltsNumber": smoltsNumber,
                            "adultSalmonNumber": adultSalmonNumber
                        })
                    }
                    }).catch((error) => {
                        console.log(error)
                    })
                })
        })
    }
}

module.exports = {
    Rivers
}