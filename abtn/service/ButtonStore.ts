module abtn.service {

    export class ButtonStore {

        private current: Config = null; // new Config();

        private task: JQueryPromise<Config> = null;

        load() {
            if (this.task) return this.task;            

            return this.task = $.getJSON("abtn.json")
                .then(cfg =>
                    this.current = new Config().with(cfg)
                );
        }

        getCurrent() {
            return this.current;
        }

        saveCurrent() {
            var opts = {
                data: JSON.stringify(this.getCurrent()),
                type: 'post',
                url: "abtn.json",
                contentType: 'application/json'
            };
            return $.ajax(opts).then(x=> x);
        }

    }

}