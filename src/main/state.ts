import { create } from 'zustand'

export type VideoType = {
  path: string
  name: string
  formattedName: string
  cover?: string
}

type ValueType = {
  videos: VideoType[]
  rootPath: string
  covers: Map<string, string>
}

type FunctionType = {
  setVideos: (videos: VideoType[]) => void
}

const initState = {
  rootPath: '',
  videos: [],
  covers: new Map()
}
type StateType = ValueType & FunctionType
export const useStore = create<StateType>()((set) => ({
  ...initState,
  setVideos: (videos) => set({ videos })
}))
