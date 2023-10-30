import { extname } from 'path'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { COVERS_DIR_FULL_PATH } from './constants'
import * as fs from 'fs'

const ignoreChar = /\._|_uncensored$/gi

const clearCode = /_uncensored$|(_[a-zA-Z])$|-|/gi

const prefix = 'https://www.141jav.com/torrent/'

export const getPureName = (path: string, hasExt = false): string => {
  let fileName = path.split('/').pop()
  fileName = fileName?.replace(ignoreChar, '') || ''
  if (hasExt) {
    return fileName
  } else {
    return fileName.replace(extname(fileName), '')
  }
}

export const getCover = async (code: string, rootPath: string): Promise<boolean> => {
  const originCode = code
  code = code.replace(clearCode, '').toLocaleLowerCase()
  console.log('code: ', code)
  try {
    const res = await axios.get(prefix + code)
    if (res.status === 200) {
      const $ = await cheerio.load(res.data)
      const img = $('.image')
      const url = img.attr('src')
      if (url) {
        return await downloadImage(url, rootPath + COVERS_DIR_FULL_PATH + originCode + '.jpg')
      }
    }
  } catch (error) {
    console.log(error)
    return false
  }
  return false
}

export const downloadImage = async (url: string, downloadPath: string): Promise<boolean> => {
  const res = await axios.get(url, {
    responseType: 'arraybuffer'
  })
  if (res.status !== 200) {
    return false
  }

  try {
    fs.writeFileSync(downloadPath, res.data)
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}
