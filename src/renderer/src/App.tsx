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
  const showSiderbar = useStore((state) => state.siderbar)

  useEffect(() => {
    if (rootPath) {
      initData(rootPath)
    } else {
      navigate('/welcome')
    }
  }, [])

  return (
    <div className="flex h-screen cursor-pointer pt-7 drag">
      <div className="relative flex flex-1 no-drag">
        <div
          className={`w-[200px] absolute transition-all ease-in-out h-full ${
            showSiderbar ? 'left-0' : 'left-[-200px]'
          }`}
        >
          <Siderbar />
        </div>
        <div
          className={`absolute h-full flex flex-col flex-1 transition-all ease-in-out right-0 ${
            showSiderbar ? 'left-[200px]' : 'left-0'
          }`}
        >
          <SearchBar />
          <MovieWall />
        </div>
      </div>
    </div>
  )
}

export default App
