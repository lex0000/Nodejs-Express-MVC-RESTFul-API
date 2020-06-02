const MyClass = require('../../../../lib/MyClass');
const Model = require('../../models/model');
module.exports = class Controller extends MyClass{
    constructor(module) {
        super(module);
        this.model = new Model(module);
    }
    async test(body={}){
        //return await this.callModule('post','app','index',{})
        let data = await this.callApi("test");
        return this.reply(data);
    }   

}