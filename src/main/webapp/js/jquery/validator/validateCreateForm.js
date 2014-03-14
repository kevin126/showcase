/**
 * create by : JONIM.XIA 创建资产模块自定义表单的验证 取到所有输入框控件，根据唯一Id循环校验 1，isNull--是否允许为空
 * 2，columnLength--最大长度 3，label--名称 4，htmlType--表现形式 5，id--输出错误信息的DivId
 * 6，value--输入值
 */
function save(formId) {
	var form = document.getElementById(formId);
	var s = null;
	var flag = true;
	for (i = 0; i < form.elements.length; i++) {
		// get all input text elements
		if (form.elements[i].type == "text"
				|| form.elements[i].type == "textarea") {
			var inputElement = form.elements[i];
			var elementId = inputElement.id;
			// get create form elenments
			if (elementId != null && elementId.indexOf('COLUMN_') != -1) {
				var value = inputElement.value;
				var isNull = document.getElementById(elementId + "_AllowNull").value;
				var columnLength = document.getElementById(elementId
						+ "_Length").value;
				var minLength = document.getElementById(elementId
						+ "_MinLength").value;
				var label = document.getElementById(elementId + "_Lable").value;
				var htmlType = document.getElementById(elementId + "_HtmlType").value;
				var id = elementId + "_Div";
				if (minLength == null)
					minLength = 0;
				// start vilidate
				var msg = validateNull(value, isNull, label);
				if (msg != null) {
					showMsg(id, msg);
					flag = false;
					break;
				} else {
					msg = validateLength(value, columnLength, label, htmlType,
							minLength);
					if (msg != null) {
						showMsg(id, msg);
						flag = false;
						break;
					}
					if (htmlType != "" && htmlType.trim() == "integer") {
						msg = validateNumber(value, label);
						if (msg != null) {
							showMsg(id, msg);
							flag = false;
							break;
						}
					} else if (htmlType != "" && htmlType.trim() == "float") {
						msg = validateDouble(value, label);
						if (msg != null) {
							showMsg(id, msg);
							flag = false;
							break;
						}
					}
				}
				if (msg == null) {
					showMsg(id, msg);
				}
			}
		}
	}
	// do submit
	if (flag)
		form.submit();
}
/**
 * validte is null
 * 
 * @param {}
 *            value
 * @param {}
 *            isNull
 * @param {}
 *            label
 * @return {}
 */
function validateNull(value, isNull, label) {
	var msg = null;
	if (isNull == 'false' && value.trim() == "") {
		msg = CreateForm.form_error + label + CreateForm.form_not_null;
	}
	return msg;
}

/**
 * vlidate length is over
 * 
 * @param {}
 *            value
 * @param {}
 *            columnLength
 * @param {}
 *            label
 * @return {}
 */
function validateLength(value, columnLength, label, htmlType, minLength) {
	var msg = null;
	if (htmlType != ""
			&& (htmlType.trim() == "integer" || htmlType.trim() == "float")) {
		value = parseInt(value);
		columnLength = parseInt(columnLength);
		minLength = parseInt(minLength);
		if (value != "" && value > columnLength) {
			msg = CreateForm.form_error + label + CreateForm.form_value_not_height + columnLength + CreateForm.form_mark;
		} else if (value != "" && value < minLength) {
			msg = CreateForm.form_error + label + CreateForm.form_value_not_low + minLength + CreateForm.form_mark;
		}
	} else {
		if (value != "" && value.length > columnLength) {
			msg = CreateForm.form_error + label + CreateForm.form_length_not_long + columnLength + CreateForm.form_length_mark;
		} else if (value != "" && value.length < minLength) {
			msg = CreateForm.form_error + label + CreateForm.form_length_not_short + minLength + CreateForm.form_length_mark;
		}
	}
	return msg;
}

/**
 * 校验整数
 * 
 * @param {}
 *            value
 * @param {}
 *            label
 * @param {}
 *            htmlType
 * @return {}
 */
function validateNumber(value, label) {
	var msg = null;
	if (value != "") {
		for (var j = 0; j < value.length; j++) {
			var cc = value.charAt(j);
			if (cc < "0" || cc > "9") {
				msg = CreateForm.form_error + label + CreateForm.form_only_integer;
				break;
			}
		}
	}
	return msg;
}

/**
 * 校验float
 * 
 * @param {}
 *            value
 * @param {}
 *            label
 * @return {}
 */
function validateDouble(value, label) {
	var msg = null;
	if (value == "")
		return msg;
	if (value.indexOf(".") == -1) {
		msg = validateNumber(value, label);
		if (msg != null) {
			msg = CreateForm.form_error + label + CreateForm.form_only_float;
			return msg;
		}
	} else {
		var i = value.indexOf(".");
		var first = value.substring(0, i);
		var last = value.substring(i + 1, value.length);
		if (first != "")
			msg = validateNumber(first, label);
		if (msg != null) {
			msg = CreateForm.form_error + label + CreateForm.form_only_float;
			return msg;
		} else if (last != "") {
			msg = validateNumber(last, label);
			if (msg != null) {
				msg = CreateForm.form_error + label + CreateForm.form_only_float;
				return msg;
			}
		}
	}
	return msg;
}

/**
 * show msg
 * 
 * @param {}
 *            msg
 */
function showMsg(id, msg) {
	var div = document.getElementById(id);
	div.innerHTML = msg;
	if (msg != "" && msg != null) {
		div.style.display = "block";
	} else {
		div.style.display = "none";
	}
}

/**
 * 设置自定义页面高度
 */
function setHeight() {
	var innerHeight;
	if (window.innerHeight) {
		innerHeight = window.innerHeight;
	} else {
		innerHeight = document.body.clientHeight;
	}

	innerHeight = parseInt(innerHeight);
	if (innerHeight == null || innerHeight == '' || innerHeight < 643) {
		document.getElementById("divHeight").style.height = 643;
	} else {
		document.getElementById("widowHeight").style.height = innerHeight;
	}
}

/**
 * 设置自定义页面高度
 */
function setAssetViewHeight() {
	var innerHeight;
	if (window.innerHeight) {
		innerHeight = window.innerHeight;
	} else {
		innerHeight = document.body.clientHeight;
	}

	innerHeight = parseInt(innerHeight);
	if (innerHeight == null || innerHeight == '' || innerHeight < 600) {
		document.getElementById("divHeight").style.height = 600;
	} else {
		document.getElementById("widowHeight").style.height = innerHeight;
	}
}

function setNoticeHeight() {
	var innerHeight;
	if (window.innerHeight) {
		innerHeight = window.innerHeight;
	} else {
		innerHeight = document.body.clientHeight;
	}

	innerHeight = parseInt(innerHeight);
	if (innerHeight == null || innerHeight == '' || innerHeight < 675) {
		document.getElementById("divHeight").style.height = 675;
	} else {
		document.getElementById("widowHeight").style.height = innerHeight;
	}
}

