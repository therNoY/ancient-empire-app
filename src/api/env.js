/**
 * HTTP 连接 和 WS连接的地址
 */

// let host = '192.168.0.102';
// let host = '122.51.229.206';
let host = '127.0.0.1';
// let host = '192.168.43.8';


let imgUrl = 'http://' + host + ':8090/img/ae/';
let gameCoreUrl = 'ws://' + host + ':8090';
let baseUrl = 'http://' + host + ':8090';

export {
  baseUrl,gameCoreUrl,imgUrl
}
