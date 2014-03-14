/******************************************************************************** 
 * Create Author   : Xiaojiapeng
 * Create Date     : Jan 24, 2011
 * File Name       : WorkGroupServiceImpl.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tekview.apex.uums.base.OceanRuntimeException;
import com.tekview.apex.uums.base.criterion.Criteria;
import com.tekview.apex.uums.base.page.PageList;
import com.tekview.apex.uums.dao.WorkGroupDao;
import com.tekview.apex.uums.model.User;
import com.tekview.apex.uums.model.UserMaintenanceGroup;
import com.tekview.apex.uums.service.WorkGroupService;

/**
 * 工作组service的实现类
 * @author Xiaojiapeng
 *
 */


@Service("workGroupService")
@Transactional
public class WorkGroupServiceImpl implements WorkGroupService {

	@Autowired
	private WorkGroupDao workGroupDao;
	/**
     * 添加新工作组
     * @param workGroupName 工作组名称
     * @param workGroupMemo 描述
     * @param parentWorkGroupId 父工作组Id
     * @return 添加结果
     */
	@Override
	public long addWorkGroup(String workGroupName, String workGroupMemo,
			String parentWorkGroupId) {
		UserMaintenanceGroup group=workGroupDao.getByName(workGroupName);
		if (group!=null) {
			throw new OceanRuntimeException("group.is.exist");
		}
		UserMaintenanceGroup workGroup = new UserMaintenanceGroup();
		if(workGroupName!=null&&!"".equals(workGroupName)){
			workGroup.setWorkGroupName(workGroupName);
		}
		if(workGroupMemo!=null&&!"".equals(workGroupMemo)){
			workGroup.setWorkGroupMemo(workGroupMemo);
		}
		if(parentWorkGroupId!=null&&!"".equals(parentWorkGroupId)){
			workGroup.setParentworkGroup(getById(Long.parseLong(parentWorkGroupId)));		//set父工作组的信息
		}
		try {
			workGroupDao.save(workGroup);
			return 1;
		} catch (Exception e) {
			e.printStackTrace();
			return 0;
		}
	}

	/**
     * 删除工作组
     * @param workGroupName 工作组名称
     */
	@Override
	public void deleteWorkGroup(String workGroupName) {
		UserMaintenanceGroup workGroup = (UserMaintenanceGroup) workGroupDao.getWorkGroupByWorkGroupName(workGroupName);
		if (workGroup==null) {
			throw new OceanRuntimeException("exception.workGroup.not.exists");
		}
		if (workGroup.getId()==1) {				//判断将要删除的工作组是否是默认工作组，默认工作组不能被删除
			throw new OceanRuntimeException("default.WorkGroup.not.delete");
		}
		List<UserMaintenanceGroup> workGroupList = workGroupDao.getGroupByParentDeptId(workGroup.getId());
		if(workGroupList.size()>0){		//判断工作组中是否有子工作组
			throw new OceanRuntimeException("has.sub.in.WorkGroup");
		}	
		if(queryUsers(workGroup.getId()).size()>0){			//判断工作组下是否有用户
			throw new OceanRuntimeException("has.Users.in.WorkGroup");
		}
		workGroupDao.deleteWorkGroup(workGroupName);
	}

	 /**
     * 批量删除工作组
     * @param workGroupIds 批量删除工作组Id集合
     */
	@Override
	public void deleteWorkGroups(List<String> workGroupIds) {
		if(workGroupIds.size()>0&&workGroupIds!=null){
			for (String string : workGroupIds) {
				UserMaintenanceGroup group=workGroupDao.getById(Long.parseLong(string));
				if (group==null) {
					throw new OceanRuntimeException("exception.workGroup.not.exists");
				}
				if (Long.parseLong(string)==1) {	//判读将要删除的工作组集合中是否有默认工作组，默认工作组不能被删除
					throw new OceanRuntimeException("default.WorkGroup.not.delete");
				}
				List<UserMaintenanceGroup> workGroupList= workGroupDao.getGroupByParentDeptId(Long.parseLong(string));
				
				if(workGroupList.size()>0){			//判断工作组中是否有子工作组
					throw new OceanRuntimeException("has.sub.in.WorkGroup");
				}	
				
				if(queryUsers(Long.parseLong(string)).size()>0){		// 判断工作组下是否有用户
					throw new OceanRuntimeException("has.Users.in.WorkGroup");
				}
			}
		}
		for (int i = 0; i < workGroupIds.size(); i++) {
			delete(Long.parseLong(workGroupIds.get(i)));
		}

	}

