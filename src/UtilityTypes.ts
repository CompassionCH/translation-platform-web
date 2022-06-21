/**
 * This file lists utility Typescript types that can be used to
 * enhance development experience
 */

// Defines the base structure of the props object in a component
type PropsKind = Record<string, { type?: any }>;

// Attempts to find the type of a prop given its constructor.
// For example, defining a prop { type: String }, String is actually
// a StringConstructor, so this type will map it to the simple `string` type
type ConstructorsFinder<T> = 
  T extends StringConstructor ? string :
    T extends BooleanConstructor ? boolean :
      T extends NumberConstructor ? number :
        T extends FunctionConstructor ? Function : 
          T extends ArrayConstructor ? Array<any> : any;


/**
 * This type can be used to infer the type of props given 
 * a component props object. For example:
 * const props = {
 *    myProps: { type: String },
 * };
 * 
 * type Props = PropsType<typeof props>; // { myProps: string }
 */
export type PropsType<T extends PropsKind> = {
  [key in keyof T]: ConstructorsFinder<T[key]['type']>;
};