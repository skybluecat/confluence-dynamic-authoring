var testme;
var mylist;

var stateInformation = {
};

var gameVariables = {
	"gameOver" : false,
	"endingText" : "NA",
	"turnNumber" : 0,
	"numIntents" : 3,
	"numActionsPerIntent" : 5
};

var setupCharacterDescriptions = function() {
	var mydiv;
	for (var i=0;i<cast.length;i++)
	{
		mydiv=document.getElementById(cast[i]);
		mydiv.innerHTML= getCharacterName(cast[i])+ getCharacterDescription(cast[i]);
	}
};


var setUpInitialState = function(){
	//update our local copies of these variables, and display them.
	updateLocalStateInformation();
};

//Fills in all of the actionList divs with buttons corresponding to the actions the player can take
//by calling individual instances of populateActionList
var populateActionLists = function(storedVolitions, cast){
	for(var i=0;i<cast.length;i++)
	{populateActionList(playerChar, cast[i], storedVolitions, cast);}
};

//Fills the actionList div with buttons corresponding to the actions the player can take.
var populateActionList = function(initiator, responder, storedVolitions, cast){
	var char1 = initiator;
	var char2 = responder;
	
	//Num intents to look at: 5
	//Num actions per intent: 2 (for now!)
	//console.log("storedVolitions before getting possible actions... " , storedVolitions.dump());
	var possibleActions = cif.getActions(char1, char2, storedVolitions, cast, gameVariables.numIntents, gameVariables.numActionsPerIntent);


	
	var mydiv=document.getElementById(char2);

	var tempp;mydiv.innerHTML+="<br/>Actions to "+char2+": ";
	//Let's make a button for each action the hero wants to take!
	for(var i = 0; i < possibleActions.length; i += 1){
		//Make a new button
		var action = possibleActions[i];

		//If the character doesn't have a strong volition to do this action,
		//don't include it in the action list.
		//if(action.weight < -10){
		//	continue;
		//}
		var buttonnode= document.createElement('input');
		buttonnode.setAttribute('type','button');
		buttonnode.setAttribute('name',action);
		buttonnode.setAttribute('value',action.displayName+"("+action.weight+")");
		buttonnode.actionToPerform = action;
		buttonnode.cast = cast;
		buttonnode.onclick = actionButtonClicked;
		//buttonnode.attachEvent('onclick', actionButtonClicked2);


		mydiv.appendChild(buttonnode);
	}

	//Write a little message if there were no possible actions.
	if(possibleActions.length==0){
		
	mydiv.innerHTML+="No actions possible";
	}

};

var actionButtonClicked = function(){
	//Clean away all of the other actions -- they made their choice!
	clearActionList();


	//CHANGE THE SOCIAL STATE -- social physics baby!!!
	var effects = this.actionToPerform.effects; // should be an array of effects.
	for(var i = 0; i < effects.length; i += 1){
		cif.set(effects[i]);
	}
//do not run trigger rules here, because then it would be run multiple times per turn
	
	//Print out if the action was 'accepted' or rejected!
	var statusArea = document.getElementById("actionsMessage");
	var acceptMessage = this.actionToPerform.displayName + " successful! ";
	if(this.actionToPerform.isAccept !== undefined && this.actionToPerform.isAccept === false){
		acceptMessage = this.actionToPerform.displayName + " failed! ";
	}
	statusArea.innerHTML = acceptMessage;
	
	/////////////////////
	//other characters get to act now!
	/////////////////////
	storedVolitions = cif.calculateVolition(cast);
	var NPCActions = new Array();
	var tempAction;
	var i;var j;
	for(i = 0; i < cast.length; i += 1){
		if(cast[i] == playerChar){continue;}
		for(j = 0; j < cast.length; j += 1){
			NPCActions=NPCActions.concat(cif.getActions(cast[i], cast[j], storedVolitions, cast, 3, 3));
		}
		console.log("This is what "+cast[i]+" wants to do:");
		console.log(NPCActions);
		NPCActions=NPCActions.filter(function(a){return(a.weight >= 0)});
		if(NPCActions.length==0){
			console.log("nonono! this guy has no actions! it's the rule writer's fault!");
			continue;
		}
		tempAction = NPCActions[Math.floor(Math.random()*NPCActions.length)];
		effects = tempAction.effects; // should be an array of effects.
		for(j = 0; j < effects.length; j += 1){
			cif.set(effects[j]);
		}
		statusArea.innerHTML += "  "
		acceptMessage = tempAction.goodBindings[0].initiator + " did " +tempAction.displayName + " to "+ tempAction.goodBindings[0].responder+ "!";
		if(tempAction.isAccept !== undefined && tempAction.isAccept === false){
			acceptMessage = tempAction.goodBindings[0].initiator + " did " +tempAction.displayName + " to "+ tempAction.goodBindings[0].responder+ " but failed!";
		}
		statusArea.innerHTML += acceptMessage;
		NPCActions=new Array();
	}
	//RUN SOME TRIGGER RULES based on the new state!
		cif.runTriggerRules(cast);
	//check for characters leaving and eliminate them in Ensemble
	var query;var results;
	for(var k = 0; k < cast.length; k += 1){
		query = {
				"class" : "status",
				"type" : "present",
				"first" : cast[k],
				"value" :true
				};
		results=cif.get(query);
		if(results.length==0)
		{
			cif.setCharacterEliminated(cast[k]);
			var tempdiv=document.getElementById(cast[k]);
			manor.removeChild(tempdiv);
			statusArea.innerHTML += "<b>Good job! "+getCharacterName(cast[k])+" left the party!</b> ";
			cast[k]=undefined;
		}
	}
	cast=cast.filter(function(a){if((typeof a)=="undefined")return false; else return true;});

	updateLocalStateInformation();
	//set up next turn.
	var event = document.createEvent('Event');
	event.initEvent('nextTurn', true, true);
	document.dispatchEvent(event);
};

