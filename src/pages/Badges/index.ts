import { Component, useState } from "@odoo/owl";
import template from './badges.xml';
import { BlurLoader } from '../../components/Loader';
import useCurrentTranslator from "../../hooks/useCurrentTranslator";


import _ from "../../i18n";
import { buildTutorial, startTutorial } from "../../tutorial";

type BadgeItem = {
    id: number;
    name: string;
    description: string;
    icon_url: string;
    type: string;
    is_unlocked: boolean;
    progress: number;
    threshold: number;
};

type State = {
    loading: boolean;
};

class Badges extends Component {
    static template = template;
    static components = {
        BlurLoader,
    };

    currentTranslator = useCurrentTranslator();
    _ = _;

    state = useState<State>({
        loading: false,
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
                element: '.badges-grid',
                on: 'top'
            },
        },
        {
            id: 'step-badges-progress',
            text: _('Keep an eye on the progress bar for locked badges. It shows you exactly how many translations you need to unlock your next reward. Happy translating!'),
            classes: 'no-next',
            buttons: [{
                classes: 'bg-compassion text-white',
                text: _('Got it!'),
                action: () => {
                    this.tutorial.complete();
                },
            }],
        }
    ]);

    async setup() {
        this.state.loading = true;
        try {
            await this.currentTranslator.loadIfNotInitialized();
        } catch (error) {
            console.error("Error loading the translator:", error);
        }
        this.state.loading = false;

        setTimeout(() => {
            startTutorial(this.tutorial);
        }, 0);
    }

    getBadgeCurrentValue(badge: BadgeItem): number {
        return Math.round(badge.progress * badge.threshold);
    }
}

export default Badges;