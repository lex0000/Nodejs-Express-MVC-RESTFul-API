const MyClass = require('../../../lib/MyClass');
module.exports = class Model extends MyClass{
    constructor(module) {
        super(module);
    }
    fetchAll() {
        return [
            { app_code: 101, app_name: 'test' , 'body':this.module.payload }
        ]
    }
}