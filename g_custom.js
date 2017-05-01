
/*
*
*
*
注意 setCookie 定义整个cookie定义单个值会替换掉整个，setCookieJsonVal 定义整个cookie中单个值
*
*
*
*/

function setCookie(name,value1){
    /*
    *————— setCookie(name,value) —————–
    * setCookie(name,value)
    * 功能:设置得变量name的值
    * 参数:name,字符串;value,字符串.
    * 实例:setCookie(‘username’,’baobao’)
    *————— setCookie(name,value) —————–
    */
    var Days = 30; //此 cookie 将被保存 30 天
    var exp　= new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + '=' + encodeURIComponent(value1) + ';expires=' + exp.toGMTString();
}

function getCookie(name){
    /*
    *————— getCookie(name) —————–
    * getCookie(name)
    * 功能:取得变量name的值
    * 参数:name,字符串.
    * 实例:alert(getCookie(“baobao”));
    *————— getCookie(name) —————–
    */
    var arr = document.cookie.match(new RegExp('(^| )'+name+'=([^;]*)(;|$)'));
    if(arr !=null) return decodeURIComponent(arr[2]); return null;
}

function getCookieJson(name){
    //取得变量name的值，并转换为json对象
    var jstr = getCookie(name);
    if (jstr==null) return null;
    var jobj = eval('('+decodeURIComponent(jstr)+')');
    if (typeof(jobj)!='object') return null;
    return jobj;
}

function getCookieJsonVal(name,jsonkey){
    //获取cookie中保存的JSON数据中的变量值,JSON中的Key,JSON用encodeURIComponent编码
    var arr = document.cookie.match(new RegExp('(^| )'+name+'=([^;]*)(;|$)'));
    if(arr !=null){
        var jobj = eval('('+decodeURIComponent(arr[2])+')');
        var backval = jobj[jsonkey];
        return decodeURIComponent(backval);
    }else{
        return null; //if (p1act==null) p1act=1;
    }
}

function addCookieJsonVal(name,jsonobjorstr){
    //为保存在cookie中的JSON数据，添加变量值，第二个参数可以使json字符串也可以使json对象
    if (typeof(jsonobjorstr)=='string'){
        var sobj = eval('('+jsonobjorstr+')');
    }else if(typeof(jsonobjorstr)=='object'){
        var sobj = jsonobjorstr;
    }else{
        return 0; //不是字符串也不是对象
    }
    var jobj = getCookieJson(name);
	if(typeof(jobj)=='object' && jobj!=null){
        for(var x in sobj){
            jobj[x]=sobj[x];
        }
        setCookie(name,JSON.stringify(jobj));
        return 1;
    }else{
        setCookie(name,JSON.stringify(sobj)); //如果json值不存在就创建一个
    }
}

function setCookieJsonVal(name,jsonobjorstr){//添加和修改是一回事
    return addCookieJsonVal(name,jsonobjorstr);
}

function delCookieJsonVal(name,jsonkey){
    //为保存在cookie中的JSON数据，删除变量值
    var jobj = getCookieJson(name);
    if(typeof(jobj)=='object'){
        for(var x in jobj){
            if (x==jsonkey){
                delete jobj[x];
                break;
            }
        }
        setCookie(name,JSON.stringify(jobj));
        return 1;
    }else{
        return null; //if (p1act==null) p1act=1;
    }
}

function GetUrlParms() { //用JSON对象返回Url方式传递值的变量名和字符串
    var args = new Object();
    var query = location.search.substring(1); //获取查询串
    if (query.lastIndexOf('#')>0){
        var query = query.substring(0,query.lastIndexOf('#')-1);
    }
    var pairs = query.split("&"); //在逗号处断开
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('='); //查找name=value
        if (pos == -1) continue; //如果没有找到就跳过
        var argname = pairs[i].substring(0, pos); //提取name
        var value = pairs[i].substring(pos + 1); //提取value
        args[argname] = unescape(value); //存为属性
    }
    return args;
}
//< script type = "text/javascript" >
//  var args = new Object();
//  args = GetUrlParms();
//  如果要查找参数key:
//  if (args["id"] != undefined){
//      var value1 = args["id"];
//    }
//  alert(value1);
//<script>

function GetUrlJsonVal(varname,jsonkey) {
//解析用Url方式传递JSON数据中的变量值，url中变量名称,JSON中的Key,JSON用encodeURIComponent编码
// var login_name = GetUrlJsonVal('z','name'); //http://localhost/a.html?z=%7Bn_act%3A1%2Cname%3A%22%25E6%259D%258E%25E8%2589%25B3%22%7D
// alert(login_name );
// 请求时的样子
// var u=url+'?z='+encodeURIComponent('{n_act:1,name:"'+encodeURIComponent(login_name)+'"}');
    var query = location.search.substring(1); //获取查询串
    if (query.lastIndexOf('#')>0){
        var query = query.substring(0,query.lastIndexOf('#')-1); //内部路由会改变在后面加#
    }
    var pairs = query.split("&"); //在逗号处断开
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('='); //查找name=value
        if (pos == -1) continue; //如果没有找到就跳过
        var argname = pairs[i].substring(0, pos); //提取name
        var value = pairs[i].substring(pos + 1); //提取value
        if(varname != argname) continue;
        var jobj = eval('('+unescape(value)+')');
        var backval = jobj[jsonkey];
        return decodeURIComponent(backval);
    }
}


//ajax(postorget,url,data,ync) data是JSON格式向服务器传递,ync为false关掉异步工作方式
//var count = ajax('post',url,{cs:"10"},false);
//var count = ajax('get',url+'?cs=10','',false);
        // var html;
        // $.each(data, function(commentIndex, comment){
        //     html += '<p>' + comment['SHYSHJ'] + '</p><p>' + comment['JCKSH'] + '</p>';
        //     alert(html);
        // });
//http://www.cnblogs.com/tylerdonet/p/3520862.html
function ajax(postorget,url,d,ync){
    var bv;
    $.ajax({
        type: postorget,
        url: url,
        data: d,
        dataType: "json", //控制返回值data是字符串还是JSON对象
        //contentType : "application/x-www-form-urlencoded; charset=UTF-8",
        async: ync,
        success: function(data){
            bv = data;
        },
        error: function(textStatus){
            alert(textStatus);
        }
    });
    return bv;
}
