module abtn {

    export function cast(o: any): any;
    export function cast<T>(o:any):T {
        return o;
    }

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

    export function shadeColor(color:string, percent:number) {

        var R = parseInt(color.substring(1, 3), 16);
        var G = parseInt(color.substring(3, 5), 16);
        var B = parseInt(color.substring(5, 7), 16);

        R = parseInt(cast(R * (100 + percent) / 100));
        G = parseInt(cast(G * (100 + percent) / 100));
        B = parseInt(cast(B * (100 + percent) / 100));

        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;

        var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
        var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
        var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

        return "#" + RR + GG + BB;
    }

    export function keys(obj: any): string[] {
        if (Object.keys) return Object.keys(obj);
        var result: string[] = [];
        if (!obj) return result;
        for (var key in obj) {
            if (obj.hasOwnProperty.call(key)) {
                result.push(key);
            }
        }
        return result;
    }

    export function values(obj: any) {
        var result: any[] = [];
        if (!obj) return result;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                result.push(obj[key]);
            }
        }
        return result;
    }

    export function camel(o: any) {
        var name = nameof(o) || '';
        return name.substring(0, 1).toLowerCase() 
            +  name.substring(1, Math.max(name.length, 1) )
    }
    export function safeDigest(scope: any) {
        if (!scope.$$phase) scope.$digest();
    }

    export function safeApply(scope: any) {
        if (!scope.$$phase) scope.$apply();
    }
} 