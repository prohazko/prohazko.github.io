var musico;
(function (musico) {
    musico.di = {
        albumStore: 'albumStore'
    };

    function extractNameFromSource(def) {
        return (def.toString().match(/function (.+?)\(/) || [, ''])[1];
    }

    function nameof(ent) {
        if (typeof ent == "string")
            return ent;
        if (!ent)
            return 'undefined';

        if (ent.constructor && ent.constructor.name != "Function" && ent.constructor.name != "Object") {
            if (ent.constructor.name)
                return ent.constructor.name;

            /* f#@cking ie*/
            if (ent.constructor && ent.toString() == '[object Object]')
                return extractNameFromSource(ent.constructor);

            return extractNameFromSource(ent);
        } else {
            return ent.name || 'undefined';
        }
    }
    musico.nameof = nameof;
})(musico || (musico = {}));
/// <reference path="./../typings/jquery/jquery.d.ts" />
/// <reference path="./../typings/angularjs/angular.d.ts" />
/// <reference path="util.ts" />
var musico;
(function (musico) {
    function init() {
        var app = angular.module('musico', []);

        app.controller(musico.nameof(musico.AlbumListCtrl), musico.AlbumListCtrl);

        app.value(musico.di.albumStore, new musico.AlbumStore());

        app.directive('ngRightClick', musico.directives.ngRightClick);
        app.directive('fixButtons', musico.directives.fixButtons);

        app.run(function () {
            return console.log('wow');
        });
    }
    musico.init = init;
})(musico || (musico = {}));
var musico;
(function (musico) {
    var AlbumListCtrl = (function () {
        function AlbumListCtrl(albumStore) {
            this.albumStore = albumStore;
            this.albums = [];
            this.editing = null;
            this.active = null;
            this.backup = new musico.Album();
            this.albums = albumStore.all;
        }
        AlbumListCtrl.prototype.addAlbum = function () {
            if (this.editing)
                return;

            var empty = new musico.Album().with({ commited: false });
            this.editing = empty;
            this.albums.push(empty);
        };

        AlbumListCtrl.prototype.commit = function () {
            this.editing = null;
        };

        AlbumListCtrl.prototype.cancel = function () {
            var idx = this.albums.indexOf(this.editing);
            if (!this.editing.commited) {
                this.albums.splice(idx, 1);
            }
            if (this.editing.commited) {
                this.albums[idx] = new musico.Album().with(this.backup);
            }
            this.editing = null;
        };

        AlbumListCtrl.prototype.editActive = function () {
            if (this.editing)
                this.cancel();

            this.backup = new musico.Album().with(this.active);
            this.editing = this.active;
            this.active = null;
        };

        AlbumListCtrl.prototype.deleteActive = function () {
            var idx = this.albums.indexOf(this.active);
            this.albums.splice(idx, 1);
            if (this.active == this.editing)
                this.editing = null;
            this.active = null;
        };

        AlbumListCtrl.prototype.deleteAll = function () {
            this.albumStore.all = [];
            this.albums = [];
            this.active = this.editing = null;
        };

        AlbumListCtrl.prototype.reset = function () {
            this.albumStore.forget();
            location.reload();
        };
        return AlbumListCtrl;
    })();
    musico.AlbumListCtrl = AlbumListCtrl;
})(musico || (musico = {}));
var musico;
(function (musico) {
    (function (directives) {
        function ngRightClick($parse) {
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

                        $(document.body).one('click', function () {
                            return $(menu).hide();
                        });
                    });
                });
            };
        }
        directives.ngRightClick = ngRightClick;

        function fixButtons($parse) {
            return function (scope, element, attrs) {
                var ev = $parse(attrs.fixButtons);
                var el = attrs.fixButtonsEl;

                scope.$watch(attrs.fixButtons, function (val, prev) {
                    if (!val)
                        return;
                    setTimeout(function () {
                        var $inp = $('input[type="text"]').eq(0);
                        $inp.focus().select();
                        $(el).css({ top: $inp.position().top });
                    }, 10);
                });
            };
        }
        directives.fixButtons = fixButtons;
    })(musico.directives || (musico.directives = {}));
    var directives = musico.directives;
})(musico || (musico = {}));
var musico;
(function (musico) {
    var Album = (function () {
        function Album(artist, title, year) {
            if (typeof artist === "undefined") { artist = "Unknown artist"; }
            if (typeof title === "undefined") { title = "Unknown album"; }
            if (typeof year === "undefined") { year = 0; }
            this.artist = artist;
            this.title = title;
            this.year = year;
            this.commited = true;
        }
        // with(other: Album): Album;
        Album.prototype.with = function (other) {
            for (var key in other) {
                if (!other.hasOwnProperty(key) || key[0] == '$')
                    continue;

                this[key] = other[key];
            }
            return this;
        };
        return Album;
    })();
    musico.Album = Album;
})(musico || (musico = {}));
var musico;
(function (musico) {
    var initial = [
        new musico.Album("Pink Floyd", "The Dark Side of the Moon", 1973),
        new musico.Album("The Beatles", "Revolver", 1966),
        new musico.Album("Led Zeppelin", "Led Zeppelin IV", 1971),
        new musico.Album("The Stooges", "Fun House", 1970)
    ];

    var AlbumStore = (function () {
        function AlbumStore() {
            var _this = this;
            this.all = initial.slice(0);
            this.unloadToken = function () {
                return _this.beforeUnload();
            };
            var stored = localStorage.getItem('musico-albums');
            if (stored && (stored = JSON.parse(stored))) {
                this.all = stored.map(function (dto) {
                    return new musico.Album().with(dto);
                });
            }

            $(window).on('beforeunload', this.unloadToken);
        }
        AlbumStore.prototype.beforeUnload = function () {
            localStorage.setItem('musico-albums', JSON.stringify(this.all));
        };

        AlbumStore.prototype.forget = function () {
            localStorage.clear();
            $(window).off('beforeunload', this.unloadToken);
        };
        return AlbumStore;
    })();
    musico.AlbumStore = AlbumStore;
})(musico || (musico = {}));
