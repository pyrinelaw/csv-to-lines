## csv-to-lines

将 csv 文件 或者 csv 文件中字符串转换为数组

### 使用示例

```javascript
const path = require('path');
const csvToLines = require('csv-to-lines');

const string = fs.readFileSync(path.join(__dirname, 'web.csv'), 'utf-8');

console.warn(csvToLines.byFile(path.join(__dirname, 'web.csv')));
console.warn(csvToLines.byString(string));
```

### 方法说明

#### byFile(file);

file: csv 文件路径

#### byString(string);

string: csv 文本字符串