class eventBus {
  constructor() {
    this.eventMap = {};
  }
  addEventListener(eventname, fn, isOnce) {
    const taskObj = { fn, isOnce };
    if (!this.eventMap[eventname]) {
      this.eventMap[eventname] = [taskObj];
    } else {
      this.eventMap[eventname].push(taskObj);
    }
  }
  on(eventname, fn) {
    this.addEventListener(eventname, fn, false);
  }
  once(eventname, fn) {
    this.addEventListener(eventname, fn, true);
  }
  off(eventname) {
    this.eventMap[eventname] = [];
  }
  trigger(eventname) {
    const tasks = this.eventMap[eventname];
    const onceTasks = [];
    tasks &&
      tasks.forEach((item, index) => {
        const { fn, isOnce } = item;
        fn && fn();
        if (isOnce) {
          onceTasks.push(index);
        }
      });
    onceTasks.forEach((index) => {
      this.eventMap[eventname].splice(index, 1);
    });
  }
}
const bus = new eventBus();
const fn1 = () => {
  console.log("fn1");
};
const fn2 = () => {
  console.log("fn2");
};
bus.on("fn", fn1);
bus.once("fn", fn2);
bus.on("fn", fn1);
bus.trigger("fn"); // fn1 fn2 fn1
bus.trigger("fn"); // fn1 fn1
bus.off("fn");
bus.trigger("fn"); // null
