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

const topMenus = [
  {
    label: '全部',
    key: 'ALL',
    icon: <DatabaseOutlined />
  },
  {
    label: '最爱',
    key: 'LIKE',
    danger: true,
    icon: <HeartFilled />
  },
  {
    label: '最近',
    key: 'RECENT',
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
  const showSiderbar = useStore((state) => state.siderbar)
  const folders = useStore((state) => state.folders)
  const rootPath = useStore((state) => state.rootPath)
  const [menus, setMenus] = useState<MenuProps['items']>([])

  useEffect(() => {
    if (rootPath) {
      setMenus(generateMenu(rootPath, folders))
    }
  }, [folders, rootPath])

  return (
    <>
      {showSiderbar ? (
        <div className="flex flex-col bg-white w-52">
          <Menu mode="inline" items={topMenus} />
          <div className="overflow-y-auto">
            <Menu mode="inline" items={menus}></Menu>
          </div>
        </div>
      ) : null}
    </>
  )
}
