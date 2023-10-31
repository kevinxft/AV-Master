import { extname } from 'path'
import { COVERS_DIR_FULL_PATH } from './constants'
import * as fs from 'fs'
import { net } from 'electron'
import * as cheerio from 'cheerio'

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
  const url = prefix + code
  const response = await net.fetch(url)
  if (response.ok) {
    const body = await response.text()
    const $ = await cheerio.load(body)
    const img = $('.image')
    const url = img.attr('src')
    if (url) {
      const downloadPath = rootPath + COVERS_DIR_FULL_PATH + originCode + '.jpg'
      return await downloadImage(url, downloadPath)
    }
  }
  return false
}

export const downloadImage = async (url: string, downloadPath: string): Promise<boolean> => {
  const response = await net.fetch(url, {})
  if (!response.ok) {
    return false
  }
  try {
    const data = await response.arrayBuffer()
    const buffer = Buffer.from(data)
    fs.writeFileSync(downloadPath, buffer)
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}
