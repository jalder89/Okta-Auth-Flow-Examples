require("dotenv").config();
const menu = require("./cli/menus.js");
const auth = require("./api/authentication.js");


async function main() {
    let isRunning = true;
    while (isRunning) {
      let choice = await menu.mainMenu(); // Show main menu options
      switch (choice) {
        // Display Auth Server Menu
        case "login-flow":
          const credentials = await menu.getLogin();
          const tokens = await auth.login(credentials);
          break;

        // Exit the CLI
        case "exit":
          isRunning = false;
          break;

        default:
          break;
      }
    }
}

// Start the application
main();