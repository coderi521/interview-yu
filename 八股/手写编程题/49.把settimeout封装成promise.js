function timeout(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
timeout(2000)
  .then(() => {
    console.log("houdunren.com");
    return timeout(2000);
  })
  .then((value) => {
    console.log("hdcms.com");
  });
