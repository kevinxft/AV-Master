import { Button } from 'antd'
import { FolderOpenOutlined } from '@ant-design/icons'
import { useState } from 'react'

function Welcome(): JSX.Element {
  const [loading, setLoading] = useState(false)
  const onSelectFolder = async () => {
    console.log('onSelectFolder')
    console.log(window.electron)
    setLoading(true)
    const result = await window.electron.ipcRenderer.invoke('select-folder')
    setLoading(false)
    console.log(result)
    window.localStorage.setItem('root', result.rootPath)
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
