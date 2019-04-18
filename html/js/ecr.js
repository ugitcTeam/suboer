(function(window){
	window.app={
		getObj:function(list){
			var obj={};
			var _this=this;
			$(list).each(function(){
				obj[this.name]=app.getInpVal(this);
				if(this.sub==obj[this.name]){
					$.extend(obj,app.getObj(this.subList));
				}
			});
			return obj;
		},
		setObj:function(data,list){
			$(list).each(function(){
				app.set[this.type]({name:this.name,value:data[this.name]});
			});
		},
		getInpVal:function(enty){
			app.get[enty.type](enty.name)
		},
		get:{
			text:function(name){
				return $("input[name='"+name+"']").val();
			},
			radio:function(name){
				var $radio=$("input[name='"+name+"']");
				$radio.each(function(){
					if(this.checked){
						return this.value;
					}
				});
			},
			checkbox:function(name){
				var $checkbox=$("input[name='"+name+"']");
				var arr=[];
				$checkbox.each(function(){
					if(this.checked){
						arr.push(this.value);
					}
				});
				return arr;
			},
			select:function(name){
				return $("select[name='"+name+"']").val();
			},
			file:function(name){ 
				var $this=$("input[name='" + name + "']")
				var str=$this.val();
				var preImg=$this.prev("img");
				str=str?preImg.attr("src"):str;
				return str;
			}
		},
		set:{
			text:function(enty){
				$("input[name='"+enty.name+"']").val(enty.value);
			},
			radio:function(enty){
				var $radio=$("input[name='"+enty.name+"']");
				$radio.each(function(){
					if(this.value==enty.value){
						this.checked=true;
					}
				});
			},
			checkbox:function(enty){
				var $checkbox=$("input[name='"+enty.name+"']");
				var arr_val=(typeof enty.value=="string")?enty.value.split(","):value;
				$checkbox.each(function(){
					if(arr_val.indexOf(searchElement: any, fromIndex?: int))
				})
			}
		}
	}
})(window)