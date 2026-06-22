import fs from "fs";
import chalk from "chalk";

const FILE_PATH = "notes.json";

async function readNotes() {
  try {
    await fs.promises.access(FILE_PATH);
  } catch {
    await fs.promises.writeFile(FILE_PATH, JSON.stringify([], null, 2), "utf8");
    return [];
  }

  try {
    const data = await fs.promises.readFile(FILE_PATH, "utf8");
    if (!data.trim()) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error(chalk.red(`Load Error: ${error.message}`));
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
        console.log(chalk.red("Error: Please specify a task description to add."));
        return;
      }
      const now = new Date();
      const dateStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
      const newNote = {
        id: notes.length > 0 ? notes[notes.length - 1].id + 1 : 1,
        text: target,
        createdAt: dateStr,
        done: false,
      };
      notes.push(newNote);
      await saveNotes(notes);
      console.log(chalk.green(`✓ Task added: ${target}`));
      break;

    case "list":
        if(notes.length === 0){
            console.log(chalk.yellow("No notes saved yet."));
        }
        notes.forEach((note) => {
        if (note.text.length > 40) {
          console.log(chalk.green(`${note.text.slice(0, 40)}...`));
        } else {
          console.log(`${note.id}. ${chalk.yellow(note.createdAt)} - ${chalk.blue.bold(note.text)} `);
        }
      });
      break;

    default:
      console.log(chalk.magenta("Usage instructions:"));
      console.log("  node notes.js add 'Task Name'");
      console.log("  node notes.js list");
      break;
    } 
}
main();