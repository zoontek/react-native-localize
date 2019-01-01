declare module 'react-native-languages' {
  interface EventData {
    language: string;
    languages: string[];
  }

  type EventHandler = (eventData: EventData) => any;

  interface RNLanguagesModule {
    readonly language: string;
    readonly languages: string[];
    addEventListener: (type: 'change', handler: EventHandler) => void;
    removeEventListener: (type: 'change', handler: EventHandler) => void;
  }

  export const language: string;
  export const languages: string[];

  let Module: RNLanguagesModule;

  export default Module;
}
