import {
  MenuFoldOutlined,
  PictureOutlined,
  SyncOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  PictureFilled
} from '@ant-design/icons'
import { Button, Input } from 'antd'
import { useStore } from '@renderer/common/useStore'
import { useState } from 'react'

function SearchBar(): JSX.Element {
  const toggleSiderbar = useStore((state) => state.toggleSiderbar)
  const toggleCover = useStore((state) => state.toggleCover)
  const showSiderbar = useStore((state) => state.siderbar)
  const fullCover = useStore((state) => state.fullCover)
  const rootPath = useStore((state) => state.rootPath)
  const refreshData = useStore((state) => state.initData)

  const [loading, setLoading] = useState(false)

  const onSyncData = async () => {
    setLoading(true)
    await refreshData(rootPath)
    setLoading(false)
  }

  return (
    <div className="flex px-2 py-2 bg-white text-slate-900">
      <Button
        onClick={toggleSiderbar}
        type="text"
        icon={showSiderbar ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
      ></Button>
      <Button type="text" icon={<SettingOutlined />}></Button>
      <Button
        onClick={toggleCover}
        type="text"
        icon={fullCover ? <PictureFilled /> : <PictureOutlined />}
      ></Button>
      {rootPath && (
        <Button type="text" loading={loading} onClick={onSyncData} icon={<SyncOutlined />}></Button>
      )}
      <Input.Search placeholder="输入番号" allowClear enterButton="搜索" className="w-64 ml-auto" />
    </div>
  )
}

export default SearchBar
