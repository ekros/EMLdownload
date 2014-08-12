//////////////////////////////////////////////////////////////////////////////
// Based on the original emaildownloader zimlet. This one allows download email in text format without compression
// @author Eric Ros
//////////////////////////////////////////////////////////////////////////////

function eml_download() {
}

eml_download.prototype = new ZmZimletBase();
eml_download.prototype.constructor = eml_download;

eml_download.prototype.doDrop =
function(obj) {
	switch (obj.TYPE) {
		case "ZmFolder":
			this._FolderDropped(obj);
			break;
		case "ZmMailMsg":
			this._MessageDropped(obj);
			break;
		case "ZmConv":
			this._MessageDropped(obj);
			break;
		default:this.displayErrorMessage("This type of element is not supported yet!");
 }
};

eml_download.prototype._MessageDropped =
function(msgObj) {
	if (msgObj.length >= 2) // only one mail at once
	{
		this.displayErrorMessage("Please, drag only one email!");
	}
	else
	{
		this.srcMsgObj = msgObj.srcObj;
		if(this.srcMsgObj.type == "CONV")
		{
			this.srcMsgObj = this.srcMsgObj.getFirstHotMsg();
		}
		var url = [];
		var i = 0;
		var proto = location.protocol;
		var port = Number(location.port);
		url[i++] = proto;
		url[i++] = "//";
		url[i++] = location.hostname;
		if (port && ((proto == ZmSetting.PROTO_HTTP && port != ZmSetting.HTTP_DEFAULT_PORT) 
			|| (proto == ZmSetting.PROTO_HTTPS && port != ZmSetting.HTTPS_DEFAULT_PORT))) {
			url[i++] = ":";
			url[i++] = port;
		}
		url[i++] = "/home/";
		url[i++]= AjxStringUtil.urlComponentEncode(appCtxt.getActiveAccount().name);
		url[i++] = "/?auth=co&id=";
		url[i++] = this.srcMsgObj.id;
		try{
			var subject = this.srcMsgObj.subject.replace(/\*/g, "").replace(/\[/g, "").replace(/\]/g, "").replace(/\</g, "").replace(/\>/g, "").replace(/\=/g, "").replace(/\+/g, "").replace(/\'/g, "").replace(/\"/g, "").replace(/\\/g, "").replace(/\//g, "").replace(/\,/g, "").replace(/\./g, "").replace(/\:/g, "").replace(/\;/g, "").replace(/ /g, "").replace(/!/g, ""); 
			if(subject.length > 16){
				subject = subject.substring(0,15);
	        }
		} catch(e) {
		}
		var getUrl = url.join("");

        var response = AjxRpc.invoke(null, getUrl, null, null, true);

        if (response.success == true) {
        	uriContent = "data:application/octet-stream," + encodeURIComponent(response.text);
		window.open(uriContent, "_blank");
        }
    }
};

eml_download.prototype._FolderDropped = 
function(msgObj) {
	this.displayErrorMessage("EML Download does not support folders yet!");
};