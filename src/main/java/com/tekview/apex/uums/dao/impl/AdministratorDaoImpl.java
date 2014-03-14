/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 27, 2011
 * File Name       : AdministratorDaoImpl.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.dao.impl;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.stereotype.Repository;

import com.tekview.apex.uums.dao.AdministratorDao;
import com.tekview.apex.uums.dao.DaoSupport;
import com.tekview.apex.uums.model.Administrator;
/**
 * 管理员DAO实现
 */
@Repository("administratorDao")
public class AdministratorDaoImpl extends DaoSupport<Administrator> implements
		AdministratorDao {
	
	@PersistenceContext
	private EntityManager entityManager;
	
	protected Class<Administrator> getEntityClass() {
		return Administrator.class;
	}
	/**
	 * 通过帐户获取管理员信息
	 * @param name 帐户
	 * @return 管理员信息
	 */
	public Administrator getByName(String name){
		 Query query=entityManager.createQuery("SELECT entity From Administrator entity where entity.name=:name");
		 query.setParameter("name", name);
		 try{
			 return (Administrator)query.getSingleResult();
		 }catch(NoResultException e){
			 return null;
		 }
	}
}
