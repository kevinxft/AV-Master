import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { useStore } from '@renderer/common/useStore'
import MovieWall from '@renderer/components/MovieWall'
import { FAVORITE_SYMBOL } from '@renderer/common/constants'
import { Divider, FloatButton } from 'antd'
import {
  HeartOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
  HeartFilled,
  FieldTimeOutlined,
  TagsOutlined,
  FileImageFilled,
  FileImageOutlined
} from '@ant-design/icons'

function App(): JSX.Element {
  const navigate = useNavigate()
  const initData = useStore((state) => state.initData)
  const videos = useStore((state) => state.videos)
  const rootPath = useStore((state) => state.rootPath)
  const fullCover = useStore((state) => state.fullCover)
  const toggleFullCover = useStore((state) => state.toggleCover)
  const search = useStore((state) => state.search)
  const setSearch = useStore((state) => state.setSearch)

  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (rootPath) {
      if (videos.length === 0) {
        initData(rootPath)
      }
    } else {
      navigate('/welcome')
    }
  }, [])

  const onTop = () => {
    if (wrapRef.current) {
      wrapRef.current.scrollTop = 0
    }
  }

  const onBottom = () => {
    if (wrapRef.current) {
      wrapRef.current.scrollTop = wrapRef.current.scrollHeight
    }
  }

  const toggleShowFavorite = (show) => {
    if (show) {
      setSearch([FAVORITE_SYMBOL])
    } else {
      setSearch([])
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex items-center h-8 pl-24 drag">
        {search
          .filter((s) => s !== FAVORITE_SYMBOL)
          .map((tag) => (
            <div key={tag}>{tag}</div>
          ))}
      </div>
      <div ref={wrapRef} className="flex-1 overflow-y-auto scroll-smooth">
        <MovieWall />
      </div>
      <FloatButton.Group shape="square" style={{ background: '#fff' }}>
        <FloatButton onClick={onTop} icon={<VerticalAlignTopOutlined />} />
        <FloatButton icon={<TagsOutlined />} />
        <FloatButton icon={<FieldTimeOutlined />} />
        <FloatButton
          onClick={() => toggleShowFavorite(!search.includes(FAVORITE_SYMBOL))}
          icon={
            search.includes(FAVORITE_SYMBOL) ? (
              <HeartFilled style={{ color: '#FA7070' }} />
            ) : (
              <HeartOutlined />
            )
          }
        />
        <FloatButton
          onClick={() => toggleFullCover()}
          icon={fullCover ? <FileImageFilled /> : <FileImageOutlined />}
        />
        <FloatButton onClick={onBottom} icon={<VerticalAlignBottomOutlined />} />
      </FloatButton.Group>
    </div>
  )
}

export default App
