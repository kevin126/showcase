/**
 * @class Ext.ux.form.TimeField
 * @extends Ext.ux.form.FieldPanel
 * IP 输入控件
 */
Ext.namespace("Ext.ux.form");
Ext.ux.form.IpField = Ext.extend(Ext.ux.form.FieldPanel, {
	border: false,
	baseCls: null,
	layout: 'table',
	token: '.',
	value: '192.168.0.1',
	layoutConfig: {
		columns: 7
	},
	width: 180,
	// private
	defaults:{
		maskRe: /[0-9]/,
		maxLength: 3,
		listeners: {
			'focus': function(f){
				f.selectText();
			}
		}
	},
	initComponent: function()
	{
		this.items = [{
			xtype:'numberfield',
			width:40,
			name: this.name + '0',
			validator:function(value){
				var b = /^([0-9]{1,2})|(1[0-9][0-9])|(2[0-5][0-5])$/.test(value);
				if(!b){
					return false;
				}
				return true;
			}
		}, {
			html: '.',
			baseCls: null,
			bodyStyle: 'font-weight: bold; font-size-adjust: .9',
			border: false
		}, {
			xtype:'numberfield',
			width:40,
			name: this.name + '1',
			validator:function(value){
				var b = /^([0-9]{1,2})|(1[0-9][0-9])|(2[0-5][0-5])$/.test(value);
				if(!b){
					return false;
				}
				return true;
			}
		}, {
			html: '.',
			baseCls: null,
			bodyStyle: 'font-weight: bold; font-size-adjust: .9',
			border: false
		}, {
			xtype:'numberfield',
			width:40,
			name: this.name + '2',
			validator:function(value){
				var b = /^([0-9]{1,2})|(1[0-9][0-9])|(2[0-5][0-5])$/.test(value);
				if(!b){
					return false;
				}
				return true;
			}
		}, {
			html: '.',
			baseCls: null,
			bodyStyle: 'font-weight: bold; font-size-adjust: .9',
			border: false
		}, {
			xtype:'numberfield',
			width:40,
			name: this.name + '3',
			validator:function(value){
				var b = /^([0-9]{1,2})|(1[0-9][0-9])|(2[0-5][0-5])$/.test(value);
				if(!b){
					return false;
				}
				return true;
			}
		}]
		Ext.ux.form.IpField.superclass.initComponent.call(this);
	}
});


Ext.reg('ipfield', Ext.ux.form.IpField);
