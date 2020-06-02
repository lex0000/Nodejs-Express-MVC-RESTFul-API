const Config = require('../configs/Config');
const Common = require('../configs/Common');
const Db = require('../configs/Db');
module.exports =  class MyClass {
    constructor(module) {
        this.module = module;
        this.req    = this.module.req;
        this.res    = this.module.res;
        this.next   = this.module.next;
        this.config =  new Config(this.module);
        this.common =  new Common(this.module);
        this.db     =  new Db(this.module);
        
    }

    async exec(data={}){
        //return this.module.params.controllerPath;
        //let { Controller }  = require('../modules/apps/controllers/get/index');
        let Controller  = require(this.module.params.controllerPath);
        return  await new Controller(this.module)[this.module.params.actionName](data);
    }

    async reply(data={}){
        data.payload = this.module.payload;
        return data;
    }

    async callModule(method,moduleName,actionName,data={}){
        let controllerPath = "../modules/" + moduleName + "/controllers/" + method + "/" + actionName;
        let Controller  = require(controllerPath);
        return  await new Controller(this.module)[actionName](data);
    }

    async callApi(apiName,body={}){
        return this.req.params;
    }

    
}
