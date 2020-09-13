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
const initializeExclusionList = () => {
  addToList(exclusionsPreset, exclusions, true);
};

const addToList = (inputArr, targetList, checkSite) => {
  if (checkSite) {
    const startingArr = inputArr;
    inputArr = inputArr.filter((item) =>
      document.querySelector("[data-searchable-tag=" + CSS.escape(item) + "]")
    );
    let diff = startingArr.filter((item) => inputArr.indexOf(item) === -1);
    if (diff.length) {
      const diffString = diff
        .map((item) => `${workingDomain}/${item}`)
        .join("\n");
      chrome.runtime.sendMessage({
        type: "error",
        details: `Can not find the following item(s):\n${diffString}`,
      });
    }
  }
  targetList.push(
    ...inputArr.filter(
      (item) => !exclusions.includes(item) && !targetList.includes(item)
    )
  );
};

const remFromList = (inputArr, targetList) => {
  inputArr.forEach((item) => targetList.splice(targetList.indexOf(item), 1));
};

function initAll() {
  initializeExclusionList();
  addToList(initializeProcedureLists(), procedureLists);
  queryHandler();
}

let exclusionsPreset = ["3D Imaging", "Stem Cells", "Stem-Cells", "Stemcells"];

// start exported variables
let procedureLists = [];

let procedures = [];

let exclusions = [];

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
  let newProcedures = [];
  try {
    if (document.querySelector('[itemprop="copyrightHolder"]')) {
      if (
        document.querySelector('[itemprop="copyrightHolder"]').innerHTML ===
        "PBHS"
      ) {
        for (item of procedureLists) {
          if (
            document.querySelector(
              "[data-searchable-tag=" + CSS.escape(item) + "]"
            )
          ) {
            let childElements = document.querySelector(
              "[data-searchable-tag=" + CSS.escape(item) + "]"
            ).parentElement.children;
            let childList = {};
            for (element in Array.from(childElements)) {
              if (childElements[element].className === "children") {
                childList = childElements[element];
                break;
              }
            }
            for (child in Array.from(childList.children)) {
              newProcedures.push(
                childList.children[child].querySelector("a").innerText
              );
            }
          } else {
            throw `Can't find "${workingDomain}/${item}"`;
          }
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
  procedures = [];
  addToList(newProcedures, procedures);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let lists = {};
  if (request === "queryData") {
  }
  if (request.formType === "addForm") {
    const formData = request.formData;
    for (const field in formData) {
      formData[field] = formData[field].split(", ");
    }
    for (const field in formData) {
      if (field === "pLists") {
        addToList(formData.pLists, procedureLists, true);
      }
      if (field === "exLists") {
        addToList(formData.exLists, exclusions, true);
      }
      if (field === "miscAdd") {
        addToList(formData.miscAdd, misc);
      }
    }
  }
  if (request.formType === "remForm") {
    const formData = request.formData;
    console.log("formData = ", formData);
    for (const field in formData) {
      if (field === "remPLists") {
        console.log("formData.remPLists = ", formData.remPLists);
        remFromList(formData.remPLists, procedureLists);
      }
      if (field === "remExLists") {
        remFromList(formData.remExLists, exclusions);
      }
      if (field === "remMiscAdd") {
        remFromList(formData.remMiscAdd, misc);
      }
    }
  }
  queryHandler();
  lists.procedureLists = procedureLists;
  lists.procedures = procedures;
  lists.exclusions = exclusions;
  lists.misc = misc;
  sendResponse(lists);
});

document.addEventListener("DOMContentLoaded", initAll());
