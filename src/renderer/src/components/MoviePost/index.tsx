import { VideoType, useStore } from '@renderer/common/useStore'
import { Button } from 'antd'
import { HeartFilled, HeartOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { InView } from 'react-intersection-observer'

type propsType = {
  video: VideoType
}

const MoviePost = ({ video }: propsType) => {
  const fullCover = useStore((state) => state.fullCover)
  const rootPath = useStore((state) => state.rootPath)
  const [isInView, setInView] = useState(false)
  const [like, setLike] = useState(false)
  const [loading, setLoading] = useState(false)

  const refreshData = useStore((state) => state.initData)

  const onPlay = () => {
    window.electron.ipcRenderer.send('play', video.path)
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
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-2 text-sm text-white text-black-400 bg-black/50">
          <Button
            loading={loading}
            onClick={onGetCover}
            type="link"
            size="small"
            style={{ color: 'white' }}
          >
            {video.name}
          </Button>
          <Button
            type="link"
            danger
            onClick={() => setLike(!like)}
            icon={like ? <HeartFilled /> : <HeartOutlined />}
            size="small"
          />
        </div>
        <img
          src={isInView ? video.cover : ''}
          className={!fullCover ? 'absolute right-0 z-0 object-cover h-[100%] max-w-[215%]' : ''}
        />
        <div className="absolute inset-0 grid transition-all select-none group hover:bg-black/40">
          <PlayCircleOutlined
            onClick={onPlay}
            className="hidden m-auto text-transparent cursor-pointer group-hover:block"
            style={{ fontSize: '60px', color: 'white' }}
          />
        </div>
      </div>
    </InView>
  )
}

export default MoviePost
