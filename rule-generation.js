//get default schema
var xhr;var defaultSchema;
function loadDefault()
{
 xhr = new XMLHttpRequest();
xhr.open("GET", "schema.json", true);
xhr.onreadystatechange = function() {
	if ((xhr.status === 200)&&(xhr.readyState==4)) 
	{
		defaultSchema=JSON.parse(xhr.responseText);
	}
};
	xhr.onerror = function (e) {
	};
	xhr.send();
}

loadDefault();

var rule;
var rules=[];
var warned=false;
function formatError(reason)
{
	if(warned==false){alert("format error: "+lines[linenumber]+" at line "+linenumber+", reason: "+reason);warned=true;}
	console.error("format error: "+lines[linenumber]+" at line "+linenumber+", reason: "+reason);
}
function formatWarning(reason)
{
	console.warn("format warning: "+lines[linenumber]+" at line "+linenumber+", reason: "+reason);
}
function formatInfo(reason)
{
	console.info("format info: "+lines[linenumber]+" at line "+linenumber+", reason: "+reason);
}
function getClass(str)
{
	for(var i=0;i<schema.schema.length;i++)
	{
		for(var j=0;j<schema.schema[i].types.length;j++)
		{
			if(schema.schema[i].types[j]==str)
			{
				return schema.schema[i].class;
			}
		}
	}
	formatError("type not found: "+str);
}
function createCondition(cond)
{//now this returns a condition object for reusablilty
	var index=cond.indexOf(",");var condObj={};
	if(index!=-1)
	{
		condObj.first=cond.substring(0,index);if(condObj.first.indexOf(" ")>=0){formatError("space detected in variable name"+condObj.first);}
		cond=cond.substring(index+1).trim();
		var match=cond.match("\\w+");
		condObj.second=cond.substring(0,match[0].length);
		cond=cond.substring(match[0].length).trim();
	}
	else
	{
		var match=cond.match("\\w+");
		condObj.first=cond.substring(0,match[0].length);
		cond=cond.substring(match[0].length).trim();
	}
	if(cond.match("^not"))
	{
		condObj.value=false;
		cond=cond.substring(3).trim();
	}
	var type=cond.match("\\w+")[0];
	condObj.type=type;
	cond=cond.substring(type.length).trim();
	condObj.class=getClass(type);
	if(cond.length>0)
	{
		condObj.operator=cond[0];if(!cond[0].match("[<>=]")){formatError("unrecognized operator "+cond[0]);}
		condObj.value=Number(cond.substring(1));
	}
	if("value" in condObj==false){condObj.value=true;}
	return condObj;
}
function createEffect(cond)
{//effects are just like conditions; so here cond means postconditions LOL
	var index=cond.indexOf(",");var condObj={};
	if(index!=-1)
	{
		condObj.first=cond.substring(0,index);if(condObj.first.indexOf(" ")>=0){formatError("space detected in variable name"+condObj.first);}
		cond=cond.substring(index+1).trim();
		var match=cond.match("\\w+");
		condObj.second=cond.substring(0,match[0].length);
		cond=cond.substring(match[0].length).trim();
	}
	else
	{
		var match=cond.match("\\w+");
		condObj.first=cond.substring(0,match[0].length);
		cond=cond.substring(match[0].length).trim();
	}
	if(cond.match("^not"))
	{
		condObj.value=false;
		cond=cond.substring(3).trim();
	}
	var type=cond.match("\\w+")[0];
	condObj.type=type;
	cond=cond.substring(type.length).trim();
	condObj.class=getClass(type);
	if(cond.length>0)
	{
		condObj.operator=cond[0];if(!cond[0].match("[+-=]")){formatError("unrecognized operator "+cond[0]);}
		condObj.value=Number(cond.substring(1));
	}
	if("value" in condObj==false){condObj.value=true;}
	return condObj;
}
function addIntent(cond)
{
	
	var condObj={};
	if(cond.match("^increase"))
	{
		condObj.intentDirection=true;
	}
	else if(cond.match("^decrease"))
	{
		condObj.intentDirection=false;
	}
	else{formatError("no intent direction found");}
	cond=cond.substring(8).trim();
	var index=cond.indexOf(",");
	if(index!=-1)
	{
		condObj.first=cond.substring(0,index);if(condObj.first.indexOf(" ")>=0){formatError("space detected in variable name"+condObj.first);}
		cond=cond.substring(index+1).trim();
		var match=cond.match("\\w+");
		condObj.second=cond.substring(0,match[0].length);
		cond=cond.substring(match[0].length).trim();
	}
	else
	{
		var match=cond.match("\\w+");
		condObj.first=cond.substring(0,match[0].length);
		cond=cond.substring(match[0].length).trim();
	}
	var type=cond.match("\\w+")[0];
	condObj.type=type;
	cond=cond.substring(type.length).trim();
	condObj.class=getClass(type);
	
	rule.intent=condObj;//this time no excuses, I'm just too lazy to change the cond name
}
function sanitize(r)
{
	if("intent" in r)
	{
		//is top-level rule
		if("leadsTo" in r==false)
		{formatError("top level rule has no leads-to rules: "+r.name);}
		if("conditions" in r==false)
		{r.conditions=[];}
		if("influenceRules" in r==false)
		{r.influenceRules=[];}
	}
	else
	{
		if("effects" in r)
		{
			//is terminal rule
			if("conditions" in r==false)
			{r.conditions=[];}
			if("influenceRules" in r==false)
			{r.influenceRules=[];}
			if("isAccept" in r==false)
			{r.isAccept=true;}
		}
		else
		{
			//intermediate level rule
			if("leadsTo" in r==false)
			{formatError("intermediate level rule has no leads-to rules: "+r.name);}
			if("conditions" in r==false)
			{r.conditions=[];}
			if("influenceRules" in r==false)
			{r.influenceRules=[];}
		}
	}
}
function createReverseCond(cond)
{
	var tempc=JSON.parse(JSON.stringify(cond));
	if("operator" in cond==false)
	{
		//assuming boolean for now
		tempc.value=!tempc.value;
	}
	else
	{
		//do not allow equal sign, because it needs != as reverse and we don't have that, so it's specially handled
		if(tempc.operator==">"){tempc.operator="<";tempc.value++;}
		else {if(tempc.operator=="<"){tempc.operator=">";tempc.value--;}else{formatError("unsupported reversing operator "+tempc.operator);}}
	}
	return tempc;
}
function splitARule(r,cond,effs,elseEffs)
{
	//return an array of two generated rules
	var a=[];var tempr;
	//true branch; generate new name and effects
	tempr=JSON.parse(JSON.stringify(r));
	tempr.name+="_t";//true, for now; maybe use clearer suffixes later
	tempr.conditions.push(cond);
	tempr.effects=tempr.effects.concat(effs);
	a.push(tempr);
	if(cond.operator=="=")
	{
		//assuming numeric; special case for equal because it needs three-way splitting
		tempr=JSON.parse(JSON.stringify(r));
		tempr.name+="_g";//greater than
		var tempc=JSON.parse(JSON.stringify(cond));
		tempc.operator=">";
		tempr.conditions.push(tempc);
		tempr.effects=tempr.effects.concat(elseEffs);
		a.push(tempr);
		tempr=JSON.parse(JSON.stringify(r));
		tempr.name+="_l";//lesser than
		tempc=JSON.parse(JSON.stringify(cond));
		tempc.operator="<";
		tempr.conditions.push(tempc);
		tempr.effects=tempr.effects.concat(elseEffs);
		a.push(tempr);
	}
	else
	{
		//false branch; generate new name and effects
		tempr=JSON.parse(JSON.stringify(r));
		tempr.name+="_f";//false; maybe use clearer suffixes later
		tempr.conditions.push(createReverseCond(cond));
		tempr.effects=tempr.effects.concat(elseEffs);
		a.push(tempr);
	}
	
	return a;
}
var temprules;//used as temporary queue between iterations
function splitRules()
{
	while(1)
	{
		temprules=[];
		for(var i=0;i<rules.length;i++)
		{
			var cond; var effs; var elseEffs;var ruletosplit;
			if("effects" in rules[i]==false){continue;}
			for(var j=0;j<rules[i].effects.length;j++)
			{
				if("condition" in rules[i].effects[j])
				{
					cond=rules[i].effects[j].condition;effs=rules[i].effects[j].effects;elseEffs=rules[i].effects[j].elseEffects;
					var temp=rules[i].effects.splice(j+1);rules[i].effects.pop();
					rules[i].effects=rules[i].effects.concat(temp);//take out this effect object
					ruletosplit=rules[i];//remember the rule
					rules[i]=null;//remove the rule for this iteration
					var splitted=splitARule(ruletosplit,cond,effs,elseEffs);
					//must alter all leads to arrays containing this rule so it doesn't break
					for(var k in rules)
					{
						if(rules[k])
						{
							if("leadsTo" in  rules[k])
							{
								var tempindex=rules[k].leadsTo.indexOf(ruletosplit.name);
								if(tempindex>=0)
								{
									var templeadsto=rules[k].leadsTo.splice(tempindex+1);rules[k].leadsTo.pop();
									rules[k].leadsTo=rules[k].leadsTo.concat(templeadsto);
									for(var l=0;l<splitted.length;l++)
									{
										rules[k].leadsTo.push(splitted[l].name);
									}
								}
							}
						}
					}
					for(var k in temprules)
					{
						if(temprules[k])
						{
							if("leadsTo" in  temprules[k])
							{
								var tempindex=temprules[k].leadsTo.indexOf(ruletosplit.name);
								if(tempindex>=0)
								{
									var templeadsto=temprules[k].leadsTo.splice(tempindex+1);temprules[k].leadsTo.pop();
									temprules[k].leadsTo=temprules[k].leadsTo.concat(templeadsto);
									for(var l=0;l<splitted.length;l++)
									{
										temprules[k].leadsTo.push(splitted[l].name);
									}
								}
							}
						}
					}//no rule leads to itself so updating other rules should be fine
					temprules=temprules.concat(splitted);//save split rules for next iteration
					break;//only split for one conditional per iteration
				}
			}
		}
		var oldrules=rules.filter(function(a){if(a==null)return false;return true;});
		rules=oldrules.concat(temprules);
		if(temprules.length==0){break;}//finally done
	}
}
var linenumber;// global line number
var lines;//global lines
var lineheader;//global header string
var schema;//loaded from some input json text
function parse()
{
	rules=[];
	//if(document.getElementById("schematext").value.length>0){schema=JSON.parse(document.getElementById("schematext").value);}
	//else{
		schema=defaultSchema;
	//}//by default schema.json is loaded from the web page's folder, no need to paste it every time unless you need to change it
	var line;var matched;var displayName;
	lines=document.getElementById("ruletext").value.split("\n");
for(linenumber=0;linenumber<lines.length;linenumber++)
{
	if(lines[linenumber].length==0){continue;}
	line=lines[linenumber];
	matched=line.match(".+?:");if(!matched){continue;}
	lineheader=matched[0].substring(0,matched[0].length-1);line=line.substring(matched[0].length).trim();
	switch (lineheader)
	{
		case "name":
			rule={};rules.push(rule);
			var dni=line.indexOf(",");//display name index
			displayName=null;
			if(dni!=-1){displayName=line.substring(dni+1).trim();line=line.substring(0,dni).trim();}
			rule.name=line.trim();if(displayName){rule.displayName=displayName;}
			break;
		case 'leads to':
			var rulenames=line.split(",");
			for(var i=0;i<rulenames.length;i++)
			{
				rulenames[i]=rulenames[i].trim();
			}
			rule.leadsTo=rulenames;
			break;
		case 'intent':
			addIntent(line.trim());
			break;
		case 'conditions':
			var conditions=line.split(";");if("conditions" in rule==false){rule.conditions=[];}
			for(var i=0;i<conditions.length;i++)
			{
				rule.conditions.push(createCondition(conditions[i].trim()));
			}
			break;
		case 'effects':
			var c=line.match("if\\s.+?:");//conditional clause
			if(c)
			{//then all effects on this line are subject to this condition
				//note that for now allowing multiple conditions is not a good idea because conditions can only be connected with AND not OR, so generating negation of multiple conditions is pretty inefficient; better save this until we can use OR to connect conditions in Ensemble
				var condEff={};
				var condition=c[0].substring(2,c[0].length-1).trim();
				condEff.condition=createCondition(condition);
				line=line.substring(c[0].length).trim();
				//check for else clause
				var ec=line.match(".*?else\\s*:");//else clause
				if(ec)
				{
					var elseEff={};condEff.elseEffects=[];
					var elseEffects=line.substring(ec[0].length).split(";");//effects after the else:
					for(var i=0;i<elseEffects.length;i++)
					{	
						if(elseEffects[i].trim()){condEff.elseEffects.push(createEffect(elseEffects[i].trim()));}
					}
					line=line.substring(0,line.length-line.match("else\\s*:.*")[0].length).trim();
				}
				else{condEff.elseEffects=[];}
				var effects=line.split(";");condEff.effects=[];
				for(var i=0;i<effects.length;i++)
				{
					if(effects[i].trim()){condEff.effects.push(createEffect(effects[i].trim()));}
				}
				if("effects" in rule==false){rule.effects=[];}
				rule.effects.push(condEff);//a conditional effect object in the list, will be split later
			}
			else
			{
				var effects=line.split(";");if("effects" in rule==false){rule.effects=[];}
				for(var i=0;i<effects.length;i++)
				{
					rule.effects.push(createEffect(effects[i].trim()));
				}
			}
			break;
		case "is accept":
			if(line.match("true")){rule.isAccept=true;}
			if(line.match("false")){rule.isAccept=false;}
		default: formatError("unknown line header");
	}
	
}
for(var i=0;i<rules.length;i++){sanitize(rules[i]);}//add necessary attributes like influence rules that I'm not using, and also split conditional rules until they are no longer conditional
splitRules();
var ruleobj={fileName:"actions.json",actions:rules};
cif.clearActionLibrary();//modified cif.js to add this one
actions = cif.addActions(ruleobj);
}