//Dithering
var dataFn;

function matIndex(dim, x, y){
	return shuffleNum(Math.abs(((y%2==0?x:dim-x)-2*y)%dim), dim)
}

function shuffleNum(num, range){
	for(var i=0; i<range; i++){
		if(num%i == i-1){
			num = num-i+1;
		}else{
			num += 1;
		}
	}
	return num%range;
}

function getColors(image, numColors){
	var means = [];
	var groups = [];
	for(var i=0; i<numColors; i++){
		groups.push([]);
		means.push([]);
		for(var j=0; j<3; j++){
			means[i].push(image.data[Math.floor(i*image.data.length/numColors)+j]);
		}
	}
	
	var pp = 0;
	do{
		prevMeans = means.slice(0,means.length);
		for(var i=0; i<groups.length; i++){
		  groups[i] = [];
		}
		for(var i=0; i<image.data.length; i+=4){
			var curPxl = image.data.slice(i,i+3);
			groups[closest(curPxl, means)].push(curPxl);
		}
		for(var i=0; i<means.length; i++){
		  if(groups[i].length !== 0){
  			means[i] = [0, 0, 0];
  			for(var j=0; j<groups[i].length; j++){
  			  for(var k=0; k<groups[i][j].length; k++){
    				means[i][k] += groups[i][j][k];
  			  }
  			}
  			for(var j=0; j<3; j++){
  			  if(groups[i].length !== 0){
      			means[i][j] = Math.floor(means[i][j]/groups[i].length);
  			  }
  			}
  		}
		}
		pp++;
	}while(totalDif(prevMeans, means) > 1 && pp<128);
	console.log("PP");
	console.log(pp);
	console.log("Dif");
  console.log(totalDif(prevMeans, means));
	console.log("Color");
  console.log(means);
	return means;
}

function totalDif(arr1, arr2){
  var total = 0;
  for(var i=0; i<arr1.length; i++){
    total += dif(arr1[i], arr2[i]);
  }
  return total
}

function dif(arr1, arr2){
	var d = 0;
	for(var i=0; i<arr1.length; i++){
		d += Math.pow(arr1[i] - arr2[i], 2);
	}
	return Math.pow(d,1/2);
}

function closest(pixel, colors){
	var min = 256*3;
	var ind = 0;
	for(var i=0; i<colors.length;i++){
		var d = dif(pixel, colors[i]);
		if(d < min){ind = i; min = d;}
	}
	return ind;
}

var avg = function(array1, array2, weight2){
	if(weight2 === undefined){weight2 = 1;}
	return array1.map(function (num, idx) {
		return (num + weight2*array2[idx])/(1+weight2);
	});
}

//returns an imageProcess
function dither(colors, matDim){
  return function(dat){
	  var buffer8 = new Uint8ClampedArray(dat.data.length);
	  for(var i=0; i<dat.data.length; i+=4){
		var x = (i/4)%dat.width;
		var y = Math.floor(i/(4*dat.width));
		var g = closest(
			avg(
				dat.data.slice(i,i+3), 
				colors[matIndex(matDim, x, y)%colors.length],
				1/(colors.length*(1+matIndex(matDim+1, x, y)/(matDim+1+1)))
			), 
		colors);
		
		//reversing gamma correction
		buffer8[i] = colors[g][0];
		buffer8[i+1] = colors[g][1];
		buffer8[i+2] = colors[g][2];
		buffer8[i+3] = 255;
	  }
	  
	  return new ImageData(buffer8, dat.width, dat.height);
  };
}
