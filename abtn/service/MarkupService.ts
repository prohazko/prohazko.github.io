module abtn.service {

    export class MarkupService {

        private getButtonMarkup(config: Config, btn: Button) {

            return "<td>" + "<img> /" + "</td>";
        }

        getMarkup(config:Config) {
            
            return config.categories.map(c=> {
                return c.buttons.map(b=> this.getButtonMarkup(config, b) ).join('\n')
            }).join('\n')
        }
    }
}