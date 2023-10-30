import { ipcMain, dialog } from 'electron'
import { exec } from 'child_process'
import path from 'path'
import { getPureName, getCover } from './utils'
import fs from 'fs'
import { AV_MASTER_COVERS_DIR, AV_MASTER_CONFIG_DIR, CUSTOM_PREFIX } from './constants'

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
    videos: formatVideos(videos, covers),
    folders: [...folders]
  }
}

const formatVideos = (videoPaths: string[], covers) => {
  const result: {
    name: string
    path: string
    cover?: string
  }[] = []
  for (const path of videoPaths) {
    const name = getPureName(path)
    result.push({
      name,
      path,
      cover: covers.has(name) ? `${CUSTOM_PREFIX}://${covers.get(name)}` : ''
    })
  }
  return result
}

const processCovers = (folder: string) => {
  fs.readdirSync(folder).forEach((file) => {
    const fileName = getPureName(file)
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
            console.log(result)
            if (!result.canceled) {
              return resolve(result.filePaths[0])
            }
            return resolve('')
          })
          .catch((e) => {
            console.log(e)
            reject(e)
          })
      })
  )

  ipcMain.handle('traverse-folder', async (event, path) => {
    try {
      initData()
      const all = traverse(path)
      return all
    } catch (error) {
      console.error(error)
      return []
    }
  })

  ipcMain.handle('get-cover', async (event, code: string, rootPath: string) => {
    const res = await getCover(code, rootPath)
    console.log(res)
    return res
  })

  ipcMain.on('play', (event, videoPath) => {
    console.log('play')
    console.log(videoPath)
    exec(`open -a iina ${videoPath}`)
  })
}
