module abtn.ctrl {

    export class FormCtrl {

        constructor(private buttonStore:service.ButtonStore) {
           

            window['formCtrl'] = this;
        }

        createButtons() {
            console.log( 'create btns yo', this.buttonStore.getCurrent().width )
        }

    }
} 