branchListWrapper = document.getElementById('branchListWrapper')

let getBranchList = (riverName) => {
    serverRequest('POST', '/getBranchList', `riverName=${riverName}`, (xmlhttp) => {
        
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            let riverObject= JSON.parse(xmlhttp.responseText);
            let riverInformation = riverObject.riverinformation;
            let branches = riverInformation.branches

            let displayString = ''
            displayString += `\t\t<h3>${riverName}</h3>\n`;

            // Display Branches in Cards:

            for (let j = 0; j < Object.keys(branches).length; j++) {
                displayString += `\t\t<div class="col s12 m6" style="padding: 1">\n`;
                let branch = branches[Object.keys(branches)[j]];

                displayString += `\t\t<div class="card blue-grey darken-1">\n`;
                    displayString += `\t\t\t<form id="branch${j + 1}Form">\n`;
                        displayString += `\t\t\t<div class="card-content white-text">\n`;
                            displayString += `\t\t\t\t<div class="row">\n`;
                                displayString += `\t\t\t\t\t<div class="input-field col s12">\n`;
                                    displayString += `\t\t\t\t\t\t<input style="color: white;" type="text" id='branch${j + 1}' name='branch${j + 1}' value="${branch.branchName}" placeholder="Enter the name of the branch" />\n`;
                                    displayString += `\t\t\t\t\t\t<label for="branchName">Branch Name</label>\n`;
                                displayString += `\t\t\t\t\t</div>\n`;
                            displayString += `\t\t\t\t</div>\n`;

                            displayString += `\t\t\t\t<div class="row">\n`;
                                displayString += `\t\t\t\t\t<div class="input-field col s12">\n`;
                                    displayString += `\t\t\t\t\t\t<textarea style="color: white;" id="branchDescription${j + 1}" name="branchDescription${j + 1}" class="materialize-textarea">${branch.description}</textarea>\n`;
                                    displayString += `\t\t\t\t\t\t<label for="branchDescription${j + 1}">Description</label>\n`;
                                displayString += `\t\t\t\t\t</div>\n`;
                            displayString += `\t\t\t\t</div>\n`;

                            // Display Sweeps:
                            
                            displayString += `\t\t\t\t<div class="row">\n`;
                            for (let k = 0; k < branch.sweeps.length; k++) {
                                displayString += `\t\t\t\t\t<div class="input-field col s12">\n`;
                                    displayString += `\t\t\t\t\t\t<input style="color: white;" type="number" id="branch${j + 1}Sweep${k + 1}" name="branch${j + 1}Sweep${k + 1}" value="${branch.sweeps[k]}" placeholder="Number of fish caught this sweep" />\n`;
                                    displayString += `\t\t\t\t\t\t<label for="branch${j + 1}Sweep${k + 1}">Sweep ${k + 1}</label>\n`;
                                displayString += `\t\t\t\t\t</div>\n`;
                            }
                            displayString += `\t\t\t\t</div>\n`;

                        displayString += `\t\t\t</div>\n`;
                    displayString += `\t\t\t</form>\n`;

                    displayString += `\t\t\t<div class="card-action">\n`;
                        displayString += `\t\t\t\t<a class="waves-effect waves-light btn"><i class="material-icons left">add</i>Add a Sweep</a>\n`;
                        displayString += `\t\t\t\t<a class="waves-effect waves-light btn"  onClick="updateBranchData('branch${j + 1}Form');"><i class="material-icons left">save</i>Save</a>\n`;
                        displayString += `\t\t\t\t<a class="waves-effect waves-light btn"><i class="material-icons left">delete</i>Delete</a>\n`;
                    displayString += `\t\t\t</div>\n`;
                displayString += `\t\t</div>\n`;
                displayString += `\t\t</div>\n`;
            }
            branchListWrapper.innerHTML = displayString
            M.updateTextFields();
            for (let j = 0; j < Object.keys(branches).length; j++) {
                M.textareaAutoResize($(`#branchDescription${j + 1}`));
            }
        }
    });
}

let updateBranchData = (formName) => {
    let form = document.getElementById(formName)
    console.log(form)
    let formData = new FormData(form)
    console.log(formData.getAll())
}

getBranchList('Food');

