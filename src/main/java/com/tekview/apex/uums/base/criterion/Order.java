/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : Order.java
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
 * Represents an order imposed upon a Criteria result set.
 *
 */
public class Order implements Serializable {
    protected final String entityName;
    protected final String propName;
    protected final boolean ascending;

    private Order(String entityName, String propName, boolean ascending) {
        this.entityName = entityName;
        this.propName = propName;
        this.ascending = ascending;
    }

    public String getPropName() {
        return propName;
    }

    public String getEntityName() {
        return propName;
    }

    public String getFullName() {
        if (entityName == null) {
            return propName;
        } else {
            return entityName + "." + propName;
        }
    }

    public boolean isAscending() {
        return ascending;
    }

    public static Order asc(String name) {
        return new Order(null, name, true);
    }

    public static Order asc(String entityName, String name) {
        return new Order(entityName, name, true);
    }

    public static Order desc(String name) {
        return new Order(null, name, false);
    }

    public static Order desc(String entityName, String name) {
        return new Order(entityName, name, false);
    }
}