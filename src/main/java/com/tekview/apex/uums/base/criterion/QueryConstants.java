/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : QueryConstants.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.base.criterion;

/**
 * 查询常量类.
 *
 */
public interface QueryConstants
{
    static final String INVALID_SQL_FORMAT = "invalid_sql_format";

    static final String BLANK = " ";
    static final String COMMA = ",";
    static final String SELECT = "SELECT";
    static final String FROM = "FROM";
    static final String WHERE = "WHERE";
    static final String AND = "AND";
    static final String OR = "OR";
    static final String NOT = "NOT";
    static final String BETWEEN = "BETWEEN";
    static final String ORDER_BY = "ORDER BY";
    static final String GROUP_BY = "GROUP BY";
    static final String HAVING = "HAVING";
    static final String DISTINCT = "DISTINCT";

    static final String ASC = "ASC";
    static final String DESC = "DESC";

    static final String NULL = "NULL";
    static final String IS = "IS";
    static final String LIKE = "LIKE";
    static final String IN = "IN";
    static final String INTERROGATION_POINT = "?";

    static final String LEFT_PARENTHESIS = "(";
    static final String RIGHT_PARENTHESIS = ")";

    static final String EQUALITY_SIGN = "=";
    static final String INEQUALITY_SIGN = "<>";
    static final String LESS_EQUALITY_SIGN = "<=";
    static final String LESS_SIGN = "<";
    static final String GREAT_EQUALITY_SIGN = ">=";
    static final String GREAT_SIGN = ">";
}