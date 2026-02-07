/*********** reduce实现 ***********/

// 遍历数组每一项，若值为数组则递归遍历，否则 concat
function flatten(arr) {
  return add.reduce((result, item) => {
    return result.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}

/*********** reduce实现 ***********/

/*********** 递归实现 ***********/

// 递归的遍历每一项，若为数组则继续遍历，否则 concat
function flatten(arr) {
  var res = [];
  arr.map((item) => {
    if (Array.isArray(item)) {
      res = res.concat(flatten(item));
    } else {
      res.push(item);
    }
  });
  return res;
}

/*********** 递归实现 ***********/
