import * as vscode from "vscode";
import * as fs from "fs";
import * as gl from "glob";
import * as path from "path";
import { Note } from "./note";

export class NotesProvider
  implements vscode.TreeDataProvider<Note>, vscode.Disposable
{
  private _onDidChangeTreeData: vscode.EventEmitter<Note | undefined> =
    new vscode.EventEmitter<Note | undefined>();

  readonly onDidChangeTreeData: vscode.Event<Note | undefined> =
    this._onDidChangeTreeData.event;

  private _subscriptions: vscode.Disposable[] = [];

  constructor(private notesLocations: string[]) {}

  public init(): NotesProvider {
    this.refresh();
    this.subscribe();
    return this;
  }

  public dispose() {
    this.unsubscribe();
  }

  unsubscribe() {
    for (const subscription of this._subscriptions) {
      subscription.dispose();
    }
  }

  subscribe() {
    for (const notesLocation of this.notesLocations) {
      const pattern = `${notesLocation}/**/*.md`;
      console.log(`Watching ${pattern}`);
      const watcher = vscode.workspace.createFileSystemWatcher(pattern);

      this._subscriptions.push(watcher.onDidChange(this.refresh));
      this._subscriptions.push(watcher.onDidCreate(this.refresh));
      this._subscriptions.push(watcher.onDidDelete(this.refresh));

      this._subscriptions.push(watcher);
    }
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  // get the parent of a note
  getTreeItem(note: Note): vscode.TreeItem {
    return note;
  }

  // get the children of a note
  getChildren(note?: Note): Thenable<Note[]> {
    // if there is no notes location return an empty list
    if (!this.notesLocations) {
      return Promise.resolve([]);
    }
    // else if there is a note return an empty list
    if (note) {
      return Promise.resolve([]);
    }
    // else return the list of notes
    else {
      return Promise.resolve(
        this.notesLocations.flatMap((notesLocation) =>
          this.getNotes(notesLocation)
        )
      );
    }
  }

  // get the notes in the notes location
  getNotes(notesLocation: string): Note[] {
    if (this.pathExists(notesLocation)) {
      // return a note
      const createNoteItem = (pathItem: gl.Path): Note =>
        new Note(
          path.relative(notesLocation, pathItem.fullpath()),
          pathItem.fullpath(),
          "", // category
          "", // tags
          {
            command: "stapler.openNote",
            title: "",
            arguments: [pathItem.fullpath()],
          }
        );

      const pattern = `**/*.md`;

      const notes = gl
        .sync(pattern, {
          cwd: notesLocation,
          nocase: true,
          withFileTypes: true,
        })
        .map(createNoteItem);

      console.log(
        `Found ${notes.length} notes in ${notesLocation} matching ${pattern}`,
        notes
      );

      return notes;
    }
    // else if the notes location does not exist
    else {
      return [];
    }
  }

  // check if a path exists
  private pathExists(p: string): boolean {
    // try to access the given location
    try {
      fs.accessSync(p);
      // return false if location does not exist
    } catch (err) {
      return false;
    }
    // return true if location exists
    return true;
  }
}
