import { insert, reset } from "./database";
import { BaseDirectory, readDir } from '@tauri-apps/api/fs';
import { desktopDir, documentDir, downloadDir, homeDir, pictureDir, basename } from '@tauri-apps/api/path';
import { getFolders } from "./config";
import Item from "../models/Item";

// perform a scan every 5 minutes
const SCAN_INTERVAL = 5 * 60 * 1000;

// wait at max 10 seconds to execute scans of folders
const MAX_WAITING_TIME = 10000

/**
 * Registers a callback to be executed during the next idle periods of the event loop. 
 *
 * @param {function} fn - The callback function to be executed.
 * @param {number} time - The maximum time, in milliseconds, the browser is given to run the callback.
 */
const registerCallback = async (fn: () => void, timeout: number) => {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => fn(), { timeout })
  } else {
    await new Promise((resolve) => window.requestAnimationFrame(resolve));
    window.setTimeout(() => fn(), 0);
  }
}


let interval: number | null = null;

export const resolveBaseDirectory = async (baseDirectory: BaseDirectory) => {

  let path = null;
  switch (baseDirectory) {
    case BaseDirectory.Document:
      path = await documentDir();
      break;
    case BaseDirectory.Download:
      path = await downloadDir();
      break;
    case BaseDirectory.Desktop:
      path = await desktopDir();
      break;
    case BaseDirectory.Home:
      path = await homeDir();
      break;
    case BaseDirectory.Picture:
      path = await pictureDir();
      break;
    default:
      throw new Error(`Unknown base directory: ${baseDirectory}`);
  }
  const name = await basename(path);
  return new Item({ path, name, children: [] });
}

const process = async (entries: Item[]) => {
  await insert(entries);
};

const scan = (baseDir: BaseDirectory, path?: string) =>
  new Promise<void>((resolve) => {
    registerCallback(async () => {
      const basePath = (await resolveBaseDirectory(baseDir)).path;
      const subpath = path?.replace(basePath, '') ?? '';
      try {
        const entries = (await readDir(subpath, { dir: baseDir }));
        const files = entries.filter(e => e.children == null);
        const dirs = entries.filter(e => e.children != null);
        await process(files.map(Item.new));
        for (const dir of dirs) {
          await scan(baseDir, dir.path)
        }
      } catch (error) {
        console.warn(error)
      }
      resolve();
    }, MAX_WAITING_TIME);
  });

const scanComputer = async () => {
  console.time('scan');
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  await reset();

  const customDirs = await getFolders() || [BaseDirectory.Document, BaseDirectory.Download, BaseDirectory.Desktop];
  const promises = customDirs.map((d: BaseDirectory) => scan(d));
  await Promise.all(promises);
  console.timeEnd('scan');
  interval = setTimeout(scanComputer, SCAN_INTERVAL);
};

export {
  scan,
  scanComputer,
}

