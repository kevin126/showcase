/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : CriterionUtil.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.base.criterion;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.tekview.apex.uums.base.criterion.interpreter.Interpreter;
import com.tekview.apex.uums.base.criterion.interpreter.InterpreterFactory;
import com.tekview.apex.uums.base.criterion.interpreter.sql.InterpreterFactoryImpl;
import com.tekview.apex.uums.base.criterion.interpreter.sql.SqlInterpreteContext;
import com.tekview.apex.uums.base.page.PageArrayList;
import com.tekview.apex.uums.base.page.PageList;

public class CriterionUtil {
    static final String pattern_block = "(^.*FROM.*WHERE$)|(.*FROM.*AND$)|(.*FROM.*OR$)|(.*FROM.*NOT$)";
    static final String pattern_permit = "(^SELECT.*FROM)|(^DELETE.*FROM)|(^UPDATE)";

    private CriterionUtil() {
    }

    public static void inteprete(Object context, Object obj) {
        InterpreterFactory factory = getFactory();
        Interpreter<Object, Object> interpreter =
                (Interpreter<Object, Object>) factory.getInterpreter(obj);
        interpreter.interprete(context, obj);
    }

    private static InterpreterFactory getFactory() {
        return InterpreterFactoryImpl.getInstance();
    }

    /**
     * Simple Validator.
     *
     * @param request to be validated sql
     * @return success or failure
     */
    public static boolean validate(String request) {
        String sql = request.toUpperCase();
        StringBuilder sb = new StringBuilder();
        char pre = sql.charAt(0);
        char current;
        if (pre != ' ') {
            sb.append(pre);
        }
        for (int i = 1; i < sql.length(); i++) {
            current = sql.charAt(i);
            if (current == ' ' && pre == ' ') {
                pre = current;
                continue;
            }
            sb.append(current);
        }

        String stardard = sb.toString();

        Pattern p = Pattern.compile(pattern_block);
        Matcher m = p.matcher(stardard);
        boolean flag = m.find();
        if (flag) {
            return false;
        }
        p = Pattern.compile(pattern_permit);
        m = p.matcher(stardard);
        flag = m.find();
        return flag;
    }

    /**
     * 获取统计的结果数count.
     *
     * @param sql      SQL字符
     * @param distinct 是否允许重复，默认为false
     * @return 统计结果的sql
     */
    public static String getCountSqlString(String sql, boolean distinct) {
        StringBuilder buf = new StringBuilder("SELECT ");
        if (distinct) {
            buf.append("DISTINCT ");
        }
        buf.append("COUNT(*) ");
        String temp = sql.toUpperCase();
        int begin = temp.indexOf("FROM");
        int end = temp.indexOf("ORDER BY");
        if (begin > -1 && end > begin) {
            buf.append(sql.substring(begin, end));
        } else if (begin > -1) {
            buf.append(sql.substring(begin));
        }
        return buf.toString();
    }

    /**
     * 获取统计的结果数count，不区分重复记录.
     *
     * @return 统计结果的sql
     */
    public static String getCountSqlString(String sql) {
        return getCountSqlString(sql, false);
    }

    /**
     * 填充query中的参数.
     *
     * @param query  Query对象
     * @param params 参数集合
     */
    public static void fillQuery(Query query, Object... params) {
        if (params.length == 0) {
            return;
        }
        int i = 0;
        for (Object obj : params) {
            query.setParameter(++i, obj);
        }
    }

    /**
     * SQL查询的util方法.
     *
     * @param sql           SQL查询语句
     * @param entityManager entityManager
     * @param criteria      查询条件
     * @return 查询出来的对象列表
     */
    public static <T> PageList<T> sqlQuery(String sql, EntityManager entityManager,
                                           Criteria criteria) {
        if (criteria == null) {
            criteria = new Criteria();
        }
        SqlInterpreteContext context = new SqlInterpreteContext(sql);
        criteria.interprete(context);
        sql = context.getContextString();

        PageList<T> result;
        Query query;
        int count = 0;
        int offset = criteria.getOffset();
        int length = criteria.getLength();

        if (offset > -1 && length > -1) {
            String countSql = CriterionUtil.getCountSqlString(sql);
            query = entityManager.createQuery(countSql);
            CriterionUtil.fillQuery(query, context.getPreparedValues().toArray(new Object[]{}));
            count = ((Number) query.getSingleResult()).intValue();
        }

        query = entityManager.createQuery(sql);
        CriterionUtil.fillQuery(query, context.getPreparedValues().toArray(new Object[]{}));
        if (offset > -1) {
            query.setFirstResult(offset);
        }
        if (length > -1) {
            query.setMaxResults(length);
        }
        List<T> list = (List<T>) query.getResultList();

        if (count == 0) {
            count = list.size();
        }
        result = new PageArrayList<T>(count, list);
        return result;
    }

    /**
     * SQL查询的util方法.
     *
     * @param sql           SQL查询语句
     * @param entityManager entityManager
     * @param criteria      查询条件
     * @throws InvalidSQLFormatException 无效的sql格式异常
     */
    public static <T> List<T> sqlQueryWithoutCount(String sql, EntityManager entityManager,
                                                   Criteria criteria) {
        if (criteria == null) {
            criteria = new Criteria();
        }
        int offset = criteria.getOffset();
        int length = criteria.getLength();
        SqlInterpreteContext context = new SqlInterpreteContext(sql);
        criteria.interprete(context);
        sql = context.getContextString();

        Query query = entityManager.createQuery(sql);
        CriterionUtil.fillQuery(query, context.getPreparedValues().toArray(new Object[]{}));
        if (offset > -1) {
            query.setFirstResult(offset);
        }
        if (length > -1) {
            query.setMaxResults(length);
        }
        List<T> list = (List<T>) query.getResultList();

        return list;
    }
}