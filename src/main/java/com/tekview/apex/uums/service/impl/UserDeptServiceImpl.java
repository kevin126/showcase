/******************************************************************************** 
 * Create Author   : Xiaojiapeng
 * Create Date     : Jan 24, 2011
 * File Name       : UserDeptServiceImpl.java
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
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tekview.apex.uums.base.OceanRuntimeException;
import com.tekview.apex.uums.base.criterion.Criteria;
import com.tekview.apex.uums.base.page.PageList;
import com.tekview.apex.uums.dao.UserDeptDao;
import com.tekview.apex.uums.model.User;
import com.tekview.apex.uums.model.UserDept;
import com.tekview.apex.uums.model.UserMaintenanceGroup;
import com.tekview.apex.uums.service.UserDeptService;
import com.tekview.apex.uums.service.impl.WorkGroupServiceImpl.UserMaintenanceGroupTree;


/**
 * 部门Service的实现类
 * @author Xiaojiapeng
 *
 */


@Service("userDeptService")
@Transactional
public class UserDeptServiceImpl implements UserDeptService {

	@Autowired
	private UserDeptDao userDeptDao;
	
	/**
     * 添加新部门
     * @param deptName 部门名称
     * @param deptMemo  部门备注
     * @param parentDeptId 上级部门ID
     * @param assUserId  资产审批负责人Id
     * @return 添加的结果
     */
	@Override
	public long addUserDept(String deptName, String deptMemo,
			String parentDeptId,Long assUserId) {
		UserDept dept=userDeptDao.getByName(deptName);
		if (dept!=null) {
			throw new OceanRuntimeException("dept.is.exist");
		}
		UserDept userDept = new UserDept();
		if(deptName!=null)
		userDept.setDeptName(deptName);
		
		if(deptMemo!=null)
		userDept.setDeptMemo(deptMemo);
		
		if(parentDeptId!=null&&!"".equals(parentDeptId))
		userDept.setParentUserDept(getById(Long.parseLong(parentDeptId)));
		
		if(assUserId!=null){
			User user = new User();
			user.setId(assUserId);
			userDept.setAssUser(user);
		}
		userDeptDao.save(userDept);
		return 1;
		
	}

	/**
     * 删除部门
     * @param deptName 部门名称
     */
	@Override
	public void deleteUserDept(String deptName) {
		UserDept userDept = (UserDept)userDeptDao.getUserDeptByName(deptName);		//根据部门名称获得部门信息
		if (userDept==null) {
			throw new OceanRuntimeException("exception.userDept.not.exists");
		}
		if(userDept.getId()==1){						//判断是否是默认部门
			throw new OceanRuntimeException("default.UserDept.not.delete");
		}
		List<UserDept> userDeptList = userDeptDao.getAllDeptByParentId(Long.toString(userDept.getId()));
		if(userDeptList.size()>0){			//判断部门下是否有子部门
			throw new OceanRuntimeException("has.sub.in.UserDept");
		}
		if(queryUsers(userDept.getId()).size()>0){		//判断部门下是否有用户
			throw new OceanRuntimeException("has.Users.in.UserDept");
		}
			
		userDeptDao.deleteUserDept(deptName);

	}

	 /**
     * 批量删除部门
     * @param id 批量删除的部门ID集合
     */
	@Override
	public void deleteUserDepts(List<String> id) {
		if(id!=null&&id.size()>0){
			for (String string : id) {
				UserDept userDept=userDeptDao.getById(Long.valueOf(string));
				if (userDept==null) {
					throw new OceanRuntimeException("exception.userDept.not.exists");
				}
				if (Long.parseLong(string)==1) {		//判断将要删除的集合中是否有默认部门
					throw new OceanRuntimeException("default.UserDept.not.delete");
				}
				
				List<UserDept> userDeptList = (List<UserDept>) userDeptDao.getAllDeptByParentId(string);
				
				if(userDeptList.size()>0){			//判断部门下时候有子部门
					throw new OceanRuntimeException("has.sub.in.UserDept");
				}
				if(queryUsers(Long.parseLong(string)).size()>0){	//判断部门下是否有用户
					throw new OceanRuntimeException("has.Users.in.UserDept");
				}
			}
		}
		for(int i=0;i<id.size();i++){
			delete(Long.parseLong(id.get(i)));
		}

	}

