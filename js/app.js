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
                obj[this.name.toLocaleUpperCase()] = $().getInputValue(this);
            });
            return obj;
        },
        getSign：function(key){
            app.getObj()
        }
        showRole: function(flat) {
            $(".role" + flat).find("input").prop("disabled", "");
            $(".role" + flat).find("select").prop("disabled", "");
            $(".role" + flat).find("textarea").prop("disabled", "");
            $(".role" + flat).find("input[type='file']").show();
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
            console.log("parent isdisabled");
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

        // return false;
    });
    // 添加一行
    $(".addRowTr").click(function() {
        if ($(this).closest(".edit").length) {
            var index = $(this).parent().next().find("tr").length; //序号
            var tr = createTr(index);
            $(this).parent().next().children().append(tr);
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
            console.log("event.which" + event.which);
            return false;
        }
    });
    // 点击行序号时，选中
    $(".table-sub").on('click', 'tr', function() {
        console.log("点击了行");
        var _target = $(event.target).closest("td[field='number']")
        var len = _target.length;
        if (len) {
            _target.closest("tr").toggleClass("remove");
        }
    });
    var columnsRow = [{ field: "index", name: "序号" }]

    function createTr(index) {
        var tr = "<tr>";
        tr += "<td field='number'>" + index + "</td>";
        for (var i = 1; i < 6; i++) {
            tr += addTo(i);
        }
        tr += "</tr>";
        return tr;
    }

    function addTo(index) {
        var str = "";
        switch (index) {
            case 1:
                // statements_1
                str = "<td field='name'><input class='w60' type='text' name='names'></td>";
                break;
            case 2:
                str = "<td field='SAP_NO'><input class='w60' type='text' name='SAP_NO'></td>";
                break;
            case 3:
                str = "<td field='PHO_NO'><input class='w60' type='text' name='PHO_NO'></td>";
                break;
            case 4:
                str = "<td field='PRE_CHAG'><textarea class='editDiv' type='text' name='PRE_CHAG'></textarea></td>";
                break;
            case 5:
                str = "<td field='POST_CHAG'><textarea class='editDiv' type='text' name='POST_CHAG'></textarea></td>";
                break;
            default:
                // statements_def
                break;
        }
        return str;
    }
    //获取表格row数据
    window.getRows = function getRows() {
        var rows = $(".table-sub").find("tr").not(".header");
        var rowData = [];
        $(rows).each(function() {
            var obj = {};
            $(this.children).each(function(index, note) {
                var $inputs = $(this).find("input");
                var $textareas = $(this).find("textarea");
                if ($inputs.length) {
                    $inputs.each(function() {
                        obj[this.name] = this.value;
                    });
                }
                if ($textareas.length) {
                    $textareas.each(function() {
                        obj[this.name] = this.value;
                    });
                }
            });
            rowData.push(obj);
        });
        return rowData;
    }
    getRows();
    /*表格单元格点击事件*/
    $(".table-sub td").click(function() {
        var attr = this.getAttribute("field");
        switchField(attr);
    });

    function switchField(attr) {
        switch (attr) {
            case "name":
                // statements_1
                break;
            default:
                // statements_def
                break;
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
    $("input[type='text']").on("input propertychange", function() {
        var $this = $(this),
            _val = $this.val(),
            count = "";
        var maxLength = 30
        if (_val.length > maxLength) {
            $this.val(_val.substring(0, maxLength));
            // console.log("超出长度限制")
        }
    });
    //div可编辑，值改变时触发时间
    $("div[contenteditable]").on("input propertychange", function() {
        var $this = $(this),
            _val = this.innerText,
            count = "";
        var len = this.getAttribute("maxLength") || 300;
        len = parseInt(len);
        if (_val.length > len) {
            $this.text(_val.substring(0, len));
            // this.innerHtml=this.innerText.substring(0,len);
        }
        // console.log(len-this.innerText.length);
    });
    window.disabled = function() {
        $("input").prop("disabled", "disabled");
        $("select").prop("disabled", "disabled");
        $("textarea").prop("disabled", "disabled");
        $("input[type='file']").hide();
    };
    disabled();
    $(".upImg").change(function() {
        if ($(this).prev()[0].nodeName == "IMG" && this.value) {
            if (window.URL) {
                $(this).prev()[0].src = window.URL.createObjectURL(this.files.item(0));
            } else {
                $(this).prev()[0].src = this.value; //ie8可以显示图片
            }
        } else {
            $(this).prev()[0].src = "";
        }
    });
});
$(function() {
    $.extend({
        setText: function(name, value) {
            $("input[name='" + name + "']").val(value).prop("checked", true);
        },
        setRadio: function(name, value) {
            var radio = $("input[name='" + name + "']", this.selector);
            $(radio).each(function() {
                if (this.value == "") {
                    $("." + name).setSelect(name, value);
                }
                if (this.value == value) {
                    this.checked = true;
                }
                this.disabled = true;
            });
        },
        setSelect: function(name, value) {
            var $select = $("." + name);
            var $options = $select.find("option");
            $options.each(function() {
                if (this.value == value) {
                    this.selected = true;
                    console.log("-------")
                    $select.change();
                }
                this.disabled = true;
            });
        },
        setTime: function(name, value) {
            $('.' + name).text(value);
        },
        objSetValue: {
            textArea: function(name, value) {
                $("." + name).setPre(value);
            },
            text: function(name, value) {
                $.setText(name, value);
            },
            NowDate: function(name, value) {
                $.setTime(name, value);
            }
        }
    });
    $.fn.extend({
        setText: function(value) {
            // $("input[name='" + name + "']").val(value).prop("checked", true);
            var span = $("<span class='" + this.class + "'></span>").text(value);
            this.after(span);
            this.remove();
        },
        // 设置单选按钮选中，并且禁用单选框选中
        setRadio: function(name, value) {
            var radio = $("input[name='" + name + "']", this.selector);
            $(radio).each(function() {
                if (this.value == "") {
                    $("." + name).setSelect(name, value);
                }
                if (this.value == value) {
                    this.checked = true;
                }
                this.disabled = true;
            });
        },
        setSelect: function(name, value) {
            var $this = $(this);
            var $options = $(this).find("option");
            $options.each(function() {
                if (this.value == value) {
                    this.selected = true;
                    $this.change();
                }
                this.disabled = true;
            });
        },
        //设置复选框选中值，并且禁用
        setCheckbox: function(name, value) {
            var radio = $("input[name='" + name + "']", this.selector);
            $(radio).each(function() {
                if (this.value == value) {
                    this.checked = true;
                }
                this.disabled = true;
            });
        },
        setPre: function(value) {
            var $pre = $("<pre class='w560' style='background:red;display:inline-block;vertical-align:top;'></pre>");
            $pre.html(value);
            $(this).find("textarea").after($pre).remove();
            $(this).find(".upImg").remove();
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
                // this.disabled=true;
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
            return $("input[name='" + name + "']").val();
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