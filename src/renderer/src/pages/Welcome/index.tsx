import { Button } from 'antd'
import { FolderOpenOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Welcome(): JSX.Element {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const onSelectFolder = async () => {
    setLoading(true)
    const path = await window.electron.ipcRenderer.invoke('select-folder')
    setLoading(false)
    if (path) {
      window.localStorage.setItem('root', path)
      navigate('/')
    } else {
      window.localStorage.removeItem('root')
    }
  }
  return (
    <div className="grid h-screen bg-slate-600">
      <Button
        className="m-auto bg-slate-400"
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
