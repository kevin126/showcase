Ext.namespace("Ext.ux.data");

/**
 * An implementation of Ext.data.DataProxy that uses DWR to make a remote call.
 */
Ext.ux.data.DWRProxy = function(config){
	Ext.apply(this, config); 
	Ext.ux.data.DWRProxy.superclass.constructor.call(this);
};

Ext.extend(Ext.ux.data.DWRProxy, Ext.data.DataProxy, {

	dwrFunction: null,
	
	loadArgsKey: 'dwrFunctionArgs',
	
	/**
	 * Load data from the configured "dwrFunction",
	 * @param {Object} params An object containing properties which are to be used for the request to the remote server.
	 * @param {Ext.data.DataReader} reader The Reader object which converts the data object into a block of Ext.data.Records.
	 * @param {Function} callback The function into which to pass the block of Ext.data.Records.
	 * @param {Object} scope The scope in which to call the callback
	 * @param {Object} arg An optional argument which is passed to the callback as its second parameter.
	 */
	load: function(params, reader, loadCallback, scope, arg){
		var dataProxy = this;
		if (dataProxy.fireEvent("beforeload", dataProxy, params) !== false) {
			var loadArgs = params[this.loadArgsKey] || params;
			var dwrFunctionArgs = [];
			if (loadArgs instanceof Array) {
				for (var i = 0; i < loadArgs.length; i++) {
					dwrFunctionArgs.push(loadArgs[i]);
				}
			} else { // loadArgs should be an Object
				for (var loadArgName in loadArgs) {
					dwrFunctionArgs.push(loadArgs[loadArgName]);
				}
			}
			dwrFunctionArgs.push({
				callback: function(response){
					var records = reader.readRecords(response);
					dataProxy.fireEvent("load", dataProxy, response, loadCallback);
					loadCallback.call(scope, records, arg, true);
				},
				exceptionHandler: function(message, exception){
					dataProxy.fireEvent("loadexception", dataProxy, message, loadCallback, exception);
					loadCallback.call(scope, null, arg, false);
				}
			});
			this.dwrFunction.apply(Object, dwrFunctionArgs); 
		} else { // the beforeload event was vetoed
			callback.call(scope || this, null, arg, false);
		}
	}
});