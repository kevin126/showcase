var PermissionId = {
	// /////////////////////////////////////////////////////////////////////
	// ////////////////////////// //////////////
	// ///////////////////////// 新的权限项 /////////////
	// ///////////////////////// //////////////
	// ////////////////////////////////////////////////////////////////////
	/** ***************************基础权限******************************* */
	NOTICE_MANAGE : "notice_manage",// 公告管理

	DUTY_MANAGE : "duty_manage",// 值班管理
	
	ADD_ATTACHMENT : "add_attachment",// 添加附件

	MODIFY_ALL_COMMENTS : "modify_all_comments",// 修改所有的备注

	DELEDTE_ALL_COMMENTS : "delete_all_comments",// 删除所有的备注

	DELETE_ALL_ATTACHMENTS : "delete_all_attachments",// 删除所有的附件

	SETTING_SYSTEM_PARAMETERS : "setting_system_parameters",// 设置系统参数
	/** ***************************工单管理组******************************* */
	CHANGE_ASSESSMENT : "change_assessment",// 评审变更

	CHANGE_RISK_ASSESSMENT : "change_risk_assessment",// 评估变更风险

	PROBLEM_SOLVING_PROGRAM_APPROVED : "problem_solving_program_approved",// 批准问题解决方案

	DELETE_ISSUE : "delete_issue",// 删除工单

	CLOSE_ISSUE : "close_issue",// 关闭工单

	EXPORT_ISSUE : "export_issue",// 导出工单

	DELETE_FOCUS_ON_HUMAN : "delete_focus_on_human",// 删除关注人

	CREATE_ISSUE : "create_issue",// 创建工单

	EDIT_ISSUE : "edit_issue",// 编辑工单
	/** *************************** 知识库管理组******************************* */
	CONFIGURATION_KNOWLEGE_BASE_TYPES : "configuration_knowledge_base_types",// 配置知识库类型

	MODIFY_PUBLISHED_KNOWLEGE : "modify_published_knowledge",// 修改已发布的知识库记录

	DELETE_PUBLISHED_KNOWLEGE : "delete_published_knowledge",// 删除已发布的知识库记录

	/** ***************************资产管理组******************************* */
	ASSETS_REQUISITIONED_APPROVAL : "assets_requisitioned_approval",// 资产领用审批

	MANAGE_ASSET : "manage_asset",// 资产维护

	MANAGE_SUPPLIER_CONTRACT : "manage_supplier_contract",// 供应商&合同管理

	/** ***************************服务级别管理组******************************* */
	MANAGE_SLA : "manage_SLA",// SLA管理

	// ************************网络管理********************************
	ALARM_MANAGE : "alarm_manage",//告警管理
	/** ***************************发布管理组******************************* */
	 DEVELOPMENT_RELEASE_PLANS : "development_release_plans",// 制定发布计划

	 APPROVED_RELEASE_PLANS : "approved_release_plans",// 审批发布计划

	 ASSIGN_TASK : "assign_task",// 分配任务

	 SUBMIT_TEST : "submit_test",// 提交测试

		 END_TEST : "end_test",// 结束测试

	 TEST_RUN : "test_run",// 试运行
	
	/** ***************************作业计划组******************************* */
	 ADD_SCHEDULE : "add_schedule",// 创建作业计划
	 
	DELETE_SCHEDULE_TASK : "delete_scheduleTask"// 删除作业任务
}