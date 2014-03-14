/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 27, 2011
 * File Name       : AdministratorService.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.service;

import com.tekview.apex.uums.base.BaseInterface;
import com.tekview.apex.uums.model.Administrator;
/**
 * 管理员Service接口
 */
public interface AdministratorService extends BaseInterface<Administrator>{
	/**
	 * 通过帐户获取管理员信息
	 * @param name 帐户
	 * @return 管理员信息
	 */
	public Administrator getByName(String name);
}
