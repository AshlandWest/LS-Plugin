const currentURL = window.location.href;
const rootDomain = window.location.hostname;

const topLevelNav = document.getElementById("nav");
let navItems = [];
if (topLevelNav) {
  Array.from(topLevelNav.children).forEach((navElement) => {
    navItem = "";
    navItem = navElement.querySelector("a").getAttribute("data-searchable-tag");
    navItems.push(navItem);
  });
}

const initializeProcedureLists = () => {
  return navItems.filter(
    (page) => page.includes("Procedures") || page.includes("Services")
  );
};

const addToList = (inputArr, targetList) =>
  targetList.push(
    ...inputArr.filter(
      (item) => !exclusions.includes(item) && !targetList.includes(item)
    )
  );

// start exported variables
let procedureLists = [];

let procedures = [];

let exclusions = ["3D Imaging", "Stem Cells", "Stem-Cells", "Stemcells"];

let misc = [];
// end exported variables

isInDevelopment = () => {
  if (rootDomain === "www.freewaysites.com") return true;
  if (rootDomain === "www.pbhssites.com") return true;
  return false;
};

developmentFilter = (domain) => {
  pathArray = window.location.pathname.split("/");
  return `${domain}/${pathArray[1]}`;
};

const workingDomain = isInDevelopment()
  ? developmentFilter(rootDomain)
  : window.location.hostname;

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request === "hi") {
//     console.log("hello from content.js");
//     sendResponse("OMG IT WORKED!!!");
//   }
// });

function queryHandler() {
  if (!procedureLists.length) {
    addToList(initializeProcedureLists(), procedureLists);
  }
  let unfilteredProcedures = [];
  for (list of procedureLists) {
    try {
      if (document.querySelector('[itemprop="copyrightHolder"]')) {
        if (
          document.querySelector('[itemprop="copyrightHolder"]').innerHTML ===
          "PBHS"
        ) {
          if (
            document.querySelector(
              "[data-searchable-tag=" + CSS.escape(list) + "]"
            )
          ) {
            let childElements = document.querySelector(
              "[data-searchable-tag=" + CSS.escape(list) + "]"
            ).parentElement.children;
            let childList = {};
            for (element in Array.from(childElements)) {
              if (childElements[element].className === "children") {
                childList = childElements[element];
                break;
              }
            }
            for (child in Array.from(childList.children)) {
              unfilteredProcedures.push(
                childList.children[child].querySelector("a").innerText
              );
              addToList(unfilteredProcedures, procedures);
            }
          } else {
            throw `Can't find "${workingDomain}/${list}"`;
          }
        } else {
          throw "Not a PBHS Site";
        }
      } else {
        throw "Not a PBHS Site";
      }
    } catch (err) {
      chrome.runtime.sendMessage({ type: "error", details: err });
    }
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request === "queryData") {
    queryHandler();
    const lists = {
      procedures: procedures,
      exclusions: exclusions,
      misc: misc,
    };
    sendResponse(lists);
  }
  if (request.formType === "addForm") {
    const formData = request.formData;
    for (const field in formData) {
      formData[field] = formData[field].split(", ");
    }
    console.log("addForm Received!", formData);
    for (const field in formData) {
      if (field === "pLists") {
        addToList(formData.pLists, procedureLists);
      }
      if (field === "exLists") {
        addToList(formData.exLists, exclusions);
      }
      if (field === "miscAdd") {
        addToList(formData.miscAdd, misc);
      }
    }
    console.log("Procedure Lists", procedureLists);
    console.log("Exclusion Lists", exclusions);
    console.log("Misc Addition Lists", misc);
    queryHandler();
    const lists = {
      procedures: procedures,
      exclusions: exclusions,
      misc: misc,
    };
    sendResponse(lists);
  }
});
