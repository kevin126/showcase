/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 27, 2011
 * File Name       : AdministratorServiceImpl.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sun.misc.BASE64Encoder;

import com.tekview.apex.uums.base.OceanRuntimeException;
import com.tekview.apex.uums.base.criterion.Criteria;
import com.tekview.apex.uums.base.page.PageList;
import com.tekview.apex.uums.dao.AdministratorDao;
import com.tekview.apex.uums.model.Administrator;
import com.tekview.apex.uums.service.AdministratorService;
/**
 * 管理员Service层实现
 *
 */
@Service("administratorService")
@Transactional
public class AdministratorServiceImpl implements AdministratorService {
	@Autowired
	private AdministratorDao administratorDao;
	/**
	 * 删除管理员
	 */
	public void delete(Long id) {
		administratorDao.delete(id);
	}
	/**
	 * 获取管理员信息
	 */
	public Administrator getById(Long id) {
		return administratorDao.getById(id);
	}
	/**
	 * 分页查询管理员
	 */
	public PageList<Administrator> queryByPage(Criteria criteria) {
		return administratorDao.queryByPage(criteria);
	}
	/**
	 * 保存管理员信息
	 */
	public void save(Administrator entity) {
		if(entity.getPassword()!=null && entity.getPassword().length()>0){
			//保存加密后的密码到数据库中
			String encrptPassword = new BASE64Encoder().encode(entity.getPassword().getBytes());
			entity.setPassword(encrptPassword);
			administratorDao.save(entity);
		}
		else{
			throw new OceanRuntimeException("管理员密码不能为空!");
		}
	}
	/**
	 * 修改管理员信息
	 */
	public void update(Administrator entity) {
		administratorDao.update(entity);
	}
	/**
	 * 通过帐户获取管理员信息
	 * @param name 帐户
	 * @return 管理员信息
	 */
	public Administrator getByName(String name){
		return administratorDao.getByName(name);
	}
}
