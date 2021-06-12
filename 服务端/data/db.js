const mysql=require('mysql')
const express = require("express")
const server=express()
const router = express.Router();
const formidable=require('formidable')
const fs=require('fs')
const path=require('path')
var bodyParser = require("body-parser")
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())

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
    console.log('server has been running at :', port,' port!')
})
//跨域请求解决方案
server.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS") res.sendStatus(200); /*让options请求快速返回*/
    else next();
});

//公告栏
server.post('/gong_gao',(req,res)=>{
    let gong_gao_sql='select * from admin_anounce'
    db_connect.query(gong_gao_sql,(err,result)=>{
        if(err){
            console.log("something wrong")
        }
        else if(result[0]==null){
            res.send({
                code:"1500"
            })
        }
        else{
            res.send({
                code:"1600",
                message:result
            })
        }
    })
})

//登录
server.post('/login',(req,res)=>{
/*     let username=JSON.parse(req.body.username)
    res.send(username) */
    let username=req.body.user_name
    let password=req.body.password
    let sql='select * from user,message where user.user_name="'+username+'"and password="'+password+'"'
    db_connect.query(sql,(err,result)=>{
        console.log("your select message:",req.body)
        if(err){
            console.log("database connect failed")
        }
        else if(result[0]==null){
            console.log(result)
            console.log("no data")
            res.send({
                code:"500",
                message:"查询无此登录信息，请详细验证！"
            })
            }
        else{
            console.log(result[0])
            console.log("your select is success")
            res.send({
                code:"200",
                message:"登陆成功",
                data:result[0],
            })
        }
    })
})
//注册
server.post('/logon',(req,res)=>{
    let username=req.body.user_name
    let password=req.body.password
    let email=req.body.email
    let sql='select user_name from user where user_name="'+username+'"'
    db_connect.query(sql,(err,result)=>{
        console.log("your select message:",req.body)
        if(err){
            console.log("database connect failed")
        }
        else if(result[0]!=null){
            console.log("data has been exist")
            res.send({
                code:"100",
                message:"用户已存在，请用其他名称"
            })
        }
        else{
            let insert_sql='insert into user (user_name,password,email) values ("'+username+'","'+password+'","'+email+'")'
            db_connect.query(insert_sql,(err)=>{
                if(err){
                    console.log("insert failed")
                }
                else{
                    console.log("insert success")
                    res.send({
                        code:"300",
                        message:"注册成功，请重新点击登录"
                    })
                }
            })
            
        }
    })
})


//普通用户个人信息
server.post('/personal_message',(req,res)=>{
    let username=req.body.username
    let sql='select * from user where user_name="'+username+'"'
    db_connect.query(sql,(err,result)=>{
        console.log("your select message:",username)
        if(err){
            console.log("database connect failed")
        }
        else if(result[0]==null){
            res.send({
                code:"400",
                data:"暂时没有信息",
            })
        }
        else{
            res.send({
                code:"600",
                data:result
            })
            // console.log(result)
            // let userID=result[0].user_id
            // let message_sql='select * from message where user_id="'+userID+'"'
            // console.log(userID)
            // db_connect.query(message_sql,(error,_result)=>{
            //     if(error){
            //         console.log("database connect failed")
            //     }
            //     else if(_result[0]==null){
            //         console.log(_result)
            //         res.send({
            //             code:"900",
            //             message:"你还暂时没有留言或者其他信息哦"
            //         })
            //     }
            //     else{
            //         res.send({
            //             code:"600",
            //             data:_result
            //         })
            //     }
            // })
        }
    })
})


//个人留言信息
server.post('/liu_yan_message',(req,res)=>{
    console.log("hello",req.body)
    let username=req.body.username
    let sql='select * from message where user_name in (select user_name from user where user_name="'+username+'")'
    db_connect.query(sql,(err,result)=>{
        if(err){
            console.log("database connect failed")
        }
        else if(result[0]==null){
            console.log("no data")
            res.send({
                code:"900",
                message:"你还没有留言或其他信息哦"
            })
        }
        else{
            let reply_sql='select * from message_reply,message where message_id=reply_for_id'
            db_connect.query(reply_sql,(err,_result)=>{
                console.log(result,_result)
                if(err){
                    console.log("database connect failed")
                }
                else{
                    res.send({
                        code:"1000",
                        data:{data1:result,data2:_result}
                    })
                }
            })
            
        }
    })
})


//发表留言信息
server.post('/message',(req,res)=>{
    let text=req.body.text
    let time=req.body.time
    let like=parseInt(req.body.like)
    let username=req.body.username
    let message_sql='insert into message (text,time,_like,user_name) values ("'+text+'","'+time+'","'+like+'","'+username+'")'
    console.log(JSON.stringify(req.body))
    db_connect.query(message_sql,(err)=>{
        if(err){
            console.log("data connect error!!")
        }
        else{
            res.send({
                code:"1100",
            })
        }
    })
})


