/******************************************************************************** 
 * Create Author   : jove wjdeng
 * Create Date     : Nov 2, 2009
 * File Name       : RfcAudit.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2009 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/ 
 /******************************************************************************** 
 * 会签人员列表显示控制
 * 
 * 
 *
 * Copyright 1999 - 2009 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/ 
	/**构造表格
	*@param rtValue 人员选择树控件的返回对象
	*@param tbodyid 增加行所在tbody的id
	*@param fixedHandler 设置选择的用户到指定应藏域id   结果值为 user1,user2,user3,
	*@param addFunction 添加按钮的添加用户调用方法
	*/
	function BuilderTbody(rtValue,tbodyid,fixedHandler,addFunction){
		this.tbody = document.getElementById(tbodyid);	
		if(!this.tbody)return;
		if(!this.fixedHandler){
				this.fixedHandler = document.getElementById(fixedHandler);//提交审批意见时,存储选择人的隐藏域
		}
		if(this.tbody.addbtn && addFunction){//在jsp自定义标签中初始化了添加按钮对象 为添加按钮添加事件方法	
				this.tbody.addbtn.onclick = addFunction;//addbtn属性,见java类:CountersignTaskRecordTag.setInitScript(StringBuffer sb)方法
		}
		this.init();//初始化数据	
		if(!rtValue)return;			
		for(var i=0;i<rtValue.length;i++){					
		    var btr=	this.builderTR(rtValue[i]);
		    if(!btr)continue;				        
		    this.tbody.appendChild(btr);//添加一行
		}
		this.addData();
		this.setReturnValue();//将返回值赋给隐藏域		
	}
	
	//设置选择的用户到指定应藏域中
	BuilderTbody.prototype.setReturnValue = function(){
		var fixedHandler = "";
		for(var para in this.tbody.userMap){
			fixedHandler+=para+",";
		}
		if(this.fixedHandler){
			this.fixedHandler.value = fixedHandler;
		}
	}
	
	//初始化数据
	BuilderTbody.prototype.init = function(){				
		this.tbody.addUserMap = new Object();//更新本次新添加的用户map
		if(!this.tbody.userMap){//还没有添加用户需要初始化数据
			this.tbody.userMap  = new Object();//当前列表中的用户
			this.tbody.stateMap = new Object();						
			var rows = this.tbody.rows; 					
			if(rows){ 
				for(var i=0;i<rows.length;i++){
					try{
						var userCell = rows[i].cells[1]; 
						var user = userCell.getElementsByTagName("A")[0].innerHTML;
						//this.tbody.userMap[user] = user;
						rows[i].user=user;//此行对应的用户						
						var operCell = rows[i].cells[rows[i].cells.length-1];//移除操作功能表格
						var stateCell = rows[i].cells[rows[i].cells.length-2];//状态表格(状态表格有可能不存在而是其它表格)
						if(operCell.hasChildNodes()){
							this.tbody.userMap[user] = 'UnDoneState';  //
							var ael = operCell.getElementsByTagName("A")[0];
							ael.onclick=this.removeRowEvent;//移除链接添加移除事件
							ael.BuilderTbody= this;	 
							if(!this.tbody.stateMap['UnDoneState'])
								this.tbody.stateMap['UnDoneState']=stateCell.cloneNode(true);//新添加行时用(新添加的行状态都是未完成)
						}else{ 
							this.tbody.userMap[user] = 'DoneState';  
							if(!this.tbody.stateMap['DoneState'])
								this.tbody.stateMap['DoneState']=stateCell.cloneNode(true);
						}								 
					}catch(e){}
				}
				this.setReturnValue();
			}			
		}
		
	}
	//构造行
	BuilderTbody.prototype.builderTR = function (trarray){
		if(!trarray)return ;
		var username = trarray[0].name;
		if(this.tbody.userMap[username]){//该用户重复
			return;
		}									
		var tr = document.createElement("TR");
		tr.user=username;
		
		var sque = this.tbody.rows.length;
		if(!sque)sque=0;
		var td = this.builderTD(sque+1);					 
		tr.appendChild(td);	 
		
		//td=this.builderUserTD(trarray[0].name);
		td=this.builderTD(trarray[0].name);
		tr.appendChild(td);
		
		this.tbody.userMap[username]='UnDoneState';//已添加的用户列表,用户未完成任务
		this.tbody.addUserMap[username]=username;//本次新添加的用户列表
	
		td=this.builderTD(this.htmlDecode(trarray[1].realName));
		tr.appendChild(td);						 
		
		td=this.builderTD(this.htmlDecode(trarray[3].depet));
		tr.appendChild(td);
		
		td=this.builderTD(this.htmlDecode(trarray[4].workGroup));
		tr.appendChild(td);
		
		td=this.builderTD(trarray[7].mail);
		tr.appendChild(td);
		
		td=this.builderTD(trarray[8].office);
		tr.appendChild(td);	
		
		this.builderStateTD(tr);
		
		td=this.builderOperationTD();
		tr.appendChild(td);						
		 	
		return tr;
		 				
	}
	
	//构造表格	
	BuilderTbody.prototype.builderTD =	function (text,attributes,values){
		var td = document.createElement("TD");
		if(!text){
			text="";
		}
		var textNode = document.createTextNode(text);
		td.appendChild(textNode);
		//td.setAttribute('align','center');
		//td.setAttribute('valign','middle');
		return td;
	}	
	
	//构造user表格	
	BuilderTbody.prototype.builderUserTD=	function (text){
		var td = document.createElement("TD");
		var ael = document.createElement("A");	
		if(mainPath){
			ael.setAttribute('href',mainPath+'/security/userMgt.do?method=userDetails&name='+text);
		}else{
			ael.setAttribute('href','/itsm/security/userMgt.do?method=userDetails&name='+text);
		}				 
		ael.appendChild(document.createTextNode(text));
		ael.setAttribute('user',text);		 
		td.appendChild(ael);
		return td;
	}
	
	//构造操作表格	
	BuilderTbody.prototype.builderOperationTD=	function (){
		var td = document.createElement("TD");
		var ael = document.createElement("A");	
		ael.setAttribute('href','javascript:void(0)');				 
		ael.appendChild(document.createTextNode('移除'));
		ael.onclick=this.removeRowEvent;//添加移除事件
		ael.BuilderTbody= this;
		td.appendChild(ael);
		return td;
	}
	
	//构造状态表格	
	BuilderTbody.prototype.builderStateTD=	function (tr){
		var headlength = this.tbody.parentNode.rows[0].cells.length;
		var trlength = tr.childNodes.length;
		//alert(headlength +"  "+trlength);
		if(headlength-1==trlength) return ;
		if(tr && this.tbody.stateMap['UnDoneState']){//包含已完成的状态行则需要添加状态cell 
			var td =this.tbody.stateMap['UnDoneState'].cloneNode(true);
			tr.appendChild(td);
		}
	}
	
	//序号重排
	BuilderTbody.prototype.rebuilderSque = function(){
		var rows = this.tbody.rows; 
		if(rows){ 
			for(var i=0;i<rows.length;i++){
				try{
					rows[i].cells[0].innerHTML=(i+1)+"";  
				}catch(e){}
			}					 
		}
	}
	//移除事件
	BuilderTbody.prototype.removeRowEvent = function(){
		var removerRow = this.parentNode.parentNode;//获得将要被删除的行对象
		var user = removerRow.user;
		if(!hasabledelet(this.BuilderTbody.tbody)){
			alert("不能删除最后一位处理人！");
			return ;
		}
		delete this.BuilderTbody.tbody.userMap[user];//删除选择的用户
		this.BuilderTbody.tbody.removeChild(removerRow);//移除行
		this.BuilderTbody.rebuilderSque();//序号重排 
		this.BuilderTbody.setReturnValue();//将返回值赋给隐藏域	(更新隐藏域用户数据)
		this.BuilderTbody.setRefreshFlag(user);//删除后台数据
		this.BuilderTbody.deleteData(user);//删除后台数据
		function hasabledelet(tbody){
			if(!tbody.jbpmProcessId)return true;//当tbody.jbpmProcessId为未定义时,此处的添加操作审批时的选择下一步处理人
			var userMapT = tbody.userMap;
			var i=0;
			for(var usertem in userMapT){
				if(userMapT[usertem]=='UnDoneState'){
					i++;
				}
			}
			return i>1;				 
		}
	}
	
	/**
	*设置操作完成后用户是否需要刷新的标志
	*(比如删除或添加处理人是当前处理人则处理完成后需要刷新页面)
	*
	****/
	BuilderTbody.prototype.setRefreshFlag = function(user){
		if(document.curUser && user ){
				if(user == document.curUser){
					document.needRefresh="Y";
					//this.tbody.needRefresh
				}
		}
	}
	
	//移除行后台数据操作
	BuilderTbody.prototype.deleteData =function(user){
		if(this.tbody.jbpmProcessId && this.tbody.activitName && user ){
			this.deletCallback.BuilderTbody=this;
			CountersignTaskRecordService.deletCountersignTaskForActivit(this.tbody.jbpmProcessId,this.tbody.activitName,user,this.deletCallback);
			
		}
	}
	
	//删除行回调方法
	BuilderTbody.prototype.deletCallback = function(data){
		if(data!='success'){
			if(JS_I18N){
				alert(JS_I18N["countersign_"+data]);
			}
			window.location.reload();
		}else{
			try{
				if("Y"==document.needRefresh)window.location.reload();
			}catch(e){
			}
		}
	}
	
	//添加处理人后台数据操作
	BuilderTbody.prototype.addData =function(){
		if(this.tbody.jbpmProcessId && this.tbody.activitName ){
			var userArray = new Array(); 
			for(var user in this.tbody.addUserMap){
				userArray.push(user);
				this.setRefreshFlag(user);//删除后台数据
			}
			if(userArray.length>0){
				CountersignTaskRecordService.addCountersignTaskForActivit(this.tbody.jbpmProcessId,this.tbody.activitName,userArray,this.addCallback);
			}
		}
	}
	
	BuilderTbody.prototype.addCallback = function(data){
		if(data!='success'){
			if(JS_I18N){
				alert(JS_I18N["countersign_"+data]);
			}
			window.location.reload();
		} else{
			try{
				if("Y"==document.needRefresh)window.location.reload();
			}catch(e){
			}
		}
	}
	
	BuilderTbody.prototype.htmlDecode = function(str){
		if(str){
			try{
				return Ext.util.Format.htmlDecode(str);
			}catch(e){
				return '';
			}
		}
		return '';
	}
	