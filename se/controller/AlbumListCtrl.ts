module musico {

    export class AlbumListCtrl {

        title = 'Music Store';
        albums: Album[] = [];
        editing: Album = null;
        active: Album = null;

        backup = new Album();

        $contextMenu = $("#album-menu");

        static $inject = [di.AlbumStore]

        constructor(private albumStore: AlbumStore) {
            this.albums = albumStore.all;
        }

        addAlbum() {
            if (this.editing) return;

            var empty = new Album();
            empty.commited = false;
            this.editing = empty;
            this.albums.push(empty);
            this.selectFirstField();
        }

        commit() {
            this.editing = null;
        }

        cancel() {
            var idx = this.albums.indexOf(this.editing);
            if (!this.editing.commited) {
                this.albums.splice(idx, 1);
            }
            if (this.editing.commited) {
                this.albums[idx] = new Album().from(this.backup);
            }

            this.editing = null; 
        }

        showMenu($e:JQueryMouseEventObject, album) {
            this.active = album;

            this.$contextMenu.css({
                display: "block",
                left: $e.pageX,
                top: $e.pageY
            });

            $(document.body).one('click', () => this.$contextMenu.hide())
        }

        editActive() {
            this.backup =  new Album().from(this.active);
            this.editing = this.active;
            this.active = null;
            this.selectFirstField();
        }

        deleteActive() {
            var idx = this.albums.indexOf(this.active);
            this.albums.splice(idx, 1);
            if (this.active == this.editing) this.editing = null;
            this.active = null;
        }

        deleteAll() {
            this.albumStore.all = [];
            this.albums = [];
            this.active = null;
            this.editing = null;
        }

        reset() {
            this.albumStore.all = null;
            location.reload();
        }

        selectFirstField() {
            setTimeout(() => $('input[type="text"]').eq(0).focus().select(), 50)
        }
    }
}