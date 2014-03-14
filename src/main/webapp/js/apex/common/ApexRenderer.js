
/**
 * 设备类型转换
 * 
 * @param {}
 *            value
 * @return {String}
 */
Apex.renderer.DeviceTypeRenderer = function(value) {
	if (value == 'ROUTER') {
		return '路由器';
	} else if (value == 'L3_SWITCH') {
		return '三层交换机';
	} else if (value == 'L2_SWITCH') {
		return '二层交换机';
	} else if (value == 'HOST') {
		return '主机';
	} else if (value == 'SERVER') {
		return '服务器';
	} else if (value == 'HUB') {
		return '集线器';
	} else if (value == 'VPN') {
		return 'VPN';
	} else if (value == 'UPS') {
		return '不间断电源';
	} else if (value == 'PRINTER') {
		return '打印机';
	} else if (value == 'FIREWALL') {
		return '防火墙';
	} else {
		return '未知';
	}
}

/**
 * 
 * 链路类型
 * 
 * @param {}
 *            value
 * @return {String}
 * 
 */
Apex.renderer.LinkTypeRenderer = function(value) {
	if (value) {
		return '手工添加';
	} else {
		return '自动计算';
	}
}

Apex.renderer.PortTypeRenderer = function(value) {
	switch (value) {
		case "6" :
			return '以太网接口';
			break;
		case "62" :
			return "快速以太网接口";
			break;
		case "69" :
			return "FASTETHERFX_VALUE";
			break;
		case "117" :
			return "G比特以太网接口";
			break;
		case "23" :
			return "PPP";
			break;
		case "63" :
			return "ISDN";
			break;
		case "24" :
			return "本地回环接口";
			break;
		case "37" :
			return "ATM";
			break;
		case "1" :
			return "NULL0";
			break;
		case "5" :
			return "X25";
			break;
		case "15" :
			return "FDDI";
			break;
		case "19" :
			return "E1";
			break;
		case "22" :
			return "PPP_Serial";
			break;
		case "32" :
			return "Frame_Relay";
			break;
		case "39" :
			return "SONET";
			break;
		case "49" :
			return "AAL5";
			break;
		case "50" :
			return "sonetpath";
			break;
		case "53" :
			return "PropVirtual";
			break;
		case "135" :
			return "l2vlan";
			break;
		case "136" :
			return "l3ipvlan";
			break;
		case "137" :
			return "l3ipxvlan";
			break;
		case "998" :
			return "HubStationPort";
			break;
		case "999" :
			return "MyVirtualPort";
			break;
		case "28" :
			return "slip";
			break;
		case "54" :
			return "propMultiplexor";
			break;
		case "75" :
			return "isdns";
			break;
		case "77" :
			return "lapd";
			break;
		case "81" :
			return "ds0";
			break;
	}
}
/**
 * 设备详情中，磁盘的类型
 */
Apex.renderer.DiskTypeRenderer = function(value) {
	if (2 == value) {
		return '物理内存';
	} else if (3 == value) {
		return '虚拟内存';
	} else if (4 == value) {
		return '本地磁盘';
	} else if (5 == value) {
		return '软盘';
	} else if (7 == value) {
		return '光驱';
	} else
		return value;
}

/**
 * 设备上安装软件的类型
 */
Apex.renderer.SoftwareTypeRenderer = function(value) {
	if (1 == value) {
		return '未知';
	} else if (2 == value) {
		return '系统软件';
	} else if (3 == value) {
		return '驱动软件';
	} else if (4 == value) {
		return '应用软件';
	} else
		return value;
}

/**
 * 是否是重要端口
 */
Apex.renderer.ImportantRenderer = function(value) {
	if (value) {
		return '重要';
	} else {
		return '不重要';
	}
}

/** 端口的属性 */
Apex.renderer.PortMode = function(value) {
	if (1 == value)
		return 'access';
	else if (2 == value)
		return 'hybrid';
	else if (3 == value)
		return 'trunk';
	else
		return value;
}

/** 路由类型 */
Apex.renderer.RouterType = function(value) {
	if (3 == value)
		return '本地子网';
	else if (4 == value)
		return '远程子网';
	else
		return '未知';
}

/** 端口通断状态 */
Apex.renderer.PortStatusRenderer = function(value) {
	if (1 == value){
		return '通';
	} else if (2 == value) {
		return '断';
	} else if (3 == value) {
		return '测试状态';
	} else if (0 == value) {
		return '未知状态';
	} else {
		return value;
	}
}