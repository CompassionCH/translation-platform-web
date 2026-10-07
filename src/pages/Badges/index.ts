import { Component, useState, onWillStart, onMounted } from "@odoo/owl";
import template from './badges.xml';
import { BlurLoader } from '../../components/Loader';
import useCurrentTranslator from "../../hooks/useCurrentTranslator";
import _ from "../../i18n";
import { buildTutorial, hideTutorial, startTutorial } from "../../tutorial";
import { models } from "../../models";
import { BadgeCategory } from "../../models/TranslatorDAO";

/**
 * The badges tutorial has its own key, so it is shown once even to users who
 * already finished or exited the main tutorial, without showing the main one again
 */
const BADGES_TUTORIAL_KEY = 'show-badges-tutorial';

type State = {
    badgesCategories: BadgeCategory[];
};

class Badges extends Component {
    static template = template;
    static components = {
        BlurLoader,
    };

    currentTranslator = useCurrentTranslator();
    _ = _;

    state = useState<State>({
        badgesCategories: [],
    });

    tutorial = buildTutorial([
        {
            id: 'step-badges-intro',
            text: _('Welcome to your Achievements page! This is where you can track all your translation milestones.'),
            attachTo: {
                element: 'h1',
                on: 'bottom'
            },
        },
        {
            id: 'step-badges-grid',
            text: _('Your badges are grouped by categories. The colored badges are the ones you have unlocked. The gray ones are waiting for you!'),
            attachTo: {
                element: '.badges-category',
                on: 'top'
            },
        },
        {
            id: 'step-badges-progress',
            text: _('Keep an eye on the progress bar for locked badges. It shows you how close you are to unlocking your next reward. Happy translating!'),
            attachTo: {
                element: '.badge-progress',
                on: 'top'
            },
            classes: 'no-next',
            buttons: [{
                classes: 'bg-compassion text-white',
                text: _('Got it!'),
                action: () => {
                    this.tutorial.complete();
                    hideTutorial(BADGES_TUTORIAL_KEY);
                },
            }],
        }
    ], BADGES_TUTORIAL_KEY);

    setup() {
        onWillStart(async () => {
            await this.currentTranslator.loadIfNotInitialized();
            this.state.badgesCategories = await models.translators.myBadges();
        });

        onMounted(() => {
            // The tutorial describes the badges, so skip it when there is none to show
            if (this.state.badgesCategories.length > 0) {
                startTutorial(this.tutorial, BADGES_TUTORIAL_KEY);
            }
        });
    }
}

export default Badges;