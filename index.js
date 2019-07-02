// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const consultor = require('./consultor-financeiro')
const promptDefault = "geral";

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Eu sou seu consultor financeiro, como posso ajudar?';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(promptDefault)
            .getResponse();
    }
};

const GeneralIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GeneralIntent';
    },
    async handle(handlerInput) {
      let error = "";
      let response = "";
      try {
        response += await consultor.macro();
        // response += await consultor.currency();
        response += await consultor.ibov();
        // response += await consultor.summary();
      } catch (err) {
        error += "não consegui gerar o resumo geral";
      }

      return handlerInput.responseBuilder
            // .speak("oi")
            .speak(response+error)
            // .reprompt(promptDefault)
            .getResponse();
    }
};
const CurrencyIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'CurrencyIntent';
  },
  async handle(handlerInput) {
    let response = await consultor.currency();

    return handlerInput.responseBuilder
          .speak(response)
        //   .reprompt(promptDefault)
          .getResponse();
  }
};

const StocksIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'StocksIntent';
  },
  async handle(handlerInput) {
    let response = await consultor.ibov();
    response += await consultor.summary();

    return handlerInput.responseBuilder
          .speak(response)
        //   .reprompt(promptDefault)
          .getResponse();
  }
};

const MacroIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'MacroIntent';
  },
  async handle(handlerInput) {
    let response = await consultor.macro();

    return handlerInput.responseBuilder
          .speak(response)
        //   .reprompt(promptDefault)
          .getResponse();
  }
};

const CryptoIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'CryptoIntent';
  },
  async handle(handlerInput) {
    let response = await consultor.crypto();

    return handlerInput.responseBuilder
          .speak(response)
        //   .reprompt(promptDefault)
          .getResponse();
  }
};
const TreasuresIntentHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
          && handlerInput.requestEnvelope.request.intent.name === 'TreasuresIntent';
  },
  async handle(handlerInput) {
    let response = await consultor.treasures();

    return handlerInput.responseBuilder
          .speak(response)
        //   .reprompt(promptDefault)
          .getResponse();
  }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'Posso te dar um resumo se você falar: geral, sobre a bolsa se você falar: ações, sobre índices do mercado se você falar: macro, sobre o tesouro direto se você falar: tesouro. Você ainda pode falar bitcoin e litecoin ou câmbio. Como posso te ajudar?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Até mais!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `Você usou ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            // .reprompt(promptDefault)
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Nesse caso não posso te ajudar. Manda outra.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            // .reprompt(promptDefault)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CryptoIntentHandler,
        CurrencyIntentHandler,
        GeneralIntentHandler,
        HelpIntentHandler,
        MacroIntentHandler,
        StocksIntentHandler,
        TreasuresIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();

