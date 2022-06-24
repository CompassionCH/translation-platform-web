import { XMLParser, XMLBuilder } from "fast-xml-parser";

const builder = new XMLBuilder({});

const typesSerializers = {
  int: {
    test: (v: number) => typeof v === 'number' && Math.round(v) === v,
    serialize: (v: number) => v,
    parse: (v: string) => parseInt(v, 10),
  },
  double: {
    test: (v: number) => typeof v === 'number' && Math.round(v) !== v,
    serialize: (v: number) => v,
    parse: (v: string) => parseFloat(v),
  },
  boolean: {
    test: (v: boolean) => typeof v === 'boolean',
    serialize: (v: boolean) => v ? 1 : 0,
    parse: (v: string) => v === '1' ? true : false,
  },
  'dateTime.iso8601': {
    test: (v: Date) => v instanceof Date,
    serialize: (v: Date) => v.toISOString(),
    parse: (v: string) => new Date(v),
  },
  base64: {
    test: (v: string) => {
      try {
        window.atob(v);
        return true;
      } catch {
        return false;
      }
    },
    serialize: (v: string) => v,
    parse: (v: string) => v,
  },
  string: {
    test: (v: string) => true,
    serialize: (v: string) => v,
    parse: (v: string) => v,
  },
  struct: {
    test: (v: object) => typeof v === 'object',
    serialize: (v: object) => {
      
    }
  }
};

function serialize(methodName: string, params: any[]) {

  builder.build({
    methodCall: {
      methodName,
      params: {

      }
    }
  });
}