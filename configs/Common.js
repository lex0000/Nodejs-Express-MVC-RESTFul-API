const fs = require('fs');
const path = require('path');
module.exports = class Common {
    constructor(module) {
        this.module = module;
    }
    walk(dir, done) {
        let self = this;
        var results = [];
        fs.readdir(dir, function (err, list) {
            if (err) return done(err);
            var i = 0;
            (function next() {
                var file = list[i++];
                if (!file) return done(null, results);
                file = path.resolve(dir, file);
                fs.stat(file, function (err, stat) {
                    if (stat && stat.isDirectory()) {
                        self.walk(file, function (err, res) {
                            results = results.concat(res);
                            next();
                        });
                    } else {
                        results.push(file);
                        next();
                    }
                });
            })();
        });
    };

    async getRoutes() {
        return new Promise((resolve, reject) => {
            let routes = {};
            let modulePath = this.module.params.rootPath + 'modules/';
            this.walk(modulePath, function (error, results) {
                results.forEach(result => {
                    let str = (result).replace(modulePath, '')
                    if (str.substr(str.length - 3) == '.js') {
                        let [moduleName, controllers, method, controllerName] = str.split("/");
                        if (controllers == 'controllers') {
                            controllerName = controllerName.replace(controllerName.substr(controllerName.length - 3), '')
                            routes[moduleName] = [];
                            routes[moduleName] = [
                                ...routes[moduleName],
                                {
                                    method: method,
                                    module: moduleName,
                                    controler: controllerName,
                                    action: controllerName,
                                }
                            ]
                        }
                    }
                });
                resolve(routes);
            });
        });
    }
}