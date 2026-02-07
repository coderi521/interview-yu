class EventEmitter {
  constructor() {
    this._events = {};
  }
  on(event, cb) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(cb);
    return this;
  }
  emit(event, ...args) {
    let arr = this._events[event];
    for (let cb of arr) {
      cb(...args);
    }
    return this;
  }
  off(event, cb) {
    if (!cb) {
      return;
    }
    if (this._events[event]) {
      this._events[event] = this._events[event].filter((cbitem) => {
        return cb !== cbitem;
      });
    }
    return this;
  }
  once(event, cb) {
    let fn = function (...args) {
      cb.apply(this, ...args);
      this.off(event, fn);
    };
    fn = fn.bind(this);
    this.on(event, fn);
    return this;
  }
}
