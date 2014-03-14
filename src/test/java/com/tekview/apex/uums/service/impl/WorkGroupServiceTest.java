/******************************************************************************** 
 * Create Author   : Xiaojiapeng
 * Create Date     : Jan 24, 2011
 * File Name       : WorkGroupServiceTest.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.xwork.StringUtils;
import org.junit.Test;

import com.tekview.apex.uums.base.BaseTestCase;
import com.tekview.apex.uums.base.criterion.Criteria;
import com.tekview.apex.uums.base.criterion.Restrictions;
import com.tekview.apex.uums.base.page.PageList;
import com.tekview.apex.uums.model.UserMaintenanceGroup;
import com.tekview.apex.uums.service.WorkGroupService;
/**
 *  工作组实例
 * @author Xiaojiapeng
 *
 */
public class WorkGroupServiceTest extends BaseTestCase {

	private WorkGroupService workGroupService = null;
	
	public WorkGroupServiceTest(){
		workGroupService = (WorkGroupService)getApplicationContext().getBean("workGroupService");
	}
	
	@Test	//添加工作组
	public void testAddWorkGroup(){		
		workGroupService.addWorkGroup("普通组", "普通组", null);
		workGroupService.addWorkGroup("普通组1", "普通组", null);
		workGroupService.addWorkGroup("普通组2", "普通组", null);
		workGroupService.addWorkGroup("普通组3", "普通组", null);
		workGroupService.addWorkGroup("普通组4", "普通组", null);
		workGroupService.addWorkGroup("普通组5", "普通组", null);
		
	}
	
	@Test	//删除工作组
	public void testDeleteWorkGroup(){
		workGroupService.deleteWorkGroup("普通组");
	}
	
	@Test		//批量删除工作组
	public void testDeleteWorkGroups(){
		List<String> id = new ArrayList<String>();
		id.add("2");
		id.add("3");
		workGroupService.deleteWorkGroups(id);
	}
	
	@Test		//根据Id查询工作组
	public void testGetGroupById(){
		UserMaintenanceGroup workGroup = workGroupService.getGroupById("4");
		System.out.println(workGroup.getWorkGroupName());
	}
	
	@Test		//查询父工作组下的所有子工作组
	public void testGetGroupByParentDeptId(){
		List<UserMaintenanceGroup> workgroupList = workGroupService.getGroupByParentDeptId(1L);
		if(workgroupList!=null){
			for (UserMaintenanceGroup userMaintenanceGroup : workgroupList) {
				System.out.println("WorkGroupName:"+userMaintenanceGroup.getWorkGroupName());
			}
		}
	}
	
	@Test		//更新工作组信息
	public void testUpdateWorkGroup(){
		workGroupService.updateWorkGroup("4", null, "普通组的描述");
		System.out.println(workGroupService.getById(4L).getWorkGroupMemo());
	}
	
	@Test		// 删除工作组
	public void testDelete(){
		workGroupService.delete(5L);
	}
	
	@Test			//根据Id获得工作组信息
	public void testGetById(){
		System.out.println(workGroupService.getById(4L).getWorkGroupName());
	}
	
	@Test			//分页查询
	public void testQueryByPage(){
		Criteria criteria = new Criteria();
        String name = "普通";
        if (StringUtils.isNotEmpty(name)) {
            //查询用户名中含有普通字符串的用户
            criteria.add(Restrictions.like("workGroupName", name));
        }
        criteria.setOffset(0);
        criteria.setLength(10);
        PageList userDeptList = workGroupService.queryByPage(criteria);
        System.out.println("list size:" + userDeptList.size());
	}
	
	@Test		//添加工作组
	public void testSave(){
		UserMaintenanceGroup workGroup = new UserMaintenanceGroup();
		workGroup.setWorkGroupName("研发工作组");
		workGroup.setWorkGroupMemo("研发工作组的描述");
		workGroupService.save(workGroup);
	}
	
	@Test			//更新工作组信息
	public void testUpdate(){
		UserMaintenanceGroup workGroup = workGroupService.getById(7L);
		workGroup.setWorkGroupMemo("普通工作组的描述");
		workGroupService.update(workGroup);
		System.out.println(workGroupService.getById(7L).getWorkGroupMemo());
	}
}
