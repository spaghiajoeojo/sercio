import { BaseDirectory } from "@tauri-apps/api/fs"

export const getFolders = () => {
    const result = localStorage.getItem('folders');
    return result ? JSON.parse(result) : [BaseDirectory.Document, BaseDirectory.Download, BaseDirectory.Desktop];
}

export const setFolders = (folders: BaseDirectory[]) => {
    localStorage.setItem('folders', JSON.stringify(folders))
}
