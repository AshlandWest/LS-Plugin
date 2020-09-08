const currentURL = window.location.href;
const rootDomain = window.location.hostname;

const topLevelNav = document.getElementById('nav');
let navItems = [];
if (topLevelNav) {
  Array.from(topLevelNav.children).forEach(navElement => {
    navItem = '';
    navItem = navElement.querySelector('a').getAttribute('data-searchable-tag')
    console.log(`pushing ${navItem} to navItems`)
    navItems.push(navItem);
  })
}

let procedureLists = navItems.filter(page =>
  page.includes('Procedures') || page.includes('Services')
)

console.log(`navItems ${navItems}
includeList: ${includeList}
prodecureLists: ${procedureLists}`)

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
    for (list of procedureLists) {
      try {
        if (document.querySelector('[itemprop="copyrightHolder"]')) {
          if (document.querySelector('[itemprop="copyrightHolder"]').innerHTML === 'PBHS') {
            if (document.querySelector('[data-searchable-tag=' + CSS.escape(list) + ']')) {
              let childElements = document.querySelector('[data-searchable-tag=' + CSS.escape(list) + ']').parentElement.children;
              let childList = {};
              for (element in Array.from(childElements)) {
                if (childElements[element].className === 'children') {
                  childList = childElements[element];
                  break;
                }
              }
              for (child in Array.from(childList.children)) {
                console.log(childList.children[child].querySelector('a').innerText)
              }
            } else {
              throw `Can't find "${workingDomain}/${list}"`
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
  }
})




