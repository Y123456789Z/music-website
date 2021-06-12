const mysql=require('mysql')
const express = require("express")
const server=express()
const router = express.Router();
const db_connect=mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Yz123456789",
    database: "music_forum",
    port:3306,
})
db_connect.connect()
let port=3000
server.listen(port,()=>{
    console.log('服务器已经运行在：', port,' 端口!')
})
router.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == "options") res.sendStatus(200);
    //让options尝试请求快速结束
    else next();
});
router.post('/login',(req,res)=>{
    console.log(req.body)
/*     let username=JSON.parse(req.body.username)
    res.send(username) */
    res.send("hhh")
})


module.exports = router;