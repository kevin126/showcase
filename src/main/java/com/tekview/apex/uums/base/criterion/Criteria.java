/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : Criteria.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.base.criterion;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Criteria is a simplified API for retrieving entities by composing Criterion objects.
 * This is a very convenient approach for functionality like "search" screens where
 * there is a variable number of conditions to be placed upon the result set.
 *
 */
public class Criteria
        implements Serializable, Criterion
{
    protected List<Criterion> criterions = new ArrayList<Criterion>();
    protected List<Order> orders = new ArrayList<Order>();
    protected List<QueryEntity> entities = new ArrayList<QueryEntity>();
    protected Group group;
    protected Having having;
    protected boolean distinct = false;

    /**
     * 偏移量. 默认不进行分页.
     */
    protected int offset = -1;

    /**
     * 分页长度. 默认不进行分页.
     */
    protected int length = 10;

    public Criteria()
    {
    }

    public Criteria(int offset, int length)
    {
        this.offset = offset;
        this.length = length;
    }

    /**
     * Add a restriction to constrain the results to be retrieved。
     *
     * @param criterion The criterion object representing the restriction to be applied.
     * @return this (for method chaining)
     */
    public Criteria add(Criterion criterion)
    {
        criterions.add(criterion);
        return this;
    }

    /**
     * Add a restriction to constrain the results to be retrieved.
     *
     * @param order The criterion object representing the restriction to be applied.
     * @return this (for method chaining)
     */
    public Criteria addOrder(Order order)
    {
        orders.add(order);
        return this;
    }

    /**
     * 返回所有的条件列表。
     *
     * @return 条件列表。
     */
    public List<Criterion> getCriterions()
    {
        return criterions;
    }

    /**
     * 返回所有的排序列表。
     *
     * @return 所有的排序列表。
     */
    public List<Order> getOrders()
    {
        return orders;
    }

    /**
     * 以注入的方式支持多表关联查询.
     *
     * @param className     实体类的SimpleName
     * @param entityName    entityName，即别名
     */
    public void addEntity(String className, String entityName)
    {
        entities.add(new QueryEntity(className, entityName));
    }

    /**
     * 获取注入的实体/表名称.
     *
     * @return 获取注入的实体/表名称
     */
    public List<QueryEntity> getEntities()
    {
        return entities;
    }

    /**
     * 获取Group By语句对象.
     *
     * @return Group By对象
     */
    public Group getGroup()
    {
        return group;
    }

    /**
     * 设置Group By语句对象.
     *
     * @param group Group By语句对象
     */
    public void setGroup(Group group)
    {
        this.group = group;
    }

    /**
     * 获取Having语句对象.
     *
     * @return Having语句对象
     */
    public Having getHaving()
    {
        return having;
    }

    /**
     * 设置Having语句对象.
     *
     * @param having    Having语句对象
     */
    public void setHaving(Having having)
    {
        this.having = having;
    }


    /**
     * 获取distinct属性.
     *
     * @return distinct属性
     */
    public boolean isDistinct()
    {
        return distinct;
    }

    /**
     * 设置distinct属性.
     *
     * @param distinct distinct属性
     */
    public void setDistinct(boolean distinct)
    {
        this.distinct = distinct;
    }

    /**
     * 获取偏移量.
     *
     * @return 偏移量
     */
    public int getOffset()
    {
        return offset;
    }

    /**
     * 设置偏移量.
     *
     * @param offset    偏移量
     */
    public void setOffset(int offset)
    {
        this.offset = offset;
    }

    /**
     * 获取分页长度.
     *
     * @return 分页长度
     */
    public int getLength()
    {
        return length;
    }

    /**
     * 设置分页长度.
     *
     * @param length    分页长度
     */
    public void setLength(int length)
    {
        this.length = length;
    }

    /**
     * 对查询条件进行解析。例如生成SQL语句，Hibernate的Criteria对象等等。
     *
     * @param context 解析上下文.
     */
    public void interprete(Object context)
    {
        CriterionUtil.inteprete(context, this);
    }
}