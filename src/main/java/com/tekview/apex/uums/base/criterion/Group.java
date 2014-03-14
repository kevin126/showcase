/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : Group.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.base.criterion;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents an group by operation on entityName.propName.
 *
 */
public class Group implements Serializable {
    /**
     * 实体类对象SimpleName的List
     */
    protected List<String> entityNames = new ArrayList<String>();

    /**
     * 属性名称列表
     */
    protected List<String> propNames = new ArrayList<String>();

    public Group() {
    }

    /**
     * Constructor
     *
     * @param entityName 实体名称.
     * @param propName   属性名
     */
    public Group(String entityName, String propName) {
        entityNames.add(entityName);
        propNames.add(propName);
    }

    /**
     * 新增Group by属性.
     *
     * @param entityName 实体类对象的SimpleName
     * @param propName   属性名称
     */
    public void addGroup(String entityName, String propName) {
        entityNames.add(entityName);
        propNames.add(propName);
    }

    public List<String> getEntityNames() {
        return entityNames;
    }

    public List<String> getPropNames() {
        return propNames;
    }

    /**
     * 获取组装后的名称.
     *
     * @return 组装后的名称
     */
    public String getFullName(String entityName, String propName) {
        if (entityName == null) {
            return propName;
        } else {
            return entityName + "." + propName;
        }
    }
}