let lists = {
  procedureLists: [],
  procedures: [],
  exclusions: [],
  misc: [],
};

const updatePage = () => {
  document.getElementById("pLists").value = "";
  document.getElementById("exLists").value = "";
  document.getElementById("miscAdd").value = "";
  document.getElementById("remPLists").innerHTML = "";
  document.getElementById("remExLists").innerHTML = "";
  document.getElementById("remMiscAdd").innerHTML = "";
  document.getElementById("backEndCode").innerHTML = "";
  document.getElementById("frontEndCode").innerHTML = "";

  lists.procedureLists.forEach((item) =>
    document.getElementById("remPLists").insertAdjacentHTML(
      "beforeend",
      `<div>
        <input type="checkbox" id="remPLists${item}" name="remPLists" value="${item}" />
        <label for="${item}">${item}</label>
      </div>`
    )
  );
  lists.exclusions.forEach((item) =>
    document.getElementById("remExLists").insertAdjacentHTML(
      "beforeend",
      `<div>
        <input type="checkbox" id="remExLists${item}" name="remExLists" value="${item}" />
        <label for="${item}">${item}</label>
      </div>`
    )
  );
  lists.misc.forEach((item) =>
    document.getElementById("remMiscAdd").insertAdjacentHTML(
      "beforeend",
      `<div>
      <input type="checkbox" id="remMiscAdd${item}" name="remMiscAdd" value="${item}" />
      <label for="${item}">${item}</label>
    </div>`
    )
  );
  document.getElementById(
    "procedureList"
  ).innerText = `${lists.procedureLists.join(", ")}`;
  document.getElementById(
    "procedurePages"
  ).innerText = `${lists.procedures.join(", ")}`;
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
  const isValidElement = (element) => {
    return element.name && element.value;
  };
  const isValidValue = (element) => {
    return !["checkbox", "radio"].includes(element.type) || element.checked;
  };
  const isCheckbox = (element) => element.type === "checkbox";
  const formToJSON = (elements) =>
    [].reduce.call(
      elements,
      (data, element) => {
        if (isValidElement(element) && isValidValue(element)) {
          if (isCheckbox(element)) {
            data[element.name] = (data[element.name] || []).concat(
              element.value
            );
          } else {
            data[element.name] = element.value;
          }
        }
        return data;
      },
      {}
    );

  const form = event.target;

  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        formType: `${form.id}`,
        formData: formToJSON(form),
      },
      function (response) {
        lists = response;
        updatePage();
      }
    );
  });

  event.preventDefault();
}
const addForm = document.getElementById("addForm");
addForm.addEventListener("submit", submitHandler);

const remForm = document.getElementById("remForm");
remForm.addEventListener("submit", submitHandler);

chrome.runtime.onMessage.addListener(function (request) {
  console.log("saw the request");
  if (request.type == "error") {
    console.log("triggered if block");
    alert(request.details);
  }
});
