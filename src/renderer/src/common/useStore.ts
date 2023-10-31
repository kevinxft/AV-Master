import { create } from 'zustand'
import { getLocalData, LRUCache } from './utils'
import { persist } from 'zustand/middleware'
import { ALL_KEY, LOVE_KEY, RECENT_KEY } from './constants'

const LRU = new LRUCache()

export type VideoType = {
  path: string
  name: string
  cover?: string
}

type ValueType = {
  rootPath: string
  videos: VideoType[]
  loves: string[]
  recent: string[]
  covers: Map<string, string>
  folders: string[]
  query: string
  current: string[]
  fullCover: boolean
  siderbar: boolean
}

type FunctionType = {
  setVideos: (videos: VideoType[]) => void
  setFolders: (folders: string[]) => void
  setRootPath: (rootPath: string) => void
  setCurrent: (current: string[]) => void
  setQuery: (query: string) => void
  toggleCover: () => void
  toggleSiderbar: () => void
  initData: (directory?: string) => void
  refreshData: () => void
  resetData: () => void
  setLove: (name: string, remove?: boolean) => void
  setRecent: (name: string) => void
  clearRecent: () => void
}

const initState = {
  rootPath: '',
  videos: [],
  loves: [],
  recent: [],
  covers: new Map(),
  folders: [],
  query: '',
  current: [ALL_KEY],
  fullCover: true,
  siderbar: true
}

const filterByCurrent = (
  videos: VideoType[],
  current: string,
  loves: string[],
  recent: string[]
): VideoType[] => {
  if (current === ALL_KEY) {
    return videos
  }
  if (current === LOVE_KEY) {
    return videos.filter((video) => loves.includes(video.name))
  } else if (current === RECENT_KEY) {
    return videos.filter((video) => recent.includes(video.name))
  } else {
    return (videos = videos.filter((video) => video.path.includes(current)))
  }
}

export const filterVideos = (
  videos: VideoType[],
  current: string,
  query: string,
  loves: string[],
  recent: string[]
): VideoType[] => {
  videos = filterByCurrent(videos, current, loves, recent)
  console.log('filterVideos')
  if (query) {
    return videos.filter((video) => video.name.toUpperCase().includes(query.toUpperCase()))
  }
  return videos
}

type StateType = ValueType & FunctionType
export const useStore = create<StateType>()(
  persist(
    (set, get) => ({
      ...initState,
      setVideos: (videos) => set({ videos }),
      setFolders: (folders) => set({ folders }),
      setRootPath: (rootPath) => set({ rootPath }),
      setCurrent: (current) => set({ current }),
      setQuery: (query) => set({ query }),
      setLove: (name, remove = false) =>
        set((state) => {
          if (remove) {
            return { loves: state.loves.filter((lv) => lv !== name) }
          } else {
            return { loves: [...state.loves, name] }
          }
        }),
      setRecent: (name: string) =>
        set((state) => {
          state.recent.forEach((r) => {
            LRU.set(r, r)
          })
          LRU.set(name, name)
          return { recent: [...state.recent, name] }
        }),
      clearRecent: () => set({ recent: [] }),
      toggleCover: () => set((state) => ({ fullCover: !state.fullCover })),
      toggleSiderbar: () =>
        set((state) => {
          return { siderbar: !state.siderbar }
        }),
      initData: async (directory) => {
        if (directory) {
          const result = await getLocalData(directory)
          return set({
            rootPath: directory,
            folders: result.folders,
            videos: result.videos
          })
        }
      },
      refreshData: async () => {
        const directory = get().rootPath
        const initData = get().initData
        if (directory) {
          await initData(directory)
        }
      },
      resetData: () => set(initState)
    }),
    {
      name: 'AV-Master'
    }
  )
)
