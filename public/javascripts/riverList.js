let riverListView = document.getElementById('riverListView')

let displayRiverlist = () => {
    serverRequest('POST', '/getRiverList', '',
    (xmlhttp) => {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        riverListView.innerHTML = xmlhttp.responseText
      }
    })
}

displayRiverlist()