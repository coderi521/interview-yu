const task = (timer, type) =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log(type);
      resolve();
    }, timer);
  });

const step = async () => {
  await task(3000, "red");
  await task(2000, "green");
  await task(1000, "yellow");
  step();
};

step();
