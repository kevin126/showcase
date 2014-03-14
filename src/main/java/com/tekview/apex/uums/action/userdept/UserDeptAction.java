/******************************************************************************** 
 * Create Author   : Xiaojiapeng
 * Create Date     : Jan 25, 2011
 * File Name       : UserDeptAction.java
 *
 * Apex CA是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.action.userdept;

import java.io.OutputStream;
import java.io.PrintWriter;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import jxl.Workbook;
import jxl.format.UnderlineStyle;
import jxl.write.Label;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
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
import com.tekview.apex.uums.model.UserDept;
import com.tekview.apex.uums.service.UserDeptService;
import com.tekview.apex.uums.service.UserService;

/**
 * 部门管理
 * 
 * @author Xiaojiapeng
 * 
 */
@Controller
@Scope("prototype")
@ParentPackage(value = "default")
@Results( {
		@Result(name = "success", location = "/WEB-INF/jsps/userdept/user-dept.jsp"),
		@Result(name = "doSuccess", location = "user-dept!list.action", type = "redirect"),
		@Result(name = "userList", location = "/WEB-INF/jsps/userdept/dept-member.jsp"),
		@Result(name = "importExcel", location = "/WEB-INF/jsps/userdept/import-user-dept.jsp") })
public class UserDeptAction extends BaseAction {
	private static final long serialVersionUID = 2716755043555705180L;

	@Autowired
	private UserDeptService userDeptService;
	@Autowired
	private UserService userService;

	private Long parentId; // 父部门Id
	private Long id; // 部门Id
	private UserDept userDept = new UserDept();
	private List<DeptVo> userDeptList = new ArrayList<DeptVo>();
	private List<UserDept> parentDept = new ArrayList<UserDept>(); // 父部门

	private String ids; // 部门Ids
	private String memberId;	//将要添加的部门用户成员Id

	private PageList<User> userList; // 封装部门用户

	public PageList<User> getUserList() {
		return userList;
	}

	public void setUserList(PageList<User> userList) {
		this.userList = userList;
	}

	public UserDept getUserDept() {
		return userDept;
	}

	public void setUserDept(UserDept userDept) {
		this.userDept = userDept;
	}

	public List<DeptVo> getUserDeptList() {
		return userDeptList;
	}

	public void setUserDeptList(List<DeptVo> userDeptList) {
		this.userDeptList = userDeptList;
	}
	
	/**
	 * 分层显示部门数据
	 * 
	 * @return
	 */
	public String list() throws Exception {
		// 获得父部门的id，如果id为空，则加载最高层的部门列表
		if (null != parentId && !"".equals(Long.toString(parentId)) && parentId!=0) {
			// 加载指定id下面的直接子部门
			userDept = userDeptService.getById(parentId);
			if (userDept==null) {
				throw new OceanRuntimeException("exception.userDept.not.exists");
			}
			// 当前部门

			List<UserDept> parentsNode = new ArrayList<UserDept>();
			List<UserDept> tempNode = new ArrayList<UserDept>();
			// 保存useDept对象，以便后面取用
			UserDept dept = userDept;
			// 循环获取所有的父辈节点,反过来拿节点
			while (userDept != null) {
				tempNode.add(userDept);
				userDept = userDept.getParentUserDept();
			}
			for (int i = tempNode.size(); i >= 1; i--) {
				parentsNode.add(tempNode.get(i - 1));
			}
			userDept = dept;
			List<Object> objList = userDeptService
					.getAllUserDeptByParentId(Long.toString(parentId),getOffset(),getPageSize());
			records=userDeptService.count(Long.toString(parentId));
			// 将获得的数据放入userDeptList
			if (objList != null && objList.size() > 0) {
				for (Object object : objList) {
					Object[] objects = (Object[]) object;
					if (objects != null && objects.length > 0) {
						DeptVo deptVo = new DeptVo();
						deptVo.setId(((BigInteger) objects[0]).longValue());
						deptVo.setDeptName((String) objects[1]);
						deptVo.setDeptMemo((String) objects[2]);
						User assUser = new User();
						if (objects[3] != null) {
							assUser
									.setId(((BigInteger) objects[3])
											.longValue());
							assUser.setName((String) objects[4]);
						}
						deptVo.setAssUser(assUser);
						deptVo.setCount(((BigInteger) objects[5]).intValue());
						//判断是否拥有子部门
						if (((BigInteger) objects[6]).intValue()>0) {
							deptVo.setHasChild(true);
						}else {
							deptVo.setHasChild(false);
						}
						userDeptList.add(deptVo);

					}
				}
			}
			parentDept = parentsNode;
		} else {
			// 加载最高层次的部门
			UserDept currentDept = new UserDept();
			String name = Version.getInstance().getCompany();
			currentDept.setDeptName(name);
			currentDept.setId(0);
			userDept = currentDept;
			parentDept = null;
			List<Object> objList = userDeptService
					.getAllUserDeptByParentId(null,getOffset(),getPageSize());
			records=userDeptService.count(null);
			// 将获得的数据放入userDeptList
			if (objList != null && objList.size() > 0) {
				for (Object object : objList) {
					Object[] objects = (Object[]) object;
					if (objects != null && objects.length > 0) {
						DeptVo deptVo = new DeptVo();
						deptVo.setId(((BigInteger) objects[0]).longValue());
						deptVo.setDeptName((String) objects[1]);
						deptVo.setDeptMemo((String) objects[2]);
						User assUser = new User();
						if (objects[3] != null) {
							assUser
									.setId(((BigInteger) objects[3])
											.longValue());
							assUser.setName((String) objects[4]);
						}
						deptVo.setAssUser(assUser);
						deptVo.setCount(((BigInteger) objects[5]).intValue());
						//判断是否拥有子部门
						if (((BigInteger) objects[6]).intValue()>0) {
							deptVo.setHasChild(true);
						}else {
							deptVo.setHasChild(false);
						}
						userDeptList.add(deptVo);

					}
				}
			}
		}

		return SUCCESS;
	}

