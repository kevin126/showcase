
Ext.namespace("Ext.ux");
/**
 * DWRTreeloader loads tree nodes by calling a DWR service.
 */
Ext.ux.DWRTreeLoader = function(config) {
	Ext.ux.DWRTreeLoader.superclass.constructor.call(this, config);
};

Ext.extend(Ext.ux.DWRTreeLoader, Ext.tree.TreeLoader, {
	loadParams: null,
	waitMessage:null,
	/**
	 * Load an {@link Ext.tree.TreeNode} from the DWR service.
	 * @param {Object} node node for which child elements should be retrieved
	 * @param {Function} callback function that should be called before executing the DWR call
	 */
	load : function(node, callback) {
		if(!Ext.isEmpty(this.waitMessage))
			this.waitMessage.show();
    	var cs, i;
    	if (this.clearOnLoad) {
      		while (node.firstChild) {
        		node.removeChild(node.firstChild);
	      	}
	    }
	    if (node.attributes.children && node.attributes.hasChildren) { // preloaded json children
	    	cs = node.attributes.children;
	      	for (i = 0,len = cs.length; i<len; i++) {
	        	node.appendChild(this.createNode(cs[i]));
	      	}
	      	if (typeof callback == "function") {
	      		callback();
	      	}
	    } else if (this.dwrCall) {
	      	this.requestData(node, callback);
	    }
	},

	/**
	 * Performs the actual load request
	 */
  	requestData : function(node, callback) {
    	var callParams;
    	var success, error, rootId, dataContainsRoot;
    	if (this.fireEvent("beforeload", this, node, callback) !== false) {
	    	callParams = this.getParams(node);
      		success = this.handleResponse.createDelegate(this, [node, callback], 1);
      		error = this.handleFailure.createDelegate(this, [node, callback], 1);
      		callParams.push({callback:success, errorHandler:error});
      		this.transId = true;
      		this.dwrCall.apply(this, callParams);
    	} else {
      		if (typeof callback == "function") {
        		callback();
      		}
    	}
	},

	/**
	 * Override this to add custom request parameters. Default adds the node id as first and only parameter
	 */
	getParams : function(node) {
		var finalParams = new Array();
		finalParams.push(node.id);
		if(!Ext.isEmpty(this.loadParams) && this.loadParams.length != 0){
			for(var i=0;i<this.loadParams.length;i++)
			    finalParams.push(this.loadParams[i]);
		}
//		//节点类型
//		var type = node.attributes.devNodeType;
//		var eleId = node.attributes.eleId;
//		if(type){
//			finalParams.push(type);
//			finalParams.push(eleId);
//		}
	    return finalParams;
	},

	/**
	 * Handles a successful response.
	 * @param {Object} childrenData data that was sent back by the server that contains the child nodes
	 * @param {Object} parent parent node to which the child nodes will be appended
	 * @param {Function} callback callback that will be performed after appending the nodes
	 */
	handleResponse : function(childrenData, parent, callback) {
    	this.transId = false;
    	this.processResponse(childrenData, parent, callback);
    	if(!Ext.isEmpty(this.waitMessage))
    		this.waitMessage.hide();
	},

	/**
	 * Handles loading error
	 * @param {Object} response data that was sent back by the server that contains the child nodes
	 * @param {Object} parent parent node to which child nodes will be appended
	 * @param {Function} callback callback that will be performed after appending the nodes
	 */
	handleFailure : function(response, parent, callback) {
    	this.transId = false;
    	this.fireEvent("loadexception", this, parent, response);
    	if (typeof callback == "function") {
      		callback(this, parent);
    	}
    	if(window.console){
	    	window.console.log("DwrTreeLoader: error during tree loading. Received response: " + response);
    	}
    	if(!Ext.isEmpty(this.waitMessage))
    		this.waitMessage.hide();
 	},

	/**
	 * Process the response that was received from server
	 * @param {Object} childrenData data that was sent back by the server that contains the attributes for the child nodes to be created
	 * @param {Object} parent parent node to which child nodes will be appended
	 * @param {Function} callback callback that will be performed after appending the nodes
	 */
	processResponse : function(childrenData, parent, callback) {
    	var i, n, nodeData;
    	try {
      		for (var i = 0; i<childrenData.length; i++) {
        		var n = this.createNode(childrenData[i]);
        		if (n) {
          			n.hasChildren = childrenData[i].hasChildren;
          			parent.appendChild(n);
        		}
      		}
      		if (typeof callback == "function") {
        		callback(this, parent);
      		}
    	} catch(e) {
      		this.handleFailure(childrenData);
    	}
  	}
});