//社区所有留言
server.post('/all_message',(req,res)=>{
    //console.log(req.body)
    let all_message_sql='select * from message'
    db_connect.query(all_message_sql,(err,result)=>{
        if(err){console.log("database connect failed!!")}
        else if(result[0]==null){
            res.send({
                code:"1200",
                message:"暂时没有评论信息哦！"
            })
        }
        else{
            let mm='select * from message_reply'
            db_connect.query(mm,(err,_result)=>{
                if(err){console.log("database connect failed!!")}
                else{
                    // console.log(result,_result)
                    res.send({
                code:"1300",
                data:{data1:result,data2:_result}
                })
                }
            })
        }
    })
})

//回复或评论留言信息
server.post('/huifu',(_req,_res)=>{
    console.log("your message is come")
    console.log(_req.body)
    _res.send({
        code:"1400",
        message:"发送成功"
    })
})

//用户修改信息
server.post('/change',(req,res)=>{
    console.log("your option is:",req.body)
    let username=req.body.user_name
    let password=req.body.password
    let email=req.body.email
    let sex=parseInt(req.body.interest)
    let qq=req.body.qq
    let wx=req.body.wx
    let wb=req.body.wb
    let qianming=req.body.qianming
    let site=req.body.site
    let github=req.body.github
    let sql='select * from user where user_name="'+username+'"'
    db_connect.query(sql,(err,result)=>{
        console.log(result)
        console.log("hello")
        if(err){
            console.log("data connect failed")
        }
        else if(result[0]!=null){
            let update_sql='update user set user_name="'+username+'",password="'+password+'",email="'+email+'",sex="'+sex+'",qq="'+qq+'",wx="'+wx+'",wb="'+wb+'",qianming="'+qianming+'",person_website="'+site+'",github="'+github+'" where user_name="'+username+'"'
            db_connect.query(update_sql,(err)=>{
                console.log("sdf")
                if(err){
                    console.log("something wrong")
                }
                else{
                    console.log("update is already changed")
                    res.send({
                        code:"700",
                        message:"你的信息已经修改",
                    })
                }
            })
        }
        else{
            res.send({
                code:"800",
                message:"用户名已存在，请重新更命名"
            })
        }
    })
})


//用户上传文件，增加积分
// server.post('/jifen',(req,res)=>{
//     console.log("your option is:",req.body)
// })



//搜索内容
server.post('/search',(req,res)=>{
    console.log("your search is:")
    console.log(req.body);
    
})

//管理员登录
server.post('/adminLogin',(req,res)=>{
    console.log(req.body)
    let username=req.body.name
    let password=req.body.password
    let loginSql='select * from admin where user_name="'+username+'" and password="'+password+'"'
    db_connect.query(loginSql,(err,result)=>{
        if(err){
            console.log("failed")
        }
        else if(result[0]==null){
            res.send({
                code:"1",
                message:"账号或密码不对哦"
            })
        }
        else{
            res.send({
                code:"2",
                data:result
            })
        }
    })
})


//管理员信息列表
server.post('/admininfo',(req,res)=>{
    console.log(req.body.name)
    let adminInfoSql='select * from admin where user_name="'+req.body.name+'"'
    db_connect.query(adminInfoSql,(err,result)=>{
        if(err){
            console.log("error")
        }
        else{
            res.send({
                code:"6",
                data:result
            })
        }
    })
})

//管理员修改自己信息
server.post('/changeAdminInfo',(req,res)=>{
    console.log(req.body)
    let changeSql='update admin set user_name="'+req.body.username+'",password="'+req.body.password+'",email="'+req.body.email+'",telphone="'+req.body.telphone+'"'
    db_connect.query(changeSql,(err)=>{
        if(err){
            console.log("something error")
        }
        else{
            res.send({
                message:"更新数据成功！"
            })
        }
    })
})


//用户列表数据
server.get('/userTableList',(req,res)=>{
    console.log(req.query)
    let behindSql1='select * from user'
    let behindSql2='select * from user where user_name like "%'+req.query.query+'%" or user_id = "'+req.query.query+'"'
    if(req.query.query==null||req.query.query==""){
        db_connect.query(behindSql1,(err,result1)=>{
            if(err){
                console.log("error")
            }
            else{
                res.send({
                    code:"3",
                    data:result1
                })
            }
        })
    }
    else{
        db_connect.query(behindSql2,(err,result2)=>{
            if(err){
                console.log("error")
            }
            else if(result2[0]!=null){
                res.send({
                    code:"4",
                    data:result2
                })
            }
            else{
                res.send({
                    code:"5",
                    message:"暂时没有该条信息哦！"
                })
            }
        })
    }
})

