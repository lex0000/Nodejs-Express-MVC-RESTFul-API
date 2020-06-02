const MyClass = require('../../../../lib/MyClass');
const Model = require('../../models/model');
const fs = require('fs');
const path = require('path');


module.exports = class Controller extends MyClass{
    constructor(module) {
        super(module);
        this.model = new Model(module);
        this.title = "CoreWebsite API";
    }
    async index(data={}){
        return data;
    }

}