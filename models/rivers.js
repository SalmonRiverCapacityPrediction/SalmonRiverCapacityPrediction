const fs = require('fs');
const calculate = require('../controllers/calculation');

class Rivers {
    constructor() {
        this.riverList = {}
    }

    loadFromFile(filePath) {
        return new Promise ((resolve, reject) => {
            fs.readFile(filePath, (err, result) => {
                if (err) reject(err);
                let data = JSON.parse(result);
                this.riverList = data.riverList;
                resolve(data);
            });
        })
    }

    getRiverList() {
        return Object.keys(this.riverList);
    }

    // saveRiverToFile(riverName, data) {
    //     fs.readdir('./data', (err,result) => {
    //         if (err) throw err;
    //         else {
    //             let fileArr = [];
    //             result.forEach(file => {
    //                 console.log("FILE: ",file);
    //                 if(file==riverName+".json"){
    //                     console.log("Match");
    //                     let newData = data.branches;
    //                     console.log(newData);
    //                     loadFromFile(file).then()
    //                 }
    //             });
    //         }

    //     });
    //     fs.writeFileSync(`./data/${riverName}.json`, JSON.stringify(data, null, 4));
    // }

    calculateN(riverName) {
        let population = 0;
        let x = 0;
        let k = 0;
        let p = 0;
        let t = 0;
        for (let i = 0; i < this.riverList[riverName].sweeps.length; i++) {
            k = i;
            t = this.riverList[riverName].sweeps[i];
            x = x + t
            p = (-k*3*t*x + k*3*3*x)/(k*3*x*x - 3*3*x*x)
        }
        population = (3*t + p*3*x)/(k*p)
        return population
    }

    calculateNRedds(river){
        var nRedds = 0;
        let L = river.fishLength;
        let D50 = river.D50;
        let D84 = river.D84
        nRedds = 100*Math.pow((3.3*Math.pow((L/600),2.3))*1+Math.pow(Math.E,-1.702*((Math.log(115)/Math.log(10)+0.62*Math.log(L/600)/Math.log(10)-Math.log(D50)/Math.log(10))/(Math.log(D84)/Math.log(10)/Math.log(D50)/Math.log(10)))),-1)
        console.log('Redd Number: ' + nRedds)
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
        var E = 0.946;
        var C = 20;
        var smoltSurvivingRate = 0.1361*(Math.log(C)/Math.log(Math.E))+0.487+E;
        console.log("smoltSurvivingRate is: ",smoltSurvivingRate);
        return smoltSurvivingRate;
    }

    calculateRiverImpact(riverName) {
        return new Promise((resolve, reject) => {

            let result = {
                currentFishPopulation: 0,
                impactOnConnectedRivers: {}
            };

            if (this.riverList[riverName] == null) {
                reject ({
                    "error": "No such river or branch in database"
                })
            }

            let riverPopulation = this.calculateN(riverName);
            let connectedRivers = this.riverList[riverName].connections;
            let impactOnConnectedBranches = {};
            console.log(this.riverList[riverName])

            let eggIncreaseFromClosingRiverToConnectedRivers = ((riverPopulation/3)*3000)/this.riverList[riverName].connections.length;

            connectedRivers.forEach(connectedRiverName => {
                let connectedRiver = this.riverList[connectedRiverName];
                let numberOfReeds = this.calculateNRedds(connectedRiver);
                let eggLimit = numberOfReeds * 3000; //3000 is eggs number
                let actualEggNumber = (connectedRiver.riverPopulation/3)*3000;
                
                let totalNumberOfEggs = actualEggNumber + eggIncreaseFromClosingRiverToConnectedRivers;
                console.log(totalNumberOfEggs, eggLimit)
                let numberOfLostParrs = this.calculateParrSurvivingNumber(totalNumberOfEggs, eggLimit)
                let numberOfLostSmolts = numberOfLostParrs*this.calculateSmoltsSurvivingRate();

                result.impactOnConnectedRivers[connectedRiver.riverName] = numberOfLostSmolts;

                if(Object.keys(result.impactOnConnectedRivers).length == connectedRivers.length) {
                    resolve(result)
                }
            })


            

            // if (connectedBranches.length == 0) {
            //     resolve ({
            //         "riverName": riverName,
            //         "branchName": branchName,
            //         "lostBranchPopulation": branchPopulation,
            //         "impactOnRiverPopulation": impactOnRiverPopulation*100,
            //         "impactOnConnectedBranches": impactOnConnectedBranches
            //     });
            // }
            // for (let i = 0; i < connectedBranches.length; i++) {
            //     let connectedBranchPopulation = this.calculateN(connectedBranches[i]);
            //     if (branchPopulation/(branchPopulation + connectedBranchPopulation) < 0.025) {
            //         impactOnConnectedBranches[connectedBranches[i]] = 0;
            //     } else {
            //         impactOnConnectedBranches[connectedBranches[i]] = connectedBranchPopulation*(branchPopulation/(branchPopulation + connectedBranchPopulation));
            //     }
            //     if (i == connectedBranches.length - 1) {
            //         resolve ({
            //             "riverName": riverName,
            //             "branchName": branchName,
            //             "lostBranchPopulation": branchPopulation,
            //             "impactOnRiverPopulation": impactOnRiverPopulation*100,
            //             "impactOnConnectedBranches": impactOnConnectedBranches
            //         });
            //     }
            // }
        })
    }


    // calculateCumulativeRiverImpact (riverName) {        
    //     return new Promise((resolve, reject) => {
    //         let cumulativeImpact = 0;
    //         let nRedds = this.calculateNRedds(riverName);
    //         let eggLimit = nRedds * 3000; //3000 is eggs number
    //         let nParrs = this.calculateParrSurvivingNumber(eggLimit*5,eggLimit); //1st arg: layed eggs; 2nd ard: need to survive
    //         let smoltsNumber = nParrs*this.calculateSmoltsSurvivingRate();
    //         if (this.riverList[riverName] == null) {
    //             reject ({
    //                 "error": "No such river or branch in database"
    //             })
    //         }        

    //         Object.keys(this.riverList[riverName]).forEach(river => {            
    //             this.calculateRiverImpact(river.riverName).then((result) => {
    //                 cumulativeImpact += result.impactOnRiverPopulation;                              
    //                 console.log("Cumulative Impact in percents: ", cumulativeImpact);
    //                 console.log("Cumulative Impact in fish number: ", cumulativeImpactOnBranches);
    //                 if (Object.keys(riverlist).indexOf(river) == (Object.keys(riverList).length - 1)) {
    //                     resolve({
    //                         'cumulativeImpact': cumulativeImpact,
    //                         "nRedds": nRedds,
    //                         "smoltsNumber": smoltsNumber
    //                     })
    //                 }
    //                 }).catch((error) => {
    //                     console.log(error)
    //                 })
    //             })
    //     })
    // }
}

module.exports = {
    Rivers
}