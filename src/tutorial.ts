import Shepherd from 'shepherd.js';
import _ from './i18n';

/**
 * User might notify that he doesn't want to watch tutorial anymore
 * Settings are saved in local storage
 */
const TUTORIAL_DISPLAY_KEY = 'show-tutorial';
export const showTutorial = () => (window.localStorage.getItem(TUTORIAL_DISPLAY_KEY) || '1') === '1';

export function buildTutorial(steps: Shepherd.Step.StepOptions[]) {
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
          window.localStorage.setItem(TUTORIAL_DISPLAY_KEY, '0');
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
 */
export const startTutorial = (tutorial: Shepherd.Tour) => {
  if (showTutorial()) {
    tutorial.start();
  }
};