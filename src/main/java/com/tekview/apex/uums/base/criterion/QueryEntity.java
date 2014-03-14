/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : QueryEntity.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.base.criterion;

import java.io.Serializable;

/**
 * 实体对象.
 * 包含实体的简单名称、实体别名等.
 *
 */
public class QueryEntity implements Serializable {
    /**
     * 实体类对象的SimpleName
     */
    private final String entityName;

    /**
     * 实体对象的别名
     */
    private final String alias;

    /**
     * Constructor
     *
     * @param entityName 实体类名
     * @param alias      实体别名
     */
    public QueryEntity(String entityName, String alias) {
        this.entityName = entityName;
        this.alias = alias;
    }

    /**
     * 返回实体类对象的SimpleName.
     *
     * @return 实体类对象的SimpleName
     */
    public String getEntityName() {
        return entityName;
    }

    /**
     * 获取实体对象的别名.
     *
     * @return 实体对象的别名
     */
    public String getAlias() {
        return alias;
    }
}