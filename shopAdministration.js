const interfaces = require("./interfaces");

class Logger extends interfaces.ILogger {
  #logMessages;

  static instance;

  constructor() {
    super();
    if (Logger.instance) {
      return Logger.instance;
    }
    this.#logMessages = new Array();
    Logger.instance = this;
  }

  log(message) {
    const timestamp = new Date().toLocaleString();
    const logMessage = timestamp + " - " + message;
    this.#logMessages.push(logMessage);
    console.log(logMessage);
  }

  getLog() {
    const messages = new Array(["Log messages:"]);
    this.#logMessages.forEach((message) => {
      messages.push(message);
    });
    return messages.join("\n");
  }

  clearLog() {
    this.#logMessages = new Array();
    this.log("Log cleared");
    return true;
  }
}

class User {
  #name;
  #age;

  constructor(name, age) {
    this.#name = name;
    this.#age = age;
  }

  getName() {
    return this.#name;
  }

  getAge() {
    return this.#age;
  }

  getInfo() {
    return this.getName() + " (" + this.getAge() + " years old)";
  }
}

class UserRepository extends interfaces.IRepository {
  #users;

  static instance;

  constructor() {
    super();
    if (UserRepository.instance) {
      return UserRepository.instance;
    }
    this.#users = new Array();
    UserRepository.instance = this;
  }

  addUser(user) {
    let hasInstance = false;
    this.#users.forEach((item) => {
      if (item.getName() == user.getName() && item.getAge() == user.getAge()) {
        hasInstance = true;
      }
    });
    if (!hasInstance) {
      this.#users.push(user);
      this.#createLog("User added: " + user.getName() + "," + user.getAge());
    } else {
      this.#createLog(
        "User already exists: " + user.getName() + "," + user.getAge()
      );
    }
  }

  #createLog(message) {
    try {
      fetch("http://localhost:3001/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }),
      });
      console.log(new Date().toLocaleString() + " - " + "Success");
    } catch (error) {
      console.error(new Date().toLocaleString() + " - " + "Error:", error);
      return new Array();
    }
  }

  removeUser(name) {
    let found = false;
    this.#users = this.#users.filter((user) => {
      const checker = user.getName() !== name;
      if (checker) {
        found = true;
      }
      return checker;
    });
    if (found) {
      this.#createLog("User removed: " + name);
    } else {
      this.#createLog("User not found: " + name);
    }
  }

  getProcessedData() {
    const usersInfo = new Array();
    this.#users.forEach((user) => {
      usersInfo.push(user.getInfo());
    });
    return usersInfo.join("\n");
  }

  getRowData() {
    return this.#users;
  }

  clearRepository() {
    this.#users = new Array();
    this.#createLog("Repository was cleared");
    return true;
  }

  loadUsers(users) {
    users.forEach((element) => {
      const user = new User(element["name"], element["age"]);
      this.addUser(user);
    });
  }
}

class UserRepositoryFacade {
  #userRepository;

  static instance;

  constructor() {
    if (UserRepositoryFacade.instance) {
      return UserRepositoryFacade.instance;
    }
    this.#userRepository = new UserRepository();
    UserRepositoryFacade.instance = this;
  }

  addUser(name, age) {
    const user = new User(name, age);
    this.#userRepository.addUser(user);
  }

  removeUser(name) {
    this.#userRepository.removeUser(name);
  }

  getUsersInfo() {
    return this.#userRepository.getProcessedData();
  }

  getUsers() {
    return this.#userRepository.getRowData();
  }

  clearRepository() {
    return this.#userRepository.clearRepository();
  }

  loadUsers(users) {
    this.#userRepository.loadUsers(users);
  }
}

module.exports = {
  Logger,
  UserRepositoryFacade,
};
