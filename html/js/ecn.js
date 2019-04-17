
var flows=["编制","物控确认","特别修改"];

var ecn_table={
	columns:[
		{field:"rowNo",name:"序号",fun:"setText"}
		,{field:"names",name:"名称",fun:"setText"}
		,{field:"phoNo",name:"图号",fun:"setText"}
		,{field:"sapNo",name:"SAP编码",fun:"setText"}
		,{field:"preChag",name:"更改前",flag:"img",img:"bgqmsfj",fun:"preAndImg"}
		,{field:"postChag",name:"更改后",flag:"img",img:"bghmsfj",fun:"preAndImg"}
		,{field:"chgTag",name:"更改标记",fun:"roleText"}
		,{field:"chgNo",name:"更改处数",fun:"roleText"}
		,{field:"remark",name:"备注",fun:"remark"}
		,{field:"dep",name:"物控部门意见",flag:"html",fun:"bmyj"}
	],
	bmyjArr:[
		{type:"text",name:"orderNo",text:"订单号："}
		,{type:"text",name:"other",text:"其他："}
		,{type:"title",name:"invAmo",text:"库存数量"}
		,{type:"text",name:"compInvAmo",text:"公司库存数量："}
		,{type:"text",name:"supInvAmo",text:"供应商库存数量："}
	],
	clArr:["orderNo",'other','compInvAmo','supInvAmo'],
	funs:{
		setText:function(data,obj){
			return ecn_table.setText(data,obj);
		},
		preAndImg:function(data,obj,_i){
			return ecn_table.preAndImg(data,obj,_i);
		},
		roleText:function(data,obj,_i){
			return ecn_table.roleText(data,obj,_i,ecn_table.role);
		},
		remark:function(data,obj,_i){
			return ecn_table.remark(data,obj,_i);
		},
		bmyj:function(data,obj,_i){
			return ecn_table.bmyj(data,obj,_i);
		}
	},
	remark:function(data,obj){
		var	area="<pre>"+(data[obj.field]||"")+"</pre>";
		if(ecn_table.role==2){
			area="<textarea>"+(data[obj.field]||"")+"</textarea>";
		}
		return area;
	},
	setText:function(data,obj){
		var span="<span>"+(data[obj.field]||"")+"</span>";
		return span;
	},
	preAndImg:function(data,obj,_i){
		var pre="<pre>"+(data[obj.field]||"")+"</pre>";
		pre+="<img class='"+obj.img+_i+"' style='width:100px;height:100px;' src='"+data[obj.img]+"'>";
		return pre;
	},
	roleText:function(data,obj,_i,role){
		var  value=data[obj.field]||"";
		var str="<span>"+value+"</span>";
		if(role==0){
			str="<input type='text' name='"+obj.field+"-"+_i+"' value='"+value+"'>";
		}
		return str;
	},
	setRow:function(data,_i){
		var $tr=$("<tr></tr>");
		var _this=this;
		$tr.attr("id",data.rowNo);
		$tr.data("oldData",data);//把数据放到当前行
		$(this.columns).each(function(index,value){
			// var colspan=this.col;
			var $td=$("<td></td>").attr({field:this.field});
			var $div=$("<div></div>").addClass(this.field);
			var subHtml=_this.funs[this.fun](data,this,_i);
			$div.append(subHtml);
			$td.append($div);
			$tr.append($td);
		});
		return $tr;
	},
	addTr:function(data){
		var $lastRow=$(".d-body");
		function sortRowNo(a,b){
			return a.rowNo-b.rowNo;
		}
		data.chgeDescs.sort(sortRowNo)
		$(data.chgeDescs).each(function(i){
			$lastRow.append(ecn_table.setRow(this,i));
		});
		if(this.role!=1){
			$("input[type='radio']").prop("disabled","disabled");
		}
	},
	createNode:function(data,flog){
		var str="";
		$(this.bmyjArr).each(function(index,value){
			var className=this.name;
			var content=this.type=="title"?"":flog?ecn_table.createInput(this,data[this.name]):ecn_table.createSpan(this.name,data[this.name]);
			str+="<div>"+this.text+content+"</div>";
		});
		return str;
	},
	createInput:function(obj,value){
		value=value||"";
		var className=obj.name;
		if(obj.type=="number"){
			className+=" inputNumber";
		}
		if(obj.type=="textarea"){
			return "<textarea class='"+className+"'>"+value+"</textarea>";
		}
		return "<input class='"+className+"' type='"+obj.type+"' name='"+obj.name+"' value='"+value+"'>";
	},
	createSpan:function(className,text){
		return "<span class='"+className+"'>"+(text || "")+"</span>"
	},
	bmyj:function(data,obj,_i){
		var div="<div><b>制品处理意见</b></div>";
		var label=this.addLabel(data["billAdv"],_i);
		var flag = this.role == 1;
		var div2=this.createNode(data,flag);
		return div+label+div2;
	},
	addLabel:function(flag,linenum){
		var $label="";
		var list=["自然消耗","立即切换","按单消耗"];
		$(list).each(function(index,value){
			$label+="<label><input type='radio'";
			$label+=flag==value?"checked":"";
			$label+=" name='billAdv-"+linenum+"' value='"+value+"'>"+value+"</label>";
		});
		return $label;
	},
	getDep:function(){
		var list=[];
		var _this=$("td[field='dep']");
		// var $radios=$("td[field='dep']").find("[type='radio']");
		$(_this).each(function(){
			list.push(ecn_table.loopDep(this))
		});
		return list;
	},
	loopDep:function(than){
		var $than=$(than);
		var $tr=$than.closest("tr");
		var data=$tr.data("oldData");
		var billAdv=$than.find("[type='radio']").getRadio1();
		var obj={};
		$(this.clArr).each(function(){
			obj[this]=$than.find("."+this).val();
		});
		obj.billAdv=billAdv;
		return $.extend(data,obj);
	},
	getChg:function(){
		var list=[];
		var rows=$("td[field='chgTag']").closest("tr");
		rows.each(function(){
			list.push(ecn_table.loopChg(this));
		});
		return list;
	},
	loopChg:function(trNode){
		var $than=$(trNode);
		var data=$than.data("oldData");
		var chgTag=$than.find("[name^='chgTag']").val();
		var chgNo=$than.find("[name^='chgNo']").val();
		var obj={chgTag:chgTag,chgNo:chgNo};
		return $.extend(data,obj);
	},
	setEco:function(data){
		$(".ecnId").text(data.ecnNo);
		$(".prodNo").text(data.prodNo);
		$(".saleChan").text(data.saleChan);
		$(".chgType").text(data.chgType);
		$(".formVer").text(data.formVer);
	},
	setQz:function(data){
		$(".bz").setSpan(data.bz);
		$(".sapsh").setSpan(data.sapsh);
		$(".pz").setSpan(data.pz);
		$(".wk").setSpan(data.wk);
	},
	setData:function(data){
		this.role=flows.indexOf(data.flow);
		this.setEco(data);
		this.addTr(data);
		this.setQz(data);
		this.constant_obj=data;
	},
	getData:function(){
		var obj=[];
		switch (this.role) {
			case 0:
				obj=this.getChg();
				break;
			case 1:
				obj=this.getDep();
				break;
			default:
				break;
		}
		obj=$.extend(this.constant_obj,{chgeDescs:obj});
		eval("var str='"+JSON.stringify(obj)+"';");
		return str;
	}
}