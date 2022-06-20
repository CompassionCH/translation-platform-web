import { useState } from "@odoo/owl";
import { models } from "../models";
import { Language } from "../models/SettingsDAO";

export default () => {

  const state = useState({
    data: [] as Language[],
    loading: false,
  });

  state.loading = true;
  models.settings.languages().then((res) => {
    state.data = res;
    state.loading = false;
  });

  return state;
};