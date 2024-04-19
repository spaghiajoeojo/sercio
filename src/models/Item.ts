import { FileEntry } from "@tauri-apps/api/fs";

export default class Item {
  path: string;

  name: string;

  is_dir: boolean;

  static new(arg: FileEntry) {
    return new Item(arg);
  }

  constructor({ path, name, children }: Pick<FileEntry, 'path' | 'name' | 'children'>) {
    this.path = path;
    this.name = name ?? '';
    this.is_dir = children !== null;
  }
};