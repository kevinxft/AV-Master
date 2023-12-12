import { create } from 'zustand'
import { getLocalData } from './utils'
import { persist } from 'zustand/middleware'
import { FAVORITE_SYMBOL } from '@renderer/common/constants'

export type VideoType = {
  path: string
  name: string
  mtime: number
  cover?: string
}

type ValueType = {
  rootPath: string
  videos: VideoType[]
  favorites: string[]
  search: string[]
  covers: Map<string, string>
  folders: string[]
  fullCover: boolean
}

type FunctionType = {
  setVideos: (videos: VideoType[]) => void
  setFolders: (folders: string[]) => void
  setRootPath: (rootPath: string) => void
  setSearch: (search: string[]) => void
  toggleCover: () => void
  initData: (directory?: string) => void
  refreshData: () => void
  resetData: () => void
  setFavorite: (name: string, remove?: boolean) => void
}

const initState = {
  rootPath: '',
  search: [],
  videos: [],
  favorites: [],
  covers: new Map(),
  folders: [],
  fullCover: false
}

export const filterVideos = (
  videos: VideoType[],
  search: string[],
  favorites: string[]
): VideoType[] => {
  const result = videos.slice().sort((a, b) => b.mtime - a.mtime)
  if (search.length === 0) {
    return result
  }
  if (search.includes(FAVORITE_SYMBOL)) {
    return result.filter((video) => favorites.includes(video.name))
  } else {
    return result.filter((video) =>
      search.some((tag) => video.path.toLocaleLowerCase().includes(tag.toLocaleLowerCase()))
    )
  }
}

type StateType = ValueType & FunctionType
export const useStore = create<StateType>()(
  persist(
    (set, get) => ({
      ...initState,
      setVideos: (videos) => set({ videos }),
      setFolders: (folders) => set({ folders }),
      setSearch: (search) => set({ search }),
      setRootPath: (rootPath) => set({ rootPath }),
      setFavorite: (name, remove = false) =>
        set((state) => {
          if (remove) {
            return { favorites: state.favorites.filter((lv) => lv !== name) }
          } else {
            return { favorites: [...state.favorites, name] }
          }
        }),
      toggleCover: () => set((state) => ({ fullCover: !state.fullCover })),
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
