const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    saveData: (formData) => ipcRenderer.send("saveData", formData),
    onExcelUpdated: (callback) => ipcRenderer.on("excelUpdated", (_, message) => callback(message))
});
