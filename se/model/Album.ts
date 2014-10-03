module musico {
    export class Album {

        public commited = true;

        constructor(
            public artist = "Unknown artist",
            public title  = "Unknown album",
            public year   = 0) {

        }

        // with(other: Album): Album;
        with(other: any): Album {
            for (var key in other) {
                if (!other.hasOwnProperty(key) || key[0] == '$')
                    continue;

                this[key] = other[key];
            }
            return this;
        }
    }
} 