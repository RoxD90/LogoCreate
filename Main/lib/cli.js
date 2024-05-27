const SVG = require("./svg");
const { Circle, Triangle, Square } = require("./shapes");
const { writeFile } = require("fs/promises");

class CLI {
  async run() {
    // Dynamic import of the inquirer module
    const inquirer = await import('inquirer');
    const prompt = inquirer.default.prompt;

    return prompt([
      {
        name: "text",
        type: "input",
        message:
          "Enter text for the logo. (Must not be more than 3 characters.)",
        validate: (text) =>
          text.length <= 3 ||
          "The message must not contain more than 3 characters",
      },
      {
        name: "textColor",
        type: "input",
        message: "Enter a text color",
      },
      {
        name: "shapeType",
        type: "list",
        message: "Select a shape for the logo",
        choices: ["circle", "square", "triangle"],
      },
      {
        name: "shapeColor",
        type: "input",
        message: "Enter a shape color",
      },
    ])
    .then(({ text, textColor, shapeType, shapeColor }) => {
      let shape;
      switch (shapeType) {
        case "circle":
          shape = new Circle();
          break;

        case "square":
          shape = new Square();
          break;

        default:
          shape = new Triangle();
          break;
      }
      shape.setColor(shapeColor);

      const svg = new SVG();
      svg.setText(text, textColor);
      svg.setShape(shape);
      return writeFile("logo.svg", svg.render());
    })
    .then(() => {
      console.log("Generated logo.svg");
    })
    .catch((error) => {
      console.error(error);
      console.log("Oops! Something went wrong.");
    });
  }
}

module.exports = CLI;
