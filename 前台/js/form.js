// var server=new XMLHttpRequest();
// server.onreadystatechange=function(){
//     if(server.readyState==4 && server.status==200){
                
//         var data=JSON.parse(server.responseText);              
//         alert(data.data[0].user_name);               
//     }
//     else if(server.status==500){
//         alert("未找到页面");
//     }
// }
// server.open("get","http://127.0.0.1:3000",true);
// server.send();
        layui.use(['element','carousel','layer','form'],function(){
            var element=layui.element,
            $=layui.$,
            form=layui.form,
            layer=layui.layer,
            carousel=layui.carousel;
            carousel.render({
            elem: '#test1'
            ,width: '100%' //设置容器宽度
            ,height:'400px'
            ,arrow: 'always' //始终显示箭头
            //,anim: 'updown' //切换动画方式
            });
            
            form.on('submit(dl)', function(data){
            //     var server=new XMLHttpRequest();
            //     server.onreadystatechange=function(){
            //     if(server.readyState==4 && server.status==200){
            //     var ads=server.responseText;              
            //     alert(ads);               
            // }
            // else if(server.status==500){
            //     alert("未找到页面");
            // }
            // };
            // server.open("post","http://127.0.0.1:3000/login",true);
            // server.send("user_name="+user_name+"&password="+password);
            
            $.ajax({type:"post",url:"http://127.0.0.1:3000/login",dataType:"JSON",data:data.field,success:function(result){
                if(result.code==200){
                    layer.msg(result.message,{
            time:1000,
            area:['200px','100px']
        });
        console.log(JSON.stringify(result.data));
        setTimeout(function(){
            layer.closeAll();
        },2000);
        
        // document.cookie=data.field.user_name+";"+data.field.password;
        // console.log(document.cookie);
        // user_status.innerHTML="欢迎您，亲爱的用户"+document.cookie.split(";")[0];
        sessionStorage.username=data.field.user_name;
        sessionStorage.password=data.field.password;
        console.log(sessionStorage);
        var user_status=document.getElementById("user_status");
        user_status.innerHTML="欢迎您，亲爱的用户"+sessionStorage.username;
                }
                else if(result.code==500){
                    layer.msg(result.message,{
            time:1000,
            area:['200px','100px']
        });
                }
        
    },error:function(err){
        if(err){
            console.log(JSON.stringify(err));
            layer.msg("糟糕，服务器崩溃了",{
                time:1000,
                area:['200px','100px']
            })
        }
    }});
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            });

            //注册
            form.on('submit(zc)', function(data){
                    $.ajax({type:"post",url:"http://127.0.0.1:3000/logon",dataType:"JSON",data:data.field,success:function(result){
                    if(result.code==100){
                        layer.msg(result.message,{
                            area:['200px','100px']
                        })
                        }
                        //注册成功
                    else if(result.code==300){
                        layer.msg(result.message,{
                            area:['200px','100px'],
                            time:1000
                        });
                        setTimeout(function(){
                            layer.closeAll();
                        },2000);
                    }
                    },
                    error:function(err){
                        console.log(JSON.stringify(err));
                        layer.msg("糟糕，服务器崩溃了",{
                            time:1000,
                            area:['200px','100px']
                        });
                    }
                    });
                return false;
            });

            //修改数据
form.on('submit(change)', function(data){
    //alert(JSON.stringify(data));
$.ajax({type:"post",url:"http://127.0.0.1:3000/change",dataType:"JSON",data:data.field,
success:function(result){
if(result.code==700){
    layer.msg(result.message,{
        time:1000,
        area:['200px','100px']
    });
}
else if(result.code==800){
    layer.msg(result.message,{
        time:1000,
        area:['200px','100px']
    });
}
},
            error:function(err){
                console.log(JSON.stringify(err));
                layer.msg("糟糕，服务器崩溃了",{
                    time:1000,
                    area:['200px','100px']
                });
            }
            });
        return false;
});
            $('#btn1,#_login').on('click',function(){
                layer.open({
                    type:1,
                    title:false,
                    area:['400px','400px'],
                    content:$('#login')
                })
            });
            $('#change_to_logon').on('click',function(){
                layer.closeAll();
                layer.open({
                    type:1,
                    title:false,
                    area:['400px','400px'],
                    content:$('#logon')
                })
            });
            $('#btn2,#_logon').on('click',function(){
                layer.open({
                    type:1,
                    title:false,
                    area:['400px','400px'],
                    content:$('#logon')
                })
            });
            $('#change_to_login').on('click',function(){
                layer.closeAll();
                layer.open({
                    type:1,
                    title:false,
                    area:['400px','400px'],
                    content:$('#login')
                })
            });
            
        });
function out(){
    sessionStorage.clear();
};
if(sessionStorage.username!=null){
    var user_status=document.getElementById("user_status");
    user_status.innerHTML="欢迎您，亲爱的用户"+sessionStorage.username;
};





