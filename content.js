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
      const diffString = diff.join("\n");
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

let exclusionsPreset = [
  "3D Imaging",
  "Stem Cells",
  "Stem-Cells",
  "Stemcells",
  "anesthesia",
  "Anesthesia",
];

// start exported variables
let procedureLists = [];

let procedures = [];

let exclusions = [];

let misc = [];
// end exported variables

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
            throw `Can't find "${item}. Check your spelling and try capitalizing the first letter of each word."`;
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
  addToList(misc, procedures);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let lists = {};
  if (request === "queryData") {
    // This function is called when popup.jsaddToList finishes loading.
    // There may be important things to put here in the future
  }
  if (request.formType === "addForm") {
    const formData = request.formData;

    for (const field in formData) {
      if (typeof formData[field] === "string") {
        formData[field] = formData[field].split(", ");
      }
    }
    for (const field in formData) {
      if (field === "pLists") {
        addToList(formData.pLists, procedureLists, true);
      }
      if (field === "addExLists") {
        addToList(formData.addExLists, exclusions, true);
      }
      if (field === "miscAdd") {
        addToList(formData.miscAdd, misc);
      }
    }
  }
  if (request.formType === "remForm") {
    const formData = request.formData;
    for (const field in formData) {
      if (field === "remPLists") {
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
