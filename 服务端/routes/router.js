const express = require("express");
const router = express.Router();
const sqlQuery = require("./mysql");
//设置跨域访问
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
// 查询userinfo表
router.get("/", (req, res) => {
  const sql = "select * from user";
  sqlQuery(sql, (data) => {
    res.send({
      code: "200",
      message: "查询成功",
      data,
    });
  });
});
// 登录
router.post("/login", function (req, res) {
  //const { user_name, password } = { ...req.body };
  //const sql = 'select * from user where user_name='${user_name}' and password='${password}'';
  const user_name=req.body.user_name
  sqlQuery(sql, (data) => {
    if (data.length > 0)
      return res.send({
        code: "200",
        
        message: "登录成功",
      });
    res.send({
      code: "500",
    });
  });
});
// 注册
router.post("/logon", (req, res) => {
  const { user_name, password } = { ...req.body };
  const sql = `select * from user where user_name='${user_name}'`;
  sqlQuery(sql, (data) => {
    if (data.length == 0) {
      const sql = `insert into user values('${user_name}',null,'${password}')`;
      sqlQuery(sql, (data) => {
        res.send({
          code: "200",
          message: "注册成功",
        });
      });
    } else {
      res.send({
        code: "500",
        message: "用户已经存在",
      });
    }
  });
});
// 修改密码
router.post("/api/passwordChange", (req, res) => {
  const { user_name, password, newPassword } = { ...req.body };
  const sql = `select * from user where user_name='${user_name}' AND password='${password}' `;
  sqlQuery(sql, (data) => {
    if (data.length != 0) {
      const sql = `update user set password='${newPassword}' where user_name = '${user_name}'`;
      sqlQuery(sql, (data) => {
        res.send({
          code: "200",
          message: "修改成功",
        });
      });
    } else {
      res.send({
        code: "500",
        message: "用户名或原密码不正确",
      });
    }
  });
});
module.exports = router;