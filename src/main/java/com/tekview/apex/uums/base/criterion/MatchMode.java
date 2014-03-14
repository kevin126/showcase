/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : MatchMode.java
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
 * Represents an strategy for matching strings using "like".
 *
 */
public abstract class MatchMode implements Serializable {
    private final String name;

    protected MatchMode(String name) {
        this.name = name;
    }

    public String toString() {
        return name;
    }

    /**
     * Match the entire string to the pattern
     */
    public static final MatchMode EXACT = new MatchMode("EXACT") {
        public String toMatchString(String pattern) {
            return pattern;
        }
    };
    /**
     * Match the start of the string to the pattern
     */
    public static final MatchMode START = new MatchMode("START") {
        public String toMatchString(String pattern) {
            return pattern + '%';
        }
    };

    /**
     * Match the end of the string to the pattern
     */
    public static final MatchMode END = new MatchMode("END") {
        public String toMatchString(String pattern) {
            return '%' + pattern;
        }
    };
    /**
     * Match the pattern anywhere in the string
     */
    public static final MatchMode ANYWHERE = new MatchMode("ANYWHERE") {
        public String toMatchString(String pattern) {
            return '%' + pattern + '%';
        }
    };

    /**
     * convertGroup the pattern, by appending/prepending "%"
     *
     * @param pattern convertGroup pattern
     * @return the match string.
     */
    public abstract String toMatchString(String pattern);
}