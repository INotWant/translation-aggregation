"use strict";

const Result = require("./result.class");
const MD5 = require("./md5");
const utils = require("./utils");
const config = require("../config");

const engine = "baidu";
const appid = config["baiduAppid"];
const key = config["baiduKey"];
const url = "http://api.fanyi.baidu.com/api/trans/vip/translate";
const base = "q={0}&from={1}&to={2}&appid={3}&salt={4}&sign={5}";

function findTargetText(msg) {
    let tText = "";
    if (msg && Array.isArray(msg.trans_result)) {
        for (let i = 0; i < msg.trans_result.length; ++i)
            tText += msg.trans_result[i].dst
    }
    return tText;
}

/**
 * Package baidu translation
 * 
 * @param sText original text
 * @param sl    source language
 * @param tl    target language
 * @param successF  the hook function of success, 'Response Text' as param
 * @param failF     the hook function of fail, 'status code' as param
 * 
 * @returns "OK" (unused)
 */
function baiduTranslate({ sText, sl = 'zh', tl = 'en', successF, failF }) {
    let salt = (new Date).getTime();
    let sign = MD5(appid + sText + salt + key);

    let method = "POST";
    let headers = [["Content-type", "application/x-www-form-urlencoded"]];
    let data = utils.format(base, encodeURI(sText), sl, tl, appid, salt, sign);

    let p = utils.requestPromise({ method, url, headers, data });
    p.then(function (msg) {
        msg = JSON.parse(msg);
        let tText = findTargetText(msg);
        let result = new Result({ engine, sText, tText, sl, tl });
        successF(result);
    }).catch(function (reason) {
        failF(reason);
    });
    return "OK";
}

module.exports = baiduTranslate;
