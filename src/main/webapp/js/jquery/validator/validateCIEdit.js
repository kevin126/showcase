var ValiDateCIedit = false;
var ValiMapCIeditTop = new Object();
$(document).ready(function() {
	$.formValidator.initConfig({
				formid : "CIEDIT_ID",
				wideword : false,
				validatorgroup : "1",
				tidymode:false,
				onerror : function(msg) {
					//alert("ff");
					if(dataBoxDataMap && document.getElementById("CIID")){
						//dataBoxDataMap$("#CIID").val(); 
						ValiMapCIeditTop[$("#CIID").val()]='N';
					}
					ValiDateCIedit = false;
					return false;
				},
				onsuccess : function() {
					//alert("ok..");
					if(dataBoxDataMap && document.getElementById("CIID")){
						//dataBoxDataMap$("#CIID").val();
						ValiMapCIeditTop[$("#CIID").val()]="Y";
					}
					ValiDateCIedit = true;
					//save4dataMap();//保存数据
					return false;
				}
			});
			
			
	// 用户登录时输入的用户名，全局唯一，可输入英文、数字、下划线，长度范围1-20
	$("#ciType").formValidator({
				empty:false,
				onshow : '请选择类型。',
				onfocus : '类型必填。',
				oncorrect : '合法！'
			}).inputValidator({
				min : 1,
				onerror : '类型不能为空！'
			});
	// 用户登录时输入的用户名，全局唯一，可输入英文、数字、下划线，长度范围1-20
	$("#ciName").formValidator({
				empty:false,
				onshow : '请输入名称。',
				onfocus : '名称必填。',
				oncorrect : '合法！'
			}).inputValidator({
				min : 1,
				max : 10,
				onerror : 'CI名称不能为空，最多10个字符！'
			}).regexValidator({
				regexp : "^[^@#$%&^]{1,10}$",
				onerror : "CI名称输入错误，不能包括@#$%^&等特殊字符。"
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test(val)) {
				return "不能包含&，\\，|，<，>，\'，\"等字符！";
			} else {
				return true;
			}
		}
	});
	
	//编号
	$("#code").formValidator({
				onshow : '请输入编号。',
				onfocus : '编号非必填。',
				oncorrect : '合法！'
			}).inputValidator({
				min : 0,
				max : 50,
				onerror : '编号非必填，最多50个字符！'
			}).regexValidator({
				regexp : "^[^@#$%&^]{0,50}$",
				onerror : "CI编号输入错误，不能包括@#$%^&等特殊字符。"
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test(val) ) {
				return "不能包含&，\\，|，<，>，\'，\"等字符！";
			} else {
				return true;
			}
		}
	}).defaultPassed();

	//版本号
	$("#version").formValidator({
				onshow : '请输入版本号。',
				onfocus : '版本号非必填。',
				oncorrect : '合法！'
			}).inputValidator({
				min : 0,
				max : 20,
				onerror : '版本号非必填，最多20个字符！'
			}).regexValidator({
				regexp : "^[^@#$%&^]{0,20}$",
				onerror : "CI版本号输入错误，不能包括@#$%^&等特殊字符。"
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test(val) ) {
				return "不能包含&，\\，|，<，>，\'，\"等字符！";
			} else {
				return true;
			}
		}
	}).defaultPassed();
	
	//联系电话
	$("#phone").formValidator({
				onshow : '请输入联系电话。',
				onfocus : '联系电话非必填。',
				oncorrect : '合法！'
			}).inputValidator({
				min : 0,
				max : 15,
				onerror : '联系电话非必填，最多15个字符！'
			}).regexValidator({
				regexp : "^[0-9|_-]{0,15}$",
				onerror : "联系电话输入错误，只由数字、“-”和“_”构成。"
			}).defaultPassed();;
	
	
	//位置
	$("#position").formValidator({
				onshow : '请输入位置。',
				onfocus : '位置非必填。',
				oncorrect : '合法！'
			}).inputValidator({
				min : 0,
				max : 255,
				onerror : '位置非必填，最多255个字符！'
			}).functionValidator({
		fun : function(val, elem) {
			if (/[<|&|>|'|"|\\]+/.test(val) ) {
				return "不能包含&，\\，|，<，>，\'，\"等字符！";
			} else {
				return true;
			}
		}
	}).defaultPassed();;
	//备注
	$("#memo").formValidator({
				onshow : '请输入描述。',
				onfocus : '描述非必填。',
				oncorrect : '合法！'
			}).inputValidator({
				min : 0,
				max : 255,
				onerror : '描述非必填，最多255个字符！'
			}).functionValidator({
				fun : function(val, elem) {
					if (/[<|&|>|'|"|\\]+/.test(val) ) {
						return "不能包含&，\\，|，<，>，\'，\"等字符！";
					} else {
						return true;
					}
				}
			}).defaultPassed();
	
	//来源
	$("#source").formValidator({
				onshow : '请选择来源。',
				onfocus : '来源非必填。',
				oncorrect : '合法！'
			}).inputValidator({
				min : 0,
				max : 15,
				onerror : '来源非必填，最多15个字符！'
			}).defaultPassed();
	
	//状态
	$("#status").formValidator({
				onshow : '请选择状态。',
				onfocus : '状态非必填。',
				oncorrect : '合法！'
			}).functionValidator({
				fun : function(val, elem) {
						return true;
				}
			}).defaultPassed();
	
	//生产商
	$("#manufacturer").formValidator({
				onshow : '请选择生产商。',
				onfocus : '生产商为非必填。',
				oncorrect : '合法！'
			}).inputValidator({
				min : 0,
				max : 255
			}).defaultPassed();
	
	
	//供应商
	$("#supplier").formValidator({
				onshow : '请选择供应商。',
				onfocus : '供应商为非必填。',
				oncorrect : '合法！'
			}).inputValidator({
				min : 0,
				max : 255
			}).defaultPassed();
			
	
	//管理员
	$("#manager").formValidator({
				onshow : '请选择管理员。',
				onfocus : '管理员为非必填。',
				oncorrect : '合法！'
			}).defaultPassed();
	
	
});

