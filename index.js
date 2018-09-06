// @flow

'use strict';

// $FlowFixMe
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
const { RNLanguages } = NativeModules;

type EventType = 'change';

type EventData = {
  language: string,
  languages: Array<string>
};

type EventHandler = (eventData: EventData) => any;

type RNLanguagesModule = {
  _eventHandlers?: Set<EventHandler>,
  _eventEmitter?: NativeEventEmitter,
  language: string,
  languages: Array<string>,
  addEventListener: (type: EventType, handler: EventHandler) => void,
  removeEventListener: (type: EventType, handler: EventHandler) => void
};

export const language: string = RNLanguages.language;
export const languages: string[] = RNLanguages.languages;

let Module: RNLanguagesModule = {
  language: RNLanguages.language,
  languages: RNLanguages.languages,

  addEventListener(type, handler) {
    if (type !== 'change') {
      console.error(`Trying to subscribe to unknown event: "${type}"`);
    } else if (this._eventHandlers && !this._eventHandlers.has(handler)) {
      this._eventHandlers.add(handler);
    }
  },

  removeEventListener(type, handler) {
    if (type !== 'change') {
      console.error(`Trying to remove listener for unknown event: "${type}"`);
    } else if (this._eventHandlers && this._eventHandlers.has(handler)) {
      this._eventHandlers.delete(handler);
    }
  }
};

if (Platform.OS === 'android') {
  Module._eventHandlers = new Set();
  Module._eventEmitter = new NativeEventEmitter(RNLanguages);

  const onLanguagesChange = (eventData: EventData) => {
    Module.language = eventData.language;
    Module.languages = eventData.languages;

    if (Module._eventHandlers) {
      Module._eventHandlers.forEach(handler => handler(eventData));
    }
  };

  Module._eventEmitter.addListener('languagesDidChange', onLanguagesChange);
}

export default Module;
