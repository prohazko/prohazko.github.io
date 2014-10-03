module musico {

    export class AlbumListCtrl {

        albums: Album[] = [];
        editing: Album = null;
        active: Album = null;

        backup = new Album();


        constructor(private albumStore: AlbumStore) {
            this.albums = albumStore.all;
        }

        addAlbum() {
            if (this.editing) return;

            var empty = new Album().with({ commited: false });
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
                this.albums[idx] = new Album().with(this.backup);
            }
            this.editing = null;
        }


        editActive() {
            if (this.editing)  this.cancel();

            this.backup = new Album().with(this.active);
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
            this.albumStore.all = [];
            this.albums = [];
            this.active = this.editing = null;
        }

        reset() {
            this.albumStore.forget();
            location.reload();
        }
    }
}