# How to install:
1. Download
1. Open terminal in directory
1. Run "npm install"
1. Run "node app.js"
1. Open a browser and access the algorithm using the following syntax:
    1. localhost:8080/calculateRiverImpact?river={river name}
    1. localhost:8080/calculateMultipleRiversImpact?river={river name 1}&river={river name 2}&river={river name 3}...

A list of rivers and their attributes can befound at "/data/Rivers.json"

# Examples:
Closing one river:
localhost:8080/calculateRiverImpact?river=Thompson%20River
Closing multiple rivers:
localhost:8080/calculateMultipleRiversImpact?river=Thompson%20River&river=Kanaka%20Creek