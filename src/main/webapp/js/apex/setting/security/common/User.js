Ext.namespace('Apex.security');
/**
 * 客户端保存的当前登陆用户和对应权限信息
 * 
 * @param {}
 *            config
 */
Apex.security.User = function(config) {

	config = config || {};

	/**
	 * 服务器存储的sessionId
	 */
	this.sessionId = '00000';

	/**
	 * 用户名
	 */
	this.userName = 'admin';

	/**
	 * 用户登陆时间
	 */
	this.loginTime = '';
	this.userId = '1';

	/**
	 * 当前用户所拥有的角色
	 */
	this.role = [];

	/**
	 * 当前用户所拥有的权限项
	 */
	this.permission = [];

	Ext.apply(this, config);

	/**
	 * 得到用户名
	 */
	this.getUserName = function() {
		return this.userName;
	};

	this.getId = function() {
		return this.userId;
	};
	/**
	 * 得到用户角色
	 */
	this.getRole = function() {
		return this.role;
	};

	/**
	 * 得到用户权限
	 */
	this.getPermission = function() {
		return this.permission;
	};

	/**
	 * 判断该用户是否拥有指定的权限
	 * 
	 * @param aId
	 *            权限项
	 * @return false ：没有aId权限；true ：有aId权限
	 */
	this.isAble = function(aId) {
		if (this.permission && this.permission.length != 0) {
			if (this.permission.indexOf(aId) != -1) {
				return true;
			} else {
				return false;
			}
		}
		return false;
	};

	this.isCurrentUser = function(name) {
		if (this.userName) {
			if (this.userName == name) {
				return true;
			} else {
				return false;
			}
		}
		return false;
	};
	/**
	 * 判断用户是否具有某个角色
	 * 
	 * @param roleName
	 *            角色名称
	 * @return false ：不具有指定的角色；true ：具有指定的角色
	 */
	this.hasFixedRole = function(roleName) {
		if (this.role && this.role.length != 0) {
			for(var i=0;i<this.role.length;i++){
				if (this.role[i].indexOf(roleName) != -1) {
					return true;
				}  
			}
		}
		return false;
	}
};