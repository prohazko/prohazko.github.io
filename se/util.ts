module musico {

    export var di = {
        AlbumStore: 'AlbumStore'
    };


    function extractNameFromSource(def: any) {
        return (def.toString().match(/function (.+?)\(/) || [, ''])[1];
    }

    export function nameof(ent: any): string {
        if (typeof ent == "string") return ent;
        if (!ent) return 'undefined';

        if (ent.constructor && ent.constructor.name != "Function" && ent.constructor.name != "Object") {
            if (ent.constructor.name) return ent.constructor.name;
            /* f#@cking ie*/
            if (ent.constructor && ent.toString() == '[object Object]') 
            return extractNameFromSource(ent.constructor)

            return extractNameFromSource(ent);
        } else {
            return ent.name || 'undefined';
        }
    }

} 