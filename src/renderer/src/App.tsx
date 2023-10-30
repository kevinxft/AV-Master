import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useStore } from '@renderer/common/useStore'
import MovieWall from '@renderer/components/MovieWall'
import SearchBar from '@renderer/components/SearchBar'
import Siderbar from '@renderer/components/SiderBar'
import { getLocalData } from '@renderer/common/utils'

function App(): JSX.Element {
  const navigate = useNavigate()
  const setVideos = useStore((state) => state.setVideos)
  const setFolders = useStore((state) => state.setFolders)
  const setRootPath = useStore((state) => state.setRootPath)

  async function initData(directory) {
    const result = await getLocalData(directory)
    setVideos(result.videos)
    setFolders(result.folders)
    setRootPath(directory)
  }

  useEffect(() => {
    const directory = localStorage.getItem('root')
    if (directory) {
      initData(directory)
    } else {
      navigate('/welcome')
    }
  }, [])

  return (
    <div className="flex h-screen">
      <Siderbar />
      <div className="flex flex-col flex-1">
        <SearchBar />
        <MovieWall />
      </div>
    </div>
  )
}

export default App
