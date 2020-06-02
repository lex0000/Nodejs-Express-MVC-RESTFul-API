const mysql = require('mysql');
const DB_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'core_website',
  port: '8889'
};
module.exports = class Db {
  constructor(module) {
    this.module = module;
    this.sql = null;
    this.sqlObject = {
      create: null,
      update: null,
      delete: null,
      select: null,
      from: null,
      where: null,
      order_by: null,
      group_by: null,
      start: null,
      limit: null
    }
  }

  async  query(sql) {
    return new Promise(function (resolve) {
      //setTimeout(() => resolve('success'), 500);
      let connection = mysql.createConnection(DB_CONFIG);
      connection.connect((err) => {
        //if (err) throw err;
        if (err) {
          resolve({
            status: false,
            sql: sql,
            data: [],
            error: err,
            response_desc: 'DB ECONNREFUSED'
          });
        }
        //console.log('Connected!');
        //let sql = "select * from test";
        connection.query(sql, function (err, result) {
          if (err) {
            resolve({
              status: false,
              sql: sql,
              data: [],
              error: err.sqlMessage,
              response_desc: 'error'
            });
            //throw err;
          }
          //console.log("Result: ",result);  
          resolve({
            status: true,
            sql: sql,
            data: result,
            response_desc: 'success'
          })
        });
        connection.end();
      });
    });
  }

  test(){
    this.select([
      
    ])
  }

  select(select = {
    select: [
      'id',
      'name'
    ],
    from: "app",
    where: [
      { id: 1, }
    ],
    order_by: ["id asc"],
  }) {
    //let str = "id,ucid,app_id,website_id,company_id,customer_id,name,description,status,created,updated,create_by,update_by"
    select =
      [
        {
          select: ['id', 'name'],
          from: "app",
          where: [
            { id: 1 },
            'name !="APP"'
          ],
          order_by: ["id asc"],
          handle:(response)=>{
            if(response.status){
              return response
            }else{
              return []
            }
          }
        },
        {
          select: ['id', 'name'],
          from: "app",
          where: [
            { name: select[0].handle() }
          ],
          order_by: ["id asc"],
          handle:(response)=>{
            if(response.status){
              return response
            }else{
              return []
            }
          }
        }
      ];
    this.sql = null;
    switch (select) {
      case null:

        break;

      default:
        break;
    }
  }

}