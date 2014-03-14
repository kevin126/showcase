/*****
*ci类型树展示js
***********************************************/
var allNodelist = new Object();//当前页面节点对象集合
/**列表树构造相关方法*********************************/
		function TreeNode(nodeId,eleObj, nodeName , pNode){
			if(!this.nodeId)this.nodeId = nodeId;//节点id
			if(!this.nodeName)this.nodeName = nodeName;//节点名称
			if(!this.pNode)this.pNode = pNode;//父节点
			if(!this.cNodes)this.cNodes = new Object();//子节点
			if(!this.eleObj)this.eleObj = eleObj;//点击的<a>标签
		}
		
		/**导航位置的Ci库显示*/
		function builderNavEleTit(){
			var aele = document.createElement("A");
			aele.setAttribute("href","###");
			var sele = document.createElement("STRONG");
//			var tnode = document.createTextNode("CI库")
			//var split = document.createTextNode("CI库")
//			sele.appendChild(tnode);
			aele.appendChild(sele);
		}
		
		/**构造导航条**/
		function bulderNavEle(node,objectEle){
			if(!node)return;
			if(!objectEle)return;
			if(!objectEle.nodes)objectEle.nodes  = new Array();
			//alert(objectEle.innerHTML);
			//--------------构造一个节点开始
			var aE = document.createElement("A")
			aE.setAttribute("href","###");
			try{
				var obj = new Object();
				obj.nodeId = node.nodeId;
				obj.nodeName = node.nodName;
				obj.pNode = node.pNode;
				aE.obj = obj;
				aE.onclick = aclickEvent;//添加单击事件
				//aE.setAttribute("onClick","typeTreeNodeClick('"+node.nodeId+"',this,'"+node.nodeName+"',null,'"+node.pNode.nodeId+"')");
			}catch(e){
				//alert(e);
			}
			if(node.nodeName !='CI库'){
				aE.appendChild(document.createTextNode(node.nodeName+" "));
				objectEle.nodes.push(aE);
				objectEle.nodes.push(document.createTextNode(" "));
				objectEle.nodes.push(creatsplit());
				objectEle.nodes.push(document.createTextNode(" "));
			}
			//----------------构造一个节点结束
			if(node.pNode){
				bulderNavEle(node.pNode,objectEle);//递归继续
			}else {
				for(var i=objectEle.nodes.length -1 ;i>-1;i--){
					appendchild(objectEle,i);//将构造的节点添加到导航条的位置
				}
			}
			
			/**节点点击事件*/
			function aclickEvent(){
				var obj = this.obj;
				var ele = this;
				if(!obj){
					obj = event.srcElement.obj
					ele = event.srcElement
				}
				typeTreeNodeClick(obj.nodeId,ele,obj.nodeName,null,obj.pNode.nodeId);//更新类型列表
				displayPage(obj.nodeId);//ci类型分页查询
			}
			
		}
		
		/**递归添加导航节点*/
		function appendchild(objectEle,i){
			if(!objectEle)return;
			if(!objectEle.nodes)return;
			if(!objectEle.nodes[i])return;
			var ele = objectEle.nodes[i];
			if(ele){
				objectEle.appendChild(ele);
				appendchild(objectEle);
			}
		}
		
		/**创建导航条分隔符*/
		function creatsplit(){
			var splitE = document.createTextNode(">>")
			return splitE;
		}
		
		/**构造当前点击节点之间的父子关系**/
		function builderNode(nodeId,obj,nodename,pnodename,pnodeId){
			var node = allNodelist["'"+nodeId+"'"];
			if(!node){
				node = new TreeNode(nodeId,obj,nodename);
				allNodelist["'"+nodeId+"'"] = node;
				//alert(nodeId+nodename+pnodename+pnodeId);
			}
			if(!node.nodeName)node.nodeName = nodename;
			if(pnodeId){
				var pnode  = allNodelist["'"+pnodeId+"'"];
				if(!pnode){
					var pnode = new TreeNode(pnodeId,null,pnodename);
					allNodelist["'"+pnodeId+"'"] = pnode;
				}
				pnode.cNodes["'"+nodeId+"'"] = node;
				node.pNode=pnode;
			}
			return node;
		}
		
		
		/**树节点页面单击事件*/
		function typeTreeNodeClick(nodeId,obj,nodename,pnodename,pnodeId){
			if(!document.getElementById("queryPage"))return;
			obj.pnodeId = pnodeId;
			obj.pnodename=pnodename;
			obj.nodename = nodename;
			this.allNodelist = allNodelist;
			var node  = builderNode(nodeId,obj,nodename,pnodename,pnodeId);
			treeClikNode= node;
			var obj = {
				'parentid':nodeId
			}
			/*var str='';
				for(var par in allNodelist){ 
					str = par+":"+allNodelist.nodeName+"\n";
				}
			alert(str);*/
				request('/WEB-INF/jsps/cmdb/include/citypelistTop.jsp',obj,refresh);
				function refresh(html){
					document.getElementById('typeList').innerHTML = html;
					//document.getElementById('NowPnode').innerHTML = treeClikNode.nodeName;
					document.getElementById('citypedetaillist').style.display="";
					var nav = document.getElementById('access');
					var colum  = document.getElementById('colum');
					nav.innerHTML = "";
					bulderNavEle(treeClikNode,nav);
					if(colum)colum.style.display = "block";
				}
		}
		
		



