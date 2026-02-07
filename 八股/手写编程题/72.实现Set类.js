class Set {
  constructor() {
    this.items = {};
  }
  add(val) {
    if (!this.has(val)) {
      this.items[val] = val;
      return true;
    } else {
      return false;
    }
  }

  has(val) {
    // return val in this.items;
    return this.items.hasOwnProperty(val);
  }

  remove(val) {
    if (this.has(val)) {
      delete this.items[val];
    }
  }

  clear() {
    this.items = {};
  }
  size() {
    return Object.keys(this.items).length;
  }
  values() {
    let arr = [];
    Object.keys(this.items).forEach((item) => {
      arr.push(this.items[item]);
    });
    return arr;
  }
}

let setDemo = new Set();
setDemo.add("demo");
setDemo.add("demo1");
setDemo.add("demo2");
setDemo.size();
setDemo.values();
