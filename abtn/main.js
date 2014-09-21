var initial = {
    columns: 3,
    width  : 120
}

function Button(category, title) {
    this.category = category;
    this.title = title;
    this.color = null;
}

Button.prototype.render = function () {
    var width = this.category.root.width;
    var cls = this.category.cls;
    this.$btn = $('<input>').attr('type', 'button')
        .addClass('btn ' + cls)
        .width(width)
        .val(this.title);
    if (this.color != null) {
        this.$btn.css('background-color', this.color)
        this.$btn.css('border-color', this.color)
    } 

    this.category.$buttons.append(this.$btn)
};


function Category(root, title) {
    this.root = root;
    this.title = title;
    this.buttons = [];
}

Category.prototype.render = function () {
    this.$header = $('<h1>').text(this.title)
    this.$btnAdd = $('<input>').attr('type', 'button').css('font-size', 'medium').val('+');
    var width = this.root.width * this.root.columns + this.root.width * 1.5
    this.$buttons = $('<div>').width(width)

    this.$btnAdd.click(function () {
        this.addButton();
    }.bind(this));
    this.root.$work.append(this.$header);
    this.root.$work.append(this.$buttons);
 //   this.$header.append(this.$btnAdd);

    this.buttons.forEach(function (btn) {
        btn.render();
    }, this)
};

Category.prototype.addButton = function (name) {
    if (!name) name = prompt('Category name');
    if (!name) return;

    var button = new Button(this, name);
    button.render();
    this.buttons.push(button);
}


function Main($view) {
    this.$view = $view;
    this.$work = $view.find('#work-area')
    this.categories = []
    this.columns = initial.columns;   
    this.width   = initial.width;

    $('#btn-category-add').click(function () {
        this.addCategory();
    }.bind(this))
}

Main.prototype.addCategory = function (name) {
    if (!name) name = prompt('Category name');
    if (!name) return;

    var category = new Category(this, name);
    category.render();
    this.categories.push(category);
}

Main.prototype.render = function () {
    //this.addCategory('test');
    this.categories.forEach(function (cat) {
        cat.render();
    }, this)
}

function init() {

    var main  = new Main($(document));
    var store = new ButtonStore(main);

    store.load().then(function () {
        main.render();
    })

    console.log('init')

    window['main'] = main;
}



$(init);