var clearActionList = function(){
	for(var i=0;i<cast.length;i++)
	{
		document.getElementById(cast[i]).innerHTML="";
	}
};

//Checks to see if the game is over!
var checkForEndConditions = function(){
	/*if(stateInformation.playerAlive == false){
		//uh oh, we lose!
		gameVariables.gameOver = true;
		gameVariables.endingText = "Game Over! You are dead!";
	}
	*/
	
	if(gameVariables.turnNumber>=20)
	{
		//took too long!
		gameVariables.gameOver = true;
		gameVariables.endingText = "Time's up! You did not make everybody leave fast enough. You feel sorry for your ancient ghostly self :(";
	}
	if(cast.length==0)
	{
		gameVariables.gameOver = true;
		gameVariables.endingText = "Congratulations! Your manipulations successfully ended the party and probably left many hearts broken. How sweet for a ghost!";
		var manorDescription=document.getElementById("manorDescription");manorDescription.innerHTML="Haunted house, dignified and empty."
	}

};

//There are certain things that we might need to 'refresh' again (the visibility of the action list,
//the state of dialogue bubbles, etc.)
var cleanUpUIForNewTurn = function(){
};

var updateLocalStateInformation = function(){
//now the player can't be killed because he's a ghost
/*	var playerAlivePred = {
		"class" : "trait",
		"type" : "alive",
		"first" : "player",
		"value" : true,
	};

	var results;
	results=cif.get(playerAlivePred);
	if(results.length>0){stateInformation.playerAlive = true;}
	else{stateInformation.playerAlive=false;}
	*/

};

var getCharacterDescription = function(character){
	var desc=""; var results;
	var query;
	var cats;var types;//categories and types in the schema
	var tempcat;var temptype;
	for(cats=0;cats<rawSchema.schema.length;cats++)
	{
		tempcat=rawSchema.schema[cats];
		if (tempcat.directionType=="undirected")
		{
			if(tempcat.isBoolean==false)
			{
				//undirected number value
				for(types=0;types<tempcat.types.length;types++)
				{
					temptype=tempcat.types[types];
					query = {
					"class" : tempcat.class,
					"type" : temptype,
					"first" : character
					};
					results=cif.get(query);
					if((results.length>0) && typeof(results[0].value)!= "undefined"){desc+=", "+temptype+": "+results[0].value.toString();}
				}
			}
			else
			{
				//undirected boolean value
				for(types=0;types<tempcat.types.length;types++)
				{
					temptype=tempcat.types[types];
					query = {
					"class" : tempcat.class,
					"type" : temptype,
					"first" : character,
					"value" :true
					};
					results=cif.get(query);
					if((results.length>0) && typeof(results[0].value)!= "undefined"){desc+=", "+temptype;}
					//else{desc+=", not "+temptype;}
				}
			}
		}
	}
	return desc;
}
var getCharacterName=function(charid)
{
	if(typeof eval("rawCast.cast."+charid+".name") == "undefined")
				{
					console.log(charid+" is not a valid cast member!");
					return "No such character "+charid;
				}
	else{return eval("rawCast.cast."+charid+".name");}
}