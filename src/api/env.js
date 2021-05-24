/**
 * HTTP 连接 和 WS连接的地址
 */

// let host = '192.168.0.101';
let host = '192.168.43.8';


let imgUrl = 'http://' + host + ':8090/img/ae/'
let gameCoreUrl = 'ws://' + host + ':8090'
let baseUrl = 'http://' + host + ':8090';

export {
  baseUrl,gameCoreUrl,imgUrl
}
