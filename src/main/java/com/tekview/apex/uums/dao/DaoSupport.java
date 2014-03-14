/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : DaoSupport.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.dao;

import java.lang.reflect.ParameterizedType;
import java.util.Collection;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.ArrayUtils;

import com.tekview.apex.uums.base.OceanRuntimeException;
import com.tekview.apex.uums.base.criterion.Criteria;
import com.tekview.apex.uums.base.criterion.CriterionUtil;
import com.tekview.apex.uums.base.criterion.Restrictions;
import com.tekview.apex.uums.base.page.PageList;
import com.tekview.apex.uums.model.User;
import com.tekview.apex.uums.model.UserDept;

public abstract class DaoSupport<T> {
    @PersistenceContext
    private EntityManager entityManager;
    //实体类
    private Class<T> entityClass;

    /**
     * 操作实体的全名称，如：MapNode.class.getName()、MapLink.class.getName()等
     *
     * @return
     */
    protected abstract Class getEntityClass();

    //保存
    public void save(T entity) {
        entityManager.persist(entity);
    }

    /**
	 * 根据主键查询实体
	 * 
	 * @param id 实体ID
	 * @return 实体对象
	 */
    public T getById(Long id) {
        return (T) entityManager.find(getEntityClass(), id);
    }

    //更新
    public void update(T entity) {
        entityManager.merge(entity);
    }

    //删除
    public void delete(Long id) {
        T entity = getById(id);
        if (entity != null) {
            entityManager.remove(entity);
        }
    }

    //删除对象
    public void deleteEntity(T entity){
    	//在删除之前把这个Detached instance绑定到当前的Sesssion，在用当前Sesssion删除此instance
    	entityManager.remove(entityManager.merge(entity));
    }
    //删除多个
    public void deleteByIds(Long[] ids) {
        for (Long id : ids) {
            delete(id);
        }
    }

    //分页查询
    public PageList<T> queryByPage(Criteria criteria) {
        String hql = "select entity from " + getEntityClass().getName() + " entity";
        if (criteria == null) {
            criteria = new Criteria();
        }
        return CriterionUtil.sqlQuery(hql, entityManager, criteria);
    }

    /**
     * 查询所有实体
     */
    public List<T> getAllEntities() {
        return (List<T>)entityManager.createQuery("from " + getEntityClass().getName()).getResultList();
    }

    /**
	 * 将查询条件封装为hql查找
	 * 
	 * @param hql 查询语句
	 * @return 实体列表
	 */
    public List<T> getEntityByHql(String hql) {
        String string = "from " + getEntityClass().getName() + hql;
        return entityManager.createQuery(string).getResultList();
    }
    
    /**
	 * 将完整的查询条件封装为hql查找,包括关键字select
	 * 
	 * @param hql 查询语句
	 * @return 实体列表
	 */
    public List<T> getEntityByFullHql(String hql) {
        return entityManager.createQuery(hql).getResultList();
    }

    /**
     * 分页查询实体对象
     *
     * @param start    开始位置 - 下标从0开始
     * @param pageSize 每页大小
     * @return
     */
    public List<T> getPagingEntities(final int start, final int pageSize) {
        Query query = entityManager.createQuery("from " + getEntityClass().getName());
        query.setFirstResult(start);
        query.setMaxResults(pageSize);
        return query.getResultList();
    }

    /**
     * 分页根据hql查询实体对象
     *
     * @param start    开始位置 - 下标从0开始
     * @param pageSize 每页大小
     * @param hql
     * @return
     */
    public List<T> getPagingEntitiesByHql(final String hql, final int start, final int pageSize) {
        Query query = entityManager.createQuery(hql);
        query.setFirstResult(start);
        query.setMaxResults(pageSize);
        return query.getResultList();
    }

    /**
     * 根据主键查询实体，如果没有查到返回null
     *
     * @param id 实体ID
     * @return 实体对象
     */
    public T getEntityById(Long id) {
        if (id == null)
            return null;
        return (T) entityManager.find(getEntityClass(), id);
    }


    /**
     * 根据T类型来算出带命名空间的函数名
     *
     * @return 返回类型为 ClassName.methodName
     */
    public String getStatement() {
        StackTraceElement[] stacks = new Exception().getStackTrace();
        return getStatement(stacks[1].getMethodName());
    }

