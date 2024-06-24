import fs from "node:fs";
import path from "node:path";
import * as vscode from "vscode";
import { EXTENSION_ID, NOTES_LOCATIONS } from "./constants";

export const openNote = (path: string) => {
  vscode.window.showTextDocument(vscode.Uri.file(path));
};

export const deleteNote = async (path: string) => {
  fs.unlinkSync(path);
};

export const chooseNotesLocation = async () => {
  // display open dialog with above options
  const fileUri = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: "Select",
  });

  if (fileUri && fileUri[0]) {
    const notesConfiguration = vscode.workspace.getConfiguration(EXTENSION_ID);

    // update Notes configuration with selected location
    await notesConfiguration.update(
      NOTES_LOCATIONS,
      path.normalize(fileUri[0].fsPath),
      true
    );

    // prompt to reload window so storage location change can take effect
    const selectedAction = await vscode.window.showWarningMessage(
      `You must reload the window for the storage location change to take effect.`,
      "Reload"
    );

    // if the user selected to reload the window then reload
    if (selectedAction === "Reload") {
      vscode.commands.executeCommand("workbench.action.reloadWindow");
    }
  }
};
