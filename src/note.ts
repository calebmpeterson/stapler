import * as vscode from "vscode";

export class Note extends vscode.TreeItem {
  constructor(
    public readonly name: string,
    public readonly location: string,
    public readonly category: string,
    public readonly tags: string,
    public readonly command?: vscode.Command
  ) {
    super(name);

    this.name = name;
    this.location = location;
    this.category = category;
    this.tags = tags;
    this.iconPath = vscode.ThemeIcon.File;
  }

  contextValue = "note";
}
