import { Component, OnInit } from "@angular/core";
import { ToasterService } from "angular2-toaster";
import { FE_Bridge } from "../../shared/models/integration";
import { AdminIntegrationsApiService } from "../../shared/services/admin/admin-integrations-api.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
    templateUrl: "./bridges.component.html",
    styleUrls: ["./bridges.component.scss"],
})
export class AdminBridgesComponent implements OnInit {

    public isLoading = true;
    public bridges: FE_Bridge<any>[];

    constructor(private adminIntegrations: AdminIntegrationsApiService,
                private toaster: ToasterService, public translate: TranslateService) {
    }

    public ngOnInit() {
        this.adminIntegrations.getAllBridges().then(bridges => {
            this.bridges = bridges.filter(b => b.isEnabled);
            this.isLoading = false;
        }).catch(err => {
            console.error(err);
            let errorMassage: string;
            this.translate.get('Failed to load bridges').subscribe((res: string) => {errorMassage = res});
            this.toaster.pop("error", errorMassage);
        });
    }
}
