// /* eslint-disable @typescript-eslint/no-var-requires */
// const { contextBridge, ipcRenderer } =  require('electron')

// contextBridge.exposeInMainWorld(
//   'ipcRenderer', {
//     send: (channel, data) => {
//       let validChannels = ["toMain"];
//       if (validChannels.includes(channel)) {
//         ipcRenderer.send(channel, data);
//       }
//     },
//     receive: (channel, func) => {
//       let validChannels = ["fromMain"];
//       if (validChannels.includes(channel)) {
//         ipcRenderer.on(channel, (event, ...args) => {
//           try {
//             func(...args);
//           } catch (error) {
//             console.error('Error in ipcRenderer receive handler:', error);
//           }
//         });
//       }
//     },
//     invoke: async (channel, data) => {
//       let validChannels = ["async-message", "synchronous-message"];
//       if (validChannels.includes(channel)) {
//         try {
//           return await ipcRenderer.invoke(channel, data);
//         } catch (error) {
//           console.error('Error in ipcRenderer invoke:', error);
//           throw error;
//         }
//       }
//     }
//   }
// );

// process.on('unhandledRejection', (error) => {
//   console.error('Unhandled promise rejection:', error);
// });