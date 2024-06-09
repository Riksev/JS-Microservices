async function getUsersRows(state, obj = "None") {
  try {
    let url;
    let content;
    switch (state) {
      case "get":
        url = "http://localhost:3000/getUsers";
        content = JSON.stringify({ content: obj });
        break;
      case "add":
        url = "http://localhost:3000/addUser";
        content = JSON.stringify(obj);
        break;
      case "remove":
        url = "http://localhost:3000/removeUser";
        content = JSON.stringify(obj);
        break;
      case "load":
        url = "http://localhost:3000/loadUsers";
        content = obj;
        break;
      case "clearRepository":
        url = "http://localhost:3000/clearRepository";
        content = JSON.stringify({ content: obj });
        break;
      default:
        url = "http://localhost:3000/getUsers";
        content = JSON.stringify({ content: obj });
    }
    console.log(new Date().toLocaleString() + " - " + "Sending fetch");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: content,
    });
    const users = await response.json();
    console.log(new Date().toLocaleString() + " - " + "Success");
    let result = "";
    users.forEach((user) => {
      result += `<tr><td>${user["name"]}</td><td>${user["age"]}</td></tr>`;
    });
    return result;
  } catch (error) {
    console.error(new Date().toLocaleString() + " - " + " Error:", error);
    return new Array();
  }
}

async function workWithLogger(state, obj) {
  try {
    let url;
    let content;
    switch (state) {
      case "clearLog":
        url = "http://localhost:3001/clearLog";
        content = { content: obj };
        break;
      case "getLog":
        url = "http://localhost:3001/getLog";
        content = { content: obj };
        break;
      default:
        url = "http://localhost:3001/clearLog";
        content = { content: obj };
    }
    console.log(new Date().toLocaleString() + " - " + "Sending fetch");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    });
    const log = await response.json();
    console.log(new Date().toLocaleString() + " - " + "Success");
    return log;
  } catch (error) {
    console.error(new Date().toLocaleString() + " - " + "Error:", error);
    return new Array();
  }
}

async function downloadUsers() {
  try {
    console.log(new Date().toLocaleString() + " - " + "Sending fetch");
    const response = await fetch("http://localhost:3000/getUsers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: "None" }),
    });
    const users = await response.json();
    console.log(new Date().toLocaleString() + " - " + "Success");
    return users;
  } catch (error) {
    console.error(new Date().toLocaleString() + " - " + "Error:", error);
    return new Array();
  }
}

async function recreateTable(rows = null) {
  let usersTableRows;
  if (!rows) {
    usersTableRows = await getUsersRows("get");
  } else {
    usersTableRows = rows;
  }
  let isEmpty = false;
  let result = "";
  if (usersTableRows.length > 0) {
    result += `<h2 id="usersHeader">Users data table</h2>`;
    result += `<table id='users'>`;
    result += `<tr><th>Name</th><th>Age</th></tr>`;
    result += usersTableRows;
    result += "</table>";
  } else {
    result = `<h2 id="usersHeader">Users table is empty!</h2>`;
    isEmpty = true;
  }

  const table = document.getElementById("users");
  const usersHeader = document.getElementById("usersHeader");
  if (table) {
    table.remove();
  }
  if (usersHeader) {
    usersHeader.remove();
  }

  document.body.innerHTML = result + document.body.innerHTML;

  if (isEmpty) {
    buttonRemoveUser.disabled = true;
    buttonClearRepository.disabled = true;
  } else {
    buttonRemoveUser.disabled = false;
    buttonClearRepository.disabled = false;
  }

  buttonAddUser.onclick = async function (event) {
    const name = prompt("User name:", "None");
    const age = prompt("User age:", 18);
    const user = { name: name, age: age };
    const response = await getUsersRows("add", user);
    await recreateTable(response);
  };

  buttonRemoveUser.onclick = async function (event) {
    const name = prompt("User name:", "None");
    const user = { name: name };
    const response = await getUsersRows("remove", user);
    await recreateTable(response);
  };

  inputLoader.onchange = async function (event) {
    if (event.target.files) {
      const reader = new FileReader();
      reader.addEventListener("load", async function () {
        const response = await getUsersRows("load", reader.result);
        await recreateTable(response);
      });
      reader.readAsText(event.target.files[0]);
    }
    return;
  };

  buttonDownloadUsers.onclick = async function (event) {
    async function saveTemplateAsFile(filename, dataObjToWrite) {
      const blob = new Blob([JSON.stringify(dataObjToWrite)], {
        type: "text/json",
      });
      const link = document.createElement("a");
      link.download = filename;
      link.href = window.URL.createObjectURL(blob);
      link.dataset.downloadurl = ["text/json", link.download, link.href].join(
        ":"
      );
      const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      link.dispatchEvent(evt);
      link.remove();
    }
    await saveTemplateAsFile("users.json", await downloadUsers());
  };

  buttonClearRepository.onclick = async function (event) {
    const response = await getUsersRows("clearRepository");
    await recreateTable(response);
  };

  buttonUpdateLog.onclick = async function (event) {
    logArea.textContent = await workWithLogger("getLog");
  };

  buttonClearLog.onclick = async function (event) {
    logArea.textContent = await workWithLogger("clearLog");
  };
}

recreateTable();
