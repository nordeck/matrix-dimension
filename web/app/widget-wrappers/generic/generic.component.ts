import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { WidgetApiService } from "../../shared/services/integrations/widget-api.service";
import { SessionStorage } from "../../shared/SessionStorage";

@Component({
    selector: "my-generic-widget-wrapper",
    templateUrl: "generic.component.html",
    styleUrls: ["generic.component.scss"],
})
export class GenericWidgetWrapperComponent {

    public isLoading = true;
    public canEmbed = false;
    public embedUrl: SafeUrl = null;

    constructor(widgetApi: WidgetApiService, activatedRoute: ActivatedRoute, sanitizer: DomSanitizer) {
        let params: any = activatedRoute.snapshot.queryParams;

        const user_id = encodeURI(SessionStorage.userId);
        const room_id = encodeURI(SessionStorage.roomId);
        const session_token = localStorage.getItem("mx_access_token");
        const token_B64 = btoa(session_token);
        const url_params = "&user_id=" + user_id + "&room_id=" + room_id + "&session_token=" + token_B64;

        widgetApi.isEmbeddable(params.url).then(result => {
            this.canEmbed = result.canEmbed;
            this.isLoading = false;
            this.embedUrl = sanitizer.bypassSecurityTrustResourceUrl(params.url) + url_params;
        }).catch(err => {
            console.error(err);
            this.canEmbed = false;
            this.isLoading = false;
        });
    }
}
