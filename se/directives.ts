module musico.directives {
    export function ngRightClick($parse) {
        return function (scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            var menu = attrs.ngRightClickMenu;
            element.bind('contextmenu', function (event) {
                scope.$apply(function () {
                    event.preventDefault();
                    fn(scope, { $event: event });

                    $(menu).css({
                        display: "block",
                        left: event.pageX,
                        top: event.pageY
                    });

                    $(document.body).one('click', () => $(menu).hide())
                });
            });
        };
    }


    export function fixButtons($parse) {
        return function (scope, element, attrs) {
            var ev = $parse(attrs.fixButtons);
            var el = attrs.fixButtonsEl;

            scope.$watch(attrs.fixButtons, function (val, prev) {
                if (!val) return;
                setTimeout(function () {
                    var $inp = $('input[type="text"]').eq(0);
                    $inp.focus().select();
                    $(el).css({ top: $inp.position().top });
                }, 10);

            });

        };
    }

} 