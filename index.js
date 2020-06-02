// before
const express = require('express');
const bodyParser = require('body-parser');
const MyClass = require('./lib/MyClass');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const swaggerUi = require('swagger-ui-express');
var options = {
    explorer: true,
    swaggerOptions: {
        //url: '/api/apidocs', name: 'CoreWebsite'
        urls: [
            { url: '/api/apidocs', name: 'CoreWebsite' }
        ]
    }
}
const allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.woff2',
    '.woff',
    '.ttf',
    '.svg',
];
class Server {
    static bootstrap(mode = 'firebase',port=5000) {
        return new Server(mode,port);
    }
    constructor(mode,port) {
        // Create expressjs application
        this.app = express();
        this.port = port;
        this.mode = mode;

        // Depending on your own needs, this can be extended
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use(bodyParser.raw({ limit: '50mb' }));
        this.app.use(bodyParser.text({ limit: '50mb' }));
        this.app.use(bodyParser.urlencoded({
            limit: '50mb',
            extended: true
        }));

        this.app.use((req, res, next) => {
            let ALLOW_ORIGIN = []
            let ORIGIN = req.headers.origin
            if (ALLOW_ORIGIN.includes(ORIGIN)) {
                res.header('Access-Control-Allow-Origin', ORIGIN)
            }
            res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE, OPTIONS')
            res.header('Access-Control-Allow-Headers', 'Content-Type, Option, Authorization')
            return next()
        })


        this.app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(null, options));

        this.app.all('/api/*', async (req, res, next) => {
            let paramsArr = req.params[0].split("/");
            let params = {
                method: req.method.toLocaleLowerCase(),
                moduleName: paramsArr[0] || 'not-found',
                controllerName: paramsArr[1] || 'index',
                actionName: paramsArr[2] || 'index'
            }
            if (paramsArr[1] && !paramsArr[2]) {
                params.actionName = paramsArr[1]
            }
            let lpath = path.join(process.cwd(), '/');
            params.rootPath = lpath;
            params.controllerPath = "../modules/" + params.moduleName + "/controllers/" + params.method + "/" + params.controllerName;
            req.params = params;
            //console.log(params)
            let module = {
                headers: req.headers,
                params: params,
                query: req.query,
                payload: req.body,
                req:req,
                res:res,
                next:next
            }
            let mvc = new MyClass(module);
            try {
                let data = await mvc.exec(req.body);
                res.send(data);
                return;
            } catch (error) {
                console.log(error);
                res.send({
                    status: false,
                    response_code: '40001',
                    response_desc: 'service not found',
                    error: error
                });
                return;
            }
        });

        //frontend location
        this.app.get('*', (req, res, next) => {
            if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
                //console.log(moment().format(), req.url)
                res.sendFile(path.resolve(`./web/${req.url}`));
            } else {
                //console.log('redirect',req.url)
                res.sendFile(path.resolve('./web/index.html'));
            }
        });

        this.app.listen(this.port, () => {
            console.log(`http is started http://localhost:${this.port}`);
        });

        // Catch errors
        this.app.on('error', error => {
            console.error(moment().format(), 'ERROR', error);
        });


        process.on('uncaughtException', error => {
            console.log(moment().format(), error);
        });
    }
}
var argv = require('yargs-parser')(process.argv.slice(2));
console.log('argv',argv);
const server = Server.bootstrap('server',argv.port);
exports.modules = server.app;


