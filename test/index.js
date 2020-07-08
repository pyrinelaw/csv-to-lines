const path = require('path');
const fs = require('fs');
const csvToLines = require('../src/index.js');

const csvString = fs.readFileSync(path.join(__dirname, 'web.csv'), 'utf-8');

console.warn(csvToLines.byFile(path.join(__dirname, 'web.csv')));
console.warn(csvToLines.byString(`示例或说明,key,zh-Hans,en
确认动作,action.confirm,确认,confirm
取消动作,action.cancel,取消,cancel
,,,
,gender.man.old,老年人,old-man`));

console.warn(csvToLines.byString(`示例或说明,key,zh-Hans,en\n确认动作,action.confirm,确认,confirm\n取消动作,action.cancel,取消,cancel\n,,,\n,gender.man.old,老年人,old-man`));


