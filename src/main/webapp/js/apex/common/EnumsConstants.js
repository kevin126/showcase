Ext.namespace('Apex');
/**
 * 枚举类型对应字符串常量<br>
 * DWR在对待枚举类型时,会要求在客户端传入字符串(枚举类中toString()方法返回的)<br><br>
 * 例(用枚举com.tekview.ocean.common.enums.IpMacPort为例) : 
 * <br>1、dwr.xml中配置
 * <pre><code>
 * 	＜convert converter="enum" match="com.tekview.apex.itsm.common.security.commons.UserStatesEnum"/＞
 * </pre></code>
 * <br>2、服务端方法
 * <pre><code>
 * 	public Object methodName(UserStatesEnum key);
 * </pre></code>
 * <br>3、客户端调用
 * <pre><code>
 * 	Service.methodName(Apex.EnumsConstants.UserStatesEnum.ENABLE);
 * </pre></code>
 * @see 写法如下面的UserStatesEnum
 * @author Allen.wang
 */
Apex.EnumsConstants = {
	/**
	 * 用户状态的枚举
	 * 
	 * @see com.tekview.apex.itsm.common.security.commons.UserStatesEnum
	 * @type 
	 */
	UserStatesEnum : {
		/**
		 * 用户状态（启用)
		 * 
		 * @type String
		 */
		ENABLE : '启用',
		/**
		 * 用户状态（禁用)
		 * 
		 * @type String
		 */
		DISABLE : '禁用'
	}
};