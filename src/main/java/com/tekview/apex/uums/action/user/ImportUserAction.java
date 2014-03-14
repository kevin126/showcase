package com.tekview.apex.uums.action.user;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;
import jxl.format.Colour;
import jxl.format.UnderlineStyle;
import jxl.write.Label;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

import org.apache.commons.lang.StringUtils;
import org.apache.struts2.convention.annotation.InterceptorRef;
import org.apache.struts2.convention.annotation.InterceptorRefs;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.tekview.apex.itsm.common.enums.UserExcelTemplateEnum;
import com.tekview.apex.itsm.common.util.SysUtil;
import com.tekview.apex.platform.mail.Email;
import com.tekview.apex.platform.mail.EmailDispatcher;
import com.tekview.apex.uums.base.OceanRuntimeException;
import com.tekview.apex.uums.constants.CAConstants;
import com.tekview.apex.uums.core.web.action.BaseAction;
import com.tekview.apex.uums.model.User;
import com.tekview.apex.uums.service.UserService;

@Controller
@Scope("prototype")
@ParentPackage(value = "default")
@Results( {
		@Result(name = "enterBatch", location = "/WEB-INF/jsps/user/batch-import-user.jsp")
})
public class ImportUserAction extends BaseAction {

	private static final long serialVersionUID = 8889305875611362942L;
	private File attachment;
	private String comments;
	private String type;
	private String code;
	
	@Autowired
	private EmailDispatcher emailDispatcher;
	
	public String getComments() {
		return comments;
	}
	
	public void setComments(String comments) {
		this.comments = comments;
	}
	
	public String getCode() {
		return code;
	}
	
	public void setCode(String code) {
		this.code = code;
	}
	 public void reset() { 
		 attachment = null; 
		 comments = null; 
		 code = request.getParameter("ISSUE_CODE"); 
		 if(!StringUtils.isEmpty(code)){
			 type = code.split("-")[0];
		 }
	  }

	
	public File getAttachment() {
		return attachment;
	}

	
	public void setAttachment(File attachment) {
		this.attachment = attachment;
	}

	
	public String getType() {
		return type;
	}

	
	public void setType(String type) {
		this.type = type;
	} 

	
	
	
	
	
	
//	@Autowired
//	private RoleService roleService;
//	@Autowired
//	private WorkGroupService workGroupService;
//	@Autowired
//	private UserDeptService userDeptService;
	@Autowired
	private UserService userService;
	
	
	
	
	
	private final static String importMsg = "importMsg";
	private final static String[] reg = {"/", "<", "&", ">", "'", "\"", "\\", "  " };
	private final static String regMail = "^(\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+)?$";
	private final static String regMobile="^(((13[0-9])|(15[^4，\\D])|(18[0，5-9]))\\d{8})?$";
	private final static String regexpName="^[0-9|a-zA-Z|_]{1,20}$";
	
	private Workbook workbook = null;
//	/**
//	 * 用来记忆已经查询过的部门名称，免得每次都要查
//	 */
//	private Map<String, UserDept> rememberDept = new HashMap<String, UserDept>();
//	/**
//	 * 用来记忆已经查询过的工作组名称，免得每次都要查
//	 */
//	private Map<String, UserMaintenanceGroup> rememberGroup = new HashMap<String, UserMaintenanceGroup>();
//	/**
//	 * 记录系统已经存在的所有的角色
//	 */
//	private Map<String, Role> allRoles = new HashMap<String, Role>();
//	/**
//	 * 系统名称
//	 */
//	private Map<String, String> operatorNames = new HashMap<String, String>();
	
	/**
	 * 记录导入的所有用户数据
	 */
	private List<User> userList=new ArrayList<User>();


