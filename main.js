var dataFn;

function median(arr){
  arr.sort(function(a,b){return a-b;});
  return arr[Math.floor(arr.length/2)];
}

function max(arr){
  return Math.max.apply(null, arr);
}

function min(arr){
  return Math.min.apply(null, arr);
}

var c;
var cOut;
var origImg;
var imgData;

//set dataFn to any imageProcess
dataFn = edge;

window.onload = function(){
  c = document.getElementById("imageHolder");
  cOut = document.getElementById("imageDrawer");
  origImg = document.getElementById("inImg");
  
  c.width = origImg.width;
  c.height = origImg.height;
  cOut.width = origImg.width;
  cOut.height = origImg.height;
  
  var ctx = c.getContext("2d");
  var ctxOut = cOut.getContext("2d");
  
  ctx.drawImage(origImg, 0, 0, origImg.width, origImg.height);
  
  imgData = ctx.getImageData(0, 0, origImg.width, origImg.height);

  var newImgData = dataFn(imgData);
  ctxOut.putImageData(newImgData, 0, 0);
};