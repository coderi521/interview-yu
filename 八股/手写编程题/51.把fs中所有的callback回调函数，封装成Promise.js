const fs = require("fs");
const promisify = function (callBack) {
  return function (...args) {
    //...args应该放在这里，返回一个函数，拿到函数的参数。
    return new Promise((resolve, reject) => {
      callBack(...args, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
  };
};
const fsReadFile = promisify(fs.readFile);
fsReadFile("./test.txt", "utf-8")
  .then((data) => console.log(data))
  .catch((err) => reject(err));
