class IRepository {
  loadFrom(data) {}
  getData() {}
  clearRepository() {}
}

class ILogger {
  log(message) {}
  getLog() {}
  clearLog() {}
}

module.exports = {
  IRepository,
  ILogger,
};
