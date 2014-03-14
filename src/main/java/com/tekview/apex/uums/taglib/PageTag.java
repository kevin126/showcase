/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 14, 2011
 * File Name       : PageTag.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.taglib;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.components.Component;
import org.apache.struts2.views.jsp.ComponentTagSupport;

import com.opensymphony.xwork2.util.ValueStack;
/**
 * 分页标签
 */
public class PageTag extends ComponentTagSupport {
	private static final long serialVersionUID = 4027880266995346319L;
	/**当前页*/
	private String currentPage;
	
	/**每页显示多少条*/
	private String pageSize;
	
	/**总记录数*/
	private String records;
	
	/** url*/
	private String url;
	
	@Override
	public Component getBean(ValueStack arg0, HttpServletRequest arg1,
			HttpServletResponse arg2) {
		 return new PageComponent(arg0); 
	}
	//获得参数  
    protected void populateParams() {  
        super.populateParams();           
        PageComponent myPage = (PageComponent)component;  
        myPage.setCurrentPage(currentPage);
        myPage.setPageSize(pageSize);
        myPage.setRecords(records);
        myPage.setUrl(url);
    }


	public String getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(String currentPage) {
		this.currentPage = currentPage;
	}

	public String getPageSize() {
		return pageSize;
	}

	public void setPageSize(String pageSize) {
		this.pageSize = pageSize;
	}

	public String getRecords() {
		return records;
	}

	public void setRecords(String records) {
		this.records = records;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
}
