/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : PropertyExpression.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.base.criterion.expression;

/**
 * Class for "property operation" comparisons (with SQL binary operators).
 * operation includes ==, <>, >, <, <=, >=。
 * <p/>
 * in order to support multi-table conjunction
 */
public class PropertyExpression extends AbstractPropertyExpression {
    /**
     * 操作类型
     */
    private final String operation;

    /**
     * 比较值
     */
    private Object value;


    /**
     * 构造函数.
     *
     * @param entityName 实体名称
     * @param propName   属性名称。
     * @param value      比较值
     * @param operation  操作类型，包括==, <>, >, <, <=, >=等。
     */
    public PropertyExpression(String entityName, String propName, Object value, String operation) {
        super(entityName, propName);
        this.value = value;
        this.operation = operation;
    }

    /**
     * 构造函数.
     *
     * @param propName  属性名称。
     * @param value     比较值
     * @param operation 操作类型，包括==, <>, >, <, <=, >=等。
     */
    public PropertyExpression(String propName, Object value, String operation) {
        super(propName);
        this.value = value;
        this.operation = operation;
    }

    /**
     * 获取操作类型.
     *
     * @return 操作类型
     */
    public String getOperation() {
        return operation;
    }

    /**
     * 获取比较值.
     *
     * @return 比较值
     */
    public Object getValue() {
        return value;
    }
}