	/**
     * 查看父部门下的所有部门
     * @param parentId  父部门Id
     * @return 父部门下的所有子部门
     */
	@Override
	public List<UserDept> getAllDeptByParentId(String parentId) {
		List<UserDept> userDeptList = userDeptDao.getAllDeptByParentId(parentId);
		for (UserDept userDept : userDeptList) {
			if (userDept.getSubUserDepts().size()>0&&userDept.getSubUserDepts()!=null) {			//判断部门中是否有子部门
				userDept.setHasChild(true);
			}
		}
		return userDeptList;
	}

	/**
     * 查看部门用户
     *
     * @param deptId 部门标识
     * @return 部门下的用户列表
     */
	@Override
	public PageList<User> queryUsers(Long deptId,int start, int pageSize) {
		return userDeptDao.queryUsers(deptId,start,pageSize);
	}
	
	public List<User> queryUsers(Long deptId) {
		return userDeptDao.queryUsers(deptId);
	}

	 /**
     * 修改部门信息
     * @param deptId 部门ID
     * @param newDeptName 部门名称
     * @param deptMemo 描述
     * @param assUserId 资产审批负责人Id
     * @return 修改是否成功
     */
	@Override
	public boolean updateUserDept(String deptId, String newDeptName,
			String deptMemo,Long assUserId) {
		UserDept userDept = (UserDept)userDeptDao.getById(Long.parseLong(deptId));
		if(userDept==null)
			throw new OceanRuntimeException("exception.userDept.not.exists");
		//判断部门是否存在 先判断旧部门名称是否与新部门名称相同，相同则不进行判断
		if (!newDeptName.equals(userDept.getDeptName())) {
			UserDept dept=userDeptDao.getByName(newDeptName);
			if (dept!=null) {
				throw new OceanRuntimeException("dept.is.exist");
			}
		}
		if(newDeptName!=null){
			userDept.setDeptName(newDeptName);
		}
		if(deptMemo!=null){
			userDept.setDeptMemo(deptMemo);
		}
		if (assUserId!=null) {
			User user = new User();
			user.setId(assUserId);
			userDept.setAssUser(user);
		}

		userDeptDao.update(userDept);
		return true;
	}

	/**
	 * 根据部门Id删除部门
	 * @param 部门Id
	 */
	@Override
	public void delete(Long id) {
		userDeptDao.delete(id);

	}

	/**
	 * 根据部门Id查询部门信息
	 * @param 部门Id
	 * @return 部门
	 */
	@Override
	public UserDept getById(Long id) {
		UserDept userDept=userDeptDao.getById(id);
		return userDept;
		
	}

	/**
	 * 分页查询部门列表
	 * @param 查询条件
	 * @return 部门列表
	 */
	@Override
	public PageList<UserDept> queryByPage(Criteria criteria) {
		return userDeptDao.queryByPage(criteria);
	}

	/**
	 * 保存部门
	 * @param 部门
	 */
	@Override
	public void save(UserDept entity) {
		if(entity!=null)
			userDeptDao.save(entity);

	}

	/**
	 * 更新部门
	 * @param 部门
	 */
	@Override
	public void update(UserDept entity) {
		if(entity!=null)
		userDeptDao.update(entity);

	}
	/**
     * 通过部门名称查询部门
     *
     * @param deptName 部门名称
     * @return 部门信息
     */
    public UserDept getByName(String deptName){
    	return userDeptDao.getByName(deptName);
    }

	/* (non-Javadoc)
	 * @see com.tekview.apex.uums.service.UserDeptService#getByAll()
	 */
	@Override
	public List<UserDept> getByAll() {
		return userDeptDao.getAllDept();
	}

	@Override
	public List<Object> getAllUserDeptByParentId(String parentDeptId,int start,int limit) {
		return userDeptDao.getAllUserDeptByParentId(parentDeptId,start,limit);
	}

