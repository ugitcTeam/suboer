(function(){
	var app={
		/**
         * 解析URL参数
         * @param url 要解析的url地址
         * @return JSON格式的参数
         * @createBy TanYong
         * @createDate 2015-06-24
         */
        parseParams: function(url) {
            if (url.indexOf("?") != -1) {
                url = url.substr(url.indexOf("?") + 1);
            }
            var paramsArr = url.match(/[^\?\=\&]*\=[^\?\=\&]*/g);
            var params = {};
            if (paramsArr != null) {
                $.each(paramsArr, function() {
                    var kv = this.split("=");
                    params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
                });
            }
            return params;
        },
        // 获取当前时间，格式YYYY-MM-DD
        getNowFormatDate() {
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        },
        getNowDate(){
            var date=new Date();
            var hours=date.getHours();
            var minutes=date.getMinutes();
            var seconds=date.getSeconds();
            var seperator1=":";
            var currentDate=hours+seperator1+minutes+seperator1+seconds;
            return app.getNowFormatDate() + " " + currentDate;

        },
        //获取当前星期的周一日期
        getMonDay(){
            var now=new Date();
            var strDate=now.toLocaleDateString();
            var day=now.getDay() || 7;//获取当前星期X(0-6,0代表星期天,) 
            var date=now.getDate();//获取当前日(1-31)  
            var strArr=strDate.split("/");
            strArr[2]=date-day+1;
            console.log(strArr.join("/"));
        }
	}
	window.app=app;
})();
// 文档加载完成后加载
$(function(){
    //兼容ie不支持写法
    if(!"console" in window){
        window.console={
            log:function(){}
        }
    }
	$(".reld input").click(function(){
		if(this.value=="0"||this.value=="否"){
			$(this).closest("div").next("div").addClass("isdisabled").find("input").attr("checked",false);
		}else{
			$(this).closest(".reld").next("div").removeClass("isdisabled");
		}
	});
	$("input").click(function(){
		if($(this).closest(".isdisabled").length){
			console.log("parent isdisabled");
			return false;
		}
        // 判断是否是变更种类
        if($(this).closest(".flowClass")){
            if(this.value=="快速变更"){
                $(".acc-dep").parent().addClass("isFlow");
            }else{
                $(".acc-dep").parent().removeClass("isFlow")
            }
        }
        
		// return false;
	});
    // 添加一行
    $(".addRowTr").click(function(){
        var index = $(this).next().find("tr").length;//序号
        var tr=createTr(index);
        $(this).next().children().append(tr);

    });
    var columnsRow=[{field:"index",name:"序号"}]
    function createTr(index){
        var tr="<tr>";
        tr+="<td>"+index+"</td>";
        for(var i=1;i<6;i++){
            tr+="<td></td>";
        }
        tr+="</tr>";
        return tr;
    }


    /*表格单元格点击事件*/
    $(".table-sub td").click(function(){
        var attr=this.getAttribute("field");
        switchField(attr);
    });
    function switchField(attr){
        switch (attr) {
            case "name":
                debugger;
                // statements_1
                break;
            default:
                // statements_def
                break;
        }
    }

    // textarea 高度随内容自适应
    $.fn.autoHeight = function(){    
        function autoHeight(elem){
            elem.style.height = 'auto';
            elem.scrollTop = 0; //防抖动
            elem.style.height = elem.scrollHeight + 'px';
        }
        this.each(function(){
            autoHeight(this);
            $(this).on('keyup', function(){
                // debugger;
                if(event.code=="Enter"){

                    this.style.height=this.scrollHeight+16+"px";
                }
                autoHeight(this);
            });
        });     
    }                
    $('textarea[autoHeight]').autoHeight();
    //多行文本输入长度限制
    $("textarea").on("input propertychange",function(){
        var $this=$(this),
        _val=$this.val(),
        count="";
        var len=this.getAttribute("maxLength")||300;
        len=parseInt(len);
        if(_val.length>len){
            $this.val(_val.substring(0,len));
        }
        console.log(len-$this.val().length);
    });
    $("input[type='text']").on("input propertychange",function(){
        var $this=$(this),
        _val=$this.val(),
        count="";
        var maxLength=30
        if(_val.length>maxLength){
            $this.val(_val.substring(0,maxLength));
            // console.log("超出长度限制")
        }
    });
    //div可编辑，值改变时触发时间
    $("div[contenteditable]").on("input propertychange",function(){
        var $this=$(this),
        _val=this.innerText,
        count="";
        var len=this.getAttribute("maxLength")||300;
        len=parseInt(len);
        if(_val.length>len){
            $this.text(_val.substring(0,len));
            // this.innerHtml=this.innerText.substring(0,len);
        }
        // console.log(len-this.innerText.length);
    });

});
$(function(){
    $.extend({
        radio:function(){
            debugger;
        }
    });
    $.fn.extend({
        setRadio:function(value){
            this.each(function(){
                if(this.value==value){
                    this.checked=true;
                }
                this.disabled=true;
            })
        },
        getText:function(name){
            return $("input[name='"+name+"']").val();
        },
        getTextarea:function(name){
            return $("textarea[name='"+name+"']").val();
        },
        getRadio:function(name){
            var radio=$("input[name='"+name+"']");
            $(radio).each(function(){
                if(this.checked){
                    return this.value;
                }
                this.disabled=true;
            });
        },
        getCheckbox:function(name,str){
            var checkboxlist=$("input[name='"+name+"']");
            var arr=[];
            $(checkboxlist).each(function(){
                if(this.checked){
                    arr.push(this.value);
                }
            });
            return str?arr:arr.join(",");
        },
        getSelect:function(name){
            return $("select[name='"+name+"']").val();
        }
    });
});