	/**
     * 
     * @param parentId 父工作组Id
     * @return
     */
	@Override
	public List<Map<String, Object>> getAllWorkGroupNamesTree(String parentId) {
		// TODO： OSS中工作组树结构的显示 等待更新......
		return null;
	}

	 /**
     * 根据工作组Id查询工作组详情
     * @param id 工作组Id
     * @return 工作组对象
     */
	@Override
	public UserMaintenanceGroup getGroupById(String id) {
		UserMaintenanceGroup workGroup =workGroupDao.getById(Long.parseLong(id));
		if(workGroup==null){
			throw new OceanRuntimeException("exception.workGroup.not.exists");
		}
		Hibernate.initialize(workGroup.getSubWorkGroup());
		return workGroup;
	}

	
	/**
     * 查询父工作组下面的所有子工作组
     * @param parentGroupId 父工作组Id
     * @return 工作组集合
     */
	@Override
	public List<UserMaintenanceGroup> getGroupByParentDeptId(long parentGroupId) {
		List<UserMaintenanceGroup> workGroupList =workGroupDao.getGroupByParentDeptId(parentGroupId);
		for (UserMaintenanceGroup userMaintenanceGroup : workGroupList) {
			if (userMaintenanceGroup.getSubWorkGroup().size()>0&&userMaintenanceGroup!=null) {			//判断工作组中是否有子工作组
				userMaintenanceGroup.setHasChild(true);
			}
		}
		return workGroupList;
		
	}

	/**
     * 查询工作组下的用户
     *
     * @param workGroupId 工作组标识
     * @return 工作组下的用户列表
     */
	@Override
	public List<User> queryUsers(Long workGroupId) {
		List<User> userList = workGroupDao.queryUsers(workGroupId);
		return userList;
	}

