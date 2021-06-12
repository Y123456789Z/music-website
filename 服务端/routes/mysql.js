const mysql=require('mysql')
const config = {
    host: "localhost",
    user: "root",
    password: "Yz123456789",
    database: "music_forum",
    port:3306,
    };
const dbConnect=mysql.createConnection(config);
// function sqlQuery(sql, callback) {
//     dbConnect.query(sql, (err, result) => {
//       if (err) {
//         return console.log("错误");
//       }
//       callback(result);
//     });
//   }
  
  module.exports = sqlQuery;