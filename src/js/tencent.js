"use strict";

const Result = require("./result.class");
const tencentcloud = require("tencentcloud-sdk-nodejs");
const config = require("../config");

const TmtClient = tencentcloud.tmt.v20180321.Client;
const models = tencentcloud.tmt.v20180321.Models;
const Credential = tencentcloud.common.Credential;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;

const engine = "tencent";
const SecretId = config["tencentSecretId"];
const SecretKey = config["tencentSecretKey"];
const region = config["tencentRegion"];

function findTargetText(msg) {
    return msg.TargetText;
}

/**
 * Package tencent translation
 * 
 * @param sText original text
 * @param sl    source language
 * @param tl    target language
 * @param successF  the hook function of success, 'Response Text' as param
 * @param failF     the hook function of fail, 'status code' as param
 * 
 * @returns "OK" (unused)
 */
function tencentTranslate({ sText, sl = 'zh', tl = 'en', successF, failF }) {
    let cred = new Credential(SecretId, SecretKey);
    let httpProfile = new HttpProfile();
    httpProfile.endpoint = "tmt.tencentcloudapi.com";
    let clientProfile = new ClientProfile();
    clientProfile.httpProfile = httpProfile;
    let client = new TmtClient(cred, region, clientProfile);
    let req = new models.TextTranslateRequest();

    let data = {
        SourceText: sText,
        Source: sl,
        Target: tl,
        ProjectId: 0,
    };
    let params = JSON.stringify(data);

    req.from_json_string(params);
    client.TextTranslate(req, function (errMsg, response) {
        if (errMsg) {
            failF(errMsg);
            return;
        }
        let msg = JSON.parse(response.to_json_string());
        let tText = findTargetText(msg);
        let result = new Result({ engine, sText, tText, sl, tl });
        successF(result);
    });

    return "OK";
}

module.exports = tencentTranslate;
