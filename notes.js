import fs from "fs";
import chalk from "chalk"

const FILE_PATH = "notes.json";

async function readNotes() {
  try {
    const data = await fs.promises.readFile(FILE_PATH, "utf8");
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveNotes(notes) {
  try {
    await fs.promises.writeFile(FILE_PATH, JSON.stringify(notes, null, 2), "utf8");
  } catch (error) {
    console.error(chalk.red(`Save Error: ${error.message}`));
  }
}

async function main(){
    const argv = process.argv.slice(2);
    const action = argv[0];
    const target = argv [1];
    const notes =await readNotes();
    switch (action) {
    case "add":
      if (!target) {
        console.log(chalk.red("❌ Error: Please specify a task description to add."));
        return;
      }
      const now = new Date();
      const dateStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
      const newNotes = { 
        id: notes.length > 0 ? notes[notes.length - 1].id + 1 : 1, 
        text: target, 
        done: false, 
        createdAt: dateStr 
      };
      notes.push(newNotes);
      await saveNotes(notes);
      console.log(chalk.green(`✓ Task added: ${target}`));
      break;

    default:
      console.log(chalk.magenta("Usage instructions:"));
      console.log("  node todo.js add 'Task Name'");
      break;
    } 
}
main();