//添加用户
server.post('/addUserInfo',(req,res)=>{
    console.log(req.body)
    let addUserSql='insert into user (user_name,password,email) values ("'+req.body.username+'","'+req.body.password+'","'+req.body.email+'")'
    db_connect.query(addUserSql,(err)=>{
        if(err){
            console.log("insert failed")
        }
        else{
            res.send({
                message:"添加数据成功！！！"
            })
        }
    })
})

//修改用户信息
server.post('/changeUserInfo',(req,res)=>{
    console.log(req.body)
    let changUserSql='update user set user_name="'+req.body.username+'",password="'+req.body.password+'",email="'+req.body.email+'",sex="'+req.body.sex+'",qq="'+req.body.qq+'",wx="'+req.body.wx+'",wb="'+req.body.wb+'",qianming="'+req.body.qianming+'",person_website="'+req.body.person_website+'",github="'+req.body.github+'",jifen="'+req.body.jifen+'" where user_name="'+req.body.username+'"'
    db_connect.query(changUserSql,(err)=>{
        if(err){
            console.log("update failed")
        }
        else{
            res.send({
                message:"修改用户数据成功！！！"
            })
        }
    })
})

//删除用户
server.post('/deleteUser',(req,res)=>{
    console.log(req.body.userId)
    let deleteUserSql='delete from user where user_id="'+req.body.userId+'"'
    db_connect.query(deleteUserSql,(err)=>{
        if(err){
            console.log("delete user failed")
        }
        else{
            res.send({
                message:"删除用户成功！！！"
            })
        }
    })
})


//公告信息列表
server.get('/gongGaoList',(req,res)=>{
    console.log(req.query.query)
    let search1='select * from admin_anounce'
    let search2='select * from admin_anounce where anounce_id like "%'+req.query.query+'%" or admin_id = "'+req.query.query+'"or text like "%'+req.query.query+'%"'
    if(req.query.query==null||req.query.query==""){
        db_connect.query(search1,(err,result)=>{
            if(err){console.log("select failed")}
            else{
                console.log(result)
                res.send({
                    data:result
                })
            }
        })
    }
    else{
        db_connect.query(search2,(err,result)=>{
            if(err){console.log("error")}
            else{
                res.send({
                    data:result
                })
            }
        })
    }
})

//发布公告
server.post('/addGongGao',(req,res)=>{
    console.log(req.body)
    let addGongGaoSql='select admin_id from admin where user_name="'+req.body.adminName+'"'
    db_connect.query(addGongGaoSql,(err,result)=>{
        if(err){console.log("error")}
        else{
            console.log(result[0].admin_id)
            let _addGongGaoSql='insert into admin_anounce(admin_id,text,time,admin_name) values("'+result[0].admin_id+'","'+req.body.text+'","'+req.body.time+'","'+req.body.adminName+'")'
            db_connect.query(_addGongGaoSql,(err)=>{
                if(err){console.log("error")}
                else{
                    res.send({
                        message:"你的公告已经发送！！！"
                    })
                }
            })
        }
    })
})

//修改公告信息
server.post('/editGongGao',(req,res)=>{
    console.log(req.body)
    let sql='update admin_anounce set text="'+req.body.text+'",time="'+req.body.time+'" where anounce_id="'+req.body.gongGaoId+'"'
    db_connect.query(sql,(err)=>{
        if(err){console.log(err)}
        else{
            res.send({
                message:"公告已经修改！！！"
            })
        }
    })
})
//删除公告信息
server.post('/deleteGongGao',(req,res)=>{
    console.log(req.body.gongGaoId)
    let sql='delete from admin_anounce where anounce_id="'+req.body.gongGaoId+'"'
    db_connect.query(sql,(err)=>{
        if(err){console.log("error")}
        else{
            res.send({
                message:"删除成功！！！"
            })
        }
    })
})
//获取社区留言信息
server.get('/community',(req,res)=>{
    console.log(req.query.query)
    let search1='select * from message'
    let search2='select * from message where anounce_id like "%'+req.query.query+'%" or admin_id = "'+req.query.query+'"or text like "%'+req.query.query+'%"'
    if(req.query.query==null||req.query.query==""){
        db_connect.query(search1,(err,result)=>{
            if(err){console.log("select failed")}
            else{
                console.log(result)
                res.send({
                    data:result
                })
            }
        })
    }
    else{
        db_connect.query(search2,(err,result)=>{
            if(err){console.log("error")}
            else{
                res.send({
                    data:result
                })
            }
        })
    }
})
//增加社区留言信息
server.post('/addMessage',(req,res)=>{
    console.log(req.body)
    let sql='insert into message (text,time,_like,user_name) values("'+req.body.text+'","'+req.body.time+'","'+req.body.like+'","'+req.body.username+'")'
    db_connect.query(sql,(err)=>{
        if(err){console.log("error")}
        else{
            res.send({
                message:"添加留言信息成功！！！"
            })
        }
    })
})

