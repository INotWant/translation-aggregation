"use strict";

const Result = require("./result.class");
const utils = require("./utils");
const config = require("../config");

const engine = 'google';
const host = config["googleHost"];
const url = utils.format("https://{0}/translate_a/single", host);
const base = "client=gtx&sl={0}&tl={1}&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&q={2}";

function findTargetText(msg) {
    let tText = '';
    if (Array.isArray(msg) && msg[0]) {
        for (let row of msg[0])
            if (row[0])
                tText += row[0];
    }
    return tText;
}

/**
 * Package google translation
 * 
 * @param sText original text
 * @param sl    source language
 * @param tl    target language
 * @param successF  the hook function of success, 'Response Text' as param
 * @param failF     the hook function of fail, 'status code' as param
 * 
 * @returns "OK" (unused)
 */
function googleTranslate({ sText, sl = 'zh-CN', tl = 'en', successF, failF }) {
    let method = "POST";
    let headers = [["Content-type", "application/x-www-form-urlencoded"]];
    let data = utils.format(base, sl, tl, encodeURI(sText));
    let p = utils.requestPromise({ method, url, headers, data });

    p.then(function (msg) {
        let arr = JSON.parse(msg);
        let tText = findTargetText(arr);
        let result = new Result({ engine, sText, tText, sl, tl });
        successF(result);
    }).catch(function (reason) {
        failF(reason);
    });
    return "OK";
}

module.exports = googleTranslate;