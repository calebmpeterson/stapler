import * as vscode from "vscode";
import { getNotesLocations } from "./config";
import { chooseNotesLocation, deleteNote } from "./commands";
import { NotesProvider } from "./NotesProvider";
import { openNote } from "./commands";

export function activate(context: vscode.ExtensionContext) {
  console.log("Stapler activated.", getNotesLocations());

  const notesProvider = new NotesProvider(getNotesLocations());
  context.subscriptions.push(notesProvider);
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider("notes-tree", notesProvider.init())
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("stapler.chooseNotesLocation", async () => {
      await chooseNotesLocation();

      notesProvider.refresh();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("stapler.openNote", (path: string) => {
      openNote(path);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("stapler.refreshNotes", () => {
      notesProvider.refresh();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "stapler.deleteNote",
      async (path: string) => {
        await deleteNote(path);

        notesProvider.refresh();
      }
    )
  );
}

export function deactivate() {}
