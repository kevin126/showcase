/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 25, 2011
 * File Name       : SecurityServiceImpl.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.service.impl;

import java.rmi.ConnectException;
import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import net.sf.cglib.beans.BeanCopier;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tekview.apex.itsm.server.system.Version;
import com.tekview.apex.platform.util.LogUtil;
import com.tekview.apex.uums.base.OceanRuntimeException;
import com.tekview.apex.uums.dao.UserDao;
import com.tekview.apex.uums.dao.UserDeptDao;
import com.tekview.apex.uums.dao.WorkGroupDao;
import com.tekview.apex.uums.model.User;
import com.tekview.apex.uums.model.UserDept;
import com.tekview.apex.uums.model.UserMaintenanceGroup;
import com.tekview.apex.uums.service.SecurityService;
@Service("securityService")
@Transactional
public class SecurityServiceImpl implements SecurityService {
	private static Logger logger = LogUtil.getLogger(LogUtil.UUMS_LOG);
	@Autowired
	private UserDeptDao userDeptDao;
	@Autowired
	private WorkGroupDao workGroupDao;
	@Autowired
	private UserDao userDao;
	/**
	 * 获取部门树列表
	 */
	public List<Map<String, Object>> getAllDepartmentNames(String parentId) {
		List<Map<String, Object>> tree = new ArrayList<Map<String, Object>>();
		if (parentId.equals("-1")) {
			List<UserDept> departments = userDeptDao.getAllDept();
			if (departments!=null && departments.size()>0) {
				for (UserDept item : departments) {
					// 根节点下的第一层树节点
					if (item.getParentUserDept() == null || item.getParentUserDept().getId() < 1) {
						Map<String, Object> map = new HashMap<String, Object>();
						map.put("id", item.getId() + "");
						map.put("text", item.getDeptName());
						map.put("checked", false);
						if (item.getSubUserDepts().size() < 1) {
							map.put("leaf", true);
						}
						map.put("parentId", parentId);
						tree.add(map);
					}
				}
			}
		} else {
			List<UserDept> list = userDeptDao.getEntitiesByOneProperty("parentUserDept.id", Long.parseLong(parentId));
			if (list!=null && list.size()>0) {
				for (UserDept item : list) {
					Map<String, Object> map = new HashMap<String, Object>();
					map.put("id", item.getId() + "");
					map.put("text", item.getDeptName());
					if (item.getSubUserDepts().size() < 1) {
						map.put("leaf", true);
					}
					map.put("checked", false);
					map.put("parentId", parentId);
					tree.add(map);
				}
			}
		}
		return tree;
	}
	/**
	 * 获取工作组树列表
	 */
	public List<Map<String, Object>> getAllWorkGroupNamesTree(String parentId) {
		List<Map<String, Object>> tree = new ArrayList<Map<String, Object>>();
		if (parentId.equals("-1")) {
			List<UserMaintenanceGroup> workGroupList = workGroupDao.getAllWorkGroup();
			if (workGroupList!=null && workGroupList.size()>0) {
				for (UserMaintenanceGroup item : workGroupList) {
					// 根节点下的第一层树节点
					if (item.getParentworkGroup() == null || item.getParentworkGroup().getId() < 1) {
						Map<String, Object> map = new HashMap<String, Object>();
						map.put("id", item.getId() + "");
						map.put("text", item.getWorkGroupName());
						if (item.getSubWorkGroup().size() < 1) {
							map.put("leaf", true);
						}
						map.put("checked", false);
						map.put("parentId", parentId);
						tree.add(map);
					}
				}
			}
		} else {
			List<UserMaintenanceGroup> list = workGroupDao.getEntitiesByOneProperty("parentworkGroup.id", Long
					.parseLong(parentId));
			if (list!=null && list.size()>0) {
				for (UserMaintenanceGroup item : list) {
					Map<String, Object> map = new HashMap<String, Object>();
					map.put("id", item.getId() + "");
					map.put("text", item.getWorkGroupName());
					map.put("checked", false);
					if (item.getSubWorkGroup().size() < 1) {
						map.put("leaf", true);
					}
					map.put("parentId", parentId);
					tree.add(map);
				}
			}
		}
		return tree;
	}
}
