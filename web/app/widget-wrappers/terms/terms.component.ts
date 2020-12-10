import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { WidgetApiService } from "../../shared/services/integrations/widget-api.service";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ToasterService } from "angular2-toaster";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: "my-terms-widget-wrapper",
    templateUrl: "terms.component.html",
    styleUrls: ["terms.component.scss"],
})
export class TermsWidgetWrapperComponent implements OnInit {

    public isLoading = true;
    public html: SafeHtml;

    constructor(private activatedRoute: ActivatedRoute,
                private sanitizer: DomSanitizer,
                private toaster: ToasterService,
                private widgetApi: WidgetApiService,
                public translate: TranslateService) {
    }

    public ngOnInit(): void {
        const params: any = this.activatedRoute.snapshot.params;

        this.widgetApi.getTerms(params.shortcode, params.lang, params.version).then(terms => {
            this.html = this.sanitizer.bypassSecurityTrustHtml(terms.text);
            this.isLoading = false;
        }).catch(err => {
            console.error(err);
            let message: string;
            this.translate.get('Error loading policy').subscribe((res: string) => {message = res});
            this.toaster.pop("error", message);
        });
    }
}
