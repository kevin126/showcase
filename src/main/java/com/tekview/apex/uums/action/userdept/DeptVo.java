/******************************************************************************** 
 * Create Author   : Xiaojiapeng
 * Create Date     : Mar 18, 2011
 * File Name       : DeptVo.java
 *
 * APEX UUMS是上海泰信科技有限公司自主研发的一款网络管理产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2010 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.action.userdept;

import com.tekview.apex.uums.model.UserDept;

/**
 * 
 *
 * @author Xiaojiapeng
 * @version 1.0
 */
public class DeptVo extends UserDept {
	
	private static final long serialVersionUID = 4018415170565804976L;
	/**
	 * 拥有用户个数
	 */
	private int count;

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}
}