//编辑社区留言
server.post('/editMessage',(req,res)=>{
    console.log(req.body)
    let sql='update message set text="'+req.body.text+'",time="'+req.body.time+'",_like="'+req.body.like+'",user_name="'+req.body.username+'" where message_id="'+req.body.messageId+'"'
    db_connect.query(sql,(err)=>{
        if(err){
            console.log("error")
        }
        else{
            res.send({
                message:"留言信息已修改！！！"
            })
        }
    })
})
//删除留言信息
server.post('/deleteLiuYan',(req,res)=>{
    console.log(req.body)
    let sql='delete from message where message_id="'+req.body.messageId+'"'
    db_connect.query(sql,(err)=>{
        if(err){
            console.log("error")
        }
        else{
            res.send({
                message:"留言信息已被删除！！！"
            })
        }
    })
})

//管理员上传音乐文件
server.post('/upload',(req,res)=>{
    console.log(req)
    const form = new formidable.IncomingForm()
    form.encoding = 'utf-8' // 编码
  form.keepExtensions = true // 保留扩展名
  form.uploadDir = path.join(__dirname, './music/') //文件存储路径 最后要注意加 '/' 否则会被存在public下
    form.parse(req, (err, fields, files) => {
        if(err) return next(err)
        console.log(fields) //Object 表单数据
        console.log(files) //上传文件用files.<name>访问
        console.log(fields.upName)
        fs.renameSync(files.file.path,form.uploadDir+'/'+files.file.name)
        console.log(files.file.name)
        //上传音乐信息到数据库
        let sql='insert into admin_up_file(up_name,up_time,up_url,_like) values("'+fields.upName+'","'+fields.mytime+'","'+files.file.name+'",0)'
        db_connect.query(sql,(err)=>{
            if(err){
                console.log("error")
            }
            else{
                console.log("success")
                res.send({
                    message:"上传成功！！！"
                })
            }
        })
    })
})

//获取个人上传音乐条目
server.get('/musicList',(req,res)=>{
    console.log(req.query)
    let search1='select * from admin_up_file where up_name="'+ req.query.adminName+'"'
    let search2='select * from admin_up_file where up_id like "%'+req.query.query+'%" or up_url like "%'+req.query.query+'%" and up_name="'+req.query.adminName+'"'
    if(req.query.query==null||req.query.query==""){
        db_connect.query(search1,(err,result)=>{
            if(err){console.log("select failed")}
            else{
                console.log(result)
                res.send({
                    data:result
                })
            }
        })
    }
    else{
        db_connect.query(search2,(err,result)=>{
            if(err){console.log("error")}
            else{
                res.send({
                    data:result
                })
            }
        })
    }
})

//获取所有上传用户的音乐列表
server.get('/allMusicList',(req,res)=>{
    console.log(req.query)
    let search1='select * from admin_up_file'
    let search2='select * from admin_up_file where up_id like "%'+req.query.query+'%" or up_name = "'+req.query.query+'"or up_url like "%'+req.query.query+'%"'
    if(req.query.query==null||req.query.query==""){
        db_connect.query(search1,(err,result)=>{
            if(err){console.log("select failed")}
            else{
                console.log(result)
                res.send({
                    data:result
                })
            }
        })
    }
    else{
        db_connect.query(search2,(err,result)=>{
            if(err){console.log("error")}
            else{
                res.send({
                    data:result
                })
            }
        })
    }
})
//编辑修改音乐信息
server.post('/editMusicList',(req,res)=>{
    console.log(req.body)
    let sql='update admin_up_file set up_time="'+req.body.up_time+'",_like="'+req.body.like+'" where up_id="'+req.body.up_id+'"'
    db_connect.query(sql,(err)=>{
        if(err){
            console.log("error")
        }
        else{
            res.send({
                message:"留言信息已修改！！！"
            })
        }
    })
})

//删除音乐
server.post('/deleteMusic',(req,res)=>{
    console.log(req.body)
    let sql='delete from admin_up_file where up_id="'+req.body.upId+'"'
    db_connect.query(sql,(err)=>{
        if(err){
            console.log("error")
        }
        else{
            res.send({
                message:"留言信息已被删除！！！"
            })
        }
    })
    //删除文件
})