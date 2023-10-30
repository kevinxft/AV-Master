import { useStore } from '@renderer/common/useStore'
import MoviePost from '../MoviePost'
import { useInView } from 'react-intersection-observer'
import { FloatButton } from 'antd'
import { ToTopOutlined } from '@ant-design/icons'
import { useRef } from 'react'

function MovieWall(): JSX.Element {
  const videos = useStore((state) => state.videos)
  const fullCover = useStore((state) => state.fullCover)
  const { ref } = useInView({
    threshold: 0
  })

  const container = useRef<HTMLDivElement>(null)
  const onToTop = () => {
    if (container.current) {
      container.current.scrollTop = 0
    }
  }

  return (
    <div ref={container} className="flex-1 overflow-y-auto scroll-smooth">
      <div
        ref={ref}
        className={`grid gap-2 p-2 ${
          fullCover
            ? 'min-[400px]:grid-cols-1 min-[800px]:grid-cols-2 min-[1200px]:grid-cols-3 min-[1600px]:grid-cols-4 min-[2000px]:grid-cols-5 min-[2400px]:grid-cols-6 min-[2800px]:grid-cols-7"'
            : 'min-[300px]:grid-cols-2 min-[550px]:grid-cols-3 min-[800px]:grid-cols-4 min-[1050px]:grid-cols-5 min-[1300px]:grid-cols-6 min-[1550px]:grid-cols-7 min-[1800px]:grid-cols-8 min-[2050px]:grid-cols-9 min-[2300px]:grid-cols-10 min-[2550px]:grid-cols-11 min-[2800px]:grid-cols-12'
        }`}
      >
        {videos.map((video) => (
          <MoviePost key={video.path} video={video} />
        ))}
      </div>
      <FloatButton onClick={onToTop} type="primary" icon={<ToTopOutlined />} />
    </div>
  )
}

export default MovieWall
