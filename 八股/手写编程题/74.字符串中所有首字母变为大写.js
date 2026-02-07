var a = 'Hi, my name\'s Han Meimei, a SOFTWARE engineer';  
  
//for循环  
function titleCase(s) {  
    var i, ss = s.toLowerCase().split(/\s+/);  
    for (i = ; i < ss.length; i++) {  
        ss[i] = ss[i].slice(, 1).toUpperCase() + ss[i].slice(1);  
    }  
    return ss.join(' ');  
}  
console.log(titleCase(a));

// for循环+replace：
function titleCase1(str) {  
    //将字符串分解为数组并将其小写化  
    var convertToArray = str.toLowerCase().split(" ");  
  
    for (var i = ; i < convertToArray.length; i++) {  
        var char = convertToArray[i].charAt();  
        //使用 replace()方法将数组中的每个首字母大写化  
        convertToArray[i] = convertToArray[i].replace(char, function replace(char) {  
            return char.toUpperCase();  
        });  
    }  
    return convertToArray.join(" ");  
}  
console.log(titleCase1(a));

// ES6写法
function titleCase5(str) {  
    return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());  
}  
console.log(titleCase5(a));

// 正则+replace：
function titleCase2(s) {  
    return s.toLowerCase().replace(/\b([\w|']+)\b/g, function(word) {  
        //return word.slice(, 1).toUpperCase() + word.slice(1);  
        return word.replace(word.charAt(), word.charAt().toUpperCase());  
    });  
}  
console.log(titleCase2(a));

// 数组+map：
function titleCase3(s) {  
    return s.toLowerCase().split(/\s+/).map(function(item, index) {  
        return item.slice(, 1).toUpperCase() + item.slice(1);  
    }).join(' ');  
}  
console.log(titleCase3(a));

// 数组+reduce
function titleCase4(s) {  
    return s.toLowerCase().split(/\s+/).reduce(function(prev, item, array, array) {  
        return prev + (prev.trim() && ' ') + item.slice(, 1).toUpperCase() + item.slice(1);  
    }, '');  
}  
console.log(titleCase4(a));