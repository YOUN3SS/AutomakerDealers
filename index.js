/* Automaker Dealer Finder
Done by : Youness (Youness.net)
Is is for demo purpose only, no copyright, no restrictions, no responsability, no warranty.
Do whatever you want with it, mentionning the author is appreciated

The code is based on Amazon examples:
https://github.com/amzn/alexa-skills-kit-js
*/

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);
        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if ("FindAutomotiveDealerWithCity" === intentName) {
        FindAutomotiveDealerWithCity(intent, session, callback);
    }
    else if ("FindAutomotiveDealer" === intentName) {
        FindAutomotiveDealer(intent, session, callback);
    }
    else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}

// ------- Skill specific business logic -------
var CARD_TITLE = "Car Brain";

function getWelcomeResponse(callback) {
    var sessionAttributes = {},
        speechOutput = "Hello! I'm Car Brain!"
            + " What can I do for you?",
        shouldEndSession = false,
        repromptText = "Please tell me what do you want me to do";

    sessionAttributes = {
        "speechOutput": repromptText,
        "repromptText": repromptText,
    };
    callback(sessionAttributes,
        buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, shouldEndSession));
}

function FindAutomotiveDealerWithCity(intent, session, callback) {
    var sessionAttributes = {};
    var reprompt = session.attributes.speechOutput;
    var city = intent.slots.City.value;

/* dealer database (ugly but... it is the quickest way)
You can add more information, like phone number, address, ... Alexa will read it
*/
    if (city == 'London')
        dealer = 'New Cars'
    else if (city == 'Birmingham')
        dealer = 'Sport Vehicles'
    else if (city == 'Birmingham')
        dealer = 'Auto Showroom'
    else if (city == 'Glasgow')
        dealer = 'Good auctions'
    else if (city == 'Sheffield')
        dealer = 'Electric Cars';

    var speechOutput = "I find one auto-maker in "
                        + city
                        +" city."
                        +" It is: "
                        + dealer;
    callback(session.attributes,
        buildSpeechletResponse(CARD_TITLE, speechOutput, reprompt, true));
}

function FindAutomotiveDealer(intent, session, callback) {
    var sessionAttributes = {};
    var reprompt = session.attributes.speechOutput;
    var speechOutput = "In which city do you want to find it?";
    callback(session.attributes,
        buildSpeechletResponse(CARD_TITLE, speechOutput, reprompt, false));
}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Bye!", "", true));
}

// ------- Helper functions to build responses -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
