"use strict";

const Result = require("./result.class");
const utils = require("./utils");
const sha256 = require("./sha256");
const config = require("../config");

const engine = "youdao";
const appid = config["youdaoAppid"];
const key = config["youdaoKey"];
const url = "http://openapi.youdao.com/api";
const base = ("q={0}&appKey={1}&salt={2}&from={3}&to={4}&sign={5}&signType=v3&curtime={6}");

function findTargetText(msg) {
    let tText = "";
    if (msg && Array.isArray(msg.translation))
        tText = msg.translation[0]
    return tText;
}

function truncate(q) {
    let len = q.length;
    if (len <= 20)
        return q;
    return q.substring(0, 10) + len + q.substring(len - 10, len);
}

/**
 * Package youdao translation
 * 
 * @param sText original text
 * @param sl    source language
 * @param tl    target language
 * @param successF  the hook function of success, 'Response Text' as param
 * @param failF     the hook function of fail, 'status code' as param
 * 
 * @returns "OK" (unused)
 */
function youdaoTranslate({ sText, sl = 'zh', tl = 'en', successF, failF }) {
    let salt = (new Date).getTime();
    let curTime = Math.round(new Date().getTime() / 1000);
    let str1 = appid + truncate(sText) + salt + curTime + key;
    let sign = sha256(str1);

    let method = "POST";
    let headers = [["Content-type", "application/x-www-form-urlencoded"]];
    let data = utils.format(base, encodeURI(sText), appid, salt, sl, tl, sign, curTime);

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

module.exports = youdaoTranslate;
