export async function getLocalData(directory: string) {
  const result = await window.electron.ipcRenderer.invoke('traverse-folder', directory)
  return result
}
