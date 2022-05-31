import { reactive, useState } from "@odoo/owl";

const useWatch = <T extends object>(state: T, callback: () => void) => {
  return reactive(useState<T>(state), callback);
};

export default useWatch;