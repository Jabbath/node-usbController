node-usbController
==================

This module aims to allow you to interface with any usb controller, needing only a simple config file.

##Usage

To use this module you will first need to make a JSON config file for your controller. 
There are two types of inputs you need to consider, buttons and those that move on a axis (joysticks).

<pre><code>
{
"axis":{"type": "axis","pos": 1},
"button": {"type": "button","pos": 3,"val": 2}
}
</code></pre>

To get the data for this config file you will have to use node-hid like so:

<pre><code>
var HID = require('node-hid');
console.log(HID.devices()); //locate your device by pid and vid
var device = HID.HID(pid,vid);
device.on("data",function(data){console.log(data.toJSON());});
</code></pre>

Then, simply note the array position of each input and in the case of buttons, their value when pressed (in base 10).

Next, you can use the module via:

<pre><code>
var controller = require('node-usbController');
var con = require('./config.json');

var x = new controller(pid,vid,con);

x.on('button2',function(data){console.log(data,'button2');});
x.on('y-axis',function(data){console.log(data,'y-axis');});
</code></pre>

##Contributing

Feel free to submit a pull request if you have some useful changes to make. Any contributions are appreciated.

##License
MIT License. See License.txt.

