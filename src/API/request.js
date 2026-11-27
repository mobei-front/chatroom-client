/**
 * @file request.js
 * @description API请求相关代码
 */
import axios from 'axios';
import { io } from 'socket.io-client';


const server = {
  host: "http://localhost:5000",
}


class Request {
  constructor(parameters) {
    this.axios = axios.create({
      baseURL: server.host,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  post(url, data) {
    return this.axios.post(url, data);
  };

  get(url) {
    return this.axios.get(url);
  };

  put(url, data) {
    return this.axios.put(url, data);
  };

  delete(url) {
    return this.axios.delete(url);
  };
}

// // 设置请求拦截器
// axios.interceptors.request.use(config => {
//   return config;
// });

class WSS {
  constructor() {
    this.ws = io("ws://localhost:5000", {
      transports: ['websocket'],
      autoConnect: false,
      query: {
        token: localStorage.getItem('token')
      },
    })
  }

  connect() {
    console.log("开始连接");
    let res = this.ws.connect();
    console.log("连接状态：", this.ws.connected);
    console.log(this.ws.id);
    return res;
  }

  on(event, callback) {
    this.ws.on(event, callback);
  }

  once(event, callback) {
    this.ws.once(event, callback);
  }

  emit(event, data) {
    this.ws.emit(event, data);
  }

  reconnect() {
    this.ws.reconnect();
  }

  disconnect() {
    this.ws.disconnect();
    console.log("长连接结束了");
  }

}

class SSE {
  constructor(parameters) {
    // 私有属性
    this.sse = null;
  }

  connect() {
    this.sse = new EventSource(`${server.host}/stream`);
  }

  onerr(fn) {
    console.log("SSE连接失败");
  }

  on(event, fn) {
    if (!this.sse) {
      this.connect();
    }
    this.sse.addEventListener(event, fn);
  }

  disconnect() {
    if (!this.sse) {
      return;
    }
    this.sse.close();
    this.sse = null;
  }


}

const ws = new WSS();
const request = new Request();
const sse = new SSE();

// 导出API请求方法
export {request, ws, sse};
