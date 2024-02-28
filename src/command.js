import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { createNewNote, getAllNotes, findNotes } from "../src/notes.js";

yargs(hideBin(process.argv))
    .command(
        "new <note>",
        "Create a new note",
        (yargs) => {
            return yargs.positional("note", {
                type: "string",
                description: "The content of the note",
            });
        },
        async ({ note: content, tags }) => {
            await createNewNote(content, tags);
            console.log("Noted");
        },
    )
    .options("tags", {
        alias: "t",
        type: "array",
        description: "tags for organising",
    })
    .command(
        "all",
        "Get all notes",
        () => {},
        async () => {
            console.log(await getAllNotes());
        },
    )
    .command(
        "find <filter>",
        "get matching notes based on content & tags",
        (yargs) => {
            return yargs.positional("filter", {
                describe:
                    "The search term to filter notes by, will be applied to note.content",
                type: "string",
            });
        },
        async ({ filter: searchContent, tags: searchTags }) => {
            const foundNotes = await findNotes(searchContent, searchTags);
            if (foundNotes.length === 0) {
                console.log("found no notes");
                return;
            }
            console.log(foundNotes);
            return;
        },
    )
    .command(
        "remove <id>",
        "remove a note by id",
        (yargs) => {
            return yargs.positional("id", {
                type: "number",
                description: "The id of the note you want to remove",
            });
        },
        async ({ id }) => {
            const allNotes = await getAllNotes();
            const newNotes = [];
            let foundNoteToRemove = false;
            for (note of allNotes) {
                if (note.id === id) {
                    foundNoteToRemove = true;
                    continue;
                }
                newNotes.push(note);
            }
            if (foundNoteToRemove) {
                console.log("note removed");
            }
        },
    )
    .command(
        "web [port]",
        "launch website to see notes",
        (yargs) => {
            return yargs.positional("port", {
                describe: "port to bind on",
                default: 5000,
                type: "number",
            });
        },
        async (argv) => {},
    )
    .command(
        "clean",
        "remove all notes",
        () => {},
        async (argv) => {},
    )

    .demandCommand(1)
    .parse();