import { Component } from "@angular/core";
import { ToasterService } from "angular2-toaster";
import { DialogRef, ModalComponent } from "ngx-modialog";
import { BSModalContext } from "ngx-modialog/plugins/bootstrap";
import { AdminWebhooksApiService } from "../../../../shared/services/admin/admin-webhooks-api.service";
import { TranslateService } from "@ngx-translate/core";

export class ManageSelfhostedWebhooksBridgeDialogContext extends BSModalContext {
    public provisionUrl: string;
    public sharedSecret: string;
    public allowTgPuppets = false;
    public allowMxPuppets = false;
    public bridgeId: number;
}

@Component({
    templateUrl: "./manage-selfhosted.component.html",
    styleUrls: ["./manage-selfhosted.component.scss"],
})
export class AdminWebhooksBridgeManageSelfhostedComponent implements ModalComponent<ManageSelfhostedWebhooksBridgeDialogContext> {

    public isSaving = false;
    public provisionUrl: string;
    public sharedSecret: string;
    public bridgeId: number;
    public isAdding = false;

    constructor(public dialog: DialogRef<ManageSelfhostedWebhooksBridgeDialogContext>,
                private webhooksApi: AdminWebhooksApiService,
                private toaster: ToasterService,
                public translate: TranslateService) {
        this.provisionUrl = dialog.context.provisionUrl;
        this.sharedSecret = dialog.context.sharedSecret;
        this.bridgeId = dialog.context.bridgeId;
        this.isAdding = !this.bridgeId;
    }

    public add() {
        this.isSaving = true;
        if (this.isAdding) {
            this.webhooksApi.newSelfhosted(this.provisionUrl, this.sharedSecret).then(() => {
                let errorMassage: string;
                this.translate.get('Webhook bridge added').subscribe((res: string) => {errorMassage = res});
                this.toaster.pop("success", errorMassage);
                this.dialog.close();
            }).catch(err => {
                console.error(err);
                this.isSaving = false;
                let errorMassage: string;
                this.translate.get('Failed to create Webhook bridge').subscribe((res: string) => {errorMassage = res});
                this.toaster.pop("error", errorMassage);
            });
        } else {
            this.webhooksApi.updateSelfhosted(this.bridgeId, this.provisionUrl, this.sharedSecret).then(() => {
                let errorMassage: string;
                this.translate.get('Webhook bridge updated').subscribe((res: string) => {errorMassage = res});
                this.toaster.pop("success", errorMassage);
                this.dialog.close();
            }).catch(err => {
                console.error(err);
                this.isSaving = false;
                let errorMassage: string;
                this.translate.get('Failed to update Webhook bridge').subscribe((res: string) => {errorMassage = res});
                this.toaster.pop("error", errorMassage);
            });
        }
    }
}
