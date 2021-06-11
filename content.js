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
    (page) =>
      page.includes("Procedures") ||
      page.includes("Services") ||
      page.includes("Treatments")
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
  if (targetList === procedureLists) {
    targetList.push(...inputArr.filter((item) => !targetList.includes(item)));
  } else {
    targetList.push(
      ...inputArr.filter(
        (item) => !exclusions.includes(item) && !targetList.includes(item)
      )
    );
  }
};

const remFromList = (inputArr, targetList) => {
  inputArr.forEach((item) => targetList.splice(targetList.indexOf(item), 1));
};

//Start misc procedure finder
const procedurePreset = ["TMJ", "Wisdom Teeth"];
function miscProcedureFinder() {
  let miscProcedures = [];
  miscProcedures.push(
    ...procedurePreset.filter((item) =>
      document.querySelector("[data-searchable-tag=" + CSS.escape(item) + "]")
    )
  );
  console.log("miscProcedures:" + miscProcedures);
  addToList(miscProcedures, procedures);
}
//End procedure list finder

function initAll() {
  initializeExclusionList();
  addToList(initializeProcedureLists(), procedureLists);
  queryHandler();
  miscProcedureFinder();
}

let exclusionsPreset = [
  "Stem-Cells",
  "Stemcells",
  "anesthesia",
  "Anesthesia",
  //start list from Alicia's document
  "Overview of Implant Placemen",
  "After Implant Placemen",
  "Cost of Dental Implant",
  "Jaw Bone Health",
  "Jaw Bone Loss and Deterioratio",
  "About Bone Grafting",
  "After Extraction of Wisdom Teet",
  "Facial Trauma",
  "Oral Pathology",
  "Bone Morphogenic Protei",
  "Stem Cells",
  "Platelet Rich Plasma",
  "3D Imaging",
  "Preventative Care",
  "Oral Hygiene",
  "Arestin",
  "Periodontal Maintenanc",
  "Restorative Dentistry",
  "Denture Care",
  "Stem Cells",
  "Cosmetic Dentistry",
  "Uses of CEREC",
  "CEREC Benefit",
  "Restorative Dentistry",
  "Overview of Implant Placemen",
  "After Implant Placemen",
  "Cost of Dental Implant",
  "Denture Care",
  "Cosmetic Dentistry",
  "Uses of CEREC",
  "CEREC Benefits",
  "General Dentistry",
  "Oral Hygiene",
  "Women and Periodontal Heal",
  "Procedures",
  "Root Canal Safety",
  "Myths About Root Canal",
  "Root Resorption",
  "Endodontic Reference",
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
    for (item of procedureLists) {
      if (
        document.querySelector("[data-searchable-tag=" + CSS.escape(item) + "]")
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
  } catch (err) {
    chrome.runtime.sendMessage({ type: "error", details: err });
  }
  addToList(newProcedures, procedures);
  addToList(misc, procedures);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let lists = {};
  if (request === "queryData") {
    // This function is called when popup.js addToList finishes loading.
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
