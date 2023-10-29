import { ipcMain, dialog } from 'electron'
import { exec } from 'child_process'
import path, { extname } from 'path'
import fs from 'fs'
import { AV_MASTER_COVERS_DIR, AV_MASTER_CONFIG_DIR } from './constants'

const regex = /\.(mkv|mp4|avi)$/i
const covers = new Map()
const folders = new Set()

const makerFolder = (path) => {
  const folder = path.split('/').pop()
  if (!folders.has(folder)) {
    folders.add(folder)
  }
}

const initData = () => {
  covers.clear()
  folders.clear()
}

function traverse(dir, videos: string[] = []) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file)
    // 如果是文件夹,递归遍历
    if (fs.statSync(fullPath).isDirectory()) {
      if (fullPath.includes(AV_MASTER_COVERS_DIR)) {
        processCovers(fullPath)
      } else {
        if (!fullPath.includes(AV_MASTER_CONFIG_DIR)) {
          makerFolder(fullPath)
        }
        traverse(fullPath, videos)
      }
    } else {
      // 是文件,进行处理
      if (regex.test(fullPath)) {
        videos.push(fullPath)
      }
    }
  })

  return {
    videos,
    covers,
    folders: [...folders]
  }
}

const processCovers = (folder: string) => {
  console.log(folder)
  fs.readdirSync(folder).forEach((file) => {
    const fileName = file.replace('.jpg', '')
    console.log(fileName)
    covers.set(fileName, path.join(folder, file))
  })
}

export const initEvents = (mainWindow) => {
  ipcMain.handle(
    'select-folder',
    async () =>
      new Promise((resolve, reject) => {
        dialog
          .showOpenDialog(mainWindow, { properties: ['openDirectory'] })
          .then((result) => {
            if (!result.canceled) {
              initData()
              const path = result.filePaths[0]
              const all = traverse(path)
              return resolve({
                ...all,
                rootPath: path
              })
            }
            return resolve([])
          })
          .catch((e) => {
            console.log(e)
            reject(e)
          })
      })
  )

  ipcMain.handle(
    'traverse-folder',
    async (event, path) =>
      new Promise((resolve, reject) => {
        try {
          const all = traverse(path)
          resolve(all)
        } catch (error) {
          console.error(error)
          reject([])
        }
      })
  )

  ipcMain.on('play', (videoPath) => {
    console.log('play')
    exec(`open -a iina`)
  })
}
