/******************************************************************************** 
 * Create Author   : Xiaojiapeng
 * Create Date     : Mar 29, 2011
 * File Name       : LabelTag.java
 *
 * APEX UUMS是上海泰信科技有限公司自主研发的一款网络管理产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2010 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.taglib;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.components.Component;
import org.apache.struts2.views.jsp.ComponentTagSupport;

import com.opensymphony.xwork2.util.ValueStack;

/**
 * 字符串处理标签
 *
 * @author Xiaojiapeng
 * @version 1.0
 */
public class LabelTag extends ComponentTagSupport {

	private static final long serialVersionUID = -8039317884341475974L;
	
	/**
	 * 处理字符串
	 */
	private String propertyValue;
	
	public String getPropertyValue() {
		return propertyValue;
	}

	public void setPropertyValue(String propertyValue) {
		this.propertyValue = propertyValue;
	}

	@Override
	public Component getBean(ValueStack arg0, HttpServletRequest arg1,
			HttpServletResponse arg2) {
		return new LabelComponent(arg0);
	}
	
	//获得参数  
    protected void populateParams() {  
        super.populateParams();           
        LabelComponent myPage = (LabelComponent)component;  
        myPage.setPropertyValue(propertyValue);
    }

}
