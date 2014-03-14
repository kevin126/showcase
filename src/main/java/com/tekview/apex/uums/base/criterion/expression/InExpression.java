/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : InExpression.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.base.criterion.expression;

/**
 * Constrains the property to a specified list of values.
 *
 */
public class InExpression extends AbstractPropertyExpression {
    private final Object[] values;

//    /**
//     * 构造函数.
//     *
//     * @param entityName 实体名称
//     * @param propName 属性名称
//     * @param values 取值范围
//     */
//    public InExpression(String entityName, String propName, Object... values)
//    {
//        super(entityName, propName);
//        this.values = values;
//    }

    /**
     * 构造函数.
     *
     * @param entityName 实体名称
     * @param propName   属性名称
     * @param values     取值范围
     */
    public <T> InExpression(String entityName, String propName, T... values) {
        super(entityName, propName);
        this.values = values;
    }

    /**
     * 构造函数.
     *
     * @param propName 属性名
     * @param values   取值范围.
     */
    public <T> InExpression(String propName, T... values) {
        super(propName);
        this.values = values;
    }

    public Object[] getValues() {
        return values;
    }
}