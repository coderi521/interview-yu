// Js实现一个带并发限制的异步调度器Scheduler，保证同时运行的任务最多有两个。
class Scheduler {
  constructor(maxNum) {
    this.taskList = [];
    this.count = 0;
    this.maxNum = maxNum;
  }
  async add(promiseCreator) {
    if (this.count >= this.maxNum) {
      await new Promise((resolve) => {
        this.taskList.push(resolve);
      });
    }
    this.count++;
    const result = await promiseCreator();
    this.count--;
    if (this.taskList.length > 0) {
      this.taskList.shift()();
    }
    return result;
  }
}

const timeout = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });
const scheduler = new Scheduler(2);
const addTask = (time, val) => {
  scheduler.add(() => {
    return timeout(time).then(() => {
      console.log(val);
    });
  });
};
addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");
// 运行结果：2，3，1，4

// 第二种

class Scheduler {
  constructor() {
    this.needRunTasks = [];
    this.runTasks = [];
  }
  add(prmoiseFn) {
    return new Promise((resolve, reject) => {
      prmoiseFn.resolve = resolve; //保存Promise状态,现在不能执行
      if (this.runTasks.length < 2) {
        this.run(prmoiseFn);
      } else {
        this.needRunTasks.push(prmoiseFn);
      }
    });
  }
  run(prmoiseFn) {
    this.runTasks.push(prmoiseFn);
    prmoiseFn().then(() => {
      prmoiseFn.resolve();
      this.runTasks.splice(this.runTasks.indexOf(prmoiseFn), 1); //移除执行后的任务
      if (this.needRunTasks.length > 0) {
        this.run(this.needRunTasks.shift());
      }
    });
  }
}

const timeout = (time) => new Promise((resolve) => setTimeout(resolve, time));
const scheduler = new Scheduler();
const addTask = (time, order) =>
  scheduler.add(() => timeout(time)).then(() => console.log(order));

addTask(400, 4);
addTask(200, 2);
addTask(300, 3);
addTask(100, 1);
