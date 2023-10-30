import { create } from 'zustand'
import { getLocalData } from './utils'

const ALL = Symbol('ALL')

export type VideoType = {
  path: string
  name: string
  cover?: string
}

type ValueType = {
  videos: VideoType[]
  rootPath: string
  covers: Map<string, string>
  folders: string[]
  query: string
  directory: string | symbol
  fullCover: boolean
  siderbar: boolean
}

type FunctionType = {
  setVideos: (videos: VideoType[]) => void
  setFolders: (folders: string[]) => void
  setRootPath: (rootPath: string) => void
  toggleCover: () => void
  toggleSiderbar: () => void
  initData: (directory?: string) => void
}

const initState = {
  rootPath: '',
  videos: [],
  covers: new Map(),
  directory: ALL,
  query: '',
  fullCover: true,
  siderbar: true,
  folders: []
}

type StateType = ValueType & FunctionType
export const useStore = create<StateType>()((set) => ({
  ...initState,
  setVideos: (videos) => set({ videos }),
  setFolders: (folders) => set({ folders }),
  setRootPath: (rootPath) => set({ rootPath }),
  toggleCover: () => set((state) => ({ fullCover: !state.fullCover })),
  toggleSiderbar: () =>
    set((state) => {
      console.log(state.siderbar)
      return { siderbar: !state.siderbar }
    }),
  initData: async (directory) => {
    if (directory) {
      const result = await getLocalData(directory)
      return set({
        directory,
        folders: result.folders,
        videos: result.videos
      })
    }
  }
}))
