

/*
  
  width    : number
  columns  : number
  categories   : { 
     title   : string,
     buttons : { title : string, cls: string }[] 
  }[]

*/


function ButtonStore(root) {
    this.root = root;
}

ButtonStore.prototype.load = function () {
    var self = this;
    return $.getJSON('abtn.json').then(function (cfg) { self.onload(cfg) });
}

ButtonStore.prototype.onload = function (stored) {
    console.log('stored', stored)
    this.root.columns = stored.columns || initial.columns;
    this.root.width   = stored.width   || initial.width;
    
    (stored.categories || []).forEach(function (cat) {
        var category = new Category(this.root, cat.title);
        category.cls = cat.cls;
        (cat.buttons || []).forEach(function (btn) {
            var button = new Button(category, btn.title);
            if (btn.color) button.color = btn.color;
            category.buttons.push(button);
        }, this)
        this.root.categories.push(category)
    }, this);
}

ButtonStore.prototype.toJSON = function () {
    
}

