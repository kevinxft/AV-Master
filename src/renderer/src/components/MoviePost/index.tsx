import { VideoType, useStore } from '@renderer/common/useStore'
import { Button } from 'antd'
import { HeartFilled, HeartOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { InView } from 'react-intersection-observer'
import { shortName } from '@renderer/common/utils'

type propsType = {
  video: VideoType
}

const MoviePost = ({ video }: propsType) => {
  const fullCover = useStore((state) => state.fullCover)
  const rootPath = useStore((state) => state.rootPath)
  const setRecent = useStore((state) => state.setRecent)
  const [isInView, setInView] = useState(false)
  const [loading, setLoading] = useState(false)
  const loves = useStore((state) => state.loves)
  const setLove = useStore((state) => state.setLove)

  const refreshData = useStore((state) => state.initData)

  const onPlay = () => {
    window.electron.ipcRenderer.send('play', video.path)
    setRecent(video.name)
  }
  const onGetCover = async () => {
    if (!loading) {
      setLoading(true)
      const result = await window.electron.ipcRenderer.invoke('get-cover', video.name, rootPath)
      setLoading(false)
      if (result) {
        refreshData(rootPath)
      }
    }
  }
  return (
    <InView as="div" onChange={(inView) => !isInView && inView && setInView(true)}>
      <div
        className={`relative flex flex-col overflow-hidden rounded-lg bg-fuchsia-100 ${
          fullCover ? 'aspect-[4/2.65]' : 'aspect-[1/1.42]'
        }`}
      >
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-0 text-sm text-white text-black-400 bg-black/50">
          <Button
            loading={loading}
            onClick={onGetCover}
            type="link"
            size="small"
            style={{ color: 'white' }}
          >
            {shortName(video.name)}
          </Button>
          <Button
            type="link"
            danger
            onClick={() => setLove(video.name, loves.includes(video.name))}
            icon={loves.includes(video.name) ? <HeartFilled /> : <HeartOutlined />}
            size="small"
          />
        </div>
        <img
          src={isInView ? video.cover : ''}
          className={
            fullCover
              ? 'h-[100%] object-cover'
              : 'absolute right-0 z-0 object-contain h-[100%] max-w-[250%]'
          }
        />
        <div className="absolute inset-0 grid transition-all select-none group hover:bg-black/40">
          <PlayCircleOutlined
            onClick={onPlay}
            className="hidden m-auto text-transparent cursor-pointer group-hover:block"
            style={{ fontSize: '50px', color: '#FCC8D1' }}
          />
        </div>
      </div>
    </InView>
  )
}

export default MoviePost
