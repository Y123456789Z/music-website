var _message=document.getElementById("gong_gao");
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4 && xhr.status==200){
                
                gong_gao_item=JSON.parse(xhr.responseText).message;
                for(var item_count=0;item_count<gong_gao_item.length;item_count++){
                    //var cad=gong_gao_item[item_count].text;
                    _message.innerHTML=gong_gao_item[item_count].text;
                    
                }
            }
        };
        xhr.open("post","http://127.0.0.1:3000/gong_gao",true);
        xhr.send();


function search(){
    var searchText=document.getElementById("searchId").value;
    layui.use(['layer','element','form'],function(){
        var $=layui.$,
        element=layui.element,
        form=layui.form;
        
        if(searchText==null||searchText==""){
            layer.msg("请输入内容")
        }
        else{
            //layer.msg("服务器出问题啦！");
            form.on('submit(search)',function(){
                layer.msg("sd")
            })
            return false;
        }
    })
}