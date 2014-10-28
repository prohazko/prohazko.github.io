module abtn.ctrl {

    export class MarkupCtrl {

        config: Config = null;

        markupHtml = "<blink> no markup </blink>"

        constructor(
            private buttonStore: service.ButtonStore,
            private markupService: service.MarkupService) {

            this.config = buttonStore.getCurrent();

            if (this.config) {
                this.markupHtml = markupService.getMarkup(this.config);
            }

            window['c_markup'] = this;

        }

    }
} 