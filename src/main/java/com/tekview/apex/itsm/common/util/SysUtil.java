package com.tekview.apex.itsm.common.util;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.UnknownHostException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.Vector;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.SystemUtils;
import org.hibernate.Hibernate;

import com.tekview.apex.uums.base.OceanRuntimeException;

/**
 * 系统通用类,比如os,当前机器的ip,mac,base64编码
 * 
 * @author jimsu
 * @since 2.2
 * 
 */
public class SysUtil {

	/**
	 * 把字节表示的数值转换为带单位的数值
	 * 
	 * @param value
	 *            单位字节
	 * @return
	 */
	public static String getWellFormatPortFlow(long value) {
		String suffix = " Bps";
		double retValue = value;
		if (retValue > 1024) {
			retValue = retValue / 1024;
			suffix = " KBps";
		}
		if (retValue > 1024) {
			retValue = retValue / 1024;
			suffix = " MBps";
		}
		if (retValue > 1024) {
			retValue = retValue / 1024;
			suffix = " GBps";
		}
		if (retValue > 1024) {
			retValue = retValue / 1024;
			suffix = " TBps";// 应该够用了
		}
		DecimalFormat format = new DecimalFormat("0.00");
		return format.format(retValue) + suffix;
	}

	public static Object byteArray2Object(byte[] bytes) {
		ByteArrayInputStream bis = new ByteArrayInputStream(bytes);
		ObjectInputStream ois = null;
		try {
			ois = new ObjectInputStream(bis);
			return ois.readObject();
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
			return null;
		} finally {
			try {
				bis.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
			try {
				ois.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	/**
	 * blob转换为object,在处理oracle blob时使用
	 * 
	 * @param blobObj
	 * @return
	 */
	public static Object blob2Object(java.sql.Blob blobObj) {
		if (blobObj == null)
			return null;
		InputStream stream = null;
		try {
			stream = blobObj.getBinaryStream();
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (stream == null)
			return null;
		ObjectInputStream objStream = null;
		try {
			objStream = new ObjectInputStream(stream);
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (objStream == null)
			return null;
		Object obj = null;
		try {
			obj = objStream.readObject();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				objStream.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return obj;
	}

	public static byte[] blob2Bytes(java.sql.Blob blobObj) {
		if (blobObj == null)
			return null;
		try {
			long len = blobObj.length();
			byte[] res = blobObj.getBytes(0L, (int) len);
			return res;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 对象Object转换为Blob
	 * 
	 * @param obj
	 * @return
	 */
	public static java.sql.Blob object2Blob(Object obj) {
		if (obj == null)
			return null;
		byte[] bs = getBytes(obj);
		if (bs == null)
			return null;
		java.sql.Blob blob = Hibernate.createBlob(bs);
		return blob;
	}

	public static java.sql.Blob bytes2Blob(byte[] bs) {
		if (bs == null)
			return null;
		java.sql.Blob blob = Hibernate.createBlob(bs);
		return blob;
	}

	/**
	 * 将一个对象以字节流方式读出
	 * 
	 * @param obj
	 * @return
	 */
	public static byte[] getBytes(Object obj) {
		ByteArrayOutputStream bao = null;
		ObjectOutputStream oos = null;
		try {
			bao = new ByteArrayOutputStream();
			oos = new ObjectOutputStream(bao);
			oos.writeObject(obj);
			oos.flush();
			byte[] data = bao.toByteArray();
			return data;
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		} finally {
			try {
				oos.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
			try {
				bao.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	/**
	 * 将文件全部读出到一个byte[]中
	 * 
	 * @param filePath
	 *            源文件路径
	 * @return
	 */
	public static byte[] getBytesFromFile(String filePath) throws Exception {
		File f = new File(filePath);
		if (!f.exists()) {
			System.out.println(filePath + " not found");
			return null;
		}
		FileInputStream fis = new FileInputStream(f);
		long i = f.length();
		byte[] b = new byte[(int) i];
		fis.read(b, 0, (int) i);
		fis.close();
		return b;
	}

	/**
	 * 将byte[]写入到一个文件中
	 * 
	 * @param b
	 *            文件内容
	 * @param fileName
	 *            将要创建的文件名
	 */
	public static void createFileFromBytes(byte[] b, String fileName)
			throws Exception {
		File f = new File(fileName);
		if (!f.exists())
			f.createNewFile();
		FileOutputStream fos = new FileOutputStream(f);
		fos.write(b, 0, b.length);
		fos.close();
	}

	/**
	 * 通过反射机制，创建一个classFullName对应的实例对象
	 * 
	 * @param classFullName
	 *            含有包全路径的类名称
	 * @return 类对应的实例
	 */
	@SuppressWarnings("unchecked")
	public static Object newObjectByClassName(String classFullName) {
		try {
			Class cls = Class.forName(classFullName);
			return cls.newInstance();
		} catch (Exception e) {
			throw new OceanRuntimeException("没有找到类:" + classFullName);
		}
	}
	/**
	 * 返回当前机器的IP地址列表，有可能是多ip的设备 <br>
	 * 如果主机名为中文，抛出异常，原来的方法无法使用了，只能使用
	 * 
	 * @return 如果出exception,则返回""
	 */
	public static List<String> getLocalIps() {
		List<String> localIps = new ArrayList<String>();
		try {
			// ipAddr = InetAddress.getLocalHost().getHostAddress();
			Enumeration<NetworkInterface> netInterfs = NetworkInterface
					.getNetworkInterfaces();
			for (; netInterfs.hasMoreElements();) {
				NetworkInterface interf = netInterfs.nextElement();
				Enumeration<InetAddress> addrs = interf.getInetAddresses();
				for (; addrs.hasMoreElements();) {
					InetAddress netAddr = addrs.nextElement();
					String ip = netAddr.getHostAddress();
					if (!StringUtils.isEmpty(ip) && !ip.equals("127.0.0.1")
							&& !ip.equals("localhost"))
						localIps.add(netAddr.getHostAddress());
				}
			}
		} catch (Exception e) {
			System.err.println("getHostAddress failed:" + e.getMessage());
			String[] ips = null;
			if (SystemUtils.IS_OS_WINDOWS)
				ips = getLocalIpsInWindows();
			else if (SystemUtils.IS_OS_LINUX)
				ips = getLocalIpsInLinux();
			if (ips != null)
				for (int i = 0; !ips[i].isEmpty() && ips[i] != null; i++)
					localIps.add(ips[i]);
		}
		return localIps;
	}

	/**
	 * 返回本机的所有IP地址的字符数组
	 * 
	 * @return
	 */
	public static String[] getAllLocalIps() {
		try {
			String hostName = InetAddress.getLocalHost().getHostName();
			InetAddress[] iNetAddress = InetAddress.getAllByName(hostName);
			// 如果是空，返回127.0.0.1，这样做可能比较搞笑
			if (iNetAddress == null)
				return new String[] { "127.0.0.1" };
			String[] ips = new String[iNetAddress.length];
			for (int i = 0; i < iNetAddress.length; i++) {
				InetAddress adi = iNetAddress[i];
				ips[i] = adi.getHostAddress();
			}
			return ips;
		} catch (UnknownHostException e1) {
			e1.printStackTrace();
		}
		return null;
	}

	private static String[] getLocalIpsInWindows() {
		Vector<String> ipList = new Vector<String>();
		try {
			Process pp = Runtime.getRuntime().exec("cmd /c ipconfig");
			InputStreamReader ir = new InputStreamReader(pp.getInputStream());
			BufferedReader bd = new BufferedReader(ir);
			String line = null;
			int pos = -1;
			String curIp = null;
			while ((line = bd.readLine()) != null) {
				if (line.equals(""))
					continue;
				pos = line.indexOf("IP Address");
				if (pos == -1)
					continue;
				curIp = line.substring(pos + 10);
				pos = curIp.indexOf(": ");
				curIp = curIp.substring(pos + 2);
				ipList.add(curIp);
			}
			bd.close();
			ir.close();
		} catch (IOException ex) {
			ex.printStackTrace();
		}
		int len = ipList.size();
		if (len == 0)
			return null;
		String[] ips = new String[len];
		int i = 0;
		for (Iterator<String> it = ipList.iterator(); it.hasNext();) {
			String ip = (String) it.next();
			ips[i] = ip;
			i++;
		}
		return ips;
	}

	/**
	 * 获取linux下机器的ip
	 * 
	 * @return
	 */
	private static String[] getLocalIpsInLinux() {
		Vector<String> ipList = new Vector<String>();
		try {
			Process pp = Runtime.getRuntime()
					.exec("sh script/getLocalIp_linux");
			InputStreamReader ir = new InputStreamReader(pp.getInputStream());
			BufferedReader bd = new BufferedReader(ir);
			String line = null;
			int pos = -1;
			String curIp = null;
			while ((line = bd.readLine()) != null) {
				if (line.equals(""))
					continue;
				pos = line.indexOf("inet addr:");
				if (pos == -1)
					continue;
				curIp = line.substring(pos + 10);
				pos = curIp.indexOf(" ");
				curIp = curIp.substring(0, pos);
				ipList.add(curIp);
			}
			bd.close();
			ir.close();
		} catch (IOException ex) {
			ex.printStackTrace();
		}
		int len = ipList.size();
		if (len == 0)
			return null;
		String[] ips = new String[len];
		int i = 0;
		for (Iterator<String> it = ipList.iterator(); it.hasNext();) {
			String ip = (String) it.next();
			ips[i] = ip;
			i++;
		}
		return ips;
	}

	/**
	 * mac地址格式转化,将"00:01:02:03:04:05"/"00-01-02-03-04-05"转换为"000102030405"
	 * 
	 * @param macAddr
	 * @return
	 */
	public static String formatMacAddr(String macAddr) {
		if (StringUtils.isEmpty(macAddr))
			return "";
		if (macAddr.length() != 17) {
			return null;
		}
		// 重新组装
		StringBuffer bf = new StringBuffer();
		bf.append(macAddr.substring(0, 2)).append(macAddr.substring(3, 5))
				.append(macAddr.substring(6, 8)).append(
						macAddr.substring(9, 11)).append(
						macAddr.substring(12, 14)).append(
						macAddr.substring(15, 17));
		return bf.toString().toUpperCase();
	}

	public static String formatTelnetMacAddr(String macAddr) {
		// 00e0-4d37-acbe或者00e0.4d37.acbe
		if (StringUtils.isEmpty(macAddr))
			return "";
		if (macAddr.length() != 14) {
			return macAddr;
		}
		// 重新组装
		StringBuffer bf = new StringBuffer();
		bf.append(macAddr.substring(0, 2)).append(macAddr.substring(2, 4))
				.append(macAddr.substring(5, 7))
				.append(macAddr.substring(7, 9)).append(
						macAddr.substring(10, 12)).append(
						macAddr.substring(12, 14));
		return bf.toString().toUpperCase();
	}

	/**
	 * 当前机器所有网卡的mac地址
	 * <p>
	 * 支持windows,linux
	 * 
	 * @return 数组每个元素格式为"00-15-C5-B6-81-DA",如果没有则返回null
	 */
	public static String[] getAllLocalMacs() {
		// 判断操作系统
		String osName = System.getProperty("os.name");
		String cmd = null;
		int osType = 0; // 0 windows 1 linux
		if (osName.startsWith("Windows")) {
			cmd = "cmd /c ipconfig /all";
		} else if (osName.startsWith("Linux")) {
			osType = 1;
			// cmd="sh ifconfig | grep addr";
			cmd = "sh script/getLocalMac_linux";
		} else
			return null;
		// 获取mac
		Vector<String> macList = new Vector<String>();
		try {
			Process pp = Runtime.getRuntime().exec(cmd);
			InputStreamReader ir = new InputStreamReader(pp.getInputStream());
			BufferedReader bd = new BufferedReader(ir);
			String line = null;
			String lastMac = null;
			int pos = -1;
			while ((line = bd.readLine()) != null) {
				if (osType == 0) {
					if (line.indexOf("Physical Address") != -1) {
						pos = line.indexOf(": ");
						if (pos >= 0) {
							lastMac = line.substring(pos + 2);
							lastMac = formatMacAddr(lastMac);
							macList.add(lastMac);
						}
					}
				} else if (osType == 1) {
					// linux的处理
					pos = line.indexOf("HWaddr ");
					if (pos != -1) {
						lastMac = line.substring(pos + 7);
						// 格式转换
						lastMac = formatMacAddr(lastMac);
						macList.add(lastMac);
					}
				}
			}
			bd.close();
			ir.close();
		} catch (IOException ex) {
			ex.printStackTrace();
		}
		if (macList.size() == 0)
			return null;
		String[] macs = new String[macList.size()];
		int i = 0;
		for (Iterator<String> it = macList.iterator(); it.hasNext(); i++) {
			macs[i] = (String) it.next();
		}
		return macs;
	}

	/**
	 * 将字符转换为int
	 * 
	 * @param info
	 *            需要转换为int的字符串
	 * @return 对应的int,如果发生异常返回0
	 */
	public static int str2Int(String info) {
		if (StringUtils.isEmpty(info))
			return 0;
		try {
			return Integer.parseInt(info);
		} catch (Exception e) {
			return 0;
		}
	}

	/**
	 * @param info
	 * @return
	 */
	public static Integer str2Integer(String info) {
		if (StringUtils.isEmpty(info))
			return null;
		try {
			return new Integer(info);
		} catch (Exception e) {
			System.out.println();
		}
		return null;
	}

	/**
	 * @param str
	 * @return
	 */
	public static Long str2LongObj(String str) {
		if (StringUtils.isEmpty(str))
			return null;
		try {
			return new Long(str);
		} catch (Exception e) {
			System.out.println();
		}
		return null;
	}

	/**
	 * 将字符转换为long
	 * 
	 * @param info
	 *            需要转换为long的字符串
	 * @return 对应的long,如果发生异常返回0
	 */
	public static long str2Long(String info) {
		try {
			return Long.decode(info);
		} catch (Exception e) {
			return 0L;
		}
	}

	/**
	 * string 2 float
	 * 
	 * @param info
	 * @return
	 */
	public static float str2Float(String info) {
		try {
			return Float.parseFloat(info);
		} catch (Exception e) {
			return 0;
		}
	}

	/**
	 * 将s进行base64编码
	 * 
	 * @param s
	 * @return base64编码
	 */
	public static String encodeBase64(String s) {
		if (s == null)
			return null;
		return (new sun.misc.BASE64Encoder()).encode(s.getBytes());
	}

	public static String encodeBase64(byte[] b) {
		if (b == null)
			return null;
		return (new sun.misc.BASE64Encoder()).encode(b);
	}

	public static byte[] decodeBase64Byte(String base64str) {
		if (base64str == null)
			return null;
		sun.misc.BASE64Decoder decoder = new sun.misc.BASE64Decoder();
		try {
			byte[] b = decoder.decodeBuffer(base64str);
			return b;
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * 将base64编码的字符还原
	 * 
	 * @param s
	 * @return
	 */
	public static String decodeBase64(String base64str) {
		if (base64str == null)
			return null;
		sun.misc.BASE64Decoder decoder = new sun.misc.BASE64Decoder();
		try {
			byte[] b = decoder.decodeBuffer(base64str);
			return new String(b);
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * 将iso8859转为gb2312/gbk
	 * 
	 * @param msgIso8859
	 * @return
	 */
	public static String getGbkFromIso8859(String msgIso8859) {
		String gbkMsg = null;
		try {
			gbkMsg = new String(msgIso8859.getBytes("iso-8859-1"), "GBK");
		} catch (UnsupportedEncodingException e) {
			gbkMsg = msgIso8859;
		}
		return gbkMsg;
	}

	/**
	 * 两个String是否相等
	 * 
	 * @param str1
	 * @param str2
	 * @return
	 */
	public static boolean isSameString(String str1, String str2) {
		if (str1 == null && str2 == null)
			return true;
		if (str1 == null && str2 != null)
			return false;
		// 此时str1!=null
		return str1.equals(str2);
	}

	/**
	 * text是中英为混合的字符串，可以全英文，也可以全中文，<br>
	 * 一个中文相当于2个英文字符，根据字符串返回总字符数。
	 * 
	 * @param text
	 * @return 总字符数
	 */
	public static int getCharacterCount(String text) {
		if (StringUtils.isEmpty(text)) {
			return 0;
		}
		char[] allChars = text.toCharArray();
		int count = 0;
		for (int i = 0; i < allChars.length; i++) {
			System.out.print(allChars[i]);
			if (Pattern.matches("[\u4e00-\u9fa5]", String.valueOf(allChars[i]))) {
				count += 2;
			} else {
				count += 1;
			}
		}
		System.out.println("总字符：" + count);
		return count;
	}

	/**
	 * 判断是否数字
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isNumeric(String str) {
		Pattern pattern = Pattern.compile("[0-9]*");
		Matcher isNum = pattern.matcher(str);
		if (!isNum.matches()) {
			return false;
		}
		return true;
	}
	/**
	 * 两个oid进行比较大小
	 * 
	 * @param s1
	 * @param s2
	 * @return
	 */
	public static int compareOid(String s1, String s2) {
		String[] fields1 = s1.split("\\.");
		String[] fields2 = s2.split("\\.");
		for (int i = 0; i < fields1.length && i < fields2.length; i++) {
			if (StringUtils.isEmpty(fields1[i])
					|| StringUtils.isEmpty(fields2[i]))
				continue;
			int fieldnum1 = str2Int(fields1[i]);
			int fieldnum2 = str2Int(fields2[i]);
			if (fieldnum1 > fieldnum2)
				return 1;
			else if (fieldnum1 < fieldnum2)
				return -1;
		}
		// 前缀都相同，则比较哪个长度更长
		if (fields1.length > fields2.length)
			return 1;
		else if (fields1.length < fields2.length)
			return -1;
		return 0;
	}

	/**
	 * 除开.1.3.6.1.4.1.之后的各节数字
	 * 
	 * @param oid
	 * @return 除开.1.3.6.1.4.1.之后的各节数字，如果为null，表示为root
	 * @author tekview
	 */
	public static int[] getLastFieldNumberOfOid(String oid) {
		String[] fields = oid.split("\\.");
		int size = fields.length - 7; // 7：".1.3.6.1.4.1."表示7节(包括第一个空格)
		if (size <= 0) // 说明是root
			return null;
		int[] ret = new int[size];
		for (int i = 7; i < fields.length; i++) {
			ret[i - 7] = str2Int(fields[i]);
		}
		return ret;
	}
	public static String emptyString(String s) {
		if (StringUtils.isEmpty(s) || StringUtils.isBlank(s) || s == null) {
			return "";
		} else {
			return s;
		}
	}

	/**
	 * 一个简单的渲染文本格式
	 * 
	 * @param text
	 * @param color -
	 *            "gray" "#aabbcc"
	 * @return
	 */
	public static String renderText(String text, String color) {
		String html = "<html><font color=" + color + ">" + text
				+ "</font></html>";
		return html;
	}

	/**
	 * 将list转化成带分隔符的字符串
	 * 
	 * @param users
	 * @param sep -
	 *            分隔符
	 * @return
	 */
	public static String listToString(List<String> users, String sep) {
		StringBuffer sb = new StringBuffer();
		if (users == null || users.isEmpty()) {
			return "";
		}
		for (int i = 0; i < users.size(); i++) {
			Object object = users.get(i);
			if (object == null) {
				continue;
			}
			String s = object.toString();
			if (i == users.size() - 1) {
				sb.append(s);
			} else {
				sb.append(s).append(sep);
			}
		}
		return sb.toString();
	}

	/**
	 * 检查是否是合法OID
	 * 
	 * @param oid
	 * @return
	 */
	public static boolean checkOid(String oid) {
		String patternStr = "((\\.)*\\d{1,7}\\.)+(\\d{1,7})*";
		Pattern pattern = Pattern.compile(patternStr);
		Matcher matcher = pattern.matcher(oid);
		if (!matcher.matches()) {
			return false;
		}
		return true;
	}

	/**
	 * HTML标签转换
	 * 
	 * @param sourcestr
	 * @return
	 */
	public static String TextToHtml(String sourcestr) {
		if (StringUtils.isBlank(sourcestr)) {
			return "";
		}
		int strlen;
		String restring = "", destr = "";
		strlen = sourcestr.length();
		for (int i = 0; i < strlen; i++) {
			char ch = sourcestr.charAt(i);
			switch (ch) {
			case '<':
				destr = "&lt;";
				break;
			case '>':
				destr = "&gt;";
				break;
			case '\"':
				destr = "&quot;";
				break;
			case '&':
				destr = "&amp;";
				break;
			case '\'':
				destr = "&#39;";
				break;
			case ' ':
				destr = "&nbsp;";
				break;
			case '/':
				destr = "&frasl;";
				break;
			default:
				destr = "" + ch;
				break;
			}
			restring = restring + destr;
		}
		String result = restring.replaceAll("\n", "<br/>");
		return "" + result;
	}

	/**
	 * add by jonim 不转义换行
	 * 
	 * @param sourcestr
	 * @return
	 */
	public static String TextToHtmlNoBr(String sourcestr) {
		if (StringUtils.isBlank(sourcestr)) {
			return "";
		}
		int strlen;
		String restring = "", destr = "";
		strlen = sourcestr.length();
		for (int i = 0; i < strlen; i++) {
			char ch = sourcestr.charAt(i);
			switch (ch) {
			case '<':
				destr = "&lt;";
				break;
			case '>':
				destr = "&gt;";
				break;
			case '\"':
				destr = "&quot;";
				break;
			case '&':
				destr = "&amp;";
				break;
			case '\'':
				destr = "&#39;";
				break;
			case ' ':
				destr = "&nbsp;&nbsp;";
				break;
			default:
				destr = "" + ch;
				break;
			}
			restring = restring + destr;
		}
		return "" + restring;
	}

	/**
	 * add by gaochao
	 * 不转义换行
	 * @param sourcestr
	 * @return
	 */
	public static String TextToHtmlOnly(String sourcestr) {
		if(StringUtils.isBlank(sourcestr)){
			return "";
		}
		int strlen;
		String restring = "", destr = "";
		strlen = sourcestr.length();
		for (int i = 0; i < strlen; i++) {
			char ch = sourcestr.charAt(i);
			switch (ch) {
			case '\\':
				destr = "\\\\";
				break;
			default:
				destr = "" + ch;
				break;
			}
			restring = restring + destr;
		}
		return "" + restring;
	}
	
	/**
	 * HTML标签转换
	 * 
	 * @param sourcestr
	 * @return &lt;&lt;&quot;&quot;&amp;<br>
	 *         <br>
	 *         <br>
	 *         &amp;&amp;
	 */
	public static String HtmlToText(String htmlContent) {
		if (htmlContent == null || "".equals(htmlContent.trim())) {
			return "";
		}
		String result = htmlContent.replaceAll("&lt;", "<").replaceAll("&gt;",
				">").replaceAll("&quot;", Matcher.quoteReplacement("\""))
				.replaceAll("&amp;", "&").replaceAll("&nbsp;", " ").replaceAll(
						"&#39;", "'").replaceAll(Matcher.quoteReplacement("%"),
						Matcher.quoteReplacement("\\%"));
		return result;
	}

	/**
	 * jsp中换行符的使用
	 */

	public static String lineChange(String content) {
		if (content == null || "".equals(content.trim())) {
			return "";
		}
		String result = content.replaceAll("\n", "<br>");
		return result;
	}

	/**
	 * 
	 * 将字符数组转化为字符串
	 * 
	 * @param content
	 *            数组
	 * @param regex
	 *            分隔符
	 * @return
	 */
	public static String StringArrayToStr(String[] content, String regex) {
		StringBuffer sbstr = new StringBuffer();
		for (int i = 0; i < content.length; i++) {
			sbstr.append(content[i]);
			if (i != content.length - 1) {
				sbstr.append(regex);
			}
		}
		return sbstr.toString();
	}

	/**
	 * 
	 * 将字符数组转化为字符串
	 * 
	 * @param content
	 *            数组
	 * @param regex
	 *            分隔符
	 * @return
	 */
	public static String[] StringListToStringArray(List<String> list) {
		String[] array = new String[list.size()];
		int i = 0;
		for (Object obj : list) {
			array[i] = obj.toString();
			i++;
		}
		return array;
	}

	/**
	 * 
	 * 将string数组转化为list
	 * 
	 * @param content
	 * @return
	 */
	public static List<String> StringArrayToStringList(String[] content) {
		List<String> list = new ArrayList<String>();
		if (null == content)
			return list;
		for (String str : content) {
			if (null != StringUtils.trimToNull(str)) {
				list.add(str);
			}
		}
		return list;
	}

	/**
	 * 
	 * 将string数组转化为list
	 * 
	 * @param content
	 * @return
	 */
	public static Vector<String> StringArrayToStringVector(String[] content) {
		Vector<String> list = new Vector<String>();
		if (null == content)
			return list;
		for (String str : content) {
			if (null != StringUtils.trimToNull(str)) {
				list.add(str);
			}
		}
		return list;
	}

	/**
	 * 首字母大小写转换
	 * 
	 * @param srcString
	 * @param flag
	 *            true小写 false大写
	 * @return
	 */
	public static String toLowerCaseInitial(String srcString, boolean flag) {
		StringBuilder sb = new StringBuilder();
		if (flag) {
			sb.append(Character.toLowerCase(srcString.charAt(0)));
		} else {
			sb.append(Character.toUpperCase(srcString.charAt(0)));
		}
		sb.append(srcString.substring(1));
		return sb.toString();
	}

	/**
	 * 
	 * 将传入的字符串自动转化话指定的 数值类型
	 * 
	 * @param src
	 * @param type
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static Object castTypeValue(Object src, Class type) {
		if (src == null)
			return null;
		String simpleName = type.getSimpleName().toUpperCase();
		String srcSN = src.getClass().getSimpleName().toUpperCase();
		if (srcSN.equals(simpleName)) {
			return src;
		}
		try {
			if (srcSN.equals("STRING")) {
				if (simpleName.equals("LONG")) {
					return new Long(Long.parseLong((String) src));
				} else if (simpleName.equals("INTEGER")
						|| simpleName.equals("INT")) {
					return new Integer((String) src);
				} else if (simpleName.equals("STRING")) {
					return src.toString();
				}
			} else if (srcSN.equals("BIGINTEGER")) {
				BigInteger bigint = (BigInteger) src;
				if (simpleName.equals("LONG")) {
					return new Long(bigint.intValue());
				} else if (simpleName.equals("INTEGER")
						|| simpleName.equals("INT")) {
					return new Integer(bigint.intValue());
				} else if (simpleName.equals("STRING")) {
					return src.toString();
				}
			} else if (srcSN.equals("LONG")) {
				Long bigint = (Long) src;
				if (simpleName.equals("INTEGER") || simpleName.equals("INT")) {
					return new Integer(bigint.intValue());
				} else if (simpleName.equals("STRING")) {
					return src.toString();
				}
			}
		} catch (NumberFormatException e) {
			return null;
		}
		return null;
	}

	/**
	 * 将字符串srcstr按分隔字符串searchstr在其中的最后一个位置起分成2段装入数组返回
	 * 
	 * @param srcstr
	 * @param searchstr
	 * @return
	 */
	public static String[] splitLastStr(String srcstr, String searchstr) {
		int loca = srcstr.lastIndexOf(searchstr);
		if (loca > 0) {
			return new String[] {
					srcstr.substring(0, loca),
					srcstr
							.substring(loca + searchstr.length(), srcstr
									.length()) };
		} else {
			return new String[] { srcstr };
		}
	}

	/**
	 * 将字符串srcstr按分隔字符串searchstr分隔返回list
	 * 
	 * @param srcstr
	 * @param searchstr
	 * @return
	 */
	public static List<String> split2ArrayList(String srcstr, String searchstr) {
		List<String> list = new ArrayList<String>();
		if (null == srcstr || null == searchstr)
			return list;
		String[] str = StringUtils.split(srcstr, searchstr);
		for (int i = 0; i < str.length; i++) {
			list.add(str[i]);
		}
		return list;
	}

	/**
	 * 
	 * 将工单的影响度由数字转换成文字
	 * 
	 * @param impace
	 * @return
	 */
	public static String translateImpace(int impace) {
		String reslut = "未知";
		if (4 == impace) {
			reslut = "紧急";
		} else if (3 == impace) {
			reslut = "高";
		} else if (2 == impace) {
			reslut = "中";
		} else if (1 == impace) {
			reslut = "低";
		} else {
			reslut = "未知";
		}
		return reslut;
	}

	public static boolean equalsLong(Long l1, Long l2) {
		if (l1 == null && l2 == null) {
			return true;
		} else if (l1 != null && l2 != null) {
			return l1.longValue() == l2.longValue();
		} else
			return false;
	}

	/**
	 * 
	 * 测试
	 * 
	 * @param s
	 */
	public static void main(String[] s) {
		System.out.println(System.currentTimeMillis());
		String[] test = splitLastStr("1_3456_78_xxxYY", "_");
		System.out.println(test[0]);
		System.out.print(test[1]);
		List<String> columns = new ArrayList<String>();
		columns.add("zhonde ma");
		columns.add("猪头");
		columns.add("hehen hade");
		System.out.println(SysUtil.listToString(columns, "_"));
	}

	/**
	 * 
	 * 判断该字符串是否是数字
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isInt(String numberString) {
		if (StringUtils.isEmpty(numberString))
			return false;
		Pattern p = Pattern.compile("-*" + "\\d*");
		if (StringUtils.trimToNull(numberString) != null) {
			Matcher m = p.matcher(numberString);
			return m.matches();
		}
		return false;
	}

	/**
	 * 
	 * 判断该字符串是否是浮点数
	 * 
	 * @param str
	 * @return
	 */
	public static Boolean isDouble(String numberString) {
		Pattern p = Pattern.compile("-*" + "\\d*" + "." + "\\d*");
		if (StringUtils.trimToNull(numberString) != null) {
			Matcher m = p.matcher(numberString);
			return m.matches();
		}
		return false;
	}

	/**
	 * 
	 * html标签转换，无空格,ext的控件对空格的处理与本系统的标签转换不兼容
	 * 
	 * @param sourcestr
	 * @return
	 */
	public static String TextToHtmlNoSpace(String sourcestr) {
		if (StringUtils.isBlank(sourcestr)) {
			return "";
		}
		int strlen;
		String restring = "", destr = "";
		strlen = sourcestr.length();
		for (int i = 0; i < strlen; i++) {
			char ch = sourcestr.charAt(i);
			switch (ch) {
			case '<':
				destr = "&lt;";
				break;
			case '>':
				destr = "&gt;";
				break;
			case '\"':
				destr = "&quot;";
				break;
			case '&':
				destr = "&amp;";
				break;
			case '\'':
				destr = "&#39;";
				break;
			default:
				destr = "" + ch;
				break;
			}
			restring = restring + destr;
		}
		String result = restring.replaceAll("\n", "<br/>");
		return "" + result;
	}

	/**
	 * 验证邮箱
	 * 
	 * @param 待验证的字符串
	 * @return 如果是符合的字符串,返回 <b>true </b>,否则为 <b>false </b>
	 */
	public static boolean isEmail(String str) {
		String regex = "^([\\w-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([\\w-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$";
		return match(regex, str);
	}

	/**
	 * 验证IP地址
	 * 
	 * @param 待验证的字符串
	 * @return 如果是符合格式的字符串,返回 <b>true </b>,否则为 <b>false </b>
	 */
	public static boolean isIP(String str) {
		String num = "(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)";
		String regex = "^" + num + "\\." + num + "\\." + num + "\\." + num
				+ "$";
		return match(regex, str);
	}

	/**
	 * 验证网址Url
	 * 
	 * @param 待验证的字符串
	 * @return 如果是符合格式的字符串,返回 <b>true </b>,否则为 <b>false </b>
	 */
	public static boolean IsUrl(String str) {
		String regex = "http(s)?://([\\w-]+\\.)+[\\w-]+(/[\\w- ./?%&=]*)?";
		return match(regex, str);
	}

	/**
	 * 验证电话号码
	 * 
	 * @param 待验证的字符串
	 * @return 如果是符合格式的字符串,返回 <b>true </b>,否则为 <b>false </b>
	 */
	public static boolean IsTelephone(String str) {
		String regex = "^(\\d{3,4}-)?\\d{6,8}$";
		return match(regex, str);
	}

	/**
	 * 验证输入密码条件(字符与数据同时出现)
	 * 
	 * @param 待验证的字符串
	 * @return 如果是符合格式的字符串,返回 <b>true </b>,否则为 <b>false </b>
	 */
	public static boolean IsPassword(String str) {
		String regex = "[A-Za-z]+[0-9]";
		return match(regex, str);
	}

	/**
	 * 验证输入密码长度 (6-18位)
	 * 
	 * @param 待验证的字符串
	 * @return 如果是符合格式的字符串,返回 <b>true </b>,否则为 <b>false </b>
	 */
	public static boolean IsPasswLength(String str) {
		String regex = "^\\d{6,18}$";
		return match(regex, str);
	}

	/**
	 * 验证输入邮政编号
	 * 
	 * @param 待验证的字符串
	 * @return 如果是符合格式的字符串,返回 <b>true </b>,否则为 <b>false </b>
	 */
	public static boolean IsPostalcode(String str) {
		String regex = "^\\d{6}$";
		return match(regex, str);
	}

	/**
	 * 验证输入手机号码
	 * 
	 * @param 待验证的字符串
	 * @return 如果是符合格式的字符串,返回 <b>true </b>,否则为 <b>false </b>
	 */
	public static boolean IsHandset(String str) {
		String regex = "^[1]+[3,5]+\\d{9}$";
		return match(regex, str);
	}

	/**
	 * 验证输入身份证号
	 * 
	 * @param 待验证的字符串
	 * @return 如果是符合格式的字符串,返回 <b>true </b>,否则为 <b>false </b>
	 */
	public static boolean IsIDcard(String str) {
		String regex = "(^\\d{18}$)|(^\\d{15}$)";
		return match(regex, str);
	}

	/**
	 * 验证输入两位小数
	 * 
	 * @param 待验证的字符串
	 * @return 如果是符合格式的字符串,返回 <b>true </b>,否则为 <b>false </b>
	 */
	public static boolean IsDecimal(String str) {
		String regex = "^[0-9]+(.[0-9]{2})?$";
		return match(regex, str);
	}

	/**
	 * 验证输入一年的12个月
	 * 
	 * @param 待验证的字符串
	 * @return 如果是符合格式的字符串,返回 <b>true </b>,否则为 <b>false </b>
	 */
	public static boolean IsMonth(String str) {
		String regex = "^(0?[[1-9]|1[0-2])$";
		return match(regex, str);
	}

	/**
	 * 验证输入一个月的31天
	 * 
	 * @param 待验证的字符串
	 * @return 如果是符合格式的字符串,返回 <b>true </b>,否则为 <b>false </b>
	 */
	public static boolean IsDay(String str) {
		String regex = "^((0?[1-9])|((1|2)[0-9])|30|31)$";
		return match(regex, str);
	}

	/**
	 * 验证日期时间
	 * 
	 * @param 待验证的字符串
	 * @return 如果是符合网址格式的字符串,返回 <b>true </b>,否则为 <b>false </b>
	 */
	public static boolean isDate(String str) {
		// 严格验证时间格式的(匹配[2002-01-31], [1997-04-30],
		// [2004-01-01])不匹配([2002-01-32], [2003-02-29], [04-01-01])
		// String regex =
		// "^((((19|20)(([02468][048])|([13579][26]))-02-29))|((20[0-9][0-9])|(19[0-9][0-9]))-((((0[1-9])|(1[0-2]))-((0[1-9])|(1\\d)|(2[0-8])))|((((0[13578])|(1[02]))-31)|(((01,3-9])|(1[0-2]))-(29|30)))))$";
		// 没加时间验证的YYYY-MM-DD
		// String regex =
		// "^((((1[6-9]|[2-9]\\d)\\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\\d|3[01]))|(((1[6-9]|[2-9]\\d)\\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\\d|30))|(((1[6-9]|[2-9]\\d)\\d{2})-0?2-(0?[1-9]|1\\d|2[0-8]))|(((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))$";
		// 加了时间验证的YYYY-MM-DD 00:00:00
		String regex = "^((((1[6-9]|[2-9]\\d)\\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\\d|3[01]))|(((1[6-9]|[2-9]\\d)\\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\\d|30))|(((1[6-9]|[2-9]\\d)\\d{2})-0?2-(0?[1-9]|1\\d|2[0-8]))|(((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-)) (20|21|22|23|[0-1]?\\d):[0-5]?\\d:[0-5]?\\d$";
		return match(regex, str);
	}

	/**
	 * 验证数字输入
	 * 
	 * @param 待验证的字符串
	 * @return 如果是符合格式的字符串,返回 <b>true </b>,否则为 <b>false </b>
	 */
	public static boolean IsNumber(String str) {
		String regex = "^[0-9]*$";
		return match(regex, str);
	}

	/**
	 * 验证非零的正整数
	 * 
	 * @param 待验证的字符串
	 * @return 如果是符合格式的字符串,返回 <b>true </b>,否则为 <b>false </b>
	 */
	public static boolean IsIntNumber(String str) {
		String regex = "^\\+?[1-9][0-9]*$";
		return match(regex, str);
	}

	/**
	 * 验证大写字母
	 * 
	 * @param 待验证的字符串
	 * @return 如果是符合格式的字符串,返回 <b>true </b>,否则为 <b>false </b>
	 */
	public static boolean IsUpChar(String str) {
		String regex = "^[A-Z]+$";
		return match(regex, str);
	}

	/**
	 * 
	 * 正则表达式校验字符串
	 * 
	 * @param regex
	 *            正则表达式
	 * @param str
	 *            需要校验的字符
	 * @return
	 */
	public static boolean match(String regex, String str) {
		java.util.regex.Pattern pattern = java.util.regex.Pattern
				.compile(regex);
		java.util.regex.Matcher match = pattern.matcher(str);
		return match.matches();
	}

	/**
	 * 检查字符串是否含有指定的字符，一旦含有就返回
	 * 
	 * @param stringValue
	 * @param filteChar
	 * @return
	 */
	public static boolean hasChar(String stringValue, String[] filteChar) {
		boolean bool = false;
		for (String value : filteChar) {
			if (stringValue.indexOf(value) != -1) {
				bool = true;
				break;
			}
		}
		return bool;
	}
}