function bindValidate(col,regexpstr){
	if(!col)return;
	//col.dbColumn,null,(col.minLength?col.minLength:(col.allowedNull?1:0)),col.columnLength,col.displayName
	try{
		var min = (col.minLength?col.minLength:(!col.allowedNull?1:0));
		var max = col.columnLength;
		
		var str = col.displayName;
		if(col.htmlType=='flex'||col.htmlType=='radio'||col.htmlType=='date'){//下拉选项框
			str ="请选择“"+ str +"”";
			max=0;//需要进行选择的类型，不需要最大长度
		}else if(col.htmlType=='one_string'||col.htmlType=='float'||col.htmlType=='integer'||col.htmlType=='many_string'){//单行文本
			str ="请输入“"+ str +"”";
		}
		var id = col.dbColumn;
		
		if(!min ){
			min =0;
		}
		
		if(col.htmlType=='integer'){
			//max = 19;
		}
		if(col.htmlType=='float'){
			//max = 32;
		}
		
		var focusstr = "";
		if(min>0){
			focusstr = str +"，必填";
		}else{
			focusstr = str +"，非必填";
		}
		
		if(max>0 && !(col.htmlType=='float'||col.htmlType=='integer')){
			focusstr += "，最大长度"+max+'个字符！';
		}else{
			focusstr += "！";
		}
		
		//输入提示
		var validate =  $("#"+id).formValidator({
						onshow : str,
						onfocus : focusstr,
						oncorrect : '合法！'
					});
		if(col.htmlType=='radio'){
			validate=$(":radio[name='"+id+"']").formValidator({
						onshow : str,
						onfocus : focusstr,
						oncorrect : '合法！',
						defaultvalue:[""]
					});
		}
		if(!validate)return;
		
		//长度校验
		if(col.htmlType=='flex'||col.htmlType=='radio'||col.htmlType=='date'){
			if(min>0){
				validate.inputValidator({
					min : min,
					onerror : "请选择“"+ col.displayName +"”！"
				});
			}else{
				validate.functionValidator({
					fun : function(val, elem) {
							return true;
					}
				})
			}
		}else if(col.htmlType=='float'||col.htmlType=='integer'){
		
		}else{
			validate.inputValidator({
				min : min,
				max : max,
				onerror : '请输入长度为'+min+'-'+max+'个字符！'
			});
		
		}
		//正则表达式验证			
		if(regexpstr){
			validate.regexValidator({
					regexp : regexpstr.regexp,
					onerror : regexpstr.str
				})
		}
		if(col.htmlType=='float'){
			validate.regexValidator({
					regexp : "^(-?\\d+)(\\.\\d+)?$",
					onerror : "请输入正确的带小数点的数字！"
				});
			$("#"+id).attr("maxlength",30);
			validate.functionValidator({
					fun : function(val, elem) {
						return Number(val)<=max;
					}
				});
		}
		if(col.htmlType=='integer'){
			validate.regexValidator({
					regexp : "^-?\\d+$",
					onerror : "只由数字构成。"
				});
			$("#"+id).attr("maxlength",19);
			validate.functionValidator({
					fun : function(val, elem) {
						return Number(val)<=max;
					}
				});
		}
		
		validate.functionValidator({
				fun : function(val, elem) {
					if (/[<|&|>|'|"|\\]+/.test(val) || /\s{2}/.test(val)
							|| /^\s/.test(val) || /\s$/.test(val)) {
						return "不能包含&，\\，|，<，>，\'，\"，连续的2个空格";
					} else {
						return true;
					}
				}
			});
		//默认状态	
		if(min==0){
			validate.defaultPassed();
		}
		
	}catch(e){
		//alert(e);
	}
}