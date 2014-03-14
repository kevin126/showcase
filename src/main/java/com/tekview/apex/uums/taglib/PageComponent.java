/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 14, 2011
 * File Name       : PageComponent.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.taglib;

import java.io.IOException;
import java.io.Writer;
import java.net.URLEncoder;
import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.components.Component;

import com.opensymphony.xwork2.util.ValueStack;
/**
 * 分页组件
 */
public class PageComponent extends Component {
	/** 当前页 */
	private String currentPage;

	/** 每页显示多少条 */
	private String pageSize;

	/** 总记录数 */
	private String records;

	/** url */
	private String url;

	private ValueStack vs;

	public PageComponent(ValueStack stack) {
		super(stack);
		vs = stack;
	}
	public boolean start(Writer writer) {  
			boolean result = super.start(writer);
			try{
				
				HttpServletRequest request = ServletActionContext.getRequest();
				Enumeration names=(Enumeration)request.getParameterNames();
				String paramName = null;
				String[] values = null;
				StringBuffer pars = new StringBuffer();
				while(names.hasMoreElements())     {   
					paramName=(String)names.nextElement();
					values = request.getParameterValues(paramName);
					if(!paramName.equals("currentPage") && !paramName.equals("pageSize") && !paramName.equals("records")){
						pars.append("&");
						pars.append(paramName);
						pars.append("=");
						pars.append(URLEncoder.encode(values[0],"utf-8"));
					}
				}			
				//当前页
				int startPage = Integer.parseInt(currentPage);
				//每页显示多少条
				int pageSiz = Integer.parseInt(pageSize);
				//总记录数
				int totalCount = Integer.parseInt(records);
				int totalPage = 0;
				if(totalCount % pageSiz == 0){
					totalPage = totalCount / pageSiz;
				}else{
					totalPage = totalCount / pageSiz + 1;
				}
				StringBuffer sb = new StringBuffer();
				//printScript(pageSiz,startPage,totalPage,sb);
				printJs(pageSiz,startPage,totalPage,sb,pars);
				writePagerByForm(startPage,totalPage,totalCount,sb,pars);
				writer.write(sb.toString());
				
			}catch(IOException e){
				e.printStackTrace();
			}
			return result;
		}
	private void printJs(int pageSize, int pageNo, int totalPage, StringBuffer sb,StringBuffer pars) {
		sb.append("<script>").append("\n");
		sb.append("function goToPage(destPage){").append("\n");
		sb.append("var reg=/^[1-9]+[0-9]*$/;//以1-9开头，后面为任意数字").append("\n");
		sb.append("var result =  reg.test(destPage);").append("\n");
		//sb.append("alert(result);").append("\n");
		sb.append("if(!result){").append("\n");
		sb.append("		if(Ext.MessageBox){Ext.MessageBox.show({title: '警告',msg: '请输入大于零的整数！',buttons : Ext.MessageBox.OK,icon : Ext.MessageBox.WARNING,fn : function(returnValue) {document.getElementById('destPage').focus();}});}else{alert('请输入大于零的整数！'); }").append("\n");
		sb.append("		document.getElementById('destPage').value='';").append("\n");
		sb.append("		return;").append("\n");
		sb.append("}").append("\n");
		sb.append("if(destPage>"+totalPage+"){").append("\n");
		sb.append("  destPage="+totalPage+";").append("\n");
		sb.append("}").append("\n");
		sb.append("window.location.href='"+url+"?currentPage='+"+"destPage"+"+'&pageSize="+pageSize+"&records="+Integer.parseInt(records)+pars).append("';\n");
		sb.append("}").append("\n");
		sb.append("function changePageSize(pageSize){").append("\n");
		sb.append("window.location.href='"+url+"?&pageSize='+"+"pageSize"+"+'&records="+Integer.parseInt(records)+pars).append("';\n");
		sb.append("}").append("\n");
		sb.append("</script>").append("\n");
	}
	private void writePagerByForm(int pageNo, int totalPage, int totalSize, StringBuffer sb,StringBuffer pars) {
		if (totalPage > 0) {
			sb.append("<div class=\"fenye_css\">").append("\n");
			sb.append("		<div class=\"fenye_coun\">").append("\n");
			sb.append("		<h1> 页数："+ pageNo +"/"+ totalPage +"页  总计："+ totalSize +"条数据 </h1>").append("\n");
			sb.append("		 <h2> ").append("\n");
			if (pageNo == 1)
				sb.append("<span onmouseout=\"this.className='h2_span'\"  class=\"h2_span\">" +
						"<i><a title='' href=\"javascript:void(0);\" ><img height=\"10\" width=\"5\" class=\"feng_img\" src=\"../images/cmdb_n/vf2.gif\"/><img height=\"10\" width=\"5\" class=\"feng_img\" src=\"../images/cmdb_n/vf2.gif\"/></a></i></span>").append("\n");
			else {
				sb.append("<span onmouseout=\"this.className='h2_span'\" onmouseover=\"this.className='h2_span_on'\" class=\"h2_span\">" +
						"<i><a title='' href=\""+url+"?currentPage="+1+"&pageSize="+Integer.parseInt(pageSize)+"&records="+Integer.parseInt(records)+pars+"\"><img height=\"10\" width=\"5\" class=\"feng_img\" src=\"../images/cmdb_n/vf2.gif\"/><img height=\"10\" width=\"5\" class=\"feng_img\" src=\"../images/cmdb_n/vf2.gif\"/></a></i></span>").append("\n");
			}
			int outPutPages = 7;
			int displayPages = (totalPage > outPutPages) ? outPutPages : totalPage;
			if (pageNo >= outPutPages) {
				int lastDisplayPage = (pageNo + 4 >= totalPage) ? totalPage : pageNo + 4;
				for (int i = pageNo - 3; i < lastDisplayPage; ++i)
					if (i + 1 == pageNo) {
						sb.append("<span  class=\"h2_span_on\"><i>"+(i + 1)+"</i></span>").append("\n");
					} else
						sb.append("<span onmouseout=\"this.className='h2_span'\" onmouseover=\"this.className='h2_span_on'\" class=\"h2_span\"><a href=\""+url+"?currentPage="+(i+1)+"&pageSize="+Integer.parseInt(pageSize)+"&records="+Integer.parseInt(records)+pars+"\"><i>"+(i + 1)+"</i></a></span>").append("\n");
			} else {
				for (int i = 0; i < displayPages; ++i) {
					if (i + 1 == pageNo) {
						sb.append("<span class=\"h2_span_on\"><i>"+(i + 1)+"</i></span>").append("\n");
					} else
						sb.append("<span onmouseout=\"this.className='h2_span'\" onmouseover=\"this.className='h2_span_on'\" class=\"h2_span\"><a href=\""+url+"?currentPage="+(i+1)+"&pageSize="+Integer.parseInt(pageSize)+"&records="+Integer.parseInt(records)+pars+"\"><i>"+(i + 1)+"</i></a></span>").append("\n");
				}
			}
			if ((totalPage > outPutPages + 5) && (pageNo + 4 < totalPage)) {
				sb.append("<span class=\"h2_span\" style=\"border:none;\">...</span>").append("\n");
				sb.append("<span onmouseout=\"this.className='h2_span'\" onmouseover=\"this.className='h2_span_on'\" class=\"h2_span\"><a href=\""+url+"?currentPage="+totalPage+"&pageSize="+Integer.parseInt(pageSize)+"&records="+Integer.parseInt(records)+pars+"\"><i>"+totalPage+"</i></a></span>").append("\n");
			}
			if (pageNo < totalPage)
				sb.append("<span onmouseout=\"this.className='h2_span'\" onmouseover=\"this.className='h2_span_on'\" class=\"h2_span\">" +
						"<i><a title='' href=\""+url+"?currentPage="+(totalPage)+"&pageSize="+Integer.parseInt(pageSize)+"&records="+Integer.parseInt(records)+pars+"\"\"><img height=\"10\" width=\"5\" class=\"feng_img\" src=\"../images/cmdb_n/vf3.gif\"/><img height=\"10\" width=\"5\" class=\"feng_img\" src=\"../images/cmdb_n/vf3.gif\"/></a></i></span>").append("\n");
			else {
				sb.append("<span class=\"h2_span\">" +
						"<i><a title='' href=\"###\" ><img height=\"10\" width=\"5\" class=\"feng_img\" src=\"../images/cmdb_n/vf3.gif\"/><img height=\"10\" width=\"5\" class=\"feng_img\" src=\"../images/cmdb_n/vf3.gif\"/></a></i></span>").append("\n");
			}
			StringBuffer psizeSetter = new StringBuffer("每页显示&nbsp;<select id='pagerSel' onchange=\"changePageSize(this.value);\">");
			for(int ii = 10; ii< 110; ii +=10 ){
				String sel_status = "";
				if(ii ==  Integer.parseInt(pageSize)){
					sel_status = "selected";
				}
				psizeSetter.append("<option value='"+ ii +"' "+ sel_status +">"+ ii +"</option>");
			}
			psizeSetter.append("</select> ");
			sb.append("&nbsp;&nbsp;<span style='height:10px;line-height:12px;'> 转到第 <input type=text value='' id='destPage' style='border: 1px solid rgb(219, 219, 219); width: 25px;'> 页 <input  style=\"border: medium none ; margin: 0pt 0pt 0pt 4px; background: transparent url(../images/cmdb_n/2_r2_c2.jpg) repeat scroll 0% 0%; -moz-background-clip: -moz-initial; -moz-background-origin: -moz-initial; -moz-background-inline-policy: -moz-initial; width: 40px; height: 20px; cursor: pointer; color: rgb(68, 68, 68);\" value='转到' type=button onclick=\"goToPage("
									+ "document.getElementById('destPage').value);\"> "+ psizeSetter.toString() +"</span>").append("\n");
			sb.append("		</h2>").append("\n");
			sb.append("	</div>").append("\n");
			sb.append("</div>").append("\n");
		}
	}
	public ValueStack getVs() {
		return vs;
	}


	public void setVs(ValueStack vs) {
		this.vs = vs;
	}

	public String getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(String currentPage) {
		this.currentPage = currentPage;
	}

	public String getPageSize() {
		return pageSize;
	}

	public void setPageSize(String pageSize) {
		this.pageSize = pageSize;
	}

	public String getRecords() {
		return records;
	}

	public void setRecords(String records) {
		this.records = records;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
}
