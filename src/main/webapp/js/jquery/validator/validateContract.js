/**
 * 合同验证
 */
$(document).ready(function() {
			$.formValidator.initConfig({
						formid : "ContractActionForm",
						onerror : function(msg) {
							return false;
						},
						onsuccess : function() {
							    compareContracTimes();
								return false;
						}
					});
			// 合同的名称，字符串，全局唯一，长度范围1-255，必填
			$("#contractname").formValidator({
						onshow : '请输入合同名称',
						onfocus : '名称不能为空',
						oncorrect : '合法'
					}).inputValidator({
						min : 1,
						max : 255,
						onerror : '合同名称长度范围为1到255'
					}).functionValidator({
						fun : notNull
					});

			// 合同编号，字符串，全局唯一，长度范围0-20，非必填
			$("#contractcode").formValidator({
						onshow : '请输入合同编号',
						onfocus : '合同编号不能为空',
						oncorrect : '合法'
					}).inputValidator({
						min : 1,
						max : 20,
						onerror : '合同编号长度范围为1到20'
					});
			// 合同供应商
			$("#contractSuppler").formValidator({
						onshow : '请选择合同供应商',
						onfocus : '合同供应商不能为空',
						oncorrect : '合法'
					}).functionValidator({
						fun : function(val, elem) {
							// alert(val);
							// alert(elem);
							if (!Ext.isEmpty(val)) {
								return true;
							} else {
								return "合同供应商不能为空"
							}
						}
					});
			// 合同有效期，开始日期必选，
			// alert($("#contractbeginTS").aguments);
			$("#contractbeginTS").formValidator({
						onshow : '请选择开始日期',
						onfocus : '开始日期为必须输入项',
						oncorrect : '合法'
					}).inputValidator({
						min : 1,
						onerror : '开始日期为必须输入项'
					});
			// 结束日期可不选
			$("#contractendTS").formValidator({
						onshow : '请选择结束日期',
						onfocus : '结束时间为非必须输入项',
						oncorrect : '合法'
					}).inputValidator({
						onerror : '输入错误'
					});
			// 对该合同的简要描述，长度范围0-20000，非必填
			$("#contractmemo").formValidator({
						onshow : '请输入合同描述',
						onfocus : '合同描述为非必须输入项',
						oncorrect : '合法'
					}).inputValidator({
						max : 20000,
						onerror : '合同描述最大长度为20000'
					});
		});