	/**
     * 修改工作组信息
     * @param workGroupId 工作组Id
     * @param newWorkGroupName 工作组名称
     * @param workGroupMemo 描述
     * @return 是否修改成功
     */
	@Override
	public boolean updateWorkGroup(String workGroupId, String newWorkGroupName,
			String workGroupMemo) {
		//获得工作组信息
		UserMaintenanceGroup workGroup = getById(Long.parseLong(workGroupId));
		if(workGroup==null){
			throw new OceanRuntimeException("exception.workGroup.not.exists");
		}
		//判断工作组名称是否存在 先判断旧工作组名称是否与新工作组名称相同，相同则不进行判断
		if (!newWorkGroupName.equals(workGroup.getWorkGroupName())) {
			UserMaintenanceGroup group=workGroupDao.getByName(newWorkGroupName);
			if (group!=null) {
				throw new OceanRuntimeException("group.is.exist");
			}
		}
		if(newWorkGroupName!=null){
			workGroup.setWorkGroupName(newWorkGroupName);
		}
		if(workGroupMemo!=null){
			workGroup.setWorkGroupMemo(workGroupMemo);
		}
		try {
			workGroupDao.update(workGroup);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
			
		
	}

	/**
	 * 根据Id删除工作组
	 * @param id 工作组Id
	 */
	@Override
	public void delete(Long id) {
		workGroupDao.delete(id);

	}

	/**
	 * 根据Id查询工作组
	 * @param id 工作组Id
	 * @return 工作组
	 */
	@Override
	public UserMaintenanceGroup getById(Long id) {
		return (UserMaintenanceGroup)workGroupDao.getById(id);
	}

	/**
	 * 分页查询工作组列表
	 * @param criteria 查询条件
	 * @return 工作组列表
	 */
	@Override
	public PageList<UserMaintenanceGroup> queryByPage(Criteria criteria) {
		return workGroupDao.queryByPage(criteria);
	}

	/**
	 * 保存工作组
	 * @param entity 工作组
	 */
	@Override
	public void save(UserMaintenanceGroup entity) {
		if(entity!=null){
			workGroupDao.save(entity);
		}

	}

	/**
	 * 更新工作组
	 * @param entity 工作组
	 * 
	 */
	@Override
	public void update(UserMaintenanceGroup entity) {
		if(entity!=null)
			workGroupDao.update(entity);

	}
	 /**
     * 通过工作组名称获取工作组信息
     *
     * @param workGroupName 工作组名称
     * @return 工作组对象
     */
    public UserMaintenanceGroup getByName(String workGroupName){
    	return workGroupDao.getByName(workGroupName);
    }
    
    /**
	 * 分页根据groupId查询实体对象
	 * 
	 * @param start
	 *            开始位置 - 下标从0开始
	 * @param pageSize
	 *            每页大小
	 * @param groupId 工作组Id
	 * @return
	 */
	@Override
	public PageList<User> queryUsers(Long groupId, int start, int pageSize) {
		return workGroupDao.queryUsers(groupId, start, pageSize);
	}

	/* (non-Javadoc)
	 * @see com.tekview.apex.uums.service.WorkGroupService#getAllWorkGroupByParentId(java.lang.Long)
	 */
	@Override
	public List<Object> getAllWorkGroupByParentId(String parentGroupId,int start,int limit) {
		return workGroupDao.getAllWorkGroupByParentId(parentGroupId,start,limit);
	}

	@Override
	public int count(String parentId) {
		return workGroupDao.countEntitiesByPropNames(new String[]{"parentworkGroup.id"}, new Object[]{parentId});
	}

	@Override
	public List<UserMaintenanceGroup> getAllWorkGroups() {
		return workGroupDao.getAllWorkGroup();
	}

	@Override
	public void addUserToGroup(Long groupId, List<Long> userIds) {
		workGroupDao.addUserToGroup(groupId, userIds);
		
	}

	@Override
	public void deleteWorkGroupMember(Long groupId, List<Long> userIds) {
		workGroupDao.deleteWorkGroupMember(groupId, userIds);
		
	}
	/**
	 * 获取所有的工作组列表，包含父子关系
	 * @return 工作组列表
	 */
	public List<UserMaintenanceGroup> getAllWorkGroupEager(){
		return workGroupDao.getAllWorkGroupEager();
	}
	/**
     * 通过id查询,加载子组
     * @param id 工作组标识
     * @return 工作组对象
     */
    public UserMaintenanceGroup getByIdEager(Long id){
    	return workGroupDao.getByIdEager(id);
    }
    /**
	 * 获取所有的工作组树列表，名称加入标识
	 * @return 工作组列表
	 */
	public List<UserMaintenanceGroup> getAllWorkGroupTree(){
		List<UserMaintenanceGroup> all=new ArrayList<UserMaintenanceGroup>();
		//获取所有的根用户组
		List<UserMaintenanceGroup> rootGroupList=workGroupDao.getAllRootWorkGroup();
		if(rootGroupList!=null && rootGroupList.size()>0){
			for(UserMaintenanceGroup group:rootGroupList){
				//生成当前根节点的树
				UserMaintenanceGroup root=workGroupDao.getByIdEager(group.getId());
				UserMaintenanceGroupTree tree= new UserMaintenanceGroupTree(root);
			    all.addAll(tree.showTree(root, "", ""));
			}
		}
		return all;
	}
	/**
	 * 工作组树型结构类
	 *
	 */
	class UserMaintenanceGroupTree{
		//根
		UserMaintenanceGroup root=null;
		//构造方法
		public UserMaintenanceGroupTree(UserMaintenanceGroup node) {
			this.root = node;
		}
		/**
	    test
	    ├1
	    │├目录1.txt
	    │├目录11
	    ││├111.txt
	    ││└112.txt
	    │└12
	    └test.pdf
	    */
	   /**
	    * @param root         当前正在被扫描的根文件
	    * @param childLeftStr 如果该文件有孩子，childLeftStr
	    *                     表示孩子节点的左面应该打印出来的结构性信息
	    *                     拿上面的例子来说，根结点test的孩子的左面的
	    *                     结构信息为"" 空，结点"目录11"的孩子的结构信息为"││",
	    * @param junction     结点图标，如果是该结点是它父亲的最后一个结点，
	    *                     则为"└",否则为"├".
	    */
	   public List<UserMaintenanceGroup> showTree(UserMaintenanceGroup root, String childLeftStr, String junction) {
		   
		   List<UserMaintenanceGroup> data=new ArrayList<UserMaintenanceGroup>();
		   //打印结点的信息
//	       System.out.println(junction + root.getWorkGroupName());
	       data.add(convert(root));
	       root=workGroupDao.getByIdEager(root.getId());
	       //如果有孩子， 而且孩子的数目不为0
	       if(root.getSubWorkGroup()!=null && root.getSubWorkGroup().size()!=0){
	    	   Set<UserMaintenanceGroup> subWorkGroups=root.getSubWorkGroup();
	    	   UserMaintenanceGroupTree[] children = new UserMaintenanceGroupTree[subWorkGroups.size()];
	    	   //Set转换成List便于操作
	    	   List<UserMaintenanceGroup> list=new ArrayList<UserMaintenanceGroup>();
				Iterator<UserMaintenanceGroup> ite=subWorkGroups.iterator();
				while(ite.hasNext()){
					list.add(ite.next());
				}
				//节点按名称排序
				Collections.sort(list,new Comparator<UserMaintenanceGroup>(){
					@Override
					public int compare(UserMaintenanceGroup group1,	UserMaintenanceGroup group2) {
						return group1.getWorkGroupName().compareTo(group2.getWorkGroupName());
					}
					
				});
				//构造孩子结点
	    	   for (int i = 0; i < list.size(); i++) {
	               children[i] = new UserMaintenanceGroupTree(list.get(i));
	           }
	    	   //打印孩子结点
	    	   for (int i = 0; i < children.length - 1; i++) {
	               //对所有的孩子结点，先打印出左边的结构信息，
//	               System.out.print(childLeftStr);
	               //递归调用showTree， 注意参数有所变化，文件加的深度增加的时候 ，它的孩子的结构信息也会
	               //增加，如果不是最后一个孩子，则结构信息需加上"│"。
	               
	               UserMaintenanceGroup parent=convert(children[i].root);
	               parent.setWorkGroupName(childLeftStr+"├"+parent.getWorkGroupName());
	               data.addAll(showTree(parent, childLeftStr + "│", "├"));
	           }
	           //最后一个孩子需要特殊处理
	           //打印结构信息
//	           System.out.print(childLeftStr);
	           //如果是最后一个孩子，则结构信息需加上" "。
	           //结点形状也调整为"└"
	           UserMaintenanceGroup parent2= convert(children[list.size() - 1].root);
	           parent2.setWorkGroupName(childLeftStr+"└"+parent2.getWorkGroupName());
	           data.addAll(showTree(parent2, childLeftStr + "　", "└"));
	       }
	       return data;
	   }
	   /**
	    * 对象转换，让PO脱离EntityManager,防止数据库写入
	    * @param src 源对象
	    * @return 目标对象
	    */
	   public UserMaintenanceGroup convert(UserMaintenanceGroup src){
		   UserMaintenanceGroup target=new UserMaintenanceGroup();
		   if(src!=null){
			   target.setId(src.getId());
			   target.setWorkGroupName(src.getWorkGroupName());
			   if(src.getWorkGroupMemo()!=null && src.getWorkGroupMemo().length()>0){
				   target.setWorkGroupMemo(src.getWorkGroupMemo());
			   }
		   }
		   return target;
	   }
	}
}
