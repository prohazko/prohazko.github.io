var abtn;
(function (abtn) {
    function cast(o) {
        return o;
    }
    abtn.cast = cast;

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
    abtn.nameof = nameof;

    function shadeColor(color, percent) {
        var R = parseInt(color.substring(1, 3), 16);
        var G = parseInt(color.substring(3, 5), 16);
        var B = parseInt(color.substring(5, 7), 16);

        R = parseInt(cast(R * (100 + percent) / 100));
        G = parseInt(cast(G * (100 + percent) / 100));
        B = parseInt(cast(B * (100 + percent) / 100));

        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;

        var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
        var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
        var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

        return "#" + RR + GG + BB;
    }
    abtn.shadeColor = shadeColor;

    function keys(obj) {
        if (Object.keys)
            return Object.keys(obj);
        var result = [];
        if (!obj)
            return result;
        for (var key in obj) {
            if (obj.hasOwnProperty.call(key)) {
                result.push(key);
            }
        }
        return result;
    }
    abtn.keys = keys;

    function values(obj) {
        var result = [];
        if (!obj)
            return result;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                result.push(obj[key]);
            }
        }
        return result;
    }
    abtn.values = values;

    function camel(o) {
        var name = nameof(o) || '';
        return name.substring(0, 1).toLowerCase() + name.substring(1, Math.max(name.length, 1));
    }
    abtn.camel = camel;
    function safeDigest(scope) {
        if (!scope.$$phase)
            scope.$digest();
    }
    abtn.safeDigest = safeDigest;

    function safeApply(scope) {
        if (!scope.$$phase)
            scope.$apply();
    }
    abtn.safeApply = safeApply;
})(abtn || (abtn = {}));
/// <reference path="./../typings/jquery/jquery.d.ts" />
/// <reference path="./../typings/angularjs/angular.d.ts" />
/// <reference path="util.ts" />
var abtn;
(function (abtn) {
    function init() {
        var app = angular.module('abtn', []);

        abtn.values(abtn.ctrl).forEach(function (x) {
            return app.controller(abtn.nameof(x), x);
        });

        abtn.values(abtn.service).forEach(function (x) {
            return app.service(abtn.camel(x), x);
        });

        app.directive('elementInit', function elementInit() {
            var ctor = function (scope, element, attr) {
                return scope[attr.elementInit].init && scope[attr.elementInit].init(element);
            };

            return [function () {
                    return ctor;
                }];
        }());

        app.run(function () {
            return console.log('start');
        });
    }
    abtn.init = init;
})(abtn || (abtn = {}));
var abtn;
(function (abtn) {
    (function (ctrl) {
        var ButtonsCtrl = (function () {
            function ButtonsCtrl($scope, buttonStore) {
                var _this = this;
                this.$scope = $scope;
                this.buttonStore = buttonStore;
                this.config = new abtn.Config();
                this.selected = null;
                buttonStore.load().then(function (cfg) {
                    return _this.config = cfg;
                }).then(function (cfg) {
                    return abtn.safeDigest(_this.$scope);
                });

                window['z2'] = this;
            }
            return ButtonsCtrl;
        })();
        ctrl.ButtonsCtrl = ButtonsCtrl;
    })(abtn.ctrl || (abtn.ctrl = {}));
    var ctrl = abtn.ctrl;
})(abtn || (abtn = {}));
var abtn;
(function (abtn) {
    (function (ctrl) {
        var RootCtrl = (function () {
            function RootCtrl(buttonStore) {
                this.buttonStore = buttonStore;
                this.title = "zad";
                window['z'] = this;
            }
            return RootCtrl;
        })();
        ctrl.RootCtrl = RootCtrl;
    })(abtn.ctrl || (abtn.ctrl = {}));
    var ctrl = abtn.ctrl;
})(abtn || (abtn = {}));
var abtn;
(function (abtn) {
    var BaseModel = (function () {
        function BaseModel() {
        }
        BaseModel.prototype.with = function (other) {
            for (var key in other) {
                if (!other.hasOwnProperty(key) || key[0] == '$')
                    continue;
                this[key] = other[key];
            }
            return this;
        };
        return BaseModel;
    })();
    abtn.BaseModel = BaseModel;
})(abtn || (abtn = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var abtn;
(function (abtn) {
    var Config = (function (_super) {
        __extends(Config, _super);
        function Config() {
            _super.apply(this, arguments);
            this.categories = [];
            this.width = 110;
            this.columns = 3;
        }
        Config.prototype.with = function (other) {
            var _this = this;
            var prev = _super.prototype.with.call(this, other);
            if (other.categories)
                prev.categories = other.categories.map(function (cat) {
                    var category = new abtn.Category().with(cat);
                    category.$config = _this;
                    return category;
                });
            return prev;
        };
        return Config;
    })(abtn.BaseModel);
    abtn.Config = Config;
})(abtn || (abtn = {}));
var abtn;
(function (abtn) {
    var Category = (function (_super) {
        __extends(Category, _super);
        function Category(title) {
            if (typeof title === "undefined") { title = 'Untitled'; }
            _super.call(this);
            this.title = title;
            this.buttons = [];
            this.$config = null;
        }
        Category.prototype.with = function (other) {
            var _this = this;
            var prev = _super.prototype.with.call(this, other);
            if (other.buttons)
                prev.buttons = other.buttons.map(function (btn) {
                    var button = new abtn.Button().with(btn);
                    button.$category = _this;
                    return button;
                });

            return prev;
        };
        return Category;
    })(abtn.BaseModel);
    abtn.Category = Category;
})(abtn || (abtn = {}));
var abtn;
(function (abtn) {
    var initial = {
        columns: 3,
        width: 130,
        margin: 5
    };

    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(title, color, link) {
            if (typeof title === "undefined") { title = 'Untitled'; }
            if (typeof color === "undefined") { color = '#dedede'; }
            if (typeof link === "undefined") { link = 'http://test.com/test.png'; }
            _super.call(this);
            this.title = title;
            this.color = color;
            this.link = link;
            this.$el = $(null);
            //private width =;
            this.$category = null;
        }
        Button.prototype.getColor = function () {
            return this.color;
        };
        Button.prototype.getShadedColor = function (shade) {
            if (typeof shade === "undefined") { shade = -17; }
            return abtn.shadeColor(this.color, shade);
        };

        Button.prototype.init = function ($el) {
            this.$el = $el;

            // this.$el.width(this.$category.$config.width);
            setTimeout(function () {
                //     this.$el.width(this.$category.$config.width);
                //     console.log('width', this.$el.width(), this.title);
            }, 150);
        };

        Button.prototype.getName = function () {
            return (this.title || '').replace(/[^a-zA-Z0-9-_]/g, '_').toLowerCase();
        };

        Button.prototype.getShotParams = function () {
            return {
                left: this.$el.offset().left - initial.margin,
                top: this.$el.offset().top - initial.margin,
                width: this.$el.outerWidth() + initial.margin * 2,
                height: this.$el.outerHeight() + initial.margin * 2,
                name: this.getName()
            };
        };
        return Button;
    })(abtn.BaseModel);
    abtn.Button = Button;
})(abtn || (abtn = {}));
var abtn;
(function (abtn) {
    (function (service) {
        var ButtonStore = (function () {
            function ButtonStore() {
            }
            ButtonStore.prototype.load = function () {
                return $.getJSON("abtn.json").then(function (cfg) {
                    return new abtn.Config().with(cfg);
                });
            };
            return ButtonStore;
        })();
        service.ButtonStore = ButtonStore;
    })(abtn.service || (abtn.service = {}));
    var service = abtn.service;
})(abtn || (abtn = {}));
