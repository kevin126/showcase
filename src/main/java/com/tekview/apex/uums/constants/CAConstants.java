package com.tekview.apex.uums.constants;

public interface CAConstants {
	/**
	 * 用户key，存放到HttpSession中引用User对象
	 */
	public final static String SESSION_USER = "com.tekview.apex.ca.user";
	/**
	 * 用户姓名key，存放到HttpSession中引用用户名
	 */
	public final static String SESSION_USERNAME = "com.tekview.apex.ca.username";
	/**
	 * 登陆者id，存放到HttpSession中引用用户id
	 */
	public final static String SESSION_USE_ID = "com.tekview.apex.ca.userId";
	
	/**
	 * 记录上次请求的地址，以便登录后直接跳转向原来的页面
	 */
	public final static String SESSION_URL="befor_url";
	
	/**
	 * 用户发送邮件前缀
	 */
	public final static String MAIL_PREFIX_ADD_USER = "mail_add_user";
}
