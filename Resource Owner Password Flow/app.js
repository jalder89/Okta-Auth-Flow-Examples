require("dotenv").config();
const menu = require("./cli/menus.js");


async function main() {
    let isRunning = true;
    while (isRunning) {
      let choice = await menu.mainMenu(); // Show main menu options
      switch (choice) {
        // Display Auth Server Menu
        case "login-flow":
          choice = await menu.loginFlow();
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