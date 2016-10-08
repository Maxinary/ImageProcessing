function getPixelValue(imgData, x, y){
	if(y >= 0 && y < imgData.height && x >= 0 && x < imgData.width){
		return imgData.data.slice(y*4*imgData.width+x*4, y*4*imgData.width+x*4 + 3);
	}else{
		return [];
	}
}

function getPixelValueGammaCorrected(imgData, x, y, gamma){//gamma optional
	if(y >= 0 && y < imgData.height && x >= 0 && x < imgData.width){
	  var data = imgData.data.slice(y*4*imgData.width+x*4, y*4*imgData.width+x*4 + 3);
	  var out = [0,0,0];
		for(var i=0; i<data.length;i++){
		  if(gamma !== undefined){
  		  out[i] = Math.pow(data[i]/255.0, gamma);
		  }else{
  		  out[i] = Math.pow(data[i]/255.0, 2.2);//assume 2.2
		  }
		}
		return out;
	}else{
		return [];
	}
}

function max(arr){
  return Math.max.apply(null, arr);
}

function min(arr){
  return Math.min.apply(null, arr);
}

function edge(dat){
  var buffer8 = new Uint8ClampedArray(dat.data.length);
  for(var i=0; i<dat.data.length; i+=4){
    var surroundRed = [];
    var surroundGreen = [];
    var surroundBlue = [];
    
    for(var j=-1;j<2;j++){
      for(var k=-1;k<2;k++){
  		  var color = getPixelValue(dat, Math.floor(i/4)%dat.width + j, Math.floor(i/(4*dat.width)+k));
  		  if(color.length !== 0){
    		  surroundRed.push(color[0]);
    		  surroundGreen.push(color[1]);
    		  surroundBlue.push(color[2]);
  		  }
  	  }
    }
    
    //reversing gamma correction
    buffer8[i] = (max(surroundRed)-min(surroundRed));
    buffer8[i+1] = (max(surroundGreen)-min(surroundGreen));
    buffer8[i+2] = (max(surroundBlue)-min(surroundBlue));
    buffer8[i+3] = 255;
  }
  
  return new ImageData(buffer8, dat.width, dat.height);
}

window.onload = function(){
  var c = document.getElementById("imageHolder");
  var cOut = document.getElementById("imageDrawer");
  var origImg = document.getElementById("inImg");
  
  c.width = origImg.width;
  c.height = origImg.height;
  cOut.width = origImg.width;
  cOut.height = origImg.height;
  
  var ctx = c.getContext("2d");
  var ctxOut = cOut.getContext("2d");
  
  ctx.drawImage(origImg, 0, 0, origImg.width, origImg.height);
  
  var imgData = ctx.getImageData(0, 0, origImg.width, origImg.height);

  for(var i=0;i<1;i++){
    imgData = edge(imgData);
  }

  ctxOut.putImageData(imgData, 0, 0);
};