function getPixelValue(imgData, x, y){
	if(y >= 0 && y < imgData.height && x >= 0 && x < imgData.width){
		return imgData.data.slice(y*4*imgData.width+x*4, y*4*imgData.width+x*4 + 3);
	}else{
		return [];
	}
}

function toHSL(rgb){
  var rgbP = [0,0,0];
  for(var i in rgb){
    rgbP[i] = rgb[i]/255;
  }
  Cmax = max(rgbP);
  Cmin = min(rgbP);
  d = Cmax - Cmin;
  
  var hsl = [0,0,0];
  
  //hue
  if(d == 0){
    hsl[0] = 0;
  }else if(Cmax == rgbP[0]){
    hsl[0] = 60*(((rgbP[1]-rgbP[2])/d)%6);
  }else if(Cmax == rgbP[1]){
    hsl[0] = 60*((rgbP[2]-rgbP[0])/d + 2);
  }else{
    hsl[0] = 60*((rgbP[0]-rgbP[1])/d + 4);    
  }
  
  //lightness
  hsl[2] = (Cmax + Cmin)/2;
  
  //saturation
  if(d == 0){
    hsl[1] = 0;
  }else{
    hsl[1] = d/(1-Math.abs(2*hsl[2]-1))
  }
  
  return hsl;
}

function fromHSL(hsl){
  var C = (1 - Math.abs(2*hsl[2] - 1)) * hsl[1];
  var X = C * (1 - Math.abs((hsl[0] / 60) % 2 - 1));
  var m = hsl[2] - C/2;
  
  var rgbP = [0,0,0];
  switch(Math.floor(hsl[0]/60)){
    case 0:
      rgbP = [C, X, 0];
      break;
    case 1:
      rgbP = [X, C, 0];
      break;
    case 2:
      rgbP = [0, C, X];
      break;
    case 3:
      rgbP = [0, X, C];
      break;
    case 4:
      rgbP = [X, 0, C];
      break;
    case 5:
      rgbP = [C, 0, X];
      break;
  }
  
  var rgb = [0,0,0];
  for(var i in rgbP){
    rgb[i] = Math.floor((rgbP[i]+m)*255);
  }
  
  return rgb;
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

function sort(arr){
  if(arr.length <= 1){
    return arr;
  }
  var half = Math.floor(arr.length/2);
  var p1 = sort(arr.slice(0, half));
  var p2 = sort(arr.slice(half, arr.length));
  var total = [];
  for(var i=0; i<p1.length;){
    for(var j=0; j<p2.length;){
      if(p1[i]<p2[j]){
        total.push(p1[i])
        i++;
      }else{
        total.push(p2[i]);
        j++;
      }
    }
  }
  return total;
}

