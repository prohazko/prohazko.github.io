var initial = {
    columns: 3,
    width: 130,
    margin: 5
}

function Button(category, title) {
    this.category = category;
    this.title = title;
    this.color = null;
}

Button.prototype.render = function () {
    var width = this.category.root.width;
    var cls = this.category.cls;
    console.log(width)
    this.$btn = $('<input>').attr('type', 'button')
        .addClass('btn ' + cls)
        .width(width)
        .val(this.title);
    if (this.color != null) {
        this.$btn.css('background-color', this.color)
        this.$btn.css('border-color', this.color)
        $("#colors").append( $("<option>").val(this.color) )
    }

    this.category.$buttons.append(this.$btn)
    this.$btn.width(width)
};

Button.prototype.getName = function () {
    return this.title.replace(/[^a-zA-Z0-9-_]/g, '_').toLowerCase();
}

Button.prototype.getShotParams = function () {
    return {
        left: this.$btn.offset().left - initial.margin,
        top: this.$btn.offset().top - initial.margin,
        width: this.$btn.outerWidth() + initial.margin * 2,
        height: this.$btn.outerHeight() + initial.margin * 2,
        name: this.getName()
    };
}

function Category(root, title) {
    this.root = root;
    this.title = title;
    this.buttons = [];
}

Category.prototype.render = function () {
    this.$header = $('<h1>').text(this.title)
    this.$btnAdd = $('<input>').attr('type', 'button').css('font-size', 'medium').val('+');
    var width = (this.root.width + 20) * this.root.columns + 5 * 6 + 20;
    this.$buttons = $('<div>').width(width)


    //   this.root.$work.append(this.$header);
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
    this.width = initial.width;


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

Main.prototype.takeShots = function () {
    var $status = $("#create-buttons-status");
    $status.text('start ...');
    this.categories.forEach(function (cat) {
        
        var competed = 0;

        cat.buttons.forEach(function (b) {
            var p = b.getShotParams();
            $.ajax('shot.png', { data: p }).then(function () {
                competed++;
                $status.text( competed + ' / ' + cat.buttons.length )
            });
        })
    });
}

function init() {
    var main = new Main($(document));

    var store = new ButtonStore(main);

    store.load().then(function () {
        main.render();
        //  if (window.callPhantom) window.callPhantom('takeShot');
    })

    $('#btn-create-buttons').click(function () {
        main.takeShots();
    })

    console.log('init')

    //   $('body').css('background-color', 'red');

    window['main'] = main;
}


//init();
$(init);
