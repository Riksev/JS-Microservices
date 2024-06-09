const { UserRepositoryFacade, Logger } = require("./shopAdministration");

// Mock for real requests
// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     json: () => Promise.resolve({}),
//   })
// );

describe("Check shop administration functionality", () => {
  let logger = new Logger();
  let userRepositoryFacade = new UserRepositoryFacade();

  const testCases = [
    {
      function: () => {
        userRepositoryFacade.addUser("Alice", 30);
        userRepositoryFacade.addUser("Bob", 25);
        userRepositoryFacade.addUser("Alice", 30);
        return userRepositoryFacade.getUsersInfo();
      },
      inString: "Test 'UserRepository: adding users'",
      expected: "Alice (30 years old)\nBob (25 years old)",
    },
    {
      function: () => {
        userRepositoryFacade.addUser("Alice", 30);
        userRepositoryFacade.removeUser("Jack");
        userRepositoryFacade.removeUser("Alice");
        return userRepositoryFacade.getUsers().length == 0;
      },
      inString: "Test 'UserRepository: removing users'",
      expected: true,
    },
    {
      function: () => {
        userRepositoryFacade.loadUsers([{ name: "Alice", age: 30 }]);
        return userRepositoryFacade.getUsersInfo();
      },
      inString: "Test 'UserRepository: loading users'",
      expected: "Alice (30 years old)",
    },
    {
      function: () => {
        return logger.clearLog();
      },
      inString: "Test 'Logger: clearing log'",
      expected: true,
    },
    {
      function: () => {
        return logger.getLog().split("\n").length;
      },
      inString: "Test 'Logger: clearing log'",
      expected: 2,
    },
  ];

  beforeEach(() => {
    userRepositoryFacade.clearRepository();
    logger.clearLog();
  });

  testCases.forEach((test) => {
    it(`'${test.inString}', expect '${test.expected}'`, () => {
      const res = test.function();
      expect(res).toBe(test.expected);
    });
  });
});
