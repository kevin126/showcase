/******************************************************************************** 
 * Create Author   : Kevin
 * Create Date     : Jan 21, 2011
 * File Name       : OceanRuntimeException.java
 *
 * Apex OssWorks是上海泰信科技有限公司自主研发的一款IT运维产品，公司拥有完全自主知识产权及专利，
 * 本系统的源代码归公司所有，任何团体或个人不得以任何形式拷贝、反编译、传播，更不得作为商业用途，对
 * 侵犯产品知识产权的任何行为，上海泰信科技有限公司将依法对其追究法律责任。
 *
 * Copyright 1999 - 2011 Tekview Technology Co.,Ltd. All right reserved.
 ********************************************************************************/
package com.tekview.apex.uums.base;

public class OceanRuntimeException extends RuntimeException {
    /**
     * 抛出到客户端的异常需要一个errorcode错误码
     */
    private String errorCode;

    /**
     * 抛出到客户端的异常需要的参数
     */
    private Object[] params;

    /**
     * 需要显示到界面上的参数，考虑到大部分错误信息之需要一个参数，故加了这个简易参数，如果有多个参数请使用数组params
     */
    private String errorParam;

	/**
     * @param message
     * @param errorParam
     */
    public OceanRuntimeException(String message, String errorParam) {
        super(message);
        this.errorParam = errorParam;
    }

    public OceanRuntimeException(String errorCode, Object[] params) {
        this.errorCode = errorCode;
        this.params = params;
    }

    /**
     * @param errorCode 错误码
     */
    public OceanRuntimeException(String errorCode) {
    	super(errorCode);
        this.errorCode = errorCode;
        
    }

    /**
     * @param message 异常简要信息
     * @param cause   根异常
     */
    public OceanRuntimeException(String message, Throwable cause) {
        super(message, cause);
    }

    public String getErrorCode() {
        return errorCode;
    }

    public Object[] getParams() {
        return params;
    }

    public void setParams(Object[] params) {
        this.params = params;
    }


    public String getErrorParam() {
        return errorParam;
    }


    public void setErrorParam(String errorParam) {
        this.errorParam = errorParam;
    }
}