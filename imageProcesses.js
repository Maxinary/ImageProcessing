function round(dat, roundLevel){
  var buffer8 = new Uint8ClampedArray(dat.data.length);
  for(var i=0; i<dat.data.length; i+=4){
	  var color = getPixelValueGammaCorrected(dat, Math.floor(i/4)%dat.width, Math.floor(i/(4*dat.width)));
	  buffer8[i] = Math.pow(Math.floor(color[0]*roundLevel)/roundLevel, 1/2.2)*255;
	  buffer8[i+1] = Math.pow(Math.floor(color[1]*roundLevel)/roundLevel, 1/2.2)*255;
	  buffer8[i+2] = Math.pow(Math.floor(color[2]*roundLevel)/roundLevel, 1/2.2)*255;
	  buffer8[i+3] = 255;
  }
  
  return new ImageData(buffer8, dat.width, dat.height);
}

function smear(dat, distance){
var buffer8 = new Uint8ClampedArray(dat.data.length);
  for(var i=0; i<dat.data.length; i+=4){
    var surroundRed = [];
    var surroundGreen = [];
    var surroundBlue = [];
    
    for(var j=-distance;j<distance+1;j++){
      for(var k=-distance;k<distance+1;k++){
  		  var color = getPixelValue(dat, Math.floor(i/4)%dat.width + j, Math.floor(i/(4*dat.width)+k));
  		  if(color.length !== 0){
    		  surroundRed.push(color[0]);
    		  surroundGreen.push(color[1]);
    		  surroundBlue.push(color[2]);
  		  }
  	  }
    }
    
    //reversing gamma correction
    buffer8[i] = median(surroundRed);
    buffer8[i+1] = median(surroundGreen);
    buffer8[i+2] = median(surroundBlue);
    buffer8[i+3] = 255;
  }
  
  return new ImageData(buffer8, dat.width, dat.height);
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

function edgeNoColor(dat){
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
    
    var tot = 1-Math.round(Math.pow(
        ((max(surroundRed)-min(surroundRed))+(max(surroundGreen)-min(surroundGreen))+(max(surroundBlue)-min(surroundBlue)))/(3*255)
      , 0.42)
    );
    
    //reversing gamma correction
    buffer8[i] = tot*219;
    buffer8[i+1] = tot*209;
    buffer8[i+2] = tot*179;
    buffer8[i+3] = 255;
  }
  
  return new ImageData(buffer8, dat.width, dat.height);
}

function hueBlind(dat){
  var buffer8 = new Uint8ClampedArray(dat.data.length);
  for(var i=0; i<dat.data.length; i+=4){
    var rgb = dat.data.slice(i, i+3);
    var hsl = toHSL(rgb);
    hsl[0] = 240;
    var rgbO = fromHSL(hsl);
    
    //reversing gamma correction
    buffer8[i] = rgbO[0];
    buffer8[i+1] = rgbO[1];
    buffer8[i+2] = rgbO[2];
    buffer8[i+3] = 255;
  }

  return new ImageData(buffer8, dat.width, dat.height);
}


function saturationBlind(dat){
  var buffer8 = new Uint8ClampedArray(dat.data.length);
  for(var i=0; i<dat.data.length; i+=4){
    var rgb = dat.data.slice(i, i+3);
    var hsl = toHSL(rgb);
    hsl[1] = 0;
    var rgbO = fromHSL(hsl);
    
    //reversing gamma correction
    buffer8[i] = rgbO[0];
    buffer8[i+1] = rgbO[1];
    buffer8[i+2] = rgbO[2];
    buffer8[i+3] = 255;
  }

  return new ImageData(buffer8, dat.width, dat.height);
}

function lightnessBlind(dat){
  var buffer8 = new Uint8ClampedArray(dat.data.length);
  for(var i=0; i<dat.data.length; i+=4){
    var rgb = dat.data.slice(i, i+3);
    var hsl = toHSL(rgb);
    hsl[2] = 0.5;
    var rgbO = fromHSL(hsl);
    
    //reversing gamma correction
    buffer8[i] = rgbO[0];
    buffer8[i+1] = rgbO[1];
    buffer8[i+2] = rgbO[2];
    buffer8[i+3] = 255;
  }

  return new ImageData(buffer8, dat.width, dat.height);
}
