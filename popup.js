document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#bananas').addEventListener('click', onclick, false)

  function onclick() {
    chrome.tabs.query({ currentWindow: true, active: true },
      function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, 'hi')
      });
  }
}, false)

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#queryData').addEventListener('click', onclick, false)
  function onclick() {
    chrome.tabs.query({ currentWindow: true, active: true },
      function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, 'queryData')
      });
  }
}, false)

function submitHandler(event) {
  const form = event.target
  console.log(form)
  const formData = new FormData(form)
  console.log('array of entries', [...formData.entries()])
  console.log('event: ', event)
  event.preventDefault()
}
const formElement = document.getElementById('procedureForm')
formElement.addEventListener('submit', submitHandler)
