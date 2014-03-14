/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : Interpreter.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.base.criterion.interpreter;

/**
 * Interpreter对表达式进行解析，例如解析成SQL语句的片断，解析成Hibernate中的Expression。
 * 解析的结果存放到Context中。
 *
 */
public interface Interpreter<Context, Object> {
    /**
     * 对表达式进行解析，形成可以用于实际查询的上下文。
     *
     * @param context 解析上下文。
     * @param obj     需要解析的对象，包括表达式、Order等等。
     */
    public void interprete(Context context, Object obj);
}