import { useStore, filterVideos } from '@renderer/common/useStore'
import MoviePost from '../MoviePost'
import { useEffect, useRef, useState } from 'react'

function MovieWall(): JSX.Element {
  const videos = useStore((state) => state.videos)
  const favorites = useStore((state) => state.favorites)
  const search = useStore((state) => state.search)
  const fullCover = useStore((state) => state.fullCover)

  const [itemSize, setItemSize] = useState({ width: '220px', height: '320px' })

  const firstChildRef = useRef(null)

  useEffect(() => {
    const observerFirstChild = () => {
      const firstChild = firstChildRef.current

      if (!firstChild) {
        return
      }

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === firstChild) {
            const { width, height } = entry.contentRect
            console.log(width, height)
            setItemSize({ width: `${width}px`, height: `${height}px` })
          }
        }
      })

      resizeObserver.observe(firstChild)

      return () => {
        resizeObserver.disconnect()
      }
    }
    observerFirstChild()
  }, [])

  return (
    <div
      className={`grid gap-2 p-2 ${
        fullCover
          ? 'min-[400px]:grid-cols-1 min-[800px]:grid-cols-2 min-[1200px]:grid-cols-3 min-[1600px]:grid-cols-4 min-[2000px]:grid-cols-5 min-[2400px]:grid-cols-6 min-[2800px]:grid-cols-7"'
          : 'min-[300px]:grid-cols-2 min-[550px]:grid-cols-3 min-[800px]:grid-cols-4 min-[1050px]:grid-cols-5 min-[1300px]:grid-cols-6 min-[1550px]:grid-cols-7 min-[1800px]:grid-cols-8 min-[2050px]:grid-cols-9 min-[2300px]:grid-cols-10 min-[2550px]:grid-cols-11 min-[2800px]:grid-cols-12'
      }`}
    >
      {filterVideos(videos, search, favorites).map((video, index) => (
        <div
          key={video.path}
          ref={index === 0 ? firstChildRef : null}
          style={{
            contentVisibility: 'auto',
            containIntrinsicHeight: itemSize.height,
            containIntrinsicWidth: itemSize.width
          }}
        >
          <MoviePost video={video} />
        </div>
      ))}
    </div>
  )
}

export default MovieWall
