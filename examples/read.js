var controller = require('node-usbController');
var con = require('./attack3.json');

var x = new controller(1133,49684,con);

x.on('trigger',function(data){console.log(data,'trigger');});
x.on('button2',function(data){console.log(data,'button2');});
x.on('button3',function(data){console.log(data,'button3');});
x.on('button4',function(data){console.log(data,'button4');});
x.on('button5',function(data){console.log(data,'button5');});
x.on('button6',function(data){console.log(data,'button6');});
x.on('button7',function(data){console.log(data,'button7');});
x.on('button8',function(data){console.log(data,'button8');});
x.on('y-axis',function(data){console.log(data,'y-axis');});
x.on('x-axis',function(data){console.log(data,'x-axis');});
x.on('lever',function(data){console.log(data,'lever');});