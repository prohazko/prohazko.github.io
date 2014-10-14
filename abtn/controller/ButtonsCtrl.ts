module abtn.ctrl {

    export class ButtonsCtrl {

        public config = new Config();
        public selected = null;

        constructor(private $scope:ng.IScope, private buttonStore:service.ButtonStore) {

            buttonStore.load()
                .then(cfg => this.config = cfg)
                .then(cfg => safeDigest(this.$scope));
            

            window['z2'] = this;
        }
    }
} 