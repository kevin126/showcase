/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 29, 2011
 * File Name       : AdminAction.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.action.security;

import javax.servlet.http.HttpSession;

import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import sun.misc.BASE64Encoder;

import com.tekview.apex.uums.base.OceanRuntimeException;
import com.tekview.apex.uums.constants.CAConstants;
import com.tekview.apex.uums.core.web.action.BaseAction;
import com.tekview.apex.uums.model.Administrator;
import com.tekview.apex.uums.service.AdministratorService;
@Controller
@Scope("prototype")
@ParentPackage(value = "default")
@Namespace("/security")// 指定名称空间
@Results( {
		@Result(name = "modifyPasswd", location = "/WEB-INF/jsps/administrator/administrator-modify-password.jsp"),
		@Result(name = "modifyPasswdResult", location = "/WEB-INF/jsps/administrator/administrator-modify-password-result.jsp")})
public class AdministratorAction extends BaseAction {
	private static final long serialVersionUID = -3042757121940260040L;
	@Autowired
	private AdministratorService administratorService;
	private Administrator administrator=new Administrator();
	private String oldPassWord; //旧密码
	private String newPassWord; //新密码
	private String newPassWordConfirm; //新密码确认
	//加载修改密码页面
	public String preModifyPasswd(){
		return "modifyPasswd";
	}
	//修改密码
	public String modifyPasswd(){
		if(oldPassWord==null || oldPassWord.length()==0){
			throw new OceanRuntimeException("请输入旧密码!");
		}
		if(newPassWord==null || newPassWord.length()==0){
			throw new OceanRuntimeException("请输入新密码!");
		}
		if(newPassWordConfirm==null || newPassWordConfirm.length()==0){
			throw new OceanRuntimeException("请输入新密码确认!");
		}
		if(!newPassWord.trim().equals(newPassWordConfirm.trim())){
			throw new OceanRuntimeException("新密码和确认密码不一致!");
		}
		//获取Session
		HttpSession session = request.getSession(true);
		administrator=(Administrator)session.getAttribute(CAConstants.SESSION_USER);
		if(administrator!=null){
			Administrator admin=administratorService.getById(administrator.getId());
			String encrptPassword = new BASE64Encoder().encode(oldPassWord.getBytes());
			String newEncrptPassword=new BASE64Encoder().encode(newPassWord.getBytes());
			if(!admin.getPassword().equals(encrptPassword)){
				throw new OceanRuntimeException("旧密码输入错误!");
			}else{
				admin.setPassword(newEncrptPassword);
				administratorService.update(admin);
			}
		}
		return "modifyPasswdResult";
	}
	public Administrator getAdministrator() {
		return administrator;
	}
	public void setAdministrator(Administrator administrator) {
		this.administrator = administrator;
	}
	public String getOldPassWord() {
		return oldPassWord;
	}
	public void setOldPassWord(String oldPassWord) {
		this.oldPassWord = oldPassWord;
	}
	public String getNewPassWord() {
		return newPassWord;
	}
	public void setNewPassWord(String newPassWord) {
		this.newPassWord = newPassWord;
	}
	public String getNewPassWordConfirm() {
		return newPassWordConfirm;
	}
	public void setNewPassWordConfirm(String newPassWordConfirm) {
		this.newPassWordConfirm = newPassWordConfirm;
	}
	
}
