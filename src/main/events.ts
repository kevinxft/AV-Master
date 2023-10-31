import { ipcMain, dialog, BrowserWindow } from 'electron'
import { exec } from 'child_process'
import path from 'path'
import { getPureName, getCover } from './utils'
import fs from 'fs'
import { AV_MASTER_COVERS_DIR, AV_MASTER_CONFIG_DIR, CUSTOM_PREFIX } from './constants'

const movieReg = /\.(mkv|mp4|avi)$/i
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
      // 是视频文件,进行处理
      if (movieReg.test(fullPath)) {
        // 获取这种奇怪的前缀
        if (!path.basename(fullPath).startsWith('._')) {
          videos.push(fullPath)
        }
      }
    }
  })

  return {
    videos: formatVideos(videos, covers),
    folders: [...folders]
  }
}

const formatVideos = (videoPaths: string[], covers: Map<string, string>) => {
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

export const initEvents = (mainWindow: BrowserWindow) => {
  ipcMain.handle(
    'select-folder',
    async () =>
      new Promise((resolve, reject) => {
        dialog
          .showOpenDialog(mainWindow, { properties: ['openDirectory'] })
          .then((result) => {
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
    return res
  })

  ipcMain.on('play', (event, videoPath) => {
    exec(`open -a iina ${videoPath}`)
  })

  ipcMain.on('sipder-cover', async (event, rootPath, folderName) => {
    initData()
    let { videos } = traverse(rootPath)
    if (folderName) {
      videos = videos.filter((video) => video.path.includes(folderName))
    }
    const noCoverVideos = videos.filter((v) => v.cover === '')
    let count = 0
    const total = noCoverVideos.length
    for (const video of noCoverVideos) {
      console.log(video.name)
      await getCover(video.name, rootPath)
      mainWindow.webContents.send('spider-cover-progress', {
        percent: Math.ceil((count++ / total) * 100),
        done: false
      })
    }
    mainWindow.webContents.send('spider-cover-progress', { percent: 100, done: true })
  })
}
