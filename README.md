node-usbController
==================

This module aims to allow you to interface with any usb gamepad/controller, needing only a simple config file.

##Usage

To use this module you will first need to make a JSON config file for your controller. 
There are two types of inputs you need to consider, buttons and joysticks (anything that gives off a range of values).

```javascript
//Example config
{
"axis":{"type": "axis","pos": 1},
"button": {"type": "button","pos": 3,"val": 2}
}
```

To get the data for this config file you will have to use node-hid like so:

```javascript
var HID = require('node-hid');
console.log(HID.devices()); //locate your device by pid (productId) and vid (vendorId)
```

Then:

```javascript
var device = new HID.HID(pid,vid);
device.on("data",function(data){console.log(data);});
```

Then, simply note the array position of each input and use that value to populate the input's "pos" property.
Buttons will require you to note the value it emits (in base 10).

Next, you can use the module via:

```javascript
var controller = require('node-usbController');
var config = require('./config.json');
var pid = 5000;//Some number as reported by node-hid or lsusb representing product id
var vid = 6000;

var x = new controller(pid,vid,config);

x.on('button2',function(data){console.log(data,'button2');});
x.on('y-axis',function(data){console.log(data,'y-axis');});
```

##Contributing

Feel free to submit a pull request if you have some useful changes to make. Any contributions are appreciated.

##License
MIT License. See License.txt.

