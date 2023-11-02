import { useState, useEffect } from 'react'
import {
  CalendarOutlined,
  DatabaseOutlined,
  HeartFilled,
  VideoCameraOutlined
} from '@ant-design/icons'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useStore } from '@renderer/common/useStore'
import { KEY_TO_STR, ALL_KEY, LOVE_KEY, RECENT_KEY } from '@renderer/common/constants'
import { formatTitle } from '@renderer/common/utils'

const topMenus = [
  {
    label: KEY_TO_STR[ALL_KEY],
    key: ALL_KEY,
    icon: <DatabaseOutlined />
  },
  {
    label: KEY_TO_STR[LOVE_KEY],
    key: LOVE_KEY,
    danger: true,
    icon: <HeartFilled />
  },
  {
    label: KEY_TO_STR[RECENT_KEY],
    key: RECENT_KEY,
    icon: <CalendarOutlined />
  }
]

type MenuItem = Required<MenuProps>['items'][number]

const generateMenu = (root: string, folders: string[]): MenuItem[] => {
  const rootName: string = root.split('/').pop() as string
  return [
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

export default function Siderbar(): JSX.Element {
  const folders = useStore((state) => state.folders)
  const rootPath = useStore((state) => state.rootPath)
  const current = useStore((state) => state.current)
  const setCurrent = useStore((state) => state.setCurrent)
  const [menus, setMenus] = useState<MenuProps['items']>([])

  useEffect(() => {
    if (rootPath) {
      setMenus(generateMenu(rootPath, folders))
    }
  }, [folders, rootPath])

  const onClick = ({ key }) => {
    setCurrent([key])
    document.title = formatTitle(key)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <Menu
        onClick={onClick}
        defaultSelectedKeys={current}
        selectedKeys={current}
        mode="vertical"
        items={topMenus}
      />
      <div className="flex-1 overflow-y-auto">
        <Menu
          onClick={onClick}
          defaultSelectedKeys={current}
          selectedKeys={current}
          mode="inline"
          items={menus}
        ></Menu>
      </div>
    </div>
  )
}
