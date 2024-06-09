class IRepository {
  getProcessedData() {}
	getRowData() {}
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
