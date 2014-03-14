$(document).ready(function() {
			$.formValidator.initConfig({
						formid : "klAnswerForm",
						wideword : false,
						onerror : function(msg) {
							return false;
						},
						onsuccess : function() {
							return true;
						}
					});
			$("#answerContent").formValidator({
						onshow : '请输入该问题的答案',
						onfocus : '答案的内容为必填项',
						oncorrect : '合法'
					}).inputValidator({
						min : 1,
						max : 20000,
						onerrormin : "不能为空",
						onerrormax : "答案的内容长度最大为20000"
					}).functionValidator({
						fun : notNull
					});
		});