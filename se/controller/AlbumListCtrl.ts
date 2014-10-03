module musico {

    export class AlbumListCtrl {

        title = 'Music Store';

        albums: Album[] = [];
        editing: Album = null;
        active: Album = null;

        backup = new Album();


        constructor(private AlbumStore: AlbumStore) {
            this.albums = AlbumStore.all;
        }

        addAlbum() {
            if (this.editing) return;

            var empty = new Album();
            empty.commited = false;
            this.editing = empty;
            this.albums.push(empty);
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


        editActive() {
            this.backup = new Album().from(this.active);
            this.editing = this.active;
            this.active = null;
        }

        deleteActive() {
            var idx = this.albums.indexOf(this.active);
            this.albums.splice(idx, 1);
            if (this.active == this.editing) this.editing = null;
            this.active = null;
        }

        deleteAll() {
            this.AlbumStore.all = [];
            this.albums = [];
            this.active = null;
            this.editing = null;
        }

        reset() {
            this.AlbumStore.all = null;
            location.reload();
        }

    }
}