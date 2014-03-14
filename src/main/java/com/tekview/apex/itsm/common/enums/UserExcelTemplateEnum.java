package com.tekview.apex.itsm.common.enums;

import java.util.Vector;

/**
 * 批量添加用户的excel表格列名称
 * 
 * @author TimyLiu
 * 
 */
public enum UserExcelTemplateEnum {
	NAME("用户名"), TASKNOTIFIER("用户描述"), REALNAME("姓名"), ZIPCODE("邮编"), COUNTRY(
			"国家"), CITY("所在城市"), ADRESS("地址"), MOBILE("手机号码"), OFFICE("固话"), FAX(
			"传真"), MAIL("电子邮件"), MSN("MSN"), EMLPOYEENO("工号"), INTERNETACCOUNT(
			"上网账号"),QQ("QQ");
	private String value;

	UserExcelTemplateEnum(String value) {
		this.value = value;
	}

	public String getValue() {
		return this.value;
	}

	@Override
	public String toString() {
		return this.value;
	}

	/**
	 * @return
	 */
	public static Vector<UserExcelTemplateEnum> allValues() {
		Vector<UserExcelTemplateEnum> result = new Vector<UserExcelTemplateEnum>();
		result.add(UserExcelTemplateEnum.NAME);
		result.add(UserExcelTemplateEnum.REALNAME);
		result.add(UserExcelTemplateEnum.EMLPOYEENO);
		result.add(UserExcelTemplateEnum.INTERNETACCOUNT);
		result.add(UserExcelTemplateEnum.TASKNOTIFIER);
		result.add(UserExcelTemplateEnum.MAIL);
		result.add(UserExcelTemplateEnum.MOBILE);
		result.add(UserExcelTemplateEnum.FAX);
		result.add(UserExcelTemplateEnum.OFFICE);
		result.add(UserExcelTemplateEnum.MSN);
		result.add(UserExcelTemplateEnum.QQ);
		result.add(UserExcelTemplateEnum.COUNTRY);
		result.add(UserExcelTemplateEnum.CITY);
		result.add(UserExcelTemplateEnum.ADRESS);
		result.add(UserExcelTemplateEnum.ZIPCODE);
		return result;
	}

}
