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

const procedurePreset = [
  "Dental Implants",
  "Replacing Missing Teeth",
  "Missing All Upper or Lower Teeth",
  "Bone Grafting for Implants",
  "Implant Supported Overdenture",
  "Teeth-in-an-Hour",
  "Bone Grafting",
  "Ridge Augmentation",
  "Sinus Lift",
  "Nerve Repositioning",
  "Socket Preservation",
  "Wisdom Teeth",
  "Impacted Wisdom Teeth",
  "Wisdom Teeth Removal",
  "Jaw Surgery",
  "Tooth Extractions",
  "Pre-Prosthetic Surgery",
  "Distraction Osteogenesis",
  "TMJ",
  "Sleep Apnea",
  "Cleft Lip & Palate",
  "Exposure of Impacted Teeth",
  "Dental Exams and Check-Ups",
  "Child Dentistry",
  "Teeth Cleaning",
  "Dental Sealants",
  "Gum Disease Treatment",
  "Gum Disease Laser Therapy",
  "Deep Teeth Cleaning",
  "Dental Fillings",
  "Amalgam Fillings",
  "Dental Bridges",
  "Dental Crowns",
  "Non-Surgical Root Canal",
  "Dentures",
  "Immediate Dentures",
  "Implant Retained Dentures",
  "Partial Dentures",
  "Exams & Maintenance",
  "Denture Relines",
  "Rebase & Repairs",
  "Soft Liners",
  "Dental Bonding",
  "Porcelain Veneers",
  "Inlays & Onlays",
  "Teeth Whitening",
  "Zoom Whitening",
  "LaserSmile",
  "CEREC",
  "E4D Dentist",
  "Clear Braces",
  "Tooth Colored Fillings",
  "Full Mouth Reconstruction",
  "Bruxism Treatment",
  "Cleft Lip and Palate",
  "Periodontal Disease",
  "Root Canal",
  "GentleWave UltraCleaning",
  "Endodontic Retreatment",
  "Apicoectomy",
  "Cracked Teeth",
  "Traumatic Injuries",
  "Professional Teeth Cleaning",
  "Perioscopic Treatment",
  "Scaling and Root Planing",
  "Crown Lengthening",
  "Laser Therapy",
  "LANAP Laser Periodontal",
  "LAPIP Laser Periodontal ",
  "Piezosurgery",
  "Laser Treatment of Cold Sores",
  "Laser Depigmentation",
  "Bite Adjustment",
  "Reduction Surgery",
  "Osseous Surgery",
  "Gingivectomy",
  "Frenectomy",
  "Gum Grafting",
  "Guided Bone & Tissue Regeneration",
  "Cosmetic Periodontal Surgery",
  "Oral Cancer Exam",
  "Stem Cell Recovery",
  "Pinhole Surgical Technique TM",
  "Mini Dental Implants",
  "Sinus Augmentation",
  "Braces",
  "Retainers",
  "Appliances",
  "In-Ovation System Braces",
  "Clear Aligners",
  "Clear Ceramic Braces",
  "Clear Aligners for Teens",
  "Elastics",
  "Retainers for Appliances",
  "Invisalign",
  "Invisalign Information",
  "Advantages of Invisalign",
  "Gum Disease",
  "Fillings / Restorations",
  "Bonding",
  "Orthodontics",
  "Removable Appliances,",
];

const exclusionsPreset = [
  "Stem-Cells",
  "Stemcells",
  "anesthesia",
  "Anesthesia",
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
  "Cosmetic Dentistry",
  "Uses of CEREC",
  "CEREC Benefit",
  "CEREC Benefits",
  "General Dentistry",
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