	/**
	 * 得到导入用户的excel模板
	 * @throws Exception
	 */
	public void getTemplate() throws Exception{
		response.setContentType("application/vnd.ms-excel");
		response.setHeader("Content-disposition",
				"attachment;filename=addUserTemplate.xls");
		try {
			WritableWorkbook workbookTemplate = Workbook.createWorkbook(response
					.getOutputStream());
			WritableSheet sheet = workbookTemplate.createSheet("sheet1", 0);
			List<UserExcelTemplateEnum> allColumn = UserExcelTemplateEnum
					.allValues();
			if (allColumn != null && allColumn.size() > 0) {
				for (int i = 0; i < allColumn.size(); i++) {
					String name = allColumn.get(i).getValue();
					if (name.equals(UserExcelTemplateEnum.NAME.getValue()) || name.equals(UserExcelTemplateEnum.REALNAME.getValue()) || 
							name.equals(UserExcelTemplateEnum.MAIL.getValue()) || name.equals(UserExcelTemplateEnum.MOBILE.getValue())) {
						WritableFont wf_color = new WritableFont(WritableFont.ARIAL,10,WritableFont.NO_BOLD,false,UnderlineStyle.NO_UNDERLINE,Colour.RED); 
						WritableCellFormat wff_color = new WritableCellFormat(wf_color); 
						Label label = new Label(i, 0, name,wff_color);
						sheet.addCell(label);
					}else{
						Label label = new Label(i, 0, name);
						sheet.addCell(label);
					}
				}
			}
			workbookTemplate.write();
			workbookTemplate.close();
			response.getOutputStream().flush();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 进入批量导入用户的界面
	 * @return
	 * @throws Exception
	 */
	public String enterBatch() throws Exception{
		return "enterBatch";
	}
	
	/**
	 * 实施批量导入用户
	 * @return
	 * @throws Exception
	 */
	public String batchImport() throws Exception{
		if (attachment==null) {
			throw new OceanRuntimeException("请选择需要导入的EXCEL文件！");
		}
		InputStream is = new FileInputStream(attachment);
		try {
			workbook = Workbook.getWorkbook(is);
		} catch (Exception e) {
			if (workbook != null)
				workbook.close();
			request.setAttribute(importMsg, "只能导入EXCEL格式的文件！请选择正确的EXCEL文件！");
			attachment=null;
			return "enterBatch";
		}
//		if (workbook.getSheets().length > 0) {
//			if (workbook.getSheets()[0].getRows() > 1) {
//				// 有记录值，则加载所有的角色，之后就不用再加载了
//				List<Role> allRole = roleService.getAllRoles();
//				for (Role role : allRole) {
//					allRoles.put(role.getRoleName(), role);
//				}
//				// 加载系统名称
//				Vector<SystemNameEnum> listName = SystemNameEnum.allValues();
//				for (SystemNameEnum name : listName) {
//					operatorNames.put(name.getValue(), name.getValue());
//				}
//			}
//		}
		for (int sheetIndex=0;sheetIndex<workbook.getSheets().length;sheetIndex++ ) {
			Sheet currentSheet=workbook.getSheets()[sheetIndex];
			int rows = currentSheet.getRows();
			int cols = currentSheet.getColumns();
			if (rows > 1 && cols > 0) {
				User user;
				for (int row = 1; row < rows; row++) {
					int errorTipRowNum=row+1; //错误提示行数
					user = new User();
					for (int col = 0; col < cols; col++) {
						String columnValue = SysUtil.HtmlToText(currentSheet.getCell(
								col, row).getContents().trim()).trim();
						String columTitle = currentSheet.getCell(col, 0).getContents();
						if (UserExcelTemplateEnum.ADRESS.getValue().equals(
								columTitle)) {
							// 长度范围0-100
							if (columnValue.length() > 100) {
								request.setAttribute(importMsg,UserExcelTemplateEnum.ADRESS.getValue()+ "最大长度为100字符，错误发生在" + (errorTipRowNum)+ "行" + (col+1) + "列！");
								return "enterBatch";
							}
							boolean isMatch = SysUtil.hasChar(columnValue, reg);
							if (isMatch) {
								request.setAttribute(importMsg,UserExcelTemplateEnum.ADRESS.getValue()+ "不能包含/，&，\\，|，<，>，\'，\"，连续的2个空格，错误发生在"+ (errorTipRowNum)+ "行"+ (col+1) + "列！");
								return "enterBatch";
							}
							user.setAddress(columnValue);
						}  else if (UserExcelTemplateEnum.CITY.getValue()
								.equals(columTitle)) {
							// 0-10
							if (columnValue.length() > 10) {
								request.setAttribute(importMsg,UserExcelTemplateEnum.CITY.getValue()+ "最大长度为10字符，错误发生在" + (errorTipRowNum)+ "行" + (col+1) + "列！");
								return "enterBatch";
							}

							boolean isMatch = SysUtil.hasChar(columnValue, reg);
							if (isMatch) {
								request
										.setAttribute(
												importMsg,
												UserExcelTemplateEnum.CITY
														.getValue()
														+ "不能包含/，&，\\，|，<，>，\'，\"，连续的2个空格，错误发生在"
														+ (errorTipRowNum)
														+ "行"
														+ (col+1) + "列！");
								return "enterBatch";
							}
							user.setCity(columnValue);
						} else if (UserExcelTemplateEnum.COUNTRY.getValue()
								.equals(columTitle)) {
							// 1-10
							if (columnValue.length() > 10) {
								request.setAttribute(importMsg,
										UserExcelTemplateEnum.COUNTRY
												.getValue()
												+ "最大长度为10字符，错误发生在"
												+ (errorTipRowNum)
												+ "行" + (col+1) + "列！");
								return "enterBatch";
							}

							boolean isMatch = SysUtil.hasChar(columnValue, reg);
							if (isMatch) {
								request
										.setAttribute(
												importMsg,
												UserExcelTemplateEnum.COUNTRY
														.getValue()
														+ "不能包含/，&，\\，|，<，>，\'，\"，连续的2个空格，错误发生在"
														+ (errorTipRowNum)
														+ "行"
														+ (col+1) + "列！");
								return "enterBatch";
							}
							user.setCountry(columnValue);
						}else if (UserExcelTemplateEnum.EMLPOYEENO.getValue()
								.equals(columTitle)) {
							// 1-30
							if (columnValue.length() > 30) {
								request.setAttribute(importMsg,
										UserExcelTemplateEnum.EMLPOYEENO
												.getValue()
												+ "最大长度为30字符，错误发生在"
												+ (errorTipRowNum)
												+ "行" + (col+1) + "列！");
								return "enterBatch";
							}

							boolean isMatch = SysUtil.hasChar(columnValue, reg);
							if (isMatch) {
								request
										.setAttribute(
												importMsg,
												UserExcelTemplateEnum.EMLPOYEENO
														.getValue()
														+ "不能包含/，&，\\，|，<，>，\'，\"，连续的2个空格，错误发生在"
														+ (errorTipRowNum)
														+ "行"
														+ (col+1) + "列！");
								return "enterBatch";
							}
							user.setEmployeeNo(columnValue);
						} else if (UserExcelTemplateEnum.FAX.getValue().equals(
								columTitle)) {
							// 1-50
							if (columnValue.length() > 50) {
								request.setAttribute(importMsg,
										UserExcelTemplateEnum.FAX.getValue()
												+ "最大长度为50字符，错误发生在" + (errorTipRowNum)
												+ "行" + (col+1) + "列！");
								return "enterBatch";
							}

							boolean isMatch = SysUtil.hasChar(columnValue, reg);
							if (isMatch) {
								request
										.setAttribute(
												importMsg,
												UserExcelTemplateEnum.FAX
														.getValue()
														+ "不能包含/，&，\\，|，<，>，\'，\"，连续的2个空格，错误发生在"
														+ (errorTipRowNum)
														+ "行"
														+ (col+1) + "列！");
								return "enterBatch";
							}

							user.setFax(columnValue);
						} else if (UserExcelTemplateEnum.INTERNETACCOUNT
								.getValue().equals(columTitle)) {

							// 1-30
							if (columnValue.length() > 30) {
								request.setAttribute(importMsg,
										UserExcelTemplateEnum.INTERNETACCOUNT
												.getValue()
												+ "最大长度为30字符，错误发生在"
												+ (errorTipRowNum)
												+ "行" + (col+1) + "列！");
								return "enterBatch";
							}

							boolean isMatch = SysUtil.hasChar(columnValue, reg);
							if (isMatch) {
								request
										.setAttribute(
												importMsg,
												UserExcelTemplateEnum.INTERNETACCOUNT
														.getValue()
														+ "不能包含/，&，\\，|，<，>，\'，\"，连续的2个空格，错误发生在"
														+ (errorTipRowNum)
														+ "行"
														+ (col+1) + "列！");
								return "enterBatch";
							}

							user.setInternetAccount(columnValue);
						} else if (UserExcelTemplateEnum.MAIL.getValue()
								.equals(columTitle)) {
							// 1-50
							if (columnValue.length() > 50||columnValue.length()<1) {
								request.setAttribute(importMsg,
										UserExcelTemplateEnum.MAIL.getValue()
												+ "长度范围为1-50字符，错误发生在" + (errorTipRowNum)
												+ "行" + (col+1) + "列！");
								return "enterBatch";
							}

							boolean isMatch = SysUtil.match(regMail,
									columnValue);
							if (!isMatch) {
								request.setAttribute(importMsg,
										UserExcelTemplateEnum.MAIL.getValue()
												+ "格式错误，错误发生在" + (errorTipRowNum)
												+ "行" + (col+1) + "列！");
								return "enterBatch";
							}
							//判定邮件地址是否存在
							User sameMailUser=userService.getByMail(columnValue);
							if(sameMailUser!=null){
								request.setAttribute(importMsg,"新用户 电子邮件"+columnValue+"已经存在，错误发生在" + (errorTipRowNum)	+ "行" + (col+1) + "列！");
								return "enterBatch";
							}
							user.setMail(columnValue);
						} else if (UserExcelTemplateEnum.MOBILE.getValue()
								.equals(columTitle)) {

							// 11-50
							if (columnValue.length() > 50 || columnValue.length() < 11) {
								request.setAttribute(importMsg,
										UserExcelTemplateEnum.MOBILE.getValue()
												+ "长度范围为11-50字符，错误发生在" + (errorTipRowNum)
												+ "行" + (col+1) + "列！");
								return "enterBatch";
							}

							boolean isMatch = SysUtil.match(regMobile, columnValue);
							if (!isMatch) {
								request
										.setAttribute(
												importMsg,
												UserExcelTemplateEnum.MOBILE
														.getValue()
														+ "手机格式错误，错误发生在" + (errorTipRowNum)
														+ "行" + (col+1) + "列！");
								return "enterBatch";
							}

							user.setMobile(columnValue);
						} else if (UserExcelTemplateEnum.MSN.getValue().equals(
								columTitle)) {
							// 1-50
							if (columnValue.length() > 50) {
								request.setAttribute(importMsg,
										UserExcelTemplateEnum.MSN.getValue()
												+ "最大长度为50字符，错误发生在" + (errorTipRowNum)
												+ "行" + (col+1) + "列！");
								return "enterBatch";
							}

							boolean isMatch = SysUtil.hasChar(columnValue, reg);
							if (isMatch) {
								request
										.setAttribute(
												importMsg,
												UserExcelTemplateEnum.MSN
														.getValue()
														+ "不能包含/，&，\\，|，<，>，\'，\"，连续的2个空格，错误发生在"
														+ (errorTipRowNum)
														+ "行"
														+ (col+1) + "列！");
								return "enterBatch";
							}
							user.setMsn(columnValue);
						} else if (UserExcelTemplateEnum.NAME.getValue()
								.equals(columTitle)) {
							// 长度1-20
							if (columnValue.length() > 20
									|| columnValue.length() < 1) {
								request.setAttribute(importMsg,
										"用户名长度为1-20字符，错误发生在" + (errorTipRowNum) + "行"
												+ (col+1) + "列！");
								return "enterBatch";
							}
							boolean isMatch = SysUtil.match(regexpName , columnValue);
							if (!isMatch) {
								request
										.setAttribute(
												importMsg,
												UserExcelTemplateEnum.NAME
														.getValue()
														+ "只能输入字母，数字，下划线，错误发生在"
														+ (errorTipRowNum)
														+ "行"
														+ (col+1) + "列！");
								return "enterBatch";
							}
							long id=0;
							if (userService.getByName(columnValue)!=null) {
								id = userService.getByName(columnValue).getId();
							}
							if (id > 0) {
								request.setAttribute(importMsg, "“"
										+ columnValue + "”用户名已经存在，错误发生在"
										+ (errorTipRowNum) + "行" + (col+1) + "列！");
								return "enterBatch";
							} else {
								user.setName(columnValue);
							}
						} else if (UserExcelTemplateEnum.OFFICE.getValue()
								.equals(columTitle)) {
							// 1-50
							if (columnValue.length() > 50) {
								request.setAttribute(importMsg,
										UserExcelTemplateEnum.OFFICE.getValue()
												+ "最大长度为50字符，错误发生在" + (errorTipRowNum)
												+ "行" + (col+1) + "列！");
								return "enterBatch";
							}

							boolean isMatch = SysUtil.hasChar(columnValue, reg);
							if (isMatch) {
								request
										.setAttribute(
												importMsg,
												UserExcelTemplateEnum.OFFICE
														.getValue()
														+ "不能包含/，&，\\，|，<，>，\'，\"，连续的2个空格，错误发生在"
														+ (errorTipRowNum)
														+ "行"
														+ (col+1) + "列！");
								return "enterBatch";
							}
							user.setOffice(columnValue);
						}else if (UserExcelTemplateEnum.REALNAME.getValue()
								.equals(columTitle)) {
							// 2-20
							if (columnValue.length() > 20
									|| columnValue.length() < 2) {
								request.setAttribute(importMsg,
										UserExcelTemplateEnum.REALNAME
												.getValue()
												+ "长度范围为2-20字符，错误发生在"
												+ (errorTipRowNum)
												+ "行"
												+ (col )
												+ "列！");
								return "enterBatch";
							}

							boolean isMatch = SysUtil.hasChar(columnValue, reg);
							if (isMatch) {
								request
										.setAttribute(
												importMsg,
												UserExcelTemplateEnum.REALNAME
														.getValue()
														+ "不能包含/，&，\\，|，<，>，\'，\"，连续的2个空格，错误发生在"
														+ (errorTipRowNum)
														+ "行"
														+ (col+1) + "列！");
								return "enterBatch";
							}

							user.setRealName(columnValue);
						} else if (UserExcelTemplateEnum.TASKNOTIFIER
								.getValue().equals(columTitle)) {
							// 0-255
							if (columnValue.length() > 255) {
								request.setAttribute(importMsg,
										UserExcelTemplateEnum.TASKNOTIFIER
												.getValue()
												+ "最大长度为255字符，错误发生在"
												+ (errorTipRowNum)
												+ "行"
												+ (col )
												+ "列！");
								return "enterBatch";
							}

							boolean isMatch = SysUtil.hasChar(columnValue, reg);
							if (isMatch) {
								request
										.setAttribute(
												importMsg,
												UserExcelTemplateEnum.TASKNOTIFIER
														.getValue()
														+ "不能包含/，&，\\，|，<，>，\'，\"，连续的2个空格，错误发生在"
														+ (errorTipRowNum)
														+ "行"
														+ (col+1) + "列！");
								return "enterBatch";
							}

							user.setTaskNotifier(columnValue);
						}else if (UserExcelTemplateEnum.ZIPCODE.getValue()
								.equals(columTitle)) {
							// 0-20
							if (columnValue.length() > 20) {
								request.setAttribute(importMsg,
										UserExcelTemplateEnum.ZIPCODE
												.getValue()
												+ "最大长度为20字符，错误发生在"
												+ (errorTipRowNum)
												+ "行" + (col+1) + "列！");
								return "enterBatch";
							}

							boolean isMatch = SysUtil.hasChar(columnValue, reg);
							if (isMatch) {
								request
										.setAttribute(
												importMsg,
												UserExcelTemplateEnum.ZIPCODE
														.getValue()
														+ "不能包含/，&，\\，|，<，>，\'，\"，连续的2个空格，错误发生在"
														+ (errorTipRowNum)
														+ "行"
														+ (col+1) + "列！");
								return "enterBatch";
							}
							user.setZipCode(columnValue);
						}else if (UserExcelTemplateEnum.QQ.getValue().equals(columTitle)) {
							if (columnValue.length() > 20) {
								request.setAttribute(importMsg,
										UserExcelTemplateEnum.QQ
												.getValue()
												+ "最大长度为20字符，错误发生在"
												+ (errorTipRowNum)
												+ "行" + (col+1) + "列！");
								return "enterBatch";
							}

							boolean isMatch = SysUtil.isNumeric(columnValue);
							if (!isMatch) {
								request.setAttribute(
												importMsg,
												UserExcelTemplateEnum.QQ
														.getValue()
														+ "号必须为数字，错误发生在"
														+ (errorTipRowNum)
														+ "行"
														+ (col+1) + "列！");
								return "enterBatch";
							}
							user.setQq(columnValue);
						} else {
							request.setAttribute(importMsg, "模板未提供  "
									+ columTitle + "  列，请按参考模板填写！");
							return "enterBatch";
						}

					}
					// 在方法里面进行特殊字符判断，长字符判断
					try {
						// 设置用户密码为系统初始化密码
						user
								.setPassword(SysUtil
										.encodeBase64("11111111"));
						//设置创建时间
						user.setCreateTime(System.currentTimeMillis());
						user.setEnabled(1);		//启用
						userService.batchAddUser(user);
						//将新添加的数据记录到userList中
						User dBUser = userService.getByName(user.getName());
						emailDispatcher.dispatchMail(new Email(CAConstants.MAIL_PREFIX_ADD_USER,String.valueOf(user.getId())));
						userList.add(dBUser);
					} catch (Exception e) {
						request.setAttribute(importMsg, "添加数据出现异常！");
						return "enterBatch";
					}
				}
			} else {
				request.setAttribute(importMsg, "EXCEL表格中没有记录，请添加数据！");
				return "enterBatch";
			}
		}
		request.setAttribute(importMsg, "导入成功！");
		return "enterBatch";
	}

	/**
	 * 获得自定行的制定列属性值
	 * @param sheetIndex 第几页
	 * @param rowIndex 第几行
	 * @param title 哪一列
	 * @return
	 */
	public String getValueByRowAndTitle(int sheetIndex,int rowIndex,String title){
		Cell[] templeteTiltes=workbook.getSheets()[sheetIndex].getRow(0);
		int columnIndex=0;
		//先取出名为title的列值
		for(Cell tempTitle:templeteTiltes){
			if(tempTitle.getContents().equals(title)){
				columnIndex=tempTitle.getColumn();
				break;
			}
		}
		return workbook.getSheets()[sheetIndex].getCell(columnIndex, rowIndex).getContents().trim();
	}

	public UserService getUserService() {
		return userService;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	public List<User> getUserList() {
		return userList;
	}

	public void setUserList(List<User> userList) {
		this.userList = userList;
	}
}
