$(document).ready(function() {
			$.formValidator.initConfig({
						formid : "addKnowledgeProblemId",
						wideword : false,
						onerror : function(msg) {
							},
						onsuccess : function() {
							$("#submitButton").attr("disabled", true);
							return true;
						}
					});
			$("#knowledgeProblemTitleId").formValidator({
						onshow : '请输入问题标题',
						onfocus : '请将问题标题描述清晰易懂',
						oncorrect : '合法'
					}).inputValidator({
						min : 1,
						max : 30,
						onerror : '问题标题为必输入项，长度为1到30字符'
					}).functionValidator({
						fun : function(val, elem) {
							if (/[<|&|>|'|"|\\]+/.test($.trim(val)) || /\s{2}/.test($.trim(val))
								|| /^\s/.test($.trim(val)) || /\s$/.test($.trim(val))) {
							return "不能包含&，\\，|，<，>，\'，\"，连续的2个空格";
							} else {
							return true;
							}
					}
				});
				
				$("#uploadfileId").formValidator({
						onshow : '请上传你的文件',
						onfocus : '请选择图片或视频文件',
						oncorrect :'合法'
					}).functionValidator({
					fun : function (val,elem){
				   var elems = document.getElementsByTagName("input");
				   var allowSubmit = false;
                    for(var k = 0;k<elems.length;k++) {
                    if(elems[k].type=="file"){
                       val =elems[k].value;
				     if (!val){
				   allowSubmit=true;
				     continue;
				     }
				     
					extArray = new Array(".gif", ".jpg", ".png", ".wmv", ".mp4", ".mkv", ".flv", ".swf")	
                  if(val.indexOf("\\") != -1){
                   val = val.slice(val.indexOf("\\") + 1);
                   ext = val.slice(val.indexOf(".")).toLowerCase();
                   for (var i = 0; i < extArray.length; i++) {
                   if (extArray[i] == ext.toLowerCase()) 
                   { 
                   allowSubmit = true;
                     break;
                   }
                   allowSubmit = false;
                   }
                   if (!allowSubmit){
                    return "对不起，只能上传以下格式的文件:  " + (extArray.join("  ")) + "\n请重新选择符合条件的文件"+ "再上传";
                       }
					} 
			       }
			       }
			       return allowSubmit;
				}		
				,onerror: '文件格式错误！'
					});
					
			$("#knowledgeProblemDesId").formValidator({
						onshow : '请输入问题描述',
						onfocus : '请将问题描述写得清晰易懂',
						oncorrect :'合法'
					}).inputValidator({
						min : 1,
						max : 2000,
						onerror : '问题描述为必输入项，长度为1到2000'
					});
			$("#knowledgeTypeId").formValidator({
						onshow : '请选择知识库类型',
						onfocus : '知识库类型为必须选择项',
						oncorrect :'合法'
					}).functionValidator({
					fun : function(){
						var type = $("#knowledgeTypeId").attr("value");
						if(null==type || ""==type){
							return "知识库类型为必须选择项";
						}
						return true;
					},
					onerror: '输入错误'
		});
		$("#knowledgeTypeId").bind("mouseout", function(){
			$("#knowledgeTypeId").blur();
		});
})