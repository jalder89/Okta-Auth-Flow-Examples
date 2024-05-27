const inquirer = require("@inquirer/prompts")

async function mainMenu() {
  const answer = await inquirer.select({
    message: "Select Function:",
    choices: [
      {
        name: "Login",
        value: "login-flow",
        description: "Login to the app",
      },
      {
        name: "Exit",
        value: "exit",
        description: "Exit the app",
      },
    ],
  });
  return answer;
}

async function getLogin() {
    const username = await inquirer.input({
        message: "Enter your Okta Username",
    });
    const password = await inquirer.password({
        message: "Enter your Okta Password"
    });
    const loginCreds = {
        username: username,
        password: password,
    }
    return loginCreds;
}

module.exports = {
    mainMenu,
    getLogin,
}