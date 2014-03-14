/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : BaseInterface.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.base;

import com.tekview.apex.uums.base.criterion.Criteria;
import com.tekview.apex.uums.base.page.PageList;

/**
 * 公共接口，包括添加、修改、删除、通过id查询、分页查询、查询总数
 *
 * @author kevin
 * @version Revision: 1.00 Date: 10-12-21下午2:16
 * @Email liuyuhui007@gmail.com
 */
public interface BaseInterface<T> {
    /**
     * 保存T类型对象到数据库中
     * @param entity 对象信息
     */
    public void save(T entity);

    /**
     * 修改记录信息
     * @param entity 要修改的对象信息
     */
    public void update(T entity);

    /**
     * 删除数据库中指定ID的记录
     * @param id 要删除的对象标识
     */
    public void delete(Long id);


    /**
     * 通过id查询数据库记录
     * @param id 唯一标识
     * @return 对象信息
     */
    public T getById(Long id);

    /**
     * 分页查询
     * @param criteria 查询条件
     * @return 对象列表
     */
    public PageList<T> queryByPage(Criteria criteria);

}