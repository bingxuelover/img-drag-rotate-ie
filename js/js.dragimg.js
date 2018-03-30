// 图片拖动
var isdrag=false,isRotate=false;
var x,y,tx,ty;
var dobj,objw,objh;

function movemouse(e){
  var ev=e||window.event;
  //if(ev.target!=document.getElementById('dragme')){isdrag=false}
  if (isdrag){
	var movel=tx + ev.clientX - x,
	    movet=ty + ev.clientY - y;
		
	var wdis=750-objw;
	var hdis=350-objh;
	if(wdis>0){
		if(movel<0){movel=0}else if(movel>wdis){movel=wdis}else{movel=movel}
	}else{
		if(movel<wdis){movel=wdis}else if(movel>0){movel=0}else{movel=movel}
	}
	if(hdis>0){
		if(movet<0){movet=0}else if(movet>hdis){movet=hdis}else{movet=movet}
	}else{
		if(movet<hdis){movet=hdis}else if(movet>0){movet=0}else{movet=movet}
	}
	dobj.style.left = movel+'px';
	dobj.style.top  = movet+'px';
	return false;
  }
}

function selectmouse(e){
  var ev = e || window.event;
  var fobj = ev.target || ev.srcElement;
  var topelement = "html" || "body";
  while (fobj.tagName != topelement  &&  fobj.className != "dragme"){
    fobj = fobj.parentNode || fobj.parentElement;
  }
  if (fobj.className=="dragme"){
    isdrag = true;
    dobj = fobj;
	if(isRotate){
		objw=parseInt(dobj.height+0);
		objh=parseInt(dobj.width+0);
	}else{
		objw=parseInt(dobj.width+0);
		objh=parseInt(dobj.height+0);
	}
	//console.log(objw,objh);
	tx = parseInt(dobj.style.left+0);
	ty = parseInt(dobj.style.top+0);
	
    x = ev.clientX;
    y = ev.clientY;
    document.onmousemove=movemouse;
    return false;
  }
}
document.getElementById('dragme').onmousedown=selectmouse;
if(isdrag=true){
	document.onmouseup=new Function('isdrag=false');
}
//旋转
$(function(){
$.extend({
	rotateEvent:function(opts){	
	    var that=this,
		    $elm=$('#dragme'),
			elm=document.getElementById('dragme');
	    var defaults={
			type:''
		}	
		that.data = {
		  angle: $(elm).attr('angle')||0,
		  height: elm.height/2+'px',
		  width: elm.width/2+'px'
		};
		opts=$.extend({},defaults,opts);
		var hardwareAccelerate = function(el) {
		  return $elm.css({
			'-webkit-perspective': 1000,
			'perspective': 1000,
			'-webkit-backface-visibility': 'hidden',
			'backface-visibility': 'hidden'
		  });
		};
		hardwareAccelerate($elm);
		
		this.prototype={
			canTransform:function(){//判断是否支持transform
				var hasTransform, helper, prefix, prefixes, prop, test, tests, value, _i, _len;
				hasTransform = false;
				prefixes = 'webkit,Moz,O,ms,Khtml'.split(',');
				tests = {
				  transform: 'transform'
				};
				for (_i = 0, _len = prefixes.length; _i < _len; _i++) {
				  prefix = prefixes[_i];
				  tests[prefix + 'Transform'] = "-" + (prefix.toLowerCase()) + "-transform";
				} 
				helper = document.createElement('img');
				document.body.insertBefore(helper, null);
				for (test in tests) {
				  prop = tests[test];
				  if (helper.style[test] === void 0) {
					continue;
				  }
				  helper.style[test] = 'rotate(90deg)';
				  
				  value = window.getComputedStyle(helper).getPropertyValue(prop);
				  if ((value != null) && value.length && value !== 'none') {
					hasTransform = true;
					break;
				  }
				}
				document.body.removeChild(helper);
				canTransform = hasTransform ? (function() {
				  return true;
				}) : (function() {
				  return false;
				});
				return canTransform();
			},
		    _rotate:function(angle) {
				var canvasRatio, glltRatio, h, w, _ref, _ref1, _ref2,origin;
				h=that.data.height + " " + that.data.height;
				w=that.data.width + " " + that.data.width;
				that.data.angle=parseInt(that.data.angle);
				
				//判断选装方向				
				if(angle==3){
					that.data.angle-=1;
					if(that.data.angle<0){that.data.angle=3;}
				}else if(angle==1){
					that.data.angle+=1;
					if(that.data.angle>3){that.data.angle=0;}
				}else if(angle==0){
					that.data.angle=0;
				}
				$(elm).attr('angle',that.data.angle);
				
				//角度旋转设置
				this.angle = that.data.angle * 90;
				if(this.angle==90){
					isRotate=true;
					origin=h;
				}else if(this.angle==270){
					isRotate=true;
					origin=w;
				}else{
					isRotate=false;
					origin="50% 50%";
				}
				if (!this.canTransform()) {
					var ty=that.data.angle;
				    elm.style.filter="progid:DXImageTransform.Microsoft.BasicImage(rotation="+ty+")";
					$elm.css({
					  left:0,
					  top:0
					});
				}else{
					$elm.css({
					  transform: "rotate(" + this.angle + "deg)",
					  "transform-origin": origin,
					  left:0,
					  top:0
					});
				}
				that.data.angle += this.angle;
			 },
			 rotateLeft:function() {
				return (this._rotate(3));
			 },
			 rotateRight:function() {
				return (this._rotate(1));
			 },
			 rotateFit:function() {
				return (this._rotate(0));
			 }
		}
		switch (opts.type){
			case 'rotateLeft':
			    this.prototype.rotateLeft();
				break;
			case 'rotateRight':
			    this.prototype.rotateRight();
				break;
			case 'rotateFit':
			    this.prototype.rotateFit();
				break;
			default:
				break;
		}
	}
})
	//动作执行
	$('#rotate_left').on('click',function(){
		var opts={type:'rotateLeft'}
		$.rotateEvent($.extend({},opts));
		return false;
	});
	$('#rotate_right').on('click',function(){
		var opts={type:'rotateRight'}
		$.rotateEvent($.extend({},opts));
		return false;
	});
	$('#rotate_fit').on('click',function(){
		var opts={type:'rotateFit'}
		$.rotateEvent($.extend({},opts));
		return false;
	})
})