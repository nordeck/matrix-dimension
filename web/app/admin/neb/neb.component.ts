import { Component } from "@angular/core";
import { ToasterService } from "angular2-toaster";
import { AdminNebApiService } from "../../shared/services/admin/admin-neb-api.service";
import { AdminUpstreamApiService } from "../../shared/services/admin/admin-upstream-api.service";
import { AdminAppserviceApiService } from "../../shared/services/admin/admin-appservice-api.service";
import { FE_Appservice, FE_NebConfiguration, FE_Upstream } from "../../shared/models/admin-responses";
import { ActivatedRoute, Router } from "@angular/router";
import {
    AdminNebAppserviceConfigComponent,
    AppserviceConfigDialogContext
} from "./appservice-config/appservice-config.component";
import { Modal, overlayConfigFactory } from "ngx-modialog";
import { TranslateService } from "@ngx-translate/core";

@Component({
    templateUrl: "./neb.component.html",
    styleUrls: ["./neb.component.scss"],
})
export class AdminNebComponent {

    public isLoading = true;
    public isAddingModularNeb = false;
    public hasModularNeb = false;
    public upstreams: FE_Upstream[];
    public appservices: FE_Appservice[];
    public configurations: FE_NebConfiguration[];

    constructor(private nebApi: AdminNebApiService,
                private upstreamApi: AdminUpstreamApiService,
                private appserviceApi: AdminAppserviceApiService,
                private toaster: ToasterService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private modal: Modal,
                public translate: TranslateService) {

        this.reload().then(() => this.isLoading = false).catch(error => {
            console.error(error);
            let errorMassage: string;
            this.translate.get('Error loading go-neb configuration').subscribe((res: string) => {errorMassage = res});
            this.toaster.pop("error", errorMassage);
        });
    }

    private reload(): Promise<any> {
        return Promise.all([
            this.loadAppservices(),
            this.loadConfigurations(),
            this.loadUpstreams(),
        ]);
    }

    private loadUpstreams(): Promise<any> {
        return this.upstreamApi.getUpstreams().then(upstreams => {
            this.upstreams = upstreams;
        });
    }

    private loadAppservices(): Promise<any> {
        return this.appserviceApi.getAppservices().then(appservices => {
            this.appservices = appservices;
        });
    }

    private loadConfigurations(): Promise<any> {
        return this.nebApi.getConfigurations().then(nebConfigs => {
            this.configurations = nebConfigs;
            this.isLoading = false;

            this.hasModularNeb = false;
            for (const neb of this.configurations) {
                if (neb.upstreamId) {
                    this.hasModularNeb = true;
                    break;
                }
            }
        });
    }

    public showAppserviceConfig(neb: FE_NebConfiguration) {
        this.modal.open(AdminNebAppserviceConfigComponent, overlayConfigFactory({
            neb: neb,

            isBlocking: true,
            size: 'lg',
        }, AppserviceConfigDialogContext));
    }

    public getEnabledBotsString(neb: FE_NebConfiguration): string {
        const result = neb.integrations.filter(i => i.isEnabled).map(i => i.displayName).join(", ");
        if (!result) return "None";
        return result;
    }

    public addSelfHostedNeb() {
        this.router.navigate(["new", "selfhosted"], {relativeTo: this.activatedRoute});
    }

    public addModularHostedNeb() {
        this.isAddingModularNeb = true;
        const createNeb = (upstream: FE_Upstream) => {
            return this.nebApi.newUpstreamConfiguration(upstream).then(neb => {
                this.configurations.push(neb);
                let errorMassage: string;
                let errorMassage1: string;
                this.translate.get('matrix.org\'s go-neb added').subscribe((res: string) => {errorMassage = res});
                this.translate.get('Click the pencil icon to enable the bots.').subscribe((res: string) => {errorMassage1 = res});
                this.toaster.pop("success", errorMassage, errorMassage1);
                this.isAddingModularNeb = false;
                this.hasModularNeb = true;
            }).catch(error => {
                console.error(error);
                this.isAddingModularNeb = false;
                let errorMassage: string;
                this.translate.get('Error adding matrix.org\'s go-neb').subscribe((res: string) => {errorMassage = res});
                this.toaster.pop("error", errorMassage);
            });
        };

        const vectorUpstreams = this.upstreams.filter(u => u.type === "vector");
        if (vectorUpstreams.length === 0) {
            console.log("Creating default scalar upstream");
            const scalarUrl = "https://scalar.vector.im/api";
            this.upstreamApi.newUpstream("modular", "vector", scalarUrl, scalarUrl).then(upstream => {
                this.upstreams.push(upstream);
                createNeb(upstream);
            }).catch(err => {
                console.error(err);
                let errorMassage: string;
                this.translate.get('Error creating matrix.org go-neb').subscribe((res: string) => {errorMassage = res});
                this.toaster.pop("error", errorMassage);
            });
        } else createNeb(vectorUpstreams[0]);
    }
}