	/**
	 * 添加或修改部门信息
	 * 
	 * @return
	 * @throws Exception
	 */
	public String addOrUpdateUserDept() throws Exception {
		if (userDept != null) {
			if (userDept.getId() > 0) { // 如果Id大于0 ，则为修改部门信息
				updateUserDept();
			} else {
				addUserDept();
			}
		}
		return list();
	}

	/**
	 * 添加新部门
	 * 
	 * @return
	 * @throws Exception
	 */
	public void addUserDept() throws Exception {
		if (parentId != null && !"".equals(parentId) && !"0".equals(parentId)) // parentId不为空，则说明添加的是子部门
			userDeptService.addUserDept(userDept.getDeptName(), userDept
					.getDeptMemo(), Long.toString(parentId), userDept
					.getAssUser().getId());
		else { // parentId为空，则说明添加的为高等级父部门
			userDeptService.addUserDept(userDept.getDeptName(), userDept
					.getDeptMemo(), null, userDept.getAssUser().getId());
		}
	}

	/**
	 * 修改部门信息
	 * 
	 * @return
	 * @throws Exception
	 */
	public void updateUserDept() throws Exception {
		if (userDept != null)
			userDeptService.updateUserDept(Long.toString(userDept.getId()),
					userDept.getDeptName(), userDept.getDeptMemo(), userDept
							.getAssUser().getId());
	}

