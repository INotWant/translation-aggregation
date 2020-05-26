"use strict";

/**
 * Package translation results
 * 
 *  engine -- 'google' or 'baidu' ...
 *  sText -- "什么是爱？"
 *  tText -- "what is love?"
 *  sl -- 'zh-CN'
 *  tl -- 'en'
 */
class Result{
    constructor({engine, sText, tText, sl='zh-CN', tl='en'}){
        this.engine = engine;
        this.sText = sText;
        this.tText = tText;
        this.sl = sl;
        this.tl = tl;
    }

    getEngine(){
        return this.engine;
    }

    getSText(){
        return this.sText;
    }

    getTText(){
        return this.tText;
    }

    getSL(){
        return this.sl;
    }

    getTL(){
        return this.tl;
    }
}

module.exports = Result;
