module abtn.ctrl {

    export class RootCtrl {

        title = "zad"

        constructor(private buttonStore:service.ButtonStore) {

            window['z'] = this;
        }
    }
} 