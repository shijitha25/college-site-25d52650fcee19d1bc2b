// Reads data.json and fills the page. Staff only ever edit data.json.
function cell(text) {
  var td = document.createElement("td");
  td.textContent = text;
  return td;
}

function showLabs(data) {
  document.getElementById("college").textContent = data.college || "College Lab Timings";
  document.getElementById("code").textContent = data.code || "";
  document.title = (data.college || "College") + " - Lab Timings";

  var body = document.getElementById("lab-slots");
  body.innerHTML = "";
  (data.labs || []).forEach(function (lab) {
    var row = document.createElement("tr");
    row.appendChild(cell(lab.name));
    row.appendChild(cell(lab.opens));
    row.appendChild(cell(lab.closes));
    body.appendChild(row);
  });
}

function showBuild(build) {
  var sha = String(build.sha || "").substring(0, 7);
  document.getElementById("build").textContent =
    "Deployed by GitHub Actions. Commit " + sha + ", run " + build.run + ".";
}

fetch("data.json", { cache: "no-store" })
  .then(function (response) {
    if (!response.ok) { throw new Error("data.json returned " + response.status); }
    return response.json();
  })
  .then(showLabs)
  .catch(function (error) {
    document.getElementById("lab-slots").innerHTML =
      "<tr><td colspan=\"3\">Could not load data.json: " + error.message + "</td></tr>";
  });

// build.json is written by the GitHub Actions workflow. It does not exist on your computer.
fetch("build.json", { cache: "no-store" })
  .then(function (response) { return response.ok ? response.json() : null; })
  .then(function (build) { if (build) { showBuild(build); } })
  .catch(function () { /* opened locally: no build info yet */ });
