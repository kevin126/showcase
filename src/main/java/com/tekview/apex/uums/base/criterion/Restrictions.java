/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : Restrictions.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.base.criterion;

import com.tekview.apex.uums.base.criterion.expression.*;

import java.util.Collection;

/**
 * Restrictions用于创建常用的表达式
 */
public class Restrictions {
    /**
     * This class can't be instaniated.
     */
    private Restrictions()
    {
    }

    /**
     * 创建等于表达式.
     *
     * @param propName  属性名
     * @param propValue 属性值
     * @return equal expression
     */
    public static <T> SimpleExpression eq(String propName, T propValue)
    {
        return new SimpleExpression(propName, propValue, QueryConstants.EQUALITY_SIGN);
    }

    /**
     * 创建等于表达式.
     *
     * @param entityName 实体名称.
     * @param propName   属性名
     * @param propValue  属性值
     * @return equal expression
     */
    public static <T> SimpleExpression eq(String entityName, String propName, T propValue)
    {
        return new SimpleExpression(entityName, propName, propValue, QueryConstants.EQUALITY_SIGN);
    }

    /**
     * 创建基于属性的等于表达式.
     *
     * @param entityName    实体名称.
     * @param propName      属性名
     * @param propValue     属性值
     * @return equal expression
     */
    public static <T> PropertyExpression eqProperty(String entityName, String propName, T propValue)
    {
        return new PropertyExpression(entityName, propName, propValue, QueryConstants.EQUALITY_SIGN);
    }

    /**
     * 创建不等于表达式.
     *
     * @param propName  属性名
     * @param propValue 属性值
     * @return not equal expression
     */
    public static <T> SimpleExpression ne(String propName, T propValue)
    {
        return new SimpleExpression(propName, propValue, QueryConstants.INEQUALITY_SIGN);
    }

    /**
     * 创建不等于表达式.
     *
     * @param entityName 实体名称.
     * @param propName   属性名
     * @param propValue  属性值
     * @return not equal expression
     */
    public static <T> SimpleExpression ne(String entityName, String propName, T propValue)
    {
        return new SimpleExpression(entityName, propName, propValue, QueryConstants.INEQUALITY_SIGN);
    }

    /**
     * 创建基于属性的不等于表达式.
     *
     * @param entityName    实体名称.
     * @param propName      属性名
     * @param propValue     属性值
     * @return not equal expression
     */
    @Deprecated
    public static <T> PropertyExpression neqProperty(String entityName, String propName, T propValue)
    {
        return new PropertyExpression(entityName, propName, propValue, QueryConstants.INEQUALITY_SIGN);
    }

    /**
     * 创建基于属性的不等于表达式.
     *
     * @param entityName    实体名称.
     * @param propName      属性名
     * @param propValue     属性值
     * @return not equal expression
     */
    public static <T> PropertyExpression neProperty(String entityName, String propName, T propValue)
    {
        return new PropertyExpression(entityName, propName, propValue, QueryConstants.INEQUALITY_SIGN);
    }

    /**
     * 创建小于等于表达式.
     *
     * @param propName  属性名称。
     * @param propValue 属性值。
     * @return less or equal epxression
     */
    public static <T> SimpleExpression le(String propName, T propValue)
    {
        return new SimpleExpression(propName, propValue, QueryConstants.LESS_EQUALITY_SIGN);
    }

    /**
     * 创建小于等于表达式.
     *
     * @param entityName 实体名称.
     * @param propName   属性名称。
     * @param propValue  属性值。
     * @return less or equal epxression
     */
    public static <T> SimpleExpression le(String entityName, String propName, T propValue)
    {
        return new SimpleExpression(entityName, propName, propValue, QueryConstants.LESS_EQUALITY_SIGN);
    }

    /**
     * 创建基于属性的小于等于表达式.
     *
     * @param entityName 实体名称.
     * @param propName   属性名称。
     * @param propValue  属性值。
     * @return less or equal epxression
     */
    public static <T> PropertyExpression leProperty(String entityName, String propName, T propValue)
    {
        return new PropertyExpression(entityName, propName, propValue, QueryConstants.LESS_EQUALITY_SIGN);
    }

