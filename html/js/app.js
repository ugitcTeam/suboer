(function() {
    var app = {
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
        getNowFormatDate: function() {
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
        getNowDatTime: function() {
            var date = new Date();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            var seperator1 = ":";
            var currentDate = hours + seperator1 + minutes + seperator1 + seconds;
            return app.getNowFormatDate() + " " + currentDate;

        },
        //获取当前星期的周一日期
        getMonDay: function() {
            var now = new Date();
            var strDate = now.toLocaleDateString();
            var day = now.getDay() || 7; //获取当前星期X(0-6,0代表星期天,) 
            var date = now.getDate(); //获取当前日(1-31)  
            var strArr = strDate.split("/");
            strArr[2] = date - day + 1;
            return strArr.join("/");
        },
        getObj: function(list) {
            var obj = {};
            $(list).each(function() {
                obj[this.name] = $().getInputValue(this);
            });
            return obj;
        },
        getSign: function(list){
            app.getObj(list)
        },
        showRole: function(flat) {
            if(flat==0){
                return false;
            }
            var $role=$(".role" + flat);
            $role.find("input").prop("disabled", "");
            $role.find("select").prop("disabled", "");
            $role.find("textarea").prop("disabled", "");
            $role.find("input[type='file']").show();
            $role.addClass("edit").find(".p5c").show();
        }
    }
    window.app = app;
})();
// 文档加载完成后加载
$(function() {
    //兼容ie不支持写法
    if (!"console" in window) {
        window.console = {
            log: function() {}
        }
    }

    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(callback, thisArg) {
            var arg, sub;
            if (this == null) {
                throw new TypeError("this is nll or not undefined!");
            }
            if (typeof callback !== "function") {
                throw new TypeError(callback + "is not a function")
            }
            var sub = 0;
            var _array = Object(this);
            var len = _array.length;
            if (arguments.length > 1) {
                arg = thisArg;
            }
            while (sub < len) {
                if (sub in _array) {
                    callback.call(T, _array[sub], sub, _array);
                }
                sub++;
            }
        }
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(val) {
            var index = -1;
            var len = this.length;
            var _than = this;
            for (var i = 0; i < len; i++) {
                if (_than[i] == val) {
                    index = i;
                }
            }
            return index;
        }
    }
    $(".reld input").click(function() {
        if (this.value == "0" || this.value == "否") {
            $(this).closest("div").next("div").addClass("isdisabled").find("input").attr("checked", false);
        } else {
            $(this).closest(".reld").next("div").removeClass("isdisabled");
        }
    });
    $("input").click(function() {
        if ($(this).closest(".isdisabled").length) {
            // console.log("parent isdisabled");
            return false;
        }
        // 判断是否是变更种类
        if ($(this).closest(".flowClass")) {
            if (this.value == "快速变更") {
                $(".acc-dep").parent().addClass("isFlow");
            } else {
                $(".acc-dep").parent().removeClass("isFlow")
            }
        }
    });
    //数字输入框禁止输入字符
    // $(document).on('keyup blur change',"input.inputNumber",function(e){
    //     var _val=this.value.slice(0,8);
    //     this.value=_val.replace(/[^\d]/g,'');
    //     var event=e||window.event;
    //     if(event.keyCode ==40&&_val!=0){
    //         this.value--;
    //     }
    //     if(event.keyCode==38){
    //         this.value++
    //     }
    // }).on('keydown',"input.inputNumber",function(e){
    //    var pattl=/[0-9]+/;
    //    //ie8下无法获取键盘按下的值
    //     // return (event.keyCode==8 || event.key.match(pattl)!=null); 
    // });
    // 添加一行
    $(".addRowTr").click(function() {
        // addTr(this);
        var $parent=$(this).closest(".edit");
        if($parent.length){
            addTr($parent.find(".table-sub"));
        }
    });
    $(".removeRowTr").click(function() {
        var trs = $(".remove").remove();
        var tagTr = $(".table-sub").find("tr").not(".header");
        $(tagTr).each(function(index, node) {
            this.children[0].innerText = index + 1;
        });
    });
    $(".table-sub").mousedown(function() {
        if (event.which == 3) {
            // 点击了右键，获取鼠标点击的行
            $(event.target).closest("tr");
            // console.log("event.which" + event.which);
            return false;
        }
    });
    // 点击行序号时，选中
    $(".table-sub").on('click', 'tr', function() {
        var _target = $(event.srcElement).closest("td[field='rowNo']")
        var len = _target.length;
        if (len) {
            _target.closest("tr").toggleClass("remove");
        }
    });
    var columns=['rowNo','names','sapNo','phoNo','preChag','postChag'];
    function createTr(index,data) {
        var tr = "<tr>";
         $(columns).each(function(i,value){
            tr+=createTrObj[value](index,data);
         });
        tr += "</tr>";
        return tr;
    }
    function addTr(_this,data){
        
        var index = _this.find("tr").length; //序号
        var tr = createTr(index,data);
        _this.append(tr);
        $(tr).data("opts",data);
    }
    function setText(field,data){
        var _val=data[field] || "";
        var nodeStr="<span class='w60'>"+_val+"</span>";
        return nodeStr;
    }
    function createInput(field,value){
        return "<input class='w60' type='text' name='"+field+"' value='"+(value)+"'>";
    }
    function addTd1(field,data){
        var _val=data&&data[field]||"";
        var content=data&&!data.isEdit?setText(field,data):createInput(field,_val);
        return "<td field='"+field+"'>"+content+"</td>"
    }
    function setPreAndImg(field,data,img){
        var content="<div class='textarea'>";
        content+="<pre>"+(data[field]||"")+"</pre>";

        content+="<img src='"+(data[img]||"")+"' style='width:100px;height:100px;'>";
        content+="</div>";
        return content;
    }
    $(".table-sub").on('click','.delImg',function(){
        var $parent=$(this).parent();
        $parent.find("img").attr("src","");
        $parent.find("input[type='file']")[0].select(); 
        document.selection.clear();
    });
    function createAreaAndImgNode(field,imgName,data){
        var _fieldValue=data&&data[field] || "";
        var imgSrc=data&&data[imgName] || "";
        var nodeStr="<div style='position:relative'><textarea class='mText' name='"+field+"'>"+_fieldValue+"</textarea>";
        nodeStr+="<img src='"+imgSrc+"' alt=''/>";
        nodeStr+="<label class='upImgSty'><input class='upImg' type='file' name='"+imgName+"' value='"+imgSrc+"'></label><span class='delImg'>X</span></div>";
        return nodeStr;
    }
    function addTd2(columns,index,data){
        var content=data&&!data.isEdit?setPreAndImg(columns.mText,data,columns.upImgName):createAreaAndImgNode(columns.mText,columns.upImgName,data);
        return "<td field='"+columns.mText+"'>"+content+"</td>";
    }

    var createTrObj={
        rowNo:function(index){
            return "<td field='rowNo'>"+index+"</td>";
        },
        names:function(index,data){
            return addTd1("names",data);
        },
        sapNo:function(index,data){
            return addTd1("sapNo",data);
        },
        phoNo:function(index,data){
            return addTd1("phoNo",data);
        },
        preChag:function(index,data){
            return addTd2({mText:"preChag",upImgName:"bgqmsfj"},index,data);
        },
        postChag:function(index,data){
            return addTd2({mText:"postChag",upImgName:"bghmsfj"},index,data);
        }
    }
    //获取表格row数据
    window.getRows = function getRows() {
        var rows = $(".table-sub").find("tr").not(".header");
        var rowData = [];
        $(rows).each(function(i,node) {
            var obj = {rowNo:i+1};
            $(this.children).each(function(index, note) {
                var $inputs = $(this).find("input");
                var $textareas = $(this).find("textarea");
                if ($inputs.length) {
                    $inputs.each(function() {
                        obj[this.name] = this.value ||"";
                        if(this.type=="file"&&this.value==""){
                            obj[this.name]=$(this).closest("div").find("img").attr("src")||"";
                        }
                    });
                }
                if ($textareas.length) {
                    $textareas.each(function() {
                        obj[this.name] = this.value ||"";
                    });
                }
            });
            rowData.push(obj);
        });
        return rowData;
    }
    window.setRows=function(data){
        var isEdit=$(".table-sub").closest("[class*='role']").hasClass("edit");
        $(data).each(function(){
            this.isEdit=isEdit;
            addTr($(".table-sub"),this);
        });
        if(!data||data.length==0){
            addTr($(".table-sub"));
        }
    }

    // textarea 高度随内容自适应
    $.fn.autoHeight = function() {
        function autoHeight(elem) {
            elem.style.height = 'auto';
            elem.scrollTop = 0; //防抖动
            elem.style.height = elem.scrollHeight + 'px';
        }
        this.each(function() {
            autoHeight(this);
            $(this).on('keyup', function() {
                // debugger;
                if (event.code == "Enter") {

                    this.style.height = this.scrollHeight + 16 + "px";
                }
                autoHeight(this);
            });
        });
    }
    $('textarea[autoHeight]').autoHeight();
    //多行文本输入长度限制
    $("textarea").on("input propertychange", function() {
        var $this = $(this),
            _val = $this.val(),
            count = "";
        var len = this.getAttribute("maxLength") || 300;
        len = parseInt(len);
        if (_val.length > len) {
            $this.val(_val.substring(0, len));
        }
        // console.log(len-$this.val().length);
    });
    window.disabled = function() {
        $("input").prop("disabled", "disabled");
        $("select").prop("disabled", "disabled");
        $("textarea").prop("disabled", "disabled");
        $("input[type='file']").hide();
    };
    disabled();
    $(".table").on('change','.upImg',function(){
        upImgChange(this);
    });
    function upImgChange(than){
        var prev=$(than).parent().prev()[0];
        if (prev.nodeName == "IMG" && than.value) {
            if (window.URL) {
                prev.src = window.URL.createObjectURL(than.files.item(0));
            } else {
                prev.src = than.value; //ie8可以显示图片
            }
        } else {
            prev.src = "";
        }
    }
    $(".upImg").change(function() {
        upImgChange(this);
    });
    $(".rc-table").on("click",'img',function(){
        var imgSrc=$(this).attr("src");
        var $pop=$("#pop");
        var top=document.documentElement.scrollTop;
        if(!$pop.length){
            $pop=$("<div class='pop' id='pop'><div class='preview'><img></div></div>");
            $("body").append($pop);
        }
        $pop.css("top",top);
        if(imgSrc&&imgSrc!=""){
            document.body.parentNode.style.overflow="hidden";
            $pop.addClass("show");
            var $img=$('.preview',$pop).find("img").attr("src",imgSrc);
            var w=$img.width()
            var h=$img.height();
            if(w/h>2){
                $img.css("width",800);
            }else{
                $img.css("height",420);
            }
            dragZoom.init($img);
            $pop.click(function(){
                if(event.srcElement.nodeName!="IMG"){
                    $pop.removeClass("show");
                    $pop.find("img").attr({"src":"",style:""});
                    document.body.parentNode.style.overflow="auto";
                }
            });
            $img.dblclick(function(){
                this.src="";
                $pop.removeClass("show");
                document.body.parentNode.style.overflow="auto";
            });
        }
    });
});
$(function() {
    $.extend({
        setText: function(name, value) {
            $("input[name='" + name + "']").val(value);
        },
        setRadio: function(name, value) {
            var radio = $("input[name='" + name + "']", this.selector);
            var isEdit=radio.closest("[class*='role']").hasClass("edit");
            $(radio).each(function() {
                if (this.value == "") {
                    $("." + name).setSelect(name, value);
                }
                if (this.value == value) {
                    this.checked = true;
                    $(this).click();
                }
                this.disabled = !isEdit;
            });
        },
        setCheckbox: function(name, value) {
            var radio = $("input[name='" + name + "']", this.selector);
            var isEdit=radio.closest("[class*='role']").hasClass("edit");
            var vals=(typeof value=="string")?value.split(","):value;
            $(radio).each(function() {
                if (vals&&vals.indexOf(this.value) != -1) {
                    this.checked = true;
                }
                this.disabled = !isEdit;
            });
        },
        setSelect: function(name, value) {
            var $select = $("." + name);
            var $options = $select.find("option");
            var isEdit=$select.closest("[class*='role']").hasClass("edit");
            $options.each(function() {
                if (this.value == value) {
                    this.selected = true;
                    $select.change();
                }
                this.disabled = !isEdit;
            });
        },
        setImg:function(name,value){
            var $img=$("img."+name);
            $img.attr("src",value);
        },
        setFile:function(name,value){
            //这里input file出于安全，不允许赋值
            var $file=$("[name='"+name+"']");
            var isEdit=$file.closest("[class*='role']").hasClass("edit");
            isEdit?$file.val(value):$file.hide();
        },
        setTime: function(name, value) {
            $('.' + name).text(value);
        },
        getInputValue: function(entity) {
            var obj = "";
            switch (entity.type) {
                case "text":
                    obj = $().getText(entity.name);
                    break;
                case "textarea":
                    obj = $().getTextarea(entity.name);
                    break;
                case "radio":
                    obj = $().getRadio(entity.name);
                    break;
                case "checkbox":
                    obj = $().getCheckbox(entity.name);
                    break;
                case "file":
                    obj = $().getFile(entity.name);
                    break;
                case "select":
                    obj = $().getSelect(entity.name);
                    break;
                case "NowDate":
                    obj = $().getNowDate(entity.name);
                    break;
                default:
                    // alert("不存在的属性："+entity.msg);
                    break;
            }
            return obj;
        },
        objSetValue: {
            textarea: function(name, value) {
                $("[name='"+name+"']").val(value)
            },
            text: function(name,value) {
                $("."+name).setText(value);
            },
            span: function(name,value){
                $("."+name).setSpan(value);
            },
            pre:function(name,value){
                $("."+name).setPre(value);
            },
            NowDate: function(name, value) {
                $.setTime(name, value);
            },
            radio:function(name,value){
                $.setRadio(name,value);
            },
            file:function(name,value){
                $.setFile(name,value);
                $.setImg(name,value);
            }
        }
    });
    $.fn.extend({
        className:function(){
            return this.attr("class");
        },
        nodeName:function(){
            return this[0].nodeName;
        },
        setText: function(value) {
            var isEdit=this.closest("[class*='role']").hasClass("edit");
            if(!this[0]){
                $.setText(this.selector.slice(1),value);
                return false;
            }
            if(this.nodeName()=="INPUT"){
                this.val(value);
                this.prop("disabled",!isEdit);
                if(!isEdit){
                    var span = $("<span class='" + this.className() + "'></span>").text(value);
                    this.after(span);
                    this.remove();
                }
            }else{
                this.text(value);
            }

        },
        setSpan:function(value){
            this.text(value);
        },
        // 设置单选按钮选中，并且禁用单选框选中
        setRadio: function(value) {
            var isEdit=this.closest("[class*='role']").hasClass("edit");
            $(this).each(function() {
                if($(this).next()[0]&&$(this).next()[0].nodeName=="SELECT"){
                    $(this).next().setSelect(value);
                }
                if (this.value == value) {
                    this.checked = true;
                    $(this).click();
                }
            });
            $(this).prop("disabled",!isEdit);
        },
        setSelect: function(value) {
            var isEdit=this.closest("[class*='role']").hasClass("edit");
            var $this = $(this);
            var $options = $this.find("option");
            $options.each(function() {
                if (this.value == value) {
                    this.selected = true;
                    $this.change();
                }
            });
            this.prop("disabled",!isEdit);
        },
        //设置复选框选中值，并且禁用
        setCheckbox: function(value) {
            var isEdit=this.closest("[class*='role']").hasClass("edit");
            var datas=value;
            $(this.filter("[type='checkbox']")).each(function() {
                if (value.split(",").indexOf(this.value)>-1) {
                    this.checked = true;
                }
                this.disabled = !isEdit;
            });
        },
        setPre: function(value) {
            if(this.nodeName()=="PRE"){
                this.html(value);
                return false;
            }
            var $pre = $("<pre class='"+this.className()+"' style='display:inline-block;vertical-align:top;'></pre>");
            $pre.html(value);
            $(this).find("textarea").after($pre).remove();
            $(this).find(".upImg").remove();
        },
        setImg:function(value){
            this.attr("src",value);
        },
        getText: function(name) {
            return $("input[name='" + name + "']").val();
        },
        getTextarea: function(name) {
            return $("textarea[name='" + name + "']").val();
        },
        getRadio: function(name) {
            var radio = $("input[name='" + name + "']");
            var _val = "";
            $(radio).each(function() {
                if (this.checked) {
                    _val = this.value;
                }
            });
            return _val;
        },
        getRadio1:function(){
            var _val="";
            this.each(function(){
                if(this.checked){
                    _val=this.value;
                }
            });
            return _val;
        },
        getCheckbox: function(name, str) {
            var checkboxlist = $("input[name='" + name + "']");
            var arr = [];
            $(checkboxlist).each(function() {
                if (this.checked) {
                    arr.push(this.value);
                }
            });
            return str ? arr : arr.join(",");
        },
        getSelect: function(name) {
            return $("select[name='" + name + "']").val();
        },
        getNowDate: function() {
            return app.getNowFormatDate();
        },
        getFile: function(name) {
            var $this=$("input[name='" + name + "']")
            var str=$this.val();
            var preImg=$this.closest("div").find("img");
            str=str?str:preImg.attr("src");
            return str;
        },
        getInputValue: function(entity) {
            var obj = "";
            switch (entity.type) {
                case "text":
                    obj = $().getText(entity.name);
                    break;
                case "textarea":
                    obj = $().getTextarea(entity.name);
                    break;
                case "radio":
                    obj = $().getRadio(entity.name);
                    break;
                case "checkbox":
                    obj = $().getCheckbox(entity.name);
                    break;
                case "file":
                    obj = $().getFile(entity.name);
                    break;
                case "select":
                    obj = $().getSelect(entity.name);
                    break;
                case "NowDate":
                    obj = $().getNowDate(entity.name);
                    break;
                default:
                    // alert("不存在的属性："+entity.msg);
                    break;
            }
            return obj;
        },
        disabled: function() {
            this[0].disabled = "disabled";
            return this;
        }
    });
});