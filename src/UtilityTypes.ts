type PropsKind = Record<string, { type?: any }>;

type ConstructorsFinder<T> = 
  T extends StringConstructor ? string :
    T extends BooleanConstructor ? boolean :
      T extends NumberConstructor ? number :
        T extends FunctionConstructor ? Function : 
          T extends ArrayConstructor ? Array<any> : any;


export type PropsType<T extends PropsKind> = {
  [key in keyof T]: ConstructorsFinder<T[key]['type']>;
};