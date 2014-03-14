/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 27, 2011
 * File Name       : AdministratorDao.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.dao;

import java.util.Collection;
import java.util.List;

import com.tekview.apex.uums.base.BaseInterface;
import com.tekview.apex.uums.model.EmailServerConfig;
/**
 * 邮件配置操作DAO
 *
 */
public interface EmailServerDao extends BaseInterface<EmailServerConfig>{
	 /**
     * 查询所有实体
     */
    public List<EmailServerConfig> getAllEntities();
    /**
     * 删除所有实体
     *
     * @param entities
     */
    public void deleteAllEntities(Collection<EmailServerConfig> entities);
}
