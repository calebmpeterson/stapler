import * as vscode from "vscode";
import { EXTENSION_ID, NOTES_LOCATIONS } from "./constants";

export const getNotesLocations = () =>
  [
    vscode.workspace.getConfiguration(EXTENSION_ID).get(NOTES_LOCATIONS),
  ].flatMap((entry) => String(entry));
