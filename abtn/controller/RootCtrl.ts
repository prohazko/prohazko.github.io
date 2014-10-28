module abtn.ctrl {

    var defaultView = "preview";


    export class RootCtrl {

        view;

        constructor(private $rootScope: ng.IRootScopeService, private $location: ng.ILocationService) {

            window['c_root'] = this;

            $rootScope.$on('$locationChangeSuccess', () => this.onLocationChange());

            // this.location.path('/' + name).replace();
            // util.safeApply(this.scope);
            this.view = this.getPath();

            if (!this.getPath()) this.setView(defaultView);
        }

        private setView(view:string) {
            console.log('setView', view);

            if (view && this.view != view) {
                console.log('settingView', view);
                this.view = view;
                this.$location.path('/' + view);
                safeDigest(this.$rootScope);
            }
        }

        private getPath() {
            return (this.$location.path() || '').replace('/', '');
        }

        private onLocationChange() {
            console.log('getPath', this.getPath());

            this.setView(this.getPath());
        }

    }
} 