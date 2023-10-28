import { create } from 'zustand'

export type VideoType = {
  path: string
  formatName: string
  name: string
  url?: string
}

interface StateType {
  setVideos: (videos: VideoType[]) => void
  videos: VideoType[]
}

const initState = {
  videos: []
}

export const useState = create<StateType>()((set) => ({
  ...initState,
  setVideos: (videos) => set(() => ({ videos }))
}))
