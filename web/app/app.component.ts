import { Component } from "@angular/core";
import "../style/app.scss";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: "my-app", // <my-app></my-app>
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent {

    constructor(public translate: TranslateService) {
        translate.addLangs(['en', 'de']);
        translate.setDefaultLang('en');
        translate.use('de');
    }
}