	@Override
	public int count(String parentId) {
		return userDeptDao.countEntitiesByPropNames(new String[]{"parentUserDept.id"}, new Object[]{parentId});
	}

	@Override
	public void addUserToDept(Long deptId, List<Long> userIds) {
		userDeptDao.addUserToDept(deptId, userIds);
		
	}

	@Override
	public void deleteUserDeptMember(Long deptId, List<Long> userIds) {
		userDeptDao.deleteUserDeptMember(deptId, userIds);
		
	}
	 /**
	 * 获取所有的部门树列表，名称加入标识
	 * @return 部门列表
	 */
	public List<UserDept> getAllUserDeptTree(){
		List<UserDept> all=new ArrayList<UserDept>();
		//获取所有的根用户组
		List<UserDept> rootUserDeptList=userDeptDao.getAllRootDept();
		if(rootUserDeptList!=null && rootUserDeptList.size()>0){
			for(UserDept userDept:rootUserDeptList){
				//生成当前根节点的树
				UserDept root=userDeptDao.getByIdEager(userDept.getId());
				UserDeptTree tree= new UserDeptTree(root);
			    all.addAll(tree.showTree(root, "", ""));
			}
		}
		return all;
	}
	/**
	 * 部门树型结构类
	 *
	 */
	class UserDeptTree{
		//根
		UserDept root=null;
		//构造方法
		public UserDeptTree(UserDept node) {
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
	   public List<UserDept> showTree(UserDept root, String childLeftStr, String junction) {
		   List<UserDept> data=new ArrayList<UserDept>();
	       data.add(convert(root));
	       root=userDeptDao.getByIdEager(root.getId());
	       //如果有孩子， 而且孩子的数目不为0
	       if(root.getSubUserDepts()!=null && root.getSubUserDepts().size()!=0){
	    	   Set<UserDept> subUserDepts=root.getSubUserDepts();
	    	   UserDeptTree[] children = new UserDeptTree[subUserDepts.size()];
	    	   //Set转换成List便于操作
	    	   List<UserDept> list=new ArrayList<UserDept>();
				Iterator<UserDept> ite=subUserDepts.iterator();
				while(ite.hasNext()){
					list.add(ite.next());
				}
				//节点按名称排序
				Collections.sort(list,new Comparator<UserDept>(){
					@Override
					public int compare(UserDept group1,	UserDept group2) {
						return group1.getDeptName().compareTo(group2.getDeptName());
					}
				});
				//构造孩子结点
	    	   for (int i = 0; i < list.size(); i++) {
	               children[i] = new UserDeptTree(list.get(i));
	           }
	    	   for (int i = 0; i < children.length - 1; i++) {
	    		   UserDept parent=convert(children[i].root);
	               parent.setDeptName(childLeftStr+"├"+parent.getDeptName());
	               //递归调用showTree， 注意参数有所变化，文件加的深度增加的时候 ，它的孩子的结构信息也会
	               //增加，如果不是最后一个孩子，则结构信息需加上"│"。
	               data.addAll(showTree(parent, childLeftStr + "│", "├"));
	    	   }
	    	   //最后一个孩子需要特殊处理
	    	   UserDept parent2= convert(children[list.size() - 1].root);
	           parent2.setDeptName(childLeftStr+"└"+parent2.getDeptName());
	           data.addAll(showTree(parent2, childLeftStr + "　", "└"));
	       }
	       return data;
	   }
	   /**
	    * 对象转换，让PO脱离EntityManager,防止数据库写入
	    * @param src 源对象
	    * @return 目标对象
	    */
	   public UserDept convert(UserDept src){
		   UserDept target=new UserDept();
		   if(src!=null){
			   target.setId(src.getId());
			   target.setDeptName(src.getDeptName());
			   if(src.getDeptMemo()!=null && src.getDeptMemo().length()>0){
				   target.setDeptMemo(src.getDeptMemo());
			   }
		   }
		   return target;
	   }
	}
}
