module abtn {

    export function init() {
        var app = angular.module('abtn', []);

        values(ctrl).forEach(x=> app.controller(nameof(x), x));

        values(service).forEach(x=> app.service(camel(x), x));

        app.directive('elementInit', function elementInit() {
            var ctor = (scope: any, element: any, attr: any) =>
                scope[attr.elementInit].init &&
                scope[attr.elementInit].init(element)

                return [() => ctor];
        } ());

        app.directive('viewport', function elementInit() {

            var height = () => $(window).height() - $('.abtn-navbar').height();
            var ctor = (scope: any, element: any, attr: any) => {
                var offset = (+attr.viewport) || 0;
                element.height(height() + offset);
                $(window).resize(() => element.height(height() + offset ));
            };

            return [() => ctor];
        } ());

        app.run(() => console.log('start'));
    }
} 