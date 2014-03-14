/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : OrExpression.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.base.criterion.expression;

import com.tekview.apex.uums.base.criterion.Criterion;

/**
 * Constrains the property to a specified list of values.
 * 参数长度至少为2.
 */
public class OrExpression<T extends Criterion> implements Criterion {
    private final T[] values;

    /**
     * 构造函数.
     *
     * @param values 取值范围
     */
    public OrExpression(T... values) {
        if (values.length < 2) {
            throw new IllegalArgumentException("err.invalid_argument_length:" + values.length);
        }
        this.values = values;
    }

    public T[] getValues() {
        return values;
    }
}