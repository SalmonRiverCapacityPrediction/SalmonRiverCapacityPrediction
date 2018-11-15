const fs = require('fs');

var checkRiverName = (data) => {
    var river_name = data[0].river_name;
    var name_found = false;
    fs.readFile("./models/streams.json", (err, result) => {
        if (err) throw err;
        var json = JSON.parse(result);
        for(i = 0;i<json.length;i++){
            if (json[i].river_name==river_name){
                var new_data = data[0].branches;
                json[i].branches.push(new_data);
                fs.writeFileSync(".json", JSON.stringify(json));
                name_found = true;
                break;
            }
        }
        if (!name_found) {
            json.push(data);
            fs.writeFileSync("./models/streams.json", JSON.stringify(json))            
        }
    });
}