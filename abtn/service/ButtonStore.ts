module abtn.service {

    export class ButtonStore {

        
        load() {
            return $.getJSON("abtn.json")
                .then(cfg=> new Config().with(cfg));
        }

    }

}