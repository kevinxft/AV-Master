import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MenuFoldOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  SyncOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { Menu, Button, Input } from 'antd'
import type { MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]

const generateMenu = (root: string, folders: string[]): MenuItem[] => {
  const rootName: string = root.split('/').pop() as string
  return [
    {
      label: '全部',
      key: ''
    },
    {
      label: rootName,
      key: rootName,
      icon: <VideoCameraOutlined />,
      children: folders.map((folder) => ({
        label: folder,
        key: folder
      }))
    }
  ]
}

function App(): JSX.Element {
  const navigate = useNavigate()
  const [menus, setMenus] = useState<MenuProps['items']>([])
  useEffect(() => {
    const lastOpened = localStorage.getItem('root') || 'root'
    const getFolders = async () => {
      const result = await window.electron.ipcRenderer.invoke('traverse-folder', lastOpened)
      console.log(result)
      setMenus(generateMenu(lastOpened, result.folders))
    }

    if (lastOpened) {
      getFolders()
    } else {
      navigate('/welcome')
    }
  }, [])

  return (
    <div className="flex h-screen bg-slate-700">
      <div className="bg-white w-52">
        <Menu mode="inline" items={menus}></Menu>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex px-2 py-2 bg-white">
          <Button type="text" icon={<MenuFoldOutlined />}></Button>
          <Button type="text" icon={<SettingOutlined />}></Button>
          <Button type="text" icon={<PictureOutlined />}></Button>
          <Button type="text" icon={<SyncOutlined />}></Button>
          <Input.Search
            placeholder="输入番号"
            allowClear
            enterButton="搜索"
            className="w-64 ml-auto"
          />
        </div>
        <div className="flex-1 overflow-y-auto"></div>
      </div>
    </div>
  )
}

export default App
