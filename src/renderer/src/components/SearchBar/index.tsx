import {
  MenuFoldOutlined,
  PictureOutlined,
  SyncOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  PictureFilled,
  BugOutlined
} from '@ant-design/icons'
import { Button, Input, Tooltip, Progress } from 'antd'
import { useStore } from '@renderer/common/useStore'
import { useEffect, useState } from 'react'
import { ALL_KEY, LOVE_KEY, RECENT_KEY } from '@renderer/common/constants'

function SearchBar(): JSX.Element {
  const toggleSiderbar = useStore((state) => state.toggleSiderbar)
  const toggleCover = useStore((state) => state.toggleCover)
  const setQuery = useStore((state) => state.setQuery)
  const showSiderbar = useStore((state) => state.siderbar)
  const fullCover = useStore((state) => state.fullCover)
  const refreshData = useStore((state) => state.refreshData)
  const [loading, setLoading] = useState(false)
  const [spiderLoading, setSpiderLoading] = useState(false)
  const [spiderPecent, setSpiderPercent] = useState(0)
  const rootPath = useStore((state) => state.rootPath)
  const current = useStore((state) => state.current)

  const onSyncData = async () => {
    setLoading(true)
    await refreshData()
    setLoading(false)
  }

  const onSpiderPicture = async () => {
    if (spiderLoading) {
      return
    }
    setSpiderLoading(true)
    let folderName = current[0]
    folderName = [ALL_KEY, LOVE_KEY, RECENT_KEY].includes(folderName) ? '' : folderName
    window.electron.ipcRenderer.send('sipder-cover', rootPath, folderName)
    window.electron.ipcRenderer.on('spider-cover-progress', async (_, result) => {
      setSpiderPercent(result.percent)
      if (result.done) {
        await refreshData()
        setSpiderLoading(false)
        setSpiderPercent(0)
      }
    })
  }

  useEffect(() => {
    return () => {
      setQuery('')
    }
  }, [])

  return (
    <div className="flex items-center bg-white text-slate-900">
      <div className="p-2">
        <Tooltip title={showSiderbar ? '隐藏侧边栏' : '显示侧边栏'}>
          <Button
            onClick={toggleSiderbar}
            type="text"
            icon={showSiderbar ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          />
        </Tooltip>
        <Tooltip title="设置">
          <Button type="text" icon={<SettingOutlined />} />
        </Tooltip>
        <Tooltip title={fullCover ? '只显示封面' : '显示大封面'}>
          <Button
            onClick={toggleCover}
            type="text"
            icon={fullCover ? <PictureFilled /> : <PictureOutlined />}
          />
        </Tooltip>
        <Tooltip title="同步本地数据">
          <Button
            type="text"
            loading={loading}
            onClick={onSyncData}
            icon={<SyncOutlined />}
          ></Button>
        </Tooltip>
        {![LOVE_KEY, RECENT_KEY].includes(current[0]) ? (
          spiderLoading ? (
            <Progress type="circle" percent={spiderPecent} size={20} />
          ) : (
            <Tooltip title="爬取封面">
              <Button
                type="text"
                loading={spiderLoading}
                onClick={onSpiderPicture}
                icon={<BugOutlined />}
              ></Button>
            </Tooltip>
          )
        ) : null}
      </div>
      <div className="flex-1 drag cursor-pointer h-[100%]"></div>
      <Input.Search
        onSearch={(value) => setQuery(value)}
        placeholder="输入番号"
        allowClear
        enterButton="搜索"
        className="w-64 m-2"
      />
    </div>
  )
}

export default SearchBar
