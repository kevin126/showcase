$(document).ready(function() {
			$.formValidator.initConfig({
						formid : "knowledgeProblemForm",
						wideword : false,
						onerror : function(msg) {
							return false;
						},
						onsuccess : function() {
							return true;
						}
					});
			$("#supplementary").formValidator({
						onshow : '请输入补充问题的内容',
						onfocus : '补充问题的内容为必填项',
						oncorrect : '合法'
					}).inputValidator({
						min : 1,
						max : 200,
						onerrormin : "不能为空",
						onerrormax : "补充问题的内容长度最大为200"
					}).functionValidator({
						fun : notNull
					});
		});