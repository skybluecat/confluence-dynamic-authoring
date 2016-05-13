# README #

### Introduction ###

Dynamic action rule authoring tool for Ensemble Engine. You can now play the example game and change its rules on the fly! When you are satisfied with the rules you are testing, use the static rule authorin tool to generate a final JSON version that Ensemble Engine can use.

About example game: In Party Time, you are a powerful ghost haunting an old house. Your human, self-appointed host (of course *you* are the one in charge as you've been around long before him) has decided to throw a party - how annoying! You have to take control of those guests, manipulate their actions to make them go away ASAP!

### How do I get set up? ###
 
Run server from project folder:
python -m SimpleHTTPServer 8000
or if using python 3: 
python -m http.server 8000

Then visit:
http://localhost:8000/PartyTime.html

### How to play ###

Every turn you will see buttons listing all possible actions your player character can do. After you press a button to take an action, every other NPC will also take an action. You can also see some descriptive text of each NPC next to his or her action buttons. Use common sense when picking actions, to make them feel bad and leave. If your possessed character leaves, you can possess a new character.

### How to edit rules ###

Type or paste your actions rules in the text box, then click the "update rules" button. New rules will take effect after your next action. The format is explained below, it's the same as in the static authoring tool. A set of example rules is included in the project. If there's any format errors, an alert will pop up for the first error and you can use the browser console to see more errors.

Editing action rules require a social schema; you can change the schema by editing the schema file in the repository (and also change the game JSON files accordingly or the game might not work). For editing other rules, you can use the original Ensemble tools.

#### Action rules format ####

(Non-blank lines should begin with a header and a colon; types of headers are explained below)

name: each "name" line marks the beginning of a new rule and gives it a name; lines following it belong to that rule until a new name line appears. The first name is the internal name; it should not have spaces. The one after the comma is the display name(unlike internal names, can have spaces); omit it and the comma if the rule is not a terminal action. Example - name:insult_stranger_enemy,Insult and make enemies

intent: specify the intent(see Ensemble Engine volitions) of a top-level action. The format is [increase/decrease] [a social state value], where a social state value is [a character variable] [a social state type] if the state(like a trait) belongs to one character; or [a character variable], [another character variable] [a social state type] if the state is between two characters. The social state type name should agree with the schema. Numeric and boolean social states both use increase/decrease. Note that Ensemble requires using "initiator" and "responder" as character variable names when referring to action initiators and responders(so you can only use these in intents, and if you refer to a pair then initiator must be the first one), though you can use additional variable names in conditions and effects. Example - intent: increase initiator,responder closeness

is accept: whether the action is considered accepted by the responder(only useful for terminal actions); is either true or false, defaults to true if omitted. Example - is accept: false

leads to: a list of comma separated action names - not display names. Specify which actions this action can turn out to be(exactly which one will be chosen depends on conditions and weights). Non-terminal rules only. Example - leads to: chat_friend, chat_stranger

conditions: A list of semicolon-separated conditions of the action. If it has no conditions, can be omitted; each condition is a social state expression of the form [character(s)] [social value expression]. For single-character states, character is just the character variable; for two-character relationships, use comma separated first and second characters. If the social state is boolean, follow by the variable type name for true or not+variable name for false; if it's numeric, follow by the variable name+operator+a number. Operators can only be ">","<" or "=". Example - conditions: a, b not enemy; a,b aggression>89

effects: Only terminal(ie, no "leads to" line) actions should have effects. They are just like conditions except operators can be "+" and "-" instead of "<" and ">". You can also have conditions with if and else clauses like "effects: if a,b closeness>50: a not happy; b happy else: a happy"; a line of effects can only have one condition but you can have several effects lines(Ensemble doesn't support conditional effects; this works by creating separate rules for each possible combination, and multiple conditions create an exponential number of split rules, so use sparingly).
