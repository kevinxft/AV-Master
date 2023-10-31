import { Button } from 'antd'
import { FolderOpenOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@renderer/common/useStore'

function Welcome(): JSX.Element {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setRootPath = useStore((state) => state.setRootPath)
  const onSelectFolder = async () => {
    setLoading(true)
    const path = await window.electron.ipcRenderer.invoke('select-folder')
    setLoading(false)
    if (path) {
      setRootPath(path)
      navigate('/')
    }
  }
  return (
    <div className="grid h-screen bg-slate-600 drag">
      <Button
        className="m-auto bg-slate-400 no-drag"
        type="primary"
        onClick={onSelectFolder}
        icon={<FolderOpenOutlined />}
        loading={loading}
      >
        选择文件夹
      </Button>
    </div>
  )
}

export default Welcome