    /**
     * 创建小于表达式.
     *
     * @param propName  属性名
     * @param propValue 属性值
     * @return less epxression
     */
    public static <T> SimpleExpression lt(String propName, T propValue)
    {
        return new SimpleExpression(propName, propValue, QueryConstants.LESS_SIGN);
    }

    /**
     * 创建小于表达式.
     *
     * @param entityName 实体名称.
     * @param propName   属性名
     * @param propValue  属性值
     * @return less epxression
     */
    public static <T> SimpleExpression lt(String entityName, String propName, T propValue)
    {
        return new SimpleExpression(entityName, propName, propValue, QueryConstants.LESS_SIGN);
    }

    /**
     * 创建基于属性的小于表达式.
     *
     * @param entityName 实体名称.
     * @param propName   属性名
     * @param propValue  属性值
     * @return less epxression
     */
    public static <T> PropertyExpression ltProperty(String entityName, String propName, T propValue)
    {
        return new PropertyExpression(entityName, propName, propValue, QueryConstants.LESS_SIGN);
    }

    /**
     * 创建大于等于表达式.
     *
     * @param propName  属性名
     * @param propValue 属性值
     * @return large or equal epxression
     */
    public static <T> SimpleExpression ge(String propName, T propValue)
    {
        return new SimpleExpression(propName, propValue, QueryConstants.GREAT_EQUALITY_SIGN);
    }

    /**
     * 创建大于等于表达式.
     *
     * @param entityName 实体名称.
     * @param propName   属性名
     * @param propValue  属性值
     * @return large or equal epxression
     */
    public static <T> SimpleExpression ge(String entityName, String propName, T propValue)
    {
        return new SimpleExpression(entityName, propName, propValue, QueryConstants.GREAT_EQUALITY_SIGN);
    }

    /**
     * 创建基于属性的大于等于表达式.
     *
     * @param entityName 实体名称.
     * @param propName   属性名
     * @param propValue  属性值
     * @return large or equal epxression
     */
    public static <T> PropertyExpression geProperty(String entityName, String propName, T propValue)
    {
        return new PropertyExpression(entityName, propName, propValue, QueryConstants.GREAT_EQUALITY_SIGN);
    }

    /**
     * 创建大于表达式.
     *
     * @param propName  属性名
     * @param propValue 属性值
     * @return large epxression
     */
    public static <T> SimpleExpression gt(String propName, T propValue)
    {
        return new SimpleExpression(propName, propValue, QueryConstants.GREAT_SIGN);
    }

    /**
     * 创建大于表达式.
     *
     * @param entityName 实体名称.
     * @param propName   属性名
     * @param propValue  属性值
     * @return large epxression
     */
    public static <T> SimpleExpression gt(String entityName, String propName, T propValue)
    {
        return new SimpleExpression(entityName, propName, propValue, QueryConstants.GREAT_SIGN);
    }

    /**
     * 创建基于属性的大于表达式.
     *
     * @param entityName 实体名称.
     * @param propName   属性名
     * @param propValue  属性值
     * @return large epxression
     */
    public static <T> PropertyExpression gtProperty(String entityName, String propName, T propValue)
    {
        return new PropertyExpression(entityName, propName, propValue, QueryConstants.GREAT_SIGN);
    }

    /**
     * 创建and表达式.
     *
     * @param lhs and表达式的左边表达式
     * @param rhs and表达式的右边表达式
     * @return and expression
     */
    public static LogicalExpression and(Criterion lhs, Criterion rhs)
    {
        return new LogicalExpression(lhs, rhs, QueryConstants.AND);
    }

    /**
     * 创建or表达式.
     *
     * @param lhs or表达式的左边表达式
     * @param rhs or表达式的右边表达式
     * @return or expression
     */
    public static LogicalExpression or(Criterion lhs, Criterion rhs)
    {
        return new LogicalExpression(lhs, rhs, QueryConstants.OR);
    }

    /**
     * 创建or表达式.
     *
     * @param criterions or表达式中的的条件集合
     * @return or expression
     */
    public static Criterion or(Criterion... criterions)
    {
        return new OrExpression(criterions);
    }

    /**
     * 创建null表达式.
     *
     * @param propName 属性名
     * @return or expression
     */
    public static Criterion isNull(String propName)
    {
        return new NullExpression(propName);
    }

