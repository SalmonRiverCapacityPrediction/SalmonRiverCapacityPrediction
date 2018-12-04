branchListWrapper = document.getElementById('branchListWrapper')

let getRiverDetail = (riverName) => {
    serverRequest('POST', '/getRiverDetail', `riverName=${riverName}`, (xmlhttp) => {
        
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let river = JSON.parse(xmlhttp.responseText);

            let displayString = ''
            displayString += `\t\t<h3>${decodeURIComponent(riverName)} - Population: ${river.riverPopulation}</h3>\n`;

            // Display Branches in Cards:
            displayString += `\t\t<div class="card blue-grey darken-1">\n`;
                displayString += `\t\t\t<form id="riverForm">\n`;
                    displayString += `\t\t\t<div class="card-content white-text">\n`;
                        displayString += `\t\t\t\t<div class="row">\n`;
                            displayString += `\t\t\t\t\t<div class="input-field col s12">\n`;
                                displayString += `\t\t\t\t\t\t<input style="color: white;" type="text" id='riverName' name='riverName' value="${river.riverName}" placeholder="Enter the name of the river" />\n`;
                                displayString += `\t\t\t\t\t\t<label for="riverName">River Name</label>\n`;
                            displayString += `\t\t\t\t\t</div>\n`;
                        displayString += `\t\t\t\t</div>\n`;

                        displayString += `\t\t\t\t<div class="row">\n`;
                            displayString += `\t\t\t\t\t<div class="input-field col s12">\n`;
                                displayString += `\t\t\t\t\t\t<textarea style="color: white;" id="description" name="description" class="materialize-textarea">${river.description}</textarea>\n`;
                                displayString += `\t\t\t\t\t\t<label for="description">Description</label>\n`;
                            displayString += `\t\t\t\t\t</div>\n`;
                        displayString += `\t\t\t\t</div>\n`;

                        // Display Sweeps:
                        
                        displayString += `\t\t\t\t<div class="row">\n`;
                        for (let k = 0; k < river.sweeps.length; k++) {
                            displayString += `\t\t\t\t\t<div class="input-field col s12 m10">\n`;
                                displayString += `\t\t\t\t\t\t<input style="color: white;" type="number" id="sweep${k + 1}" name="sweep${k + 1}" value="${river.sweeps[k]}" placeholder="Number of fish caught this sweep" />\n`;
                                displayString += `\t\t\t\t\t\t<label for="sweep${k + 1}">Sweep ${k + 1}</label>\n`;
                            displayString += `\t\t\t\t\t</div>\n`;
                            displayString += `\t\t\t\t\t<div class="col s12 m2"><a class="waves-effect waves-light btn"><i class="material-icons">delete</i></a></div>\n`;
                        }
                        displayString += `\t\t\t\t</div>\n`;

                    displayString += `\t\t\t</div>\n`;
                displayString += `\t\t\t</form>\n`;

                displayString += `\t\t\t<div class="card-action">\n`;
                    displayString += `\t\t\t\t<a class="waves-effect waves-light btn" onClick="updateRiverData('riverForm');"><i class="material-icons left">save</i>Save</a>\n`;
                    displayString += `\t\t\t\t<a class="waves-effect waves-light btn"><i class="material-icons left">delete</i>Delete</a>\n`;
                    displayString += `\t\t\t\t<a class="waves-effect waves-light btn" onClick="calculateRiverImpact('${encodeURIComponent(riverName)}')"><i class="material-icons left">rate_review</i>Impact</a>\n`;
                displayString += `\t\t\t</div>\n`;
            displayString += `\t\t</div>\n`;
            branchListWrapper.innerHTML = displayString
            M.updateTextFields();
            M.textareaAutoResize($(`#description`));
        }
    });
}

let updateBranchData = (formName) => {
    let form = document.getElementById(formName)
    console.log(form)
    let formData = new FormData(form)
    console.log(formData.getAll())
}

let calculateRiverImpact = (riverName, branchName) => {
    serverRequest('POST', '/calculateRiverImpact', `riverName=${riverName}`, (xmlhttp) => {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let result = JSON.parse(xmlhttp.responseText)
            console.log(result)
            swal(JSON.stringify(result, null, 4))
        }
    })
}

getRiverDetail('River 1');

