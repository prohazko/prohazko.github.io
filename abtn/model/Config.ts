module abtn {

    export class Config extends BaseModel {


        public categories: Category[] = [];
        public width = 110;
        public columns = 3;

        public with(other: Config): Config {
            var prev = super.with(other);
            if (other.categories)
                prev.categories = other.categories.map(cat=> {
                    var category = new Category().with(cat);
                    category.$config = this;
                    return category;
                });
            return prev;
        }
    }

}