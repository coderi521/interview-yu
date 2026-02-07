function isVaild(str) {
  const signMap = {
    ')': '(',
    '}': '{',
    ']': '[',
  }
  const stack = []
 for(const s of str) {
   if (signMap[s]) {
     if (stack.length === 0 || stack[stack.length - 1] !== signMap[s]) return false
     stack.pop()
   } else {
    stack.push(s)
   }
 }
 return stack.length === 0
}
console.log(isVaild("()")) // true