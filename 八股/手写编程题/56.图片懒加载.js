// 与普通的图片懒加载不同，如下这个多做了 2 个精心处理：

// 图片全部加载完成后移除事件监听；
// 加载完的图片，从 imgList 移除；

let imgList = [...document.querySelectorAll("img")];
let length = imgList.length;

const imgLazyLoad = function () {
  let count = 0;
  return (function () {
    let deleteIndexList = [];
    imgList.forEach((img, index) => {
      let rect = img.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        img.src = img.dataset.src;
        deleteIndexList.push(index);
        count++;
        if (count === length) {
          document.removeEventListener("scroll", imgLazyLoad);
        }
      }
    });
    imgList = imgList.filter((img, index) => !deleteIndexList.includes(index));
  })();
};
