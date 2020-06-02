const MyClass = require('../../../../lib/MyClass');
const Model = require('../../models/model');
module.exports = class Controller extends MyClass{
    constructor(module) {
        super(module);
        this.model = new Model(module);
    }
    async index(body={}){
        let data = await this.db.query("select * from app");
        //console.log('data',data);
        return this.reply(data);
    }


}