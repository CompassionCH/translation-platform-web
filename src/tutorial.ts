import { onMounted, useState } from '@odoo/owl';
import Shepherd from 'shepherd.js';
import _ from './i18n';

/**
 * User might notify that he doesn't want to watch tutorial anymore
 * Settings are saved in local storage
 */
const TUTORIAL_DISPLAY_KEY = 'show-tutorial';
const showTutorial = window.localStorage.getItem(TUTORIAL_DISPLAY_KEY) || '1';

export function runTutorial(steps: Shepherd.Step.StepOptions[]) {
  const tutorial = new Shepherd.Tour({
    useModalOverlay: true,
  });

  steps.forEach((step) => {
    if (!step.buttons) {
      step.buttons = [];
    }

    // @ts-ignore chuis qu'un thug wesh
    step.buttons.splice(0, 0, {
      classes: 'bg-slate-700 text-white',
      action: () => {
        tutorial.cancel();
        window.localStorage.setItem(TUTORIAL_DISPLAY_KEY, '0');
      },
      text: _('Close'),
    });
  });

  tutorial.addSteps(steps);

  return useState({
    
  });
};