/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : Having.java
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
 * Represents an Having operation.
 *
 */
public class Having implements Serializable {
    /**
     * Having的条件语句，通常为聚合函数
     */
    private final Criterion criterion;

    public Having(Criterion criterion) {
        this.criterion = criterion;
    }


    public Criterion getCriterion() {
        return criterion;
    }
}