    /**
     * 根据指定的属性名-值，删除实体
     *
     * @param propertyName
     * @param value
     */
    public void deleteEntityByProperty(String propertyName, final Object value) {
        StringBuffer sql = new StringBuffer("").append("delete from ").append(getEntityClass().getName()).append(" where ");
        sql.append(propertyName).append(" =").append(value);
        Query query=entityManager.createQuery(sql.toString());
        query.executeUpdate();
    }
    /**
	 * 根据SQL的or条件查询，举个例子如下： from DeviceResource where (type = 'ROUTER' or type = 'L3_SWITCH');
	 * 
	 * <p>
	 * Notes: 请在进行or查询时调用这个方法
	 * 
	 * @param propertyName 属性名
	 * @param values 属性的可能值
	 * 
	 * @return 符合条件的记录
	 */
	@SuppressWarnings("unchecked")
	public List<T> getEntitiesByOrCondition(final String propertyName, final Object... values) {
		  String hql = "select entity from " + getEntityClass().getName() + " entity";
		  Criteria criteria = new Criteria();
		  criteria.setLength(Integer.MAX_VALUE);
		  criteria.add(Restrictions.in(propertyName, values));
	      return CriterionUtil.sqlQuery(hql, entityManager, criteria);
	}

    /**
     * 删除所有实体
     *
     * @param entities
     */
    @SuppressWarnings("unchecked")
    public void deleteAllEntities(Collection<T> entities) {
        if (entities.isEmpty())
            return;
        for (T entity : entities) {
            entityManager.remove(entity);
        }
    }

    /**
     * 根据T类型来算出带命名空间的函数名
     *
     * @param methodName 方法名
     * @return 返回类型为 ClassName.methodName
     */
    public String getStatement(String methodName) {
        ParameterizedType type = ((ParameterizedType) getClass().getGenericSuperclass());
        Class<T> entityClass = (Class<T>) (type.getActualTypeArguments()[0]);
        return entityClass.getName() + "." + methodName;
    }

    /**
     * 根据Id判断对象是否存在,如果存在返回true，不存在返回false
     *
     * @param id ：对象Id
     */
    public boolean isObjExist(long id) {
        T entity = getEntityById(id);
        if (entity == null)
            return false;
        else
            return true;
    }

    /**
     * 在更新对象时，先判断该对象还存不存在，如果不存在则抛出异常图示用户
     *
     * @param id  ：对象Id
     * @param obj ：整个对象
     */
    public void updateOceanObject(long id, Object obj) {
        T entity = getEntityById(id);
        if (entity == null)
            throw new OceanRuntimeException("该记录已被其他用户删除");
        else
            entityManager.merge(obj);
    }

    public long count() {
        Long count = (Long) entityManager.createQuery("select count(*) from " + getEntityClass().getName()).getSingleResult();
        return count;
    }
    /**
	 * 根据实体对象的某个属性查询实体对象，举个例子如下： from DeviceResource where type = 'ROUTER';
	 * 
	 * @param propertyName 实体对象的属性名
	 * @param value 属性对应的值
	 * 
	 * @return 符合该特定查询条件的多个实体
	 */
	public List<T> getEntitiesByOneProperty(final String propertyName, final Object value) {
		return getEntitiesByPropNames(new String[] { propertyName }, new Object[] { value });
	}
	/**
	 * 根据实体对象的多个属性查询实体对象，举个例子如下： from DeviceResource where type = 'ROUTER' and temp = false;
	 * 
	 * @param propertyNames 匹配的属性名
	 * @param values 属性对应的值
	 * 
	 * @return 符合该特定查询条件的多个实体
	 */
	public List<T> getEntitiesByPropNames(final String[] propertyNames, final Object[] values) {
		if (ArrayUtils.isEmpty(propertyNames) || ArrayUtils.isEmpty(values) || propertyNames.length != values.length) {
			throw new IllegalArgumentException("arguments is invalid.");
		}
		Criteria criteria = new Criteria();
		for(int i=0;i<=propertyNames.length-1;i++){
			criteria.add(Restrictions.eq(propertyNames[i],values[i]));
		}
		return queryByPage(criteria);
	}
	/**
	 * 根据实体对象的多个属性查询实体对象，举个例子如下： from DeviceResource where type = 'ROUTER' and temp = false and mgtIp = '192.168.0.8';
	 * 在这个例子中，我知道查询只会返回唯一值
	 * 
	 * <p>
	 * 在你确定查询返回唯一一个值的情况下调用这个方法，否则请使用{{@link #getEntitiesByPropNames(String[], Object[])}
	 * 
	 * @param propertyNames 匹配的属性名
	 * @param values 属性对应的值
	 * 
	 * @return 符合该特定查询条件的唯一实体
	 */
	public T getUniqueEntityByPropNames(final String[] propertyNames, final Object[] values){
		List<T> result = getEntitiesByPropNames(propertyNames, values);
		if (result!=null && result.size()>0)
			return result.get(0);
		return null;
	}
	
	 /**
	 * 根据实体对象的某个属性查询唯一的实体对象
	 * 
	 * @param propertyName 实体对象的属性名
	 * @param value 属性对应的值
	 * 
	 * @return 符合该特定查询条件的唯一实体，如果没有找到，则返回null
	 */
	public T getUniqueEntityByOneProperty(String propertyName,Object value){
		return getUniqueEntityByPropNames(new String[]{propertyName},new Object[]{value});
	}
	/**
	 * 条件查询实体对象的某几个属性而不返回整个实体对象，在仅仅需要实体对象的属性而不是整个实体对象时，可以提高效率。
	 * 
	 * @param selectedProps 要查询的属性名称
	 * @param conditionKeys where子句中的查询条件
	 * @param values where子句中的查询条件对应的值
	 * @return 符合条件的实体对象某几个属性的集合
	 */
	public List<?> getEntityProperties(final String[] selectedProps, final String[] conditionKeys, final Object[] values){
		if (ArrayUtils.isEmpty(selectedProps)
				|| (!ArrayUtils.isEmpty(conditionKeys) && !ArrayUtils.isEmpty(values) && conditionKeys.length != values.length)) {
			throw new IllegalArgumentException("Invalid arguments to execute sql query.");
		}
		StringBuilder sql = new StringBuilder("select ");
		for (int i = 0, n = selectedProps.length; i < n; i++) {
			if (i != n - 1)
				sql.append(selectedProps[i] + ",");
			else
				sql.append(selectedProps[i] + " from ");
		}
		if (conditionKeys == null) {
			sql.append(getEntityClass().getName());
		} else {
			sql.append(getEntityClass().getName() + " where ");
			for (int i = 0, n = conditionKeys.length; i < n; i++) {
				if (i != n - 1) {
					sql.append(conditionKeys[i]);
					sql.append(" = ").append(values[i]).append(" and ");
				} else {
					sql.append(conditionKeys[i]);
					sql.append(" = ").append(values[i]);
				}
			}
		}
		Query query = entityManager.createQuery(sql.toString());
		return query.getResultList();
	}
	/**
	 * 根据指定的条件获符合要求的对象，以分页的形式返回
	 * 
	 * @param start 起始值
	 * @param limit 分页的数目
	 * @param hql 获取对象的Hql语句 
	 * @return 对象数组
	 */
	public Object[] getFiexedObjectsInPage(final int start, final int limit,  final String hql){
		String countHql = "select count(id) " + hql;
		Query countQuery = entityManager.createQuery(countHql);
		int size = ((Long)countQuery.getSingleResult()).intValue();
		
		Query query = entityManager.createQuery(hql);
		query.setFirstResult(start);
		query.setMaxResults(limit);
		return new Object[]{size, query.getResultList()};
	}
	
	/**
	 * 根据实体对象的多个属性查询实体对象数量，举个例子如下： from DeviceResource where type = 'ROUTER' and temp = false;
	 * 
	 * @param start 开始位置
	 * @param pageSize 每页大小
	 * @param propertyNames 匹配的属性名
	 * @param values 属性对应的值
	 * 
	 * @return 符合该特定查询条件的多个实体
	 */
	public int countEntitiesByPropNames(final String[] propertyNames, final Object[] values){
		if (ArrayUtils.isEmpty(propertyNames) || ArrayUtils.isEmpty(values) || propertyNames.length != values.length) {
			throw new IllegalArgumentException("arguments is invalid.");
		}
		StringBuilder sql = new StringBuilder("select count(*) from ");
		if (propertyNames == null) {
			sql.append(getEntityClass().getName());
		} else {
			sql.append(getEntityClass().getName() + " where ");
			for (int i = 0, n = propertyNames.length; i < n; i++) {
				if (i != n - 1) {
					sql.append(propertyNames[i]);
					sql.append(" = ").append(values[i]).append(" and ");
				} else {
					sql.append(propertyNames[i]);
					sql.append(" = ").append(values[i]);
				}
			}
		}
		Query query = entityManager.createQuery(sql.toString());
		Long result=(Long)query.getSingleResult();
		return result.intValue();
	}
	/**
	 * 条件查询实体对象
	 * 举个例子如下： from DeviceResource where type = 'ROUTER' and id=1;
	 * @param propertyNames where子句中的查询条件
	 * @param values where子句中的查询条件对应的值
	 * @return 用户列表
	 */
	public List<User> getEntitiesByPropertiesEuqal(final String[] propertyNames, final Object[] values){
		if ((!ArrayUtils.isEmpty(propertyNames) && !ArrayUtils.isEmpty(values) && propertyNames.length != values.length)) {
			throw new IllegalArgumentException("Invalid arguments to execute sql query.");
		}
		StringBuilder sql = new StringBuilder("select user from ");
		if (propertyNames == null) {
			sql.append(getEntityClass().getName()).append(" as user ");
		} else {
			sql.append(getEntityClass().getName() + " as user where ");
			for (int i = 0, n = propertyNames.length; i < n; i++) {
				if (i != n - 1) {
					sql.append(propertyNames[i]);
					sql.append(" = ").append(values[i]).append(" and ");
				} else {
					sql.append(propertyNames[i]);
					sql.append(" = ").append(values[i]);
				}
			}
		}
		Query query = entityManager.createQuery(sql.toString());
		return query.getResultList();
	}
}