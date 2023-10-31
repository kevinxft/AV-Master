import { KEY_TO_STR } from './constants'

export async function getLocalData(directory: string) {
  const result = await window.electron.ipcRenderer.invoke('traverse-folder', directory)
  return result
}

export const formatTitle = (key: string) => {
  return `AV Master | ${KEY_TO_STR[key] || key}`
}

export const shortName = (name: string) => {
  return name.replace('_uncensored', ' 🙈')
}

export class LRUCache {
  private map: Map<string, string>
  private length
  constructor(length = 20) {
    this.map = new Map()
    this.length = length
  }

  get(key: string) {
    if (!this.map.get(key)) {
      return
    }
    const value = this.map.get(key) || ''
    this.map.delete(key)
    this.map.set(key, value)
    return value
  }

  set(key: string, value: string) {
    if (this.map.get(key)) {
      this.map.delete(key)
    }
    this.map.set(key, value)
    if (this.map.size > this.length) {
      const firstKey = this.map.keys().next().value
      this.map.delete(firstKey)
    }
  }

  toArray(): string[] {
    return Array.from(this.map).map(([key]) => key)
  }

  initData(arr: string[]) {
    for (const item of arr) {
      this.set(item, item)
    }
  }

  clear() {
    this.map.clear()
  }
}
