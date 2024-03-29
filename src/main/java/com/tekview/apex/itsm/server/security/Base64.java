package com.tekview.apex.itsm.server.security;

/**
 * 
 * @since ocean v5
 * @author Jacky.Wang
 */
public class Base64 {

	public Base64() {
	}

	public static byte[] decode(char[] data) {
		int tempLen = data.length;
		for (int ix = 0; ix < data.length; ix++)
			if (data[ix] > '\377' || codes[data[ix]] < 0)
				tempLen--;
		int len = (tempLen / 4) * 3;
		if (tempLen % 4 == 3)
			len += 2;
		if (tempLen % 4 == 2)
			len++;
		byte[] out = new byte[len];
		int shift = 0;
		int accum = 0;
		int index = 0;
		for (int ix = 0; ix < data.length; ix++) {
			int value = data[ix] <= '\377' ? ((int) (codes[data[ix]])) : -1;
			if (value >= 0) {
				accum <<= 6;
				shift += 6;
				accum |= value;
				if (shift >= 8) {
					shift -= 8;
					out[index++] = (byte) (accum >> shift & 255);
				}
			}
		}
		if (index != out.length)
			throw new Error("Miscalculated data length (wrote " + index + " instead of " + out.length + ")");
		else
			return out;
	}

	public static char[] encode(byte[] data) {
		char[] out = new char[((data.length + 2) / 3) * 4];
		int i = 0;
		for (int index = 0; i < data.length; index += 4) {
			boolean quad = false;
			boolean trip = false;
			int val = 255 & data[i];
			val <<= 8;
			if (i + 1 < data.length) {
				val |= 255 & data[i + 1];
				trip = true;
			}
			val <<= 8;
			if (i + 2 < data.length) {
				val |= 255 & data[i + 2];
				quad = true;
			}
			out[index + 3] = alphabet[quad ? val & 63 : 64];
			val >>= 6;
			out[index + 2] = alphabet[trip ? val & 63 : 64];
			val >>= 6;
			out[index + 1] = alphabet[val & 63];
			val >>= 6;
			out[index] = alphabet[val & 63];
			i += 3;
		}
		return out;
	}

	private static char[] alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".toCharArray();

	private static byte[] codes;
	static {
		codes = new byte[256];
		for (int i = 0; i < 256; i++)
			codes[i] = -1;
		for (int i = 65; i <= 90; i++)
			codes[i] = (byte) (i - 65);
		for (int i = 97; i <= 122; i++)
			codes[i] = (byte) ((26 + i) - 97);
		for (int i = 48; i <= 57; i++)
			codes[i] = (byte) ((52 + i) - 48);
		codes[43] = 62;
		codes[47] = 63;
	}
}
/*
 * DECOMPILATION REPORT
 * 
 * Decompiled from: D:\Xunlei\LdapBrowser282\lib\classes/lbe/common/Base64.class Total time: 16 ms Jad reported
 * messages/errors: Exit status: 0 Caught exceptions:
 */