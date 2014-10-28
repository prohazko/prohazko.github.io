module abtn {

    var initial = {
        columns: 3,
        width: 130,
        margin: 5
    };

    export class Button extends BaseModel {

        private $el = $(null);
        //private width =;
        public $category: Category = null;

        constructor(
            public title = 'Untitled',
            public color = '#dedede',
            public link  = 'http://test.com/test.png'
            ) {
            super();
        }

        getColor() { 
            return this.color
        }
        getShadedColor(shade = -17) {
            return shadeColor(this.color, shade);
        }

        init($el: JQuery) {
            this.$el = $el;
        }

        getName() {
            return (this.title || '').replace(/[^a-zA-Z0-9-_]/g, '_').toLowerCase();
        }

        getShotParams() {
            return {
                left: this.$el.offset().left - initial.margin,
                top: this.$el.offset().top - initial.margin,
                width: this.$el.outerWidth() + initial.margin * 2,
                height: this.$el.outerHeight() + initial.margin * 2,
                name: this.getName()
            };
        }

        toJSON() {
            return {
                title: this.title,
                color: this.color
            };
        }

    }

}