var HID = require('node-hid');

function usbController(pid,vid,config){
	var controller = new HID.HID(pid,vid);
	var eventTriggers = [];
	var previousValue;
	
	var reduceToConfVals = function(data,position){//Consider running this earlier so pressing two buttons at once does not retrigger
		var keys = [];
		
		while(data !== 0){
			var greatest = [0,'key'];
		
			for(var prop in config){
				var curKey = config[prop]; 
				
				//We have to find the greatest button value that can fit into the data
				
				if(curKey.type === 'button' && curKey.pos === position && curKey.val <= data && curKey.val>greatest[0]){
					greatest[0] = curKey.val;
					greatest[1] = prop;
				}
			}
			keys.push(greatest[1]);
			data-= greatest[0]; //We subtract this value from the data so we can find the second greatest value that will fit
			//console.log(greatest);
		}
		
		return keys;
	}
	
	var eventHandler = function(data,eventTrigger){
		var trigger = eventTrigger.eventTrigger;
		//console.log('triggered',trigger);
		var position = config[trigger].pos;
		var type = config[trigger].type;
		
		if(type === 'button'){
			var buttonVals = reduceToConfVals(data,position); //When multiple button are pressed we have to separate their values
			//console.log(buttonVals);
			
			for(var i=0;i<buttonVals.length;i++){
				if(buttonVals[i] === trigger && ){
					eventTrigger.callback(data);
				}
			}
			
		}
		else if(type === 'axis'){
			eventTrigger.callback(data);
		}
	};
	
	controller.on('data',function(data){
		data = data.toJSON(); //By default, data is a Buffer object so we need to convert to an Array
		
		if(previousValue){
			//console.log('prevVal',previousValue);
			for(var i=0;i<eventTriggers.length;i++){
				var eventTrigger = eventTriggers[i].eventTrigger;
				var position = config[eventTrigger].pos;
				var callback = eventTriggers[i].callback;
			
				//if(config[eventTrigger].hasOwnProperty('defaultVal')){//Some inputs are not at 0 by default (perhaps not needed) try only checking for change
				if(data[position] !== previousValue[position]){//currently only checking for change
					eventHandler(data[position],eventTriggers[i]);
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

