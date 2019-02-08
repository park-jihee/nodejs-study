function add(x, callback) {
  console.log("add!");
  setTimeout(callback, 2000, x+x);
}

add(10, function(number){
  console.log(number);
})