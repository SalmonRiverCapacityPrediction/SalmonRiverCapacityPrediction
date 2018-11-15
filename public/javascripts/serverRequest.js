/**
 * @module
 */

/**
 * @summary Helper function to send HTTP requests
 * @function
 * @public
 *
 * @param method
 * @param url
 * @param requestString
 * @param callback
 */
let serverRequest = (method, url, requestString, callback) => {
  let xmlhttp = new XMLHttpRequest()
  xmlhttp.open(method, url, true)
  xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
  xmlhttp.onreadystatechange = () => {
    callback(xmlhttp)
  }
  xmlhttp.send(requestString)
}
