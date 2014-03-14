/******************************************************************************** 
 * Create Author   : Xiaojiapeng
 * Create Date     : Jan 27, 2011
 * File Name       : WorkGroupAction.java
 *
 * Apex CA是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.action.workgroup;

import java.io.PrintWriter;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONArray;

import org.apache.commons.lang.xwork.StringUtils;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import com.tekview.apex.itsm.server.system.Version;
import com.tekview.apex.uums.base.OceanRuntimeException;
import com.tekview.apex.uums.base.page.PageList;
import com.tekview.apex.uums.core.web.action.BaseAction;
import com.tekview.apex.uums.model.User;
import com.tekview.apex.uums.model.UserMaintenanceGroup;
import com.tekview.apex.uums.service.WorkGroupService;


@Controller
@Scope("prototype")
@ParentPackage(value = "default")
@Results( {
		@Result(name = "success", location = "/WEB-INF/jsps/workGroupMgt/work-group.jsp"),
		@Result(name ="userList", location="/WEB-INF/jsps/workGroupMgt/work-group-member.jsp")
})
public class WorkGroupAction extends BaseAction {

	private static final long serialVersionUID = -5812286707358062441L;

	@Autowired
	private WorkGroupService workGroupService;
	
	private List<WorkGroupVo> groupList=new ArrayList<WorkGroupVo>();			//工作组集合
	private UserMaintenanceGroup workGroup=new UserMaintenanceGroup();		//工作组对象
	private Long id;		//工作组id 
	private String parentId;			//父工作组Id
	private List<UserMaintenanceGroup> parentGroup=new ArrayList<UserMaintenanceGroup>();		//父工作组
	private PageList<User> userList;		//工作组成员
	private String memberId;	//工作组成员标识
	
	
	/**
	 * 分层显示工作组列表
	 * @return
	 * @throws Exception
	 */
	public String list() throws Exception{
		// 获得父工作组的id，如果id为空，则加载最高层的工作组列表
		// 进入之前清空form
		workGroup=null;
		if (null != parentId && !"".equals(parentId) && !"0".equals(parentId)) {
			// 加载指定id下面的直接子工作组
			workGroup = workGroupService.getGroupById(parentId);
			if (workGroup==null) {
				throw new OceanRuntimeException("exception.workGroup.not.exists");
			}
			// 当前工作组
			List<UserMaintenanceGroup> parentsNode = new ArrayList<UserMaintenanceGroup>();
			List<UserMaintenanceGroup> tempNode = new ArrayList<UserMaintenanceGroup>();
			//保存workGroup，以便以后取用
			UserMaintenanceGroup group =workGroup;
			// 循环获取所有的父辈节点,反过来拿节点
			while (workGroup != null) {
				tempNode.add(workGroup);
				workGroup = workGroup.getParentworkGroup();
			}
			for (int i = tempNode.size(); i >= 1; i--) {
				parentsNode.add(tempNode.get(i - 1));
			}
			workGroup=group;
			List<Object> objectList=workGroupService.getAllWorkGroupByParentId(parentId,getOffset(),getPageSize());
			records =workGroupService.count(parentId);
			//将获得到的数据放入groupList中
			if (objectList!=null&&objectList.size()>0) {
				for (Object object : objectList) {
					Object[] objects=(Object[])object;
					WorkGroupVo workGroupVo =new WorkGroupVo();
					workGroupVo.setId(((BigInteger)objects[0]).longValue());
					workGroupVo.setWorkGroupName((String)objects[1]);
					workGroupVo.setWorkGroupMemo((String)objects[2]);
					workGroupVo.setCount(((BigInteger)objects[3]).intValue());
					//是否拥有子工作组
					if (((BigInteger)objects[3]).intValue()>0) {
						workGroupVo.setHasChild(true);
					}else {
						workGroupVo.setHasChild(false);
					}
					groupList.add(workGroupVo);
				}
			}
			parentGroup=parentsNode;
		} else {
			// 加载最高层次的工作组
			UserMaintenanceGroup currentGroup = new UserMaintenanceGroup();
			String name=Version.getInstance().getCompany();
			currentGroup.setWorkGroupName(name);
			currentGroup.setId(0);
			workGroup=currentGroup;
			parentGroup=null;
			List<Object> objectList=workGroupService.getAllWorkGroupByParentId(null,getOffset(),getPageSize());
			records =workGroupService.count(null);
			//将获得到的数据放入groupList中
			if (objectList!=null&&objectList.size()>0) {
				for (Object object : objectList) {
					Object[] objects=(Object[])object;
					WorkGroupVo workGroupVo =new WorkGroupVo();
					workGroupVo.setId(((BigInteger)objects[0]).longValue());
					workGroupVo.setWorkGroupName((String)objects[1]);
					workGroupVo.setWorkGroupMemo((String)objects[2]);
					workGroupVo.setCount(((BigInteger)objects[3]).intValue());
					//是否拥有子工作组
					if (((BigInteger)objects[4]).intValue()>0) {
						workGroupVo.setHasChild(true);
					}else {
						workGroupVo.setHasChild(false);
					}
					groupList.add(workGroupVo);
				}
			}
		}
		return SUCCESS;
	}
	
	/**
	 * 添加或者更新工作组
	 * @return
	 * @throws Exception
	 */
	public String addOrUpdateWorkGroup() throws Exception{
		if(workGroup.getId()>0){			//编辑工作组信息
			updateWorkGroup();  
		}else {				//添加新工作组
			addWorkGroup();
		}
		return list();
	}
	
	/**
	 * 添加工作组
	 * @throws Exception
	 */
	public void addWorkGroup() throws Exception{
		if(parentId!=null&&!"".equals(parentId)&&!"0".equals(parentId)){			//父工作組Id不为0或空，则在此父工作组下添加子工作组
			workGroupService.addWorkGroup(workGroup.getWorkGroupName(), workGroup.getWorkGroupMemo(),parentId);
		}else {				//添加最高级的工作组
				workGroupService.addWorkGroup(workGroup.getWorkGroupName(), workGroup.getWorkGroupMemo(), null);
		}
	}
	
	/**
	 *  删除工作组
	 * @return
	 * @throws Exception
	 */
	public String deleteWorkGroup() throws Exception{
		try {
			List<String> ids = new ArrayList<String>();
			if (id!=null) {
				ids.add(Long.toString(id));
			}
			workGroupService.deleteWorkGroups(ids);
		} catch (OceanRuntimeException e) {		//扑捉错误并在页面打印出来
			String msg = getText(e.getErrorCode());
			String name = e.getErrorParam();
			if (StringUtils.isNotEmpty(name)) {
				msg = msg.replace("{0}", name);
			}
			response.setContentType("text/plain");
			response.setStatus(500);
			response.getWriter().append(msg);
		}
		return null;
	}
	
	/**
	 * 查看工作组成员  带分页
	 * @return
	 * @throws Exception
	 */
	public String showMember() throws Exception{
		
		if(id!=null){
			workGroup=workGroupService.getById(id);				//查询部门详细信息
			int startIndex =this.getOffset();
			int limitIndex = this.getPageSize();
			
			userList = workGroupService.queryUsers(id,startIndex,limitIndex);			//查看部门用户
			Long totalCount=userList.getTotalCount();
			records=totalCount.intValue();
		}
		return "userList";
	}
	
	/**
	 * 进入更新工作组
	 * @throws Exception
	 */
	public void enterUpdate() throws Exception{
		try {
			if(id!=null)
			{
				workGroup=workGroupService.getGroupById(Long.toString(id));
			}
			//转化为json数据，以便在页面无刷新显示
			UserMaintenanceGroup group = new UserMaintenanceGroup();
			group.setId(workGroup.getId());
			group.setWorkGroupName(workGroup.getWorkGroupName());
			group.setWorkGroupMemo(workGroup.getWorkGroupMemo());
			JSONArray jsonArray = JSONArray.fromObject(group);
			response.setContentType("text/html;charset=utf-8");
			PrintWriter out = response.getWriter();
			out.print(jsonArray);
		} catch (OceanRuntimeException e) {		//扑捉错误并在页面打印出来
			String msg = getText(e.getErrorCode());
			String name = e.getErrorParam();
			if (StringUtils.isNotEmpty(name)) {
				msg = msg.replace("{0}", name);
			}
			response.setContentType("text/plain");
			response.setStatus(500);
			response.getWriter().append(msg);
		}
	}
	
	/**
	 * 更新工作组
	 * @throws Exception
	 */
	public void updateWorkGroup() throws Exception{
		if(workGroup!=null)
			workGroupService.updateWorkGroup(Long.toString(workGroup.getId()), workGroup.getWorkGroupName(), workGroup.getWorkGroupMemo());
	}
	
	/**
	 * 向工作组中添加成员，每个成员只能在一个工作组中
	 * @return
	 * @throws Exception
	 */
	public String addUserToGroup() throws Exception{
		if (id == null || id.equals("") || id == 0L) {
			throw new OceanRuntimeException("要添加成员的工作组标识不正确!");
		}
		//将成员Id转化为数组并遍历保存到集合中
		String[] userIds = memberId.split(",");	
		List<Long> memberIds = new ArrayList<Long>();
		for (String id : userIds) {
			memberIds.add(Long.valueOf(id.trim()));
		}
		workGroupService.addUserToGroup(id, memberIds);
		return showMember();
	}
	
	public String deleteWorkGroupMember() throws Exception{
		if (id == null || id.equals("") || id == 0L) {
			throw new OceanRuntimeException("要删除成员的工作组标识不正确!");
		}
		//将成员Id转化为数组并遍历保存到集合中
		//为一次删除多个成员预留
		String[] userIds = memberId.split(",");	
		List<Long> memberIds = new ArrayList<Long>();
		for (String id : userIds) {
			memberIds.add(Long.valueOf(id.trim()));
		}
		workGroupService.deleteWorkGroupMember(id, memberIds);
		return showMember();
	}
	
	
	
	
	public List<UserMaintenanceGroup> getParentGroup() {
		return parentGroup;
	}
	public void setParentGroup(List<UserMaintenanceGroup> parentGroup) {
		this.parentGroup = parentGroup;
	}
	public String getMemberId() {
		return memberId;
	}
	public void setMemberId(String memberId) {
		this.memberId = memberId;
	}
	public PageList<User> getUserList() {
		return userList;
	}
	public void setUserList(PageList<User> userList) {
		this.userList = userList;
	}
	public List<WorkGroupVo> getGroupList() {
		return groupList;
	}
	public void setGroupList(List<WorkGroupVo> groupList) {
		this.groupList = groupList;
	}
	public UserMaintenanceGroup getWorkGroup() {
		return workGroup;
	}
	public void setWorkGroup(UserMaintenanceGroup workGroup) {
		this.workGroup = workGroup;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getParentId() {
		return parentId;
	}
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
}
