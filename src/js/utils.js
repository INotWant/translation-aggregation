"use strict";

/**
 * usage: format("{0}abc{1}", 'dd', 1); // 0abcdd
 * 
 * @param {string} str 
 * @param  {...any} rest 
 */
function format(str, ...rest) {
    if (typeof str === 'string' && str.constructor == String) {
        if (rest.length === 0)
            return str;
        let newStr = str;
        for (let formatI = 0; formatI < rest.length; ++formatI)
            newStr = newStr.replace(new RegExp("\\{" + formatI + "\\}", "g"), rest[formatI]);
        return newStr;
    }
    return str;
}

/**
 * package XMLHttpRequest to Promise
 * 
 * @param method "GET" "POST" ...
 * @param url 
 * @param headers [header, ...], must iterable
 * @param data http body
 * 
 * @returns a Promise obj
 */
function requestPromise({ method, url, headers = null, data = null, timeout = 3000 }) {
    return new Promise(function (resolve, reject) {
        let request = new XMLHttpRequest();
        request.timeout = timeout;
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    resolve(request.responseText);
                } else {
                    reject(request.status);
                }
            }
        };
        request.open(method, url);
        if (headers != null) {
            for (let header of headers) {
                request.setRequestHeader(header[0], header[1]);
            }
        }
        request.send(data);
    });
}

/**
 * get symbol of the language
 * 
 * @param {str} engine 'google' or 'youdao' or 'baidu' or 'tencent'
 * @param {str} lang '中文' or '英语' or '日语' or '韩语'
 */
function getLangSymbol(engine, lang) {
    let x = engine === 'google' ? 0 : (engine === 'youdao' ? 1 : (engine === 'baidu' ? 2 : (engine === 'tencent' ? 3 : -1)));
    let y = lang === '中文' ? 0 : (lang === '英语' ? 1 : (lang === '日语' ? 2 : (lang === '韩语' ? 3 : -1)));
    let table = [
        ["zh", "en", "ja", "ko"],       // google
        ["zh-CHS", "en", "ja", "ko"],   // youdao
        ["zh", "en", "jp", "kor"],      // baidu
        ["zh", "en", "jp", "kr"]];      // tencent
    if (x === -1 || y === -1)
        return "auto";
    return table[x][y];
}

var utils = {
    "format": format,
    "requestPromise": requestPromise,
    "getLangSymbol": getLangSymbol,
}

module.exports = utils;
