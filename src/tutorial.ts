import Shepherd from 'shepherd.js';
import _ from './i18n';

/**
 * User might notify that he doesn't want to watch tutorial anymore
 * Settings are saved in local storage
 */
const TUTORIAL_DISPLAY_KEY = 'show-tutorial';
export const showTutorial = (displayKey = TUTORIAL_DISPLAY_KEY) => (window.localStorage.getItem(displayKey) || '1') === '1';
export const hideTutorial = (displayKey = TUTORIAL_DISPLAY_KEY) => window.localStorage.setItem(displayKey, '0');

/**
 * Builds a tutorial. A specific displayKey can be given so that the tutorial
 * is shown and hidden independently from the main one
 */
export function buildTutorial(steps: Shepherd.Step.StepOptions[], displayKey = TUTORIAL_DISPLAY_KEY) {
  const tutorial = new Shepherd.Tour({
    useModalOverlay: true,
  });

  steps.forEach((step, i) => {

    const buttons = step.buttons as Shepherd.Step.StepOptionsButton[] || [];

    if (!step.classes?.includes('no-exit')) {
      buttons.splice(0, 0, {
        classes: 'bg-slate-700 text-white',
        action: () => {
          tutorial.cancel();
          hideTutorial(displayKey);
        },
        text: _('Exit'),
      });
    }

    if (i < steps.length - 1 && !step.classes?.includes('no-next')) {
      buttons.push({
        classes: 'bg-compassion text-white',
        action: () => tutorial.next(),
        text: _('Next'),
      });
    }

    step.buttons = buttons;
  });

  tutorial.addSteps(steps);
  return tutorial;
};

/**
 * Starts the given tutorial only if the user has no settings saying otherwise
 * @param tutorial 
 * @param displayKey the key used when building the tutorial
 */
export const startTutorial = (tutorial: Shepherd.Tour, displayKey = TUTORIAL_DISPLAY_KEY) => {
  if (showTutorial(displayKey)) {
    tutorial.start();
  }
};