module abtn {

    export function init() {
        var app = angular.module('abtn', []);

        values(ctrl).forEach(x=> app.controller(nameof(x), x));

        values(service).forEach(x=> app.service(camel(x), x));

        app.directive('elementInit', function elementInit() {
            var ctor = (scope: any, element: any, attr:any) =>
                scope[attr.elementInit].init &&
                scope[attr.elementInit].init(element)

                return [() => ctor];
        }());

        app.run(() => console.log('start'));
    }
} 