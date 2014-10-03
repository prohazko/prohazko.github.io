module musico {

    var initial = [
        new Album("Pink Floyd", "The Dark Side of the Moon", 1973),
        new Album("The Beatles", "Revolver", 1966),
        new Album("Led Zeppelin", "Led Zeppelin IV", 1971),
        new Album("The Stooges", "Fun House", 1970)
    ];

    export class AlbumStore {

        all = initial.slice(0)

        unloadToken = () => this.beforeUnload();

        constructor() {
            var stored = localStorage.getItem('musico-albums')
            if (stored && (stored = JSON.parse(stored))) {
                this.all = stored.map(dto=> new Album().from(dto));
            }

            $(window).unload(this.unloadToken)
            window['albumStore'] = this;
        }

        beforeUnload() {
            localStorage.setItem('musico-albums', JSON.stringify(this.all));
        }

        forget() {
            localStorage.clear();
            $(window).off('beforeunload',this.unloadToken)
        }
    }
}