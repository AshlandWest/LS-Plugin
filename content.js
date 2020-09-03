const currentURL = window.location.href;
const rootDomain = window.location.hostname;

// always resolves to true? troubleshoot me!!!
isInDevelopment = () => {
  if (rootDomain === 'www.freewaysites.com') return true
  if (rootDomain === 'www.pbhssites.com') return true
  return false;
}

developmentFilter = (domain) => {
  pathArray = window.location.pathname.split('/')
  return `${domain}/${pathArray[1]}`
}

const workingDomain = isInDevelopment() ? developmentFilter(rootDomain) : window.location.hostname;


chrome.runtime.onMessage.addListener(function (request) {
  if (request === 'hi') {
    alert(request);
  }
})

chrome.runtime.onMessage.addListener(function (request) {
  if (request === 'queryData') {
    try {
      if (document.querySelector('[itemprop="copyrightHolder"]')) {
        if (document.querySelector('[itemprop="copyrightHolder"]').innerHTML === 'PBHS') {
          if (document.querySelector('[data-searchable-tag="Procedures"]')) {
            let childElements = document.querySelector('[data-searchable-tag="Procedures"]').parentElement.children;
            let childList = {};
            for (element in Array.from(childElements)) {
              if (childElements[element].className === 'children') {
                childList = childElements[element];
                break;
              }
            }
            for (child in Array.from(childList.children)) {
              console.log(childList.children[child].querySelector('a').innerHTML)
            }
          } else {
            throw `Can't find "${workingDomain}/Procedures"`
          }
        } else {
          throw 'Not a PBHS Site'
        }
      } else {
        throw 'Not a PBHS Site'
      }
    }
    catch (err) {
      if (err) alert(err);
    }
  }
})




