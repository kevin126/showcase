/******************************************************************************** 
 * Create Author   : Xiaojiapeng
 * Create Date     : Mar 29, 2011
 * File Name       : LabelComponent.java
 *
 * APEX UUMS是上海泰信科技有限公司自主研发的一款网络管理产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2010 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.taglib;

import java.io.IOException;
import java.io.Writer;

import org.apache.struts2.components.Component;

import com.opensymphony.xwork2.util.ValueStack;

/**
 * 
 *字符串处理组件
 * @author Xiaojiapeng
 * @version 1.0
 */
public class LabelComponent extends Component {

	/**
	 * 传入值
	 */
	private String propertyValue;
	
	private ValueStack vs;
	
	public LabelComponent(ValueStack stack) {
		super(stack);
		vs=stack;
	}

	public boolean start(Writer writer) { 
		boolean result = super.start(writer);
		
		try {
			StringBuffer sb=new StringBuffer();
			if (propertyValue!=null) {
				if (propertyValue.length()>4) {
					//对大于4个字符的字符串处理
					sb.append(propertyValue.substring(0, 4)+"...");
				}else {
					sb.append(propertyValue);
				}
			}
			writer.write(sb.toString());
		} catch (IOException e) {
			e.printStackTrace();
		}
		return result;
	}
	
	public String getPropertyValue() {
		return propertyValue;
	}

	public void setPropertyValue(String propertyValue) {
		this.propertyValue = propertyValue;
	}

	public ValueStack getVs() {
		return vs;
	}

	public void setVs(ValueStack vs) {
		this.vs = vs;
	}

}