    /**
     * 创建null表达式.
     *
     * @param entityName 实体名称.
     * @param propName   属性名
     * @return or expression
     */
    public static Criterion isNull(String entityName, String propName)
    {
        return new NullExpression(entityName, propName);
    }

    /**
     * 创建notNull表达式.
     *
     * @param propName 属性名
     * @return or expression
     */
    public static Criterion isNotNull(String propName)
    {
        return new NotNullExpression(propName);
    }

    /**
     * 创建notNull表达式.
     *
     * @param entityName 实体名称.
     * @param propName   属性名
     * @return or expression
     */
    public static Criterion isNotNull(String entityName, String propName)
    {
        return new NotNullExpression(entityName, propName);
    }

    /**
     * 创建In表达式.
     *
     * @param propName   属性名
     * @param propValues 属性值
     * @return in expression
     */
    public static <T> Criterion in(String propName, T[] propValues)
    {
        return new InExpression(propName, propValues);
    }

    /**
     * 创建In表达式.
     *
     * @param entityName 实体名称.
     * @param propName   属性名
     * @param propValues 属性值
     * @return in expression
     */
    public static <T> Criterion in(String entityName, String propName, T[] propValues)
    {
        return new InExpression(entityName, propName, propValues);
    }

    /**
     * 创建In表达式.
     *
     * @param entityName 实体名称.
     * @param propName   属性名
     * @param propValues 属性值
     * @return in expression
     */
    public static <T> Criterion in(String entityName, String propName, Collection<T> propValues)
    {
        return new InExpression(entityName, propName, propValues.toArray());
    }

    /**
     * 创建between表达式.
     *
     * @param propName 属性名
     * @param low     起始属性值
     * @param high     终止属性值
     * @return between expression
     */
    public static <T> Criterion between(String propName, T low, T high)
    {
        return new BetweenExpression(propName, low, high);
    }

    /**
     * 创建between表达式.
     *
     * @param entityName 实体名称.
     * @param propName   属性名
     * @param low       起始属性值
     * @param high       终止属性值
     * @return between expression
     */
    public static <T> Criterion between(String entityName, String propName, T low, T high)
    {
        return new BetweenExpression(entityName, propName, low, high);
    }

    /**
     * 创建like表达式.
     *
     * @param propName  属性名
     * @param propValue 属性值
     * @return like expression
     */
    public static <T> LikeExpression like(String propName, T propValue)
    {
        return new LikeExpression(propName, propValue);
    }

    /**
     * 创建like表达式.
     *
     * @param entityName 实体名称.
     * @param propName   属性名
     * @param propValue  属性值
     * @return like expression
     */
    public static <T> LikeExpression like(String entityName, String propName, T propValue)
    {
        return new LikeExpression(entityName, propName, propValue);
    }

    /**
     * 创建like表达式.
     *
     * @param propName  属性名
     * @param propValue 属性值
     * @param matchMode 匹配模式
     * @return like expression
     */
    public static <T> LikeExpression like(String propName, T propValue, MatchMode matchMode)
    {
        return new LikeExpression(propName, propValue, matchMode);
    }

    /**
     * 创建like表达式.
     *
     * @param entityName 实体名称.
     * @param propName   属性名
     * @param propValue  属性值
     * @param matchMode 匹配模式
     * @return like expression
     */
    public static <T> LikeExpression like(String entityName, String propName, T propValue, MatchMode matchMode)
    {
        return new LikeExpression(entityName, propName, propValue, matchMode);
    }

    /**
     * 创建Not表达式.
     *
     * @param criterion     not中的表达式
     * @return not expression
     */
    public static NotExpression not(Criterion criterion)
    {
        return new NotExpression(criterion);
    }

    /**
     * 创建Group表达式.
     *
     * @param entityName 实体名称.
     * @param propName   属性名
     * @return group by expression
     */
    public static Group group(String entityName, String propName)
    {
        return new Group(entityName, propName);
    }

    /**
     * 创建Having表达式.
     *
     * @param criterion 条件
     * @return Having Expression
     */
    public static Having having(Criterion criterion)
    {
        return new Having(criterion);
    }
}