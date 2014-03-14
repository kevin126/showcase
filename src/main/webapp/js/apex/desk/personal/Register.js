Ext.namespace('Apex.Desk.Register');

Apex.Desk.MainFramePanel = function() {

	var usernameTxt = new Ext.form.TextField({
				fieldLabel : '用户名<font color="red">*</font>',
				maxLength : 20,
				minLength : 1,
//				vtype : 'SpecialChar',
				allowBlank : false,
				blankText : '用户名不能为空！',
				maxLengthText : '用户名长度不能超过20！',
				minLengthText : '用户名长度不能小于2！',
				vtype : 'CharAndNum',
				width : 200
			});
	var nicknameTxt = new Ext.form.TextField({
				fieldLabel : '姓名<font color="red">*</font>',
				maxLength : 20,
				minLength : 2,
				vtype : 'SpecialChar',
				allowBlank : false,
				blankText : '姓名不能为空！',
				maxLengthText : '姓名长度不能超过20！',
//				vtype : 'SpecialChar',
				width : 200
			});
	var passwordTxt = new Ext.form.TextField({
				fieldLabel : '密码<font color="red">*</font>',
				maxLength : 20,
				allowBlank : false,
//				vtype : 'SpecialChar',
				vtype : 'CharAndNumAndMin8AndMax20',
				inputType : 'password',
				width : 200
			});
	var passwordTxt2 = new Ext.form.TextField({
				fieldLabel : '确认密码<font color="red">*</font>',
				maxLength : 20,
				allowBlank : false,
//				vtype : 'SpecialChar',
				inputType : 'password',
				vtype : 'CharAndNumAndMin8AndMax20',
				width : 200
			});
	var workerNum = new Ext.form.TextField({
				fieldLabel : '工号',
				maxLength : 100,
//				vtype : 'SpecialChar',
				maxLengthText : '工号长度不能超过100！',
				vtype : 'SpecialChar',
				width : 200
			});
	var emailTxt = new Ext.form.TextField({
				fieldLabel : '电子邮件<font color="red">*</font>',
				minLength : 6,
				maxLength : 50,
//				vtype : 'SpecialChar',
				allowBlank : false,
				blankText : '电子邮件不能为空！',
				minLengthText : '电子邮件长度不能小于6！',
				maxLengthText : '电子邮件长度不能超过50！',
				regex : /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
				regexText : '电子邮件格式错误',
				width : 200
			});
	var mobileTxt = new Ext.form.TextField({
				fieldLabel : '手机号码<font color="red">*</font>',
				minLength : 5,
				maxLength : 20,
				allowBlank : false,
//				vtype : 'SpecialChar',
				blankText : '手机号码不能为空！',
				minLengthText : '手机号码长度不能小于5！',
				maxLengthText : '手机号码长度不能超过20！',
				regex : /^([0-9]|[\-\+])+$/,
				regexText : '手机号码格式错误',
				width : 200
			});
	var phoneTxt = new Ext.form.TextField({
				fieldLabel : '办公电话',
				maxLength : 20,
				maxLengthText : '办公电话长度不能超过20！',
				regex : /^([0-9]|[\-\+])+$/,
				regexText : '办公电话格式错误',
				width : 200
			});
	var faxTxt = new Ext.form.TextField({
				fieldLabel : '传真',
				maxLength : 20,
				maxLengthText : '传真长度不能超过20！',
				regex : /^([0-9]|[\-\+])+$/,
				regexText : '传真格式错误',
				width : 200
			});
	var msnTxt = new Ext.form.TextField({
				fieldLabel : 'MSN号码',
				maxLength : 50,
				maxLengthText : 'MSN长度不能超过50！',
				regex : /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
				regexText : 'MSN格式错误',
				width : 200
			});
	var qqTxt = new Ext.form.NumberField({
				fieldLabel : 'QQ号码',
				maxLength : 20,
				maxLengthText : 'QQ号码长度不能超过20！',
				width : 200
			});

	var country = new Ext.form.TextField({
				fieldLabel : '国家',
				maxLength : 10,
				vtype : 'SpecialChar',
				maxLengthText : '国家长度不能超过10！',
				vtype : 'SpecialChar',
				width : 200
			});
	var city = new Ext.form.TextField({
				fieldLabel : '城市',
				maxLength : 10,
				
				maxLengthText : '城市长度不能超过10！',
				vtype : 'SpecialChar',
				width : 200
			});
	var address = new Ext.form.TextField({
				fieldLabel : '地址',
				maxLength : 50,
				maxLengthText : '地址长度不能超过50！',
				vtype : 'SpecialChar',
				width : 200
			});
	var post = new Ext.form.NumberField({
				fieldLabel : '邮编',
				maxLength : 20,
				maxLengthText : '地址长度不能超过20！',
				width : 200
			});
	// ********************************
	var dwrproxy = new Ext.ux.data.DWRProxy({
				dwrFunction : SecurityService.getAllUserDeptNames
			});
	var userDeptStore = new Ext.data.SimpleStore({
				proxy : dwrproxy,
				fields : ['deptName', 'deptName']
			});
	var userDept = new Ext.form.ComboBox({
				fieldLabel : '部门<font color="red">*</font>',
				width : 200,
				triggerAction : 'all',
				baseCls : 'x-plain',
				emptyText : '请选择部门...',
				loadingText : '正在加载部门数据，请稍等...',
				valueField : 'deptName',
				displayField : 'deptName',
				mode : 'local',
				selectOnFocus : true,
				editable : true,
				allowBlank : false,
				store : userDeptStore
			});
	userDeptStore.load();
	// ********************************
	var mainPanel = new Ext.form.FormPanel({
		id : 'Apex.Desk.Register.MainPanel',
		title : '注册自助式服务台账户',
		frame : true,
		monitorValid : true,
		labelWidth : 80,
		width : 700,
		layout : 'column',
		items : [
				// 第一列
				{
			columnWidth : .5,
			layout : 'form',
			border : false,
			items : [usernameTxt, passwordTxt, workerNum, emailTxt, phoneTxt,
					msnTxt, country, address]
		},
				// 第二列
				{
					columnWidth : .5,
					layout : 'form',
					border : false,
					items : [nicknameTxt, passwordTxt2, userDept, mobileTxt,
							faxTxt, qqTxt, city, post]
				}],
		buttons : [{
			text : '提交',
			formBind : true,
			handler : function() {
				if (passwordTxt.getValue() != passwordTxt2.getValue()) {
					passwordTxt.setValue('');
					passwordTxt2.setValue('');
					Ext.MessageBox.show({
								title : '错误',
								msg : '两次输入的秘密不一致！',
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
					return;
				} else {
					var myMask = new Ext.LoadMask(Ext.getBody(), {
								msg : "数据处理中，请稍后..."
							});
					myMask.show();

					SecurityService.registerClient(usernameTxt.getValue(),
							nicknameTxt.getValue(), passwordTxt.getValue(),
							passwordTxt2.getValue(), workerNum.getValue(),
							userDept.getValue(), emailTxt.getValue().toLowerCase(), mobileTxt
									.getValue(), phoneTxt.getValue(), faxTxt
									.getValue(), msnTxt.getValue(), qqTxt
									.getValue(), country.getValue(), city
									.getValue(), address.getValue(), post
									.getValue(), {
								callback : function(rules) {
									myMask.hide();
									Ext.MessageBox.show({
												title : '提示',
												msg : '注册成功。欢迎使用OSSWorks IT运维系统！',
												buttons : Ext.MessageBox.OK,
												fn : function() {
													window.close();
												},
												icon : Ext.MessageBox.INFO
											});
								},
								errorHandler : function(errorString, exception) {
									myMask.hide();
									Ext.MessageBox.show({
												title : '错误',
												msg : exception.message,
												buttons : Ext.MessageBox.OK,
												icon : Ext.MessageBox.ERROR
											});
								}
							});
					return;
				}
			}
		}, {
			text : '关闭',
			handler : function() {
				window.close();
			}
		}]
	});
	return mainPanel;
};
Ext.onReady(function() {
			var mpanel = new Apex.Desk.MainFramePanel();
			Ext.QuickTips.init();// 不写的话，验证信息提示语不会出现。
			new Ext.Viewport({
						title : '',
						layout : 'fit',
						items : [mpanel]
					});
		});
