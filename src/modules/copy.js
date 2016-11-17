window.onload = function(){

  setInterval(save, 3 * 1000);

};

function save () {
  var asciiPicture
  asciiPicture = document.getElementById('ascii').innerHTML
  document.getElementById('copy').innerHTML = asciiPicture

}
