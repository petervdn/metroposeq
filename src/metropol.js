autowatch = 1;

// settings
var numberOfSteps = 8;

// patch objects
var randomizeNotesToggle;
var randomizeTriggerAmountToggle;
var randomizeTriggerTypeToggle;
var stepSequencer;
var stepsKnob;

// some storage
var triggerAmountSelects = [];
var triggerTypeSelects = []; 
var noteLowBound;
var noteHighBound;
var triggerAmountLowBound;
var triggerAmountHighBound; 

// whole 1/2 1/4 1/8 1/16 1/32 -- "1/2 dotted" "1/4 dotted" "1/8 dotted" "1/16 dotted" "1/32 dotted" -- "1/2 triplet" "1/4 triplet" "1/8 triplet" "1/16 triplet" "1/32 triplet"

function init()
{
	// get patch objects
	randomizeNotesToggle = patcher.getnamed('randomizeNotesToggle');
	randomizeTriggerAmountToggle = patcher.getnamed('randomizeTriggerAmountToggle');
	randomizeTriggerTypeToggle = patcher.getnamed('randomizeTriggerTypeToggle');
	stepSequencer = patcher.getnamed('stepSequencer');
	stepsKnob = patcher.getnamed('stepsKnob');

	var selector;
	for(var i = 0; i < numberOfSteps; i++)
	{
		// get trigger selects
		selector = patcher.getnamed('triggerTypeSelect' + (i + 1));
		triggerTypeSelects.push(selector);

		// get trigger amounts
		selector = patcher.getnamed('triggerAmount' + (i + 1));
		triggerAmountSelects.push(selector);
	}

	calculateLength();
}


function randomize()
{
	if(randomizeNotesToggle.getvalueof() == 1)
	{
		var message = [1];
		for(var i = 0; i < numberOfSteps; i++)
		{
			var randomNote = Math.round(noteLowBound + Math.random() * (noteHighBound - noteLowBound));
			message.push(randomNote);
		}


		stepSequencer.message('pitch', message);
	}

	if(randomizeTriggerAmountToggle.getvalueof() == 1)
	{
		for(var i = 0; i < triggerAmountSelects.length; i++)
		{
			var randomAmount = Math.round(triggerAmountLowBound + Math.random() * (triggerAmountHighBound - triggerAmountLowBound));

			triggerAmountSelects[i].message(randomAmount);
		}
	}

	if(randomizeTriggerTypeToggle.getvalueof() == 1)
	{
		var numberOfTriggerTypes = 5;
		for(var i = 0; i < triggerTypeSelects.length; i++)
		{
			triggerTypeSelects[i].message(Math.floor(Math.random() * numberOfTriggerTypes));
		}
	}
	
}

function reset()
{
	if(randomizeNotesToggle.getvalueof() == 1)
	{
		var message = [1];
		for(var i = 0; i < numberOfSteps; i++) message.push(60);
		stepSequencer.message('pitch', message);
	}

	if(randomizeTriggerAmountToggle.getvalueof() == 1)
	{
		for(var i = 0; i < triggerAmountSelects.length; i++) triggerAmountSelects[i].message(1);
	}

	if(randomizeTriggerTypeToggle.getvalueof() == 1)
	{
		for(var i = 0; i < triggerTypeSelects.length; i++) triggerTypeSelects[i].message(0);
	}
	
}

function setBounds(type, bound, value)
{
	switch(type)
	{
		case 'note':
		{
			if(bound == 'low')
			{
				noteLowBound = value;
			}
			else
			{
				noteHighBound = value;
			}
			break;
		}
		case 'trigger':
		{
			if(bound == 'low')
			{
				triggerAmountLowBound = value;
			}
			else
			{
				triggerAmountHighBound = value;
			}
			break;
		}
		default:
		{
			postn('Unknown bounds type: ' + type);
		}
	}
	postn(noteLowBound + '-' + noteHighBound);
}

function calculateLength()
{
	if(!stepsKnob) init();

	var steps = stepsKnob.getvalueof();
	var sum = 0;
	for(var i = 0; i < steps; i++)
	{
		sum += parseFloat(triggerAmountSelects[i].getvalueof());
	}
	patcher.getnamed('patternLength').message('set', sum);
}


function postn(message)
{
	post('\n' + message);
}

//init();
postn('js ready');