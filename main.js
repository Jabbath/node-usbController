var HID = require('node-hid');

function usbController(pid,vid,config){
	var controller = new HID.HID(pid,vid);
	var eventTriggers = []; //These are the x.on('whatever',function)
	var previousValue; //The set of values from the last time the data event fired
		
	var eventHandler = function(data,eventTrigger){//Handles the detected inputs once we've found them
		//console.log('eventHandler',eventTrigger);
		var trigger = eventTrigger.eventTrigger;
		var position = config[trigger].pos;
		var type = config[trigger].type;
		
		if(type === 'button'){
			var currentVal = data[position] & config[trigger].val; //When multiple button are pressed we have to separate their values
			var previousVal = previousValue[position] & config[trigger].val;
			//console.log(previousVals,'previousValue');
			
			if(currentVal && !previousVal){
				eventTrigger.callback(data[position]);
			}
			
		}
		else if(type === 'axis'){
			eventTrigger.callback(data[position]);
		}
	};
	
	controller.on('data',function(data){
		
		if(previousValue){//This is undefined first data event
			//console.log('prevVal',previousValue);
			for(var i=0;i<eventTriggers.length;i++){
				var eventTrigger = eventTriggers[i].eventTrigger;
				var position = config[eventTrigger].pos;
				var callback = eventTriggers[i].callback;
			
				if(data[position] !== previousValue[position]){//currently only checking for change
					//console.log(data[position]);
					eventHandler(data,eventTriggers[i]); //This is actually fired multiple times if multiple buttons share the same position
				}
			}
		}
		previousValue = data;
		return false;
	});
	
	this.on = function(eventTrigger,callback){
		eventTriggers.push({'eventTrigger': eventTrigger,'callback': callback});
	};
}

module.exports = usbController;