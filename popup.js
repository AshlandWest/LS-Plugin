const lists = {
  procedures: ["Proc1", "Proc2", "Proc3"],
  exclusions: ["Exc1", "Exc2", "Exc3"],
  misc: ["Misc1", "Misc2", "Misc3"],
};

const updatePage = (lists) => {
  document
    .getElementById("pLists")
    .setAttribute("value", lists.procedures.join(", "));
  document
    .getElementById("exLists")
    .setAttribute("value", lists.exclusions.join(", "));
  document
    .getElementById("miscAdd")
    .setAttribute("value", lists.misc.join(", "));
  lists.procedures.forEach((item) =>
    document.getElementById("remPLists").insertAdjacentHTML(
      "beforeend",
      `<div>
        <input type="checkbox" id="${item}" name="${item}" value="${item}" />
        <label for="${item}">${item}</label>
      </div>`
    )
  );
  lists.exclusions.forEach((item) =>
    document.getElementById("remExLists").insertAdjacentHTML(
      "beforeend",
      `<div>
        <input type="checkbox" id="${item}" name="${item}" value="${item}" />
        <label for="${item}">${item}</label>
      </div>`
    )
  );
  lists.misc.forEach((item) =>
    document.getElementById("remMiscAdd").insertAdjacentHTML(
      "beforeend",
      `<div>
      <input type="checkbox" id="${item}" name="${item}" value="${item}" />
      <label for="${item}">${item}</label>
    </div>`
    )
  );
  document.getElementById("procedureList").innerText = `${lists.procedures.join(
    ", "
  )}`;
  document.getElementById("exclusionList").innerText = `${lists.exclusions.join(
    ", "
  )}`;
  document.getElementById("miscList").innerText = `${lists.misc.join(", ")}`;
  document.getElementById(
    "backEndCode"
  ).innerText = `Procedure[category]:${lists.procedures.join()},Other`;
  document.getElementById("frontEndCode").innerHTML = "";
  lists.procedures.forEach((procedurePage) =>
    document
      .getElementById("frontEndCode")
      .insertAdjacentHTML(
        "beforeend",
        `<p>[PBHS_REVIEWS_SHOW CATEGORY="${procedurePage}"]`
      )
  );
};

function showHide(id) {
  var tag = document.getElementById(id);
  if (tag.style.display === "none") {
    tag.style.display = "inline";
  } else {
    tag.style.display = "none";
  }
}

const showHideButtons = document.querySelectorAll(".showHide");
for (const button of showHideButtons) {
  button.addEventListener("click", function (event) {
    showHide(event.target.getAttribute("for"));
    if (button.innerText === "Show") {
      button.innerText = "Hide";
    } else {
      button.innerText = "Show";
    }
  });
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    document
      .querySelector("#bananas")
      .addEventListener("click", onclick, false);

    function onclick() {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, "hi", function (response) {
          console.log(response);
        });
      });
    }
  },
  false
);

function queryData() {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, "queryData", function (response) {
      console.log(response);
    });
  });
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    document
      .querySelector("#queryData")
      .addEventListener("click", onclick, false);
    function onclick() {
      queryData();
    }
  },
  false
);

function submitHandler(event) {
  const form = event.target;
  console.log(form);
  const formData = new FormData(form);
  console.log("array of entries", [...formData.entries()]);
  console.log("event: ", event);
  event.preventDefault();
}
const addForm = document.getElementById("addForm");
addForm.addEventListener("submit", submitHandler);

const remForm = document.getElementById("remForm");
remForm.addEventListener("submit", submitHandler);