	/**
	 * 进入编辑页面
	 * 
	 * @return
	 */
	public void enterUpdate() throws Exception {
		try {
			if (id != null) {
				userDept = userDeptService.getById(id);
			}
			if (userDept == null) {
				// 部门不存在或已被删除
				throw new OceanRuntimeException("exception.userDept.not.exists");
			}
			//转换为json数据，以方便在页面实现无刷新效果
			UserDept dept = new UserDept();
			dept.setId(userDept.getId());
			dept.setDeptName(userDept.getDeptName());
			dept.setDeptMemo(userDept.getDeptMemo());
			JSONArray jsonArray = JSONArray.fromObject(dept);
			if (userDept.getAssUser() != null) {
				User user = userService.getById(userDept.getAssUser().getId());
				User us = new User();
				us.setName(user.getName());
				us.setId(user.getId());
				jsonArray.add(1, JSONArray.fromObject(us));
			}
			response.setContentType("text/html;charset=utf-8");
			PrintWriter out = response.getWriter();
			out.print(jsonArray);
		} catch (OceanRuntimeException e) {
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
	 * 根据Id删除部门
	 * 
	 * @return
	 * @throws Exception
	 */
	public void deleteUserDeptById() throws Exception {
		try {
			List<String> ids = new ArrayList<String>();
			if (id != null) {
				ids.add(Long.toString(id));
			}
			userDeptService.deleteUserDepts(ids);
		} catch (OceanRuntimeException e) {
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
	 * 加载部门用户
	 * 
	 * @return
	 * @throws Exception
	 */
	public String showUser() throws Exception {
		if (id != null) {
			userDept = userDeptService.getById(id); // 查询部门详细信息
			int startIndex = this.getOffset();
			int limitIndex = this.getPageSize();

			userList = userDeptService.queryUsers(id, startIndex, limitIndex); // 查看部门用户
			Long totalCount = userList.getTotalCount();
			records = totalCount.intValue();
		}
		return "userList";
	}
	
	/**
	 * 向部门中添加成员，每个成员只允许在一个部门中
	 * @return
	 * @throws Exception
	 */
	public String addUserToDept() throws Exception{
		if (id == null || id.equals("") || id == 0L) {
			throw new OceanRuntimeException("要添加成员的部门标识不正确!");
		}
		//将成员Id转化为数组并遍历保存到集合中
		String[] userIds = memberId.split(",");	
		List<Long> memberIds = new ArrayList<Long>();
		for (String id : userIds) {
			memberIds.add(Long.valueOf(id.trim()));
		}
		userDeptService.addUserToDept(id, memberIds);
		return showUser();
	}
	
	public String deleteUserDeptMember() throws Exception{
		if (id == null || id.equals("") || id == 0L) {
			throw new OceanRuntimeException("要删除成员的部门标识不正确!");
		}
		//将成员Id转化为数组并遍历保存到集合中
		//为一次删除多个成员预留
		String[] userIds = memberId.split(",");	
		List<Long> memberIds = new ArrayList<Long>();
		for (String id : userIds) {
			memberIds.add(Long.valueOf(id.trim()));
		}
		userDeptService.deleteUserDeptMember(id, memberIds);
		return showUser();
	}

	/**
	 * 导出选定部门
	 * 
	 * @throws Exception
	 */
	public void exportExcel() throws Exception {
		request.setCharacterEncoding("UTF-8");
		response.setContentType("application/vnd.ms-excel");
		response.setHeader("Content-disposition",
				"attachment;filename=export.xls");

		List<String> sheetColumn = new ArrayList<String>();
		sheetColumn.add("部门名称");
		sheetColumn.add("部门描述");
		sheetColumn.add("父部门Id");
		sheetColumn.add("父部门名称");

		List<UserDept> sheetData = new ArrayList<UserDept>();
		if (ids != null && !"".equals(ids)) {
			String[] idsArray = ids.split(",");
			for (String string : idsArray) {
				if (!string.trim().equals("on")) {
					UserDept dept = userDeptService.getById(Long.valueOf(string
							.trim()));
					if (dept != null) {
						sheetData.add(dept);
					}
				}

			}
		}
		exportExcelToStream("部门列表", sheetData, sheetColumn, response
				.getOutputStream());
	}

	/**
	 * 导出所有部门
	 * 
	 * @throws Exception
	 */
	public void exportExcelAll() throws Exception {
		request.setCharacterEncoding("UTF-8");
		response.setContentType("application/vnd.ms-excel");
		response.setHeader("Content-disposition",
				"attachment;filename=export.xls");

		List<String> sheetColumn = new ArrayList<String>();
		sheetColumn.add("部门名称");
		sheetColumn.add("部门描述");
		sheetColumn.add("父部门Id");
		sheetColumn.add("父部门名称");
		List<UserDept> sheetData = userDeptService.getByAll();
		exportExcelToStream("部门列表", sheetData, sheetColumn, response
				.getOutputStream());
	}

	/**
	 * 输出Excel到文件流
	 * 
	 * @param sheetName
	 *            sheet名称
	 * @param sheetData
	 *            将要导出的数据
	 * @param sheetColumn
	 *            列名
	 * @param outStream
	 * @return
	 */
	public static boolean exportExcelToStream(String sheetName,
			List<UserDept> sheetData, List<String> sheetColumn,
			OutputStream outStream) {
		if (StringUtils.isNotEmpty(sheetName) && sheetData != null
				&& sheetData.size() > 0 && sheetColumn != null
				&& sheetColumn.size() > 0 && outStream != null) {
			try {
				WritableWorkbook workbook = Workbook.createWorkbook(outStream);
				WritableSheet sheet = workbook.createSheet(sheetName, 0);
				sheet.setName(sheetName);
				WritableFont wfc = new WritableFont(WritableFont.ARIAL, 11,
						WritableFont.BOLD, false, UnderlineStyle.NO_UNDERLINE,
						jxl.format.Colour.BLACK);
				WritableCellFormat wcfFC = new WritableCellFormat(wfc);
				int columnCount = sheetColumn.size();
				for (int index = 0; index < columnCount; index++) {
					Label label = new Label(index, 0, sheetColumn.get(index),
							wcfFC);
					sheet.addCell(label);
				}
				int rows = sheetData.size();
				for (int row = 1; row <= rows; row++) {
					for (int column = 0; column < columnCount; column++) {
						String value = "";
						if ("".equals(value.trim())) {
							value = sheetData.get(row - 1).columnValue(
									sheetColumn.get(column));
						}
						Label label = new Label(column, row, value);
						sheet.addCell(label);
					}
				}
				workbook.write();
				workbook.close();
				outStream.flush();
				return true;
			} catch (Exception exp) {
				exp.printStackTrace();
				return false;
			}
		} else {
			return false;
		}
	}

	public String enterImport() throws Exception {
		return "importExcel";
	}

	public UserDeptService getUserDeptService() {
		return userDeptService;
	}

	public void setUserDeptService(UserDeptService userDeptService) {
		this.userDeptService = userDeptService;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

	public List<UserDept> getParentDept() {
		return parentDept;
	}

	public void setParentDept(List<UserDept> parentDept) {
		this.parentDept = parentDept;
	}

	public String getIds() {
		return ids;
	}

	public void setIds(String ids) {
		this.ids = ids;
	}

	public UserService getUserService() {
		return userService;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	public String getMemberId() {
		return memberId;
	}

	public void setMemberId(String memberId) {
		this.memberId = memberId;
	}


}
