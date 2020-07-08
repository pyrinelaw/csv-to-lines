const fs = require('fs');
const path = require('path');
const csvToLines = require("./csv-to-lines");
const ObjectWriteToFile = require("./object-write-to-file");
const get = require('lodash/get');
const set = require('lodash/set');
const colors = require('colors/safe');
const assert = require('assert');

class CsvToLanguageFiles {
    constructor(file, options) {
        assert(file, 'file must be set!');
        assert(options.outputDir, 'options.outputDir must be set!');

        this.file = file;
        this.options = options || {};
        this.languages = [];
        this.lines = csvToLines.byFile(file);
        this.initLanguagesByFirstLine();
        this.fillingData();
    }

    initLanguagesByFirstLine() {
        const ignoreColumns = this.options.ignoreColumns || [];
        const keyColumn = this.options.keyColumn || 0;
        const firstLine = this.lines[0] || [];
    
        firstLine.forEach((value, index) => {
            if (ignoreColumns.indexOf(index) == -1 && index != keyColumn && value) {
                this.languages.push({
                    name: value,
                    column: index,
                    data: {},
                });
            }
        });

        if (this.languages.length == 0) {
            console.log(colors.yellow("warning：未设置任何的语言类型，请在 csv 文件第一行设置！"));
            console.log(colors.yellow("可能原因：csv 第一行内容为空，或者 ignoreColumns 包含了所有的列"));
        };
    }

    fillingData() {
        const languages = this.languages;

        languages.forEach((language) => {
            this.fillingDataByLanguage(language);
        });
    }

    checkIllegalKey(key) {
        const list = key.split('.');
        
        for (let i = 0; i < list.length; i++) {
            if (list[i] == '') {
                return true;
            }
            if (/^(\d|\s)+$/.test(list[i])) {
                return true;
            }
        }

        return false;
    }

    fillingDataByLanguage(language) {
        const { column, data } = language;
        const { lines = [] } = this;
        const { keyColumn = 0, fold = true } = this.options;

        lines.forEach((line, index) => {
            const key = line[keyColumn];
            const value = line[column] || '';
            let oldValue = undefined;

            if (value && !key) {
                console.log(colors.yellow(`line ${(index + 1)} warning：对应的 value 并未设置 key！`)); 
                return;
            } 

            if (key) {
                oldValue = fold ? data[key] : get(data, key);
            }

            if (key && typeof(oldValue) == 'string') {
                console.log(colors.yellow(`line ${(index + 1)} warning：${key} 已存在，将被覆盖！`));                
            }

            if (key && !value) {
                console.log(colors.yellow(`line ${(index + 1)} warning：${key} 并未设置对应的 value！`));
            }

            if (key) {
                if (this.checkIllegalKey(key)) {
                    console.log(colors.yellow(`line ${(index + 1)} warning：${key} 不符合要求，不能包含空格或者纯数字！`));
                    return;
                }

                if (fold) {
                    data[key] = value;
                    return;
                }

                fold ? (data[key] = value) : set(data, key, value);
            }
        });
    }

    output() {
        const { languages } = this;
        const { outputDir, fileType } = this.options;

        // new ObjectWriteToFile(language.data, path.join(outputDir, `${language.name}.${fileType}`)).output();

        return Promise.all(languages.map(language => {
            return new ObjectWriteToFile(language.data, path.join(outputDir, `${language.name}.${fileType}`)).output();
        }));

        // languages.forEach(language => {
            
        //     // return new ObjectWriteToFile(language.data, path.join(outputDir, `${language.name}.${fileType}`)).output();
        //     new ObjectWriteToFile(language.data, path.join(outputDir, `${language.name}.${fileType}`)).output().then(resp => {
        //         console.warn(resp);
        //         console.warn('then =====<');
        //     }).catch(error => {
        //         console.warn(error);
        //         console.warn('error =====<');
        //     })
        // });
    }
}

const csvToLanguageFiles = (file, options) => {
    const toFiles = new CsvToLanguageFiles(file, options);
    return toFiles.output();
}

module.exports = csvToLanguageFiles;

