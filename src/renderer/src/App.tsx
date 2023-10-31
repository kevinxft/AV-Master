import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useStore } from '@renderer/common/useStore'
import MovieWall from '@renderer/components/MovieWall'
import SearchBar from '@renderer/components/SearchBar'
import Siderbar from '@renderer/components/SiderBar'

function App(): JSX.Element {
  const navigate = useNavigate()
  const initData = useStore((state) => state.initData)
  const rootPath = useStore((state) => state.rootPath)

  useEffect(() => {
    if (rootPath) {
      initData(rootPath)
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
