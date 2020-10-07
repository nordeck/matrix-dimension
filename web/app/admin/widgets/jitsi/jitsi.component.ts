import { Component } from "@angular/core";
import { FE_JitsiWidget } from "../../../shared/models/integration";
import { ToasterService } from "angular2-toaster";
import { DialogRef, ModalComponent } from "ngx-modialog";
import { WidgetConfigDialogContext } from "../widgets.component";
import { AdminIntegrationsApiService } from "../../../shared/services/admin/admin-integrations-api.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
    templateUrl: "./jitsi.component.html",
    styleUrls: ["./jitsi.component.scss", "../config-dialog.scss"],
})
export class AdminWidgetJitsiConfigComponent implements ModalComponent<WidgetConfigDialogContext> {

    public isUpdating = false;
    public widget: FE_JitsiWidget;
    private originalWidget: FE_JitsiWidget;

    constructor(public dialog: DialogRef<WidgetConfigDialogContext>, private adminIntegrationsApi: AdminIntegrationsApiService, private toaster: ToasterService, public translate: TranslateService) {
        this.originalWidget = dialog.context.widget;
        this.widget = JSON.parse(JSON.stringify(this.originalWidget));

        // Fix the ui-switch not picking up a boolean value
        this.widget.options.useDomainAsDefault = !!this.widget.options.useDomainAsDefault;
    }

    public save() {
        this.isUpdating = true;
        this.adminIntegrationsApi.setIntegrationOptions(this.widget.category, this.widget.type, this.widget.options).then(() => {
            this.originalWidget.options = this.widget.options;
            let errorMassage: string;
            this.translate.get('Widget updated').subscribe((res: string) => {errorMassage = res});
            this.toaster.pop("success", errorMassage);
            this.dialog.close();
        }).catch(err => {
            this.isUpdating = false;
            console.error(err);
            let errorMassage: string;
            this.translate.get('Error updating widget').subscribe((res: string) => {errorMassage = res});
            this.toaster.pop("error", errorMassage);
        });
    }

    public toggleForcedJitsi() {
        this.widget.options.useDomainAsDefault = !this.widget.options.useDomainAsDefault;
    }
}
