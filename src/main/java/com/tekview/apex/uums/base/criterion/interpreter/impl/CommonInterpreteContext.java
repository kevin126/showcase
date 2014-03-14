/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : CommonInterpreteContext.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.base.criterion.interpreter.impl;

import com.tekview.apex.uums.base.criterion.interpreter.InterpreteContext;

import java.util.ArrayList;
import java.util.List;

/**
 * 一般的上下文解释器.
 *
 */
public class CommonInterpreteContext implements InterpreteContext {
    /**
     * 上下文语句
     */
    protected StringBuilder sb = new StringBuilder();
    /**
     * 上下文参数
     */
    protected List<Object> preparedValues = new ArrayList<Object>();


    /**
     * 添加上下文语句.
     *
     * @param obj 上下文语句
     */
    public void append(Object obj) {
        sb.append(obj);
    }

    /**
     * 获取上下文语句.
     *
     * @return 上下文语句
     */
    public String getContextString() {
        return sb.toString();
    }

    /**
     * 添加上下文参数.
     *
     * @param obj 上下文参数
     */
    public void addPrepraredValue(Object obj) {
        preparedValues.add(obj);
    }

    /**
     * 获取上下文参数.
     *
     * @return 上下文参数
     */
    public List getPreparedValues() {
        return preparedValues;
    }
}