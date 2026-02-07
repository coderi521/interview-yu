// 有的人把发布 订阅模式又叫观察者模式
// 它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。
// 其实他们还是有差别的，在发布订阅模式中，组件是松散耦合的，正好和观察者模式相反。
// 发布订阅模式中，发布者和订阅者不知道对方的存在。它们只有通过消息代理进行通信。
// 在观察者模式中，观察者（订阅）是知道被观察者（发布）的，被观察者也一直保持对观察者进行记录。

// 被观察者
class Subject {
  constructor(name) {
    this.name;
    this.observers = []; // 观察者 存放在被观察者中
    this.state = "停电了，灯不亮";
  }
  // 被观察者要提供一个接受观察者的方法
  attach(observer) {
    this.observers.push(observer); // 存放所有观察者
  }
  setState(newState) {
    // 改变被观察着的状态
    this.state = newState;
    this.observers.forEach((o) => o.update(newState));
  }
}
// 观察者
class Observer {
  constructor(name) {
    this.name = name;
  }
  update(newState) {
    //用来通知所有的观察者状态更新了
    console.log(this.name + "说：" + newState);
  }
}
// 被观察者 灯
let sub = new Subject("灯");
let mm = new Observer("小明");
let jj = new Observer("小健");

// 订阅 观察者
sub.attach(mm);
sub.attach(jj);

sub.setState("灯亮了来电了");
// 小明说：灯亮了来电了
// 小健说：灯亮了来电了
