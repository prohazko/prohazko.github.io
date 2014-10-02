module musico {
    export class Album {

        public commited = true;

        constructor(
            public artist = "Unknown artist",
            public title  = "Unknown album",
            public year   = 0) {

        }

        from(other:Album) {
            this.artist = other.artist;
            this.title = other.title;
            this.year = other.year;
            return this;
        }
    }
} 