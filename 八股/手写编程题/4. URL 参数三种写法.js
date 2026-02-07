// 第一种写法
// 1. 指定参数名称，返回该参数的值 或者 空字符串
// 2. 不指定参数名称，返回全部的参数对象 或者 {}
// 3. 如果存在多个同名参数，则返回数组
// 4. 不支持URLSearchParams方法

function getUrlParam(sUrl, sKey) {
  let arr = sUrl.split("?")[1].split("#")[0].split("&");
  let obj = {};
  arr.forEach((item) => {
    let [key, value] = item.split("=");
    if (key in obj) {
      obj[key] = [].concat(obj[key], value);
    } else {
      obj[key] = value;
    }
  });
  return sKey ? obj[sKey] || "" : obj;
}

console.log(
  getUrlParam(
    "https://www.baidu.com/s?id=123&name=why&phone=13876769797",
    "name"
  )
);

// 第二种写法
let url =
  "http://www.domain.com/?user=anonymous&id=123&id=456&city=%E5%8C%97%E4%BA%AC&enabled";
parseParam(url);
/* 结果
{ user: 'anonymous',
  id: [ 123, 456 ], // 重复出现的 key 要组装成数组，能被转成数字的就转成数字类型
  city: '北京', // 中文需解码
  enabled: true, // 未指定值得 key 约定为 true
}
*/

// 代码
function parseParam(url) {
  const paramsStr = /.+\?(.+)$/.exec(url)[1]; // 将 ? 后面的字符串取出来
  const paramsArr = paramsStr.split("&"); // 将字符串以 & 分割后存到数组中
  let paramsObj = {};
  // 将 params 存到对象中
  paramsArr.forEach((param) => {
    if (/=/.test(param)) {
      // 处理有 value 的参数
      let [key, val] = param.split("="); // 分割 key 和 value
      val = decodeURIComponent(val); // 解码
      val = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转为数字
      if (paramsObj.hasOwnProperty(key)) {
        // 如果对象有 key，则添加一个值
        paramsObj[key] = [].concat(paramsObj[key], val);
      } else {
        // 如果对象没有这个 key，创建 key 并设置值
        paramsObj[key] = val;
      }
    } else {
      // 处理没有 value 的参数
      paramsObj[param] = true;
    }
  });
  return paramsObj;
}

// 第三种写法
const url = "https://www.baidu.com/s?id=123&name=why&phone=13876769797";

function getQueryString(url) {
  const index = url.indexOf("?");
  // 无参数直接返回
  if (index === -1) return undefined;
  const result = {};
  // 截取参数
  const str = url.substr(index + 1);
  // 切割参数
  const strArr = str.split("&");
  // 遍历赋值
  strArr.forEach((item) => {
    const [key, value] = item.split("=");
    result[key] = value;
  });
  return result;
}

const query = getQueryString(url);

console.log(query);
