function slideDrag(width, length, id){
	this.leftArray = new Array();
	this.arrayLength = length; 
	this.width = width;
	this.x = this._x = this.left = 0;
	this.isMouseDown = false;
	this.thisObj = $("#" + id);
	//alert("id:" + id + "--" +this.thisObj.width());
	this.bannerImage = $("#bannerImage");//显示部分DIV
	this.initialize();
}
slideDrag.prototype.initialize = function(){
	//alert(this.bannerImage.width()/2);
	//根据宽度重置所有block的宽度
	this.resetBlockWidth(this.bannerImage);
	this.generateArray();
	this.addEventHandler();
}
/**
 * 重置所有block的宽度
 * 
 */
slideDrag.prototype.resetBlockWidth = function(bannerImage){
//	this.thisObj.removeClass("images");
	this.thisObj.css("width", (bannerImage.width()*3 + 30)+ "px");
	
	$(".workarea_block").each(function(){
		$(this).css("width", (bannerImage.width()-25)/2 + "px");
	});
	$(".workarea_content").each(function(){
		$(this).css("width", (bannerImage.width()-25)/2 + "px");
	});
	$(".workarea_title").each(function(){
		$(this).css("width", (bannerImage.width()-25)/2 + "px" );
	});
	
	$("#images").css("height", bannerImage.height()+10);
	
}
slideDrag.prototype.generateArray = function(){
	this.leftArray[0] = 0;
	for(var i=1; i<this.arrayLength; i++){
		this.leftArray[i] = this.leftArray[i-1] - this.bannerImage.width();
	}
}
slideDrag.prototype.addEventHandler = function(){
	_this = this;
	this.thisObj.bind("mousedown", function(e){
		_this.isMouseDown = true;
		_this.x = _this._x = e.clientX;
		e.preventDefault();
	});
	$(document).bind("mousemove", function(e){
		if(_this.isMouseDown){
			_this.left = parseInt(_this.thisObj.css("left")) + (e.clientX - _this.x) ;
			if(_this.left > _this.leftArray[0]) _this.left = _this.leftArray[0];
			if(_this.left < _this.leftArray[_this.arrayLength-1]) _this.left = _this.leftArray[_this.arrayLength-1];
			_this.thisObj.css("left", _this.left);
			_this.x = e.clientX;
			e.preventDefault();
		}
	});
	$(document).bind("mouseup", function(e){
		if(_this.isMouseDown){
			if(e.clientX - _this._x < 0){
				_this.thisObj.animate(
					{
						left: _this.lineSearch(parseInt(_this.thisObj.css("left")), false)
					}, 1200
				);
			}else if(e.clientX - _this._x > 0){
				_this.thisObj.animate(
					{
						left: _this.lineSearch(parseInt(_this.thisObj.css("left")), true)
					}, 1200
				);
			}
			_this.isMouseDown = false;
		}
	});
}
slideDrag.prototype.lineSearch = function(left, isLeft){
	for(var i=0; i < _this.leftArray.length; i++){
		if(left <= _this.leftArray[i] && left >= _this.leftArray[i+1]){
			if(isLeft){
				return _this.leftArray[i];
			}else{
				return _this.leftArray[i+1];
			}
		}
	}
}