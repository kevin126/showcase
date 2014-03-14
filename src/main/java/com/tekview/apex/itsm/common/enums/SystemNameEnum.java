package com.tekview.apex.itsm.common.enums;

import java.util.Vector;

/*
 * APEX产品系列
 * */
public enum SystemNameEnum {
	/**
	 * OSSWorks系统
	 */
	OSS("OSSWorks系统"),
	/**
	 * NM网络管理系统
	 */
	NM("APEX网络管理系统"),
	/**
	 * 统一认证管理平台
	 */
	CA("APEX统一认证管理平台");
	
	private String systemName;

	SystemNameEnum(String systemName) {
		this.systemName = systemName;
	}

	public String getSystemName() {
		return this.systemName;
	}
	public String getValue() {
		return this.systemName;
	}
	@Override
	public String toString() {
		return this.systemName;
	}

	/**
	 * @return
	 */
	public static Vector<SystemNameEnum> allValues() {
		Vector<SystemNameEnum> result = new Vector<SystemNameEnum>();
		result.add(SystemNameEnum.NM);
		result.add(SystemNameEnum.OSS);
		result.add(SystemNameEnum.CA);
		return result;
	}
}