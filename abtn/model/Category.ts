module abtn {

    export class Category extends BaseModel {

        public buttons: Button[] = [];
        public $config: Config = null;

        constructor(
            public title = 'Untitled'
            ) {
            super();
        }

        public with(other: Category): Category {
            var prev = super.with(other);
            if (other.buttons)
                prev.buttons = other.buttons.map(btn=> {
                    var button = new Button().with(btn);
                    button.$category = this;
                    return button;
                });
            
            return prev;
        }

    }

}