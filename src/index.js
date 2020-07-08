const fs = require('fs');
const path = require('path');
const assert = require('assert');
const matchAll = require('match-all');

const transformLine = (line, index) => {
    const list = line.split(',');
    const result = [];
    let temp = '';

    for (var i=0; i< list.length; i++) {
        const data = list[i];

        // csv 文件中，存在双引号或者逗号的情况下会用双引号标注
        // csv 文件中，"" => "
        temp += `${temp ? ',' : ''}${data}`;

        const markNum = matchAll(temp, /(")/gi).toArray().length;
        
        if ((markNum % 2) == 0) {
            result.push(temp);
            temp = '';
        } else {
            continue;
        }
    }

    return result;
}

const csvToLinesByString = (string) => {
    assert(typeof(string) == 'string', 'The string type must be String!');

    const list = string.split(/\n/);
    const lines = [];

    list.forEach((line, index) => {
        lines.push(transformLine(line, index));
    });

    return lines;
}

const csvToLinesByFile = (file) => {
    assert(file, 'The file must be set!');
    const csv = fs.readFileSync(file, 'utf-8');
    
    return csvToLinesByString(csv);
}

exports.byFile = csvToLinesByFile;
exports.byString = csvToLinesByString;