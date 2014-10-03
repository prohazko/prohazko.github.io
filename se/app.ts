
module musico {

    export function init() {
        var app = angular.module('musico', [])

        app.controller(nameof(AlbumListCtrl), AlbumListCtrl);

        app.value(di.AlbumStore, new AlbumStore());


        app.directive('ngRightClick', directives.ngRightClick);
        app.directive('fixButtons', directives.fixButtons);

        app.run(()=>console.log('wow'));
    }

}