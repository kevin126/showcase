function deleteComment(id, thisObj){
	if(thisObj)document.mtRecordeEnventSRC= thisObj;
	var confirmBox = Ext.MessageBox.confirm('确认', '确定要删除该备注吗？',
		function(button) {
			if (button == 'yes') {
				CommentService.deleteComment(id, function(returnValue){
					if(returnValue){
						var tr = document.mtRecordeEnventSRC.parentNode.parentNode.parentNode.parentNode;//
						var table = tr.parentNode;//备注子类容表格
						tr = table.parentNode;
						table = tr.parentNode;
						table.removeChild(tr);
						if(!table.hasChildNodes()){
							var panel = table.parentNode.parentNode;
							panel.innerHTML="<div class='no_date'><div class='no_date_nei'><div class='no_tishi'>暂无备注信息</div></div></div>";
						}
					}else{
						Ext.Msg.show({
							title : '错误',
							msg : '该备注已被其他用户删除！',
							modal : true,
							buttons : Ext.Msg.OK,
							fn:function(){window.location.reload();},
							icon : Ext.Msg.ERROR
						});
						
					}
				});
			}
			//<div class='no_date'><div class='no_date_nei'><div class='no_tishi'>暂无备注信息</div></div></div>
			function creatEmptContent(){
				var tr = document.createElement("div");
				tr.className = 'no_date';
				var td = document.createElement('div');
				td.className = 'no_date_nei'
				var div= document.createElement("div");
				div.className="no_tishi";
				var textnode = document.createTextNode('暂无任何备注信息');
				div.appendChild(textnode);
				td.appendChild(div);
				tr.appendChild(td);
				return tr;
			}
		}
	);
	
}

