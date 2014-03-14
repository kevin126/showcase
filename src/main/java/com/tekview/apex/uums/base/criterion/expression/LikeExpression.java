/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : LikeExpression.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.base.criterion.expression;

import com.tekview.apex.uums.base.criterion.MatchMode;

/**
 * A case-insensitive "like".
 * 默认以'^'对"%"和"_"进行转义.
 *
 */
public class LikeExpression extends AbstractPropertyExpression {
    /**
     * 操作匹配模式
     */
    protected MatchMode matchMode;

    /**
     * 比较值
     */
    protected Object value;

    /**
     * 转义符
     */
    protected Character escapeChar;

    /**
     * 是否需要转义
     */
    protected boolean esc = true;

    /**
     * 构造函数.
     *
     * @param entityName 实体名称
     * @param propName   属性名称
     * @param value      比较值
     * @param matchMode  like操作模式
     */
    public LikeExpression(String entityName, String propName, Object value, MatchMode matchMode) {
        super(entityName, propName);
        this.matchMode = matchMode;
        this.value = value;
    }

    /**
     * 构造函数.
     *
     * @param entityName 实体名称
     * @param propName   属性名称
     * @param value      比较值
     * @param matchMode  like操作模式
     * @param esc        是否需要转义，默认以'^'对"%"和"_"进行转义
     */
    public LikeExpression(String entityName, String propName, Object value, MatchMode matchMode, boolean esc) {
        super(entityName, propName);
        this.matchMode = matchMode;
        this.value = value;
        this.esc = esc;
    }

    /**
     * 构造函数.
     *
     * @param entityName 实体名称
     * @param propName   属性名称
     * @param value      比较值
     */
    public LikeExpression(String entityName, String propName, Object value) {
        this(entityName, propName, value, MatchMode.ANYWHERE);
    }

    /**
     * 构造函数.
     *
     * @param propName 属性名称
     * @param value    比较值
     */
    public LikeExpression(String propName, Object value) {
        this(null, propName, value);
    }

    /**
     * 构造函数.
     *
     * @param propName  属性名称
     * @param value     比较值
     * @param matchMode like操作模式
     */
    public LikeExpression(String propName, Object value, MatchMode matchMode) {
        this(null, propName, value, matchMode);
    }

    /**
     * 获取操作匹配模式.
     *
     * @return 操作匹配模式
     */
    public MatchMode getMatchMode() {
        return matchMode;
    }

    /**
     * 获取比较值.
     *
     * @return 比较值
     */
    public Object getValue() {
        return value;
    }

    /**
     * 获取转义符
     *
     * @return
     */
    public Character getEscapeChar() {
        return escapeChar;
    }

    /**
     * 设置转义符
     *
     * @param escapeChar
     */
    public void setEscapeChar(Character escapeChar) {
        this.escapeChar = escapeChar;
    }

    public void setEsc(boolean esc) {
        this.esc = esc;
    }

    public boolean isEsc() {
        return esc;
    }
}