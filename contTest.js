var HID = require('node-hid');

function usbController(pid,vid,config){
	var controller = new HID.HID(pid,vid);
	var eventTriggers = [];
	var previousValue;
	
	var reduceToConfVals = function(data,position){
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
		//console.log('eventHandler',eventTrigger);
		var trigger = eventTrigger.eventTrigger;
		var position = config[trigger].pos;
		var type = config[trigger].type;
		
		if(type === 'button'){
			var buttonVals = reduceToConfVals(data,position); //When multiple button are pressed we have to separate their values
			var previousButtonVals = reduceToConfVals(previousValue[position],position);
			//console.log(previousVals,'previousValue');
			
			for(var i=0;i<buttonVals.length;i++){
				var pressedLast = false;
				
				/*We need to check if the button was already pressed last
				time around so the callback does not refire if a second button
				is pressed before the first is release*/
				
				
				for(var l=0;l<previousButtonVals.length;l++){ 
					//console.log(previousVals,trigger);
					if(previousButtonVals[l]===trigger){
						pressedLast = true;
						//console.log(pressedLast);
					}
				}
				
				if(buttonVals[i] === trigger && !pressedLast){
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
			
				if(data[position] !== previousValue[position]){//currently only checking for change
					//console.log(data[position]);
					eventHandler(data[position],eventTriggers[i]); //This is actually fired multiple times if multiple buttons share the same position
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

