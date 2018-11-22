let riverListView = document.getElementById('riverListView')

let displayRiverlist = () => {
    serverRequest('POST', '/getRiverList', '',
    (xmlhttp) => {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        let riverList = JSON.parse(xmlhttp.responseText)
        let displayString = '';
        riverList.forEach(river => {
          displayString += '<div class="card blue-grey darken-1">\n'
            displayString += '<div class="card-content white-text" style="padding: 1em">\n'
              displayString += `<a onClick="getBranchList('${encodeURIComponent(river)}');" class="waves-effect waves-light" style="color: white">\n`
                displayString += `<p class="text-flow" style="font-size: 1.25em"> ${river} </p>\n`
              displayString += '</a>\n'
            displayString += '</div>\n'
          displayString += '</div>\n'
        })
        riverListView.innerHTML = displayString;
      }
    })
}

displayRiverlist()