import { Component } from "@angular/core";
import { FE_Widget } from "../../shared/models/integration";
import { ToasterService } from "angular2-toaster";
import { AdminWidgetEtherpadConfigComponent } from "./etherpad/etherpad.component";
import { Modal, overlayConfigFactory } from "ngx-modialog";
import { BSModalContext } from "ngx-modialog/plugins/bootstrap";
import { AdminWidgetJitsiConfigComponent } from "./jitsi/jitsi.component";
import { AdminIntegrationsApiService } from "../../shared/services/admin/admin-integrations-api.service";
import { AdminWidgetWhiteboardConfigComponent } from "./whiteboard/whiteboard.component";
import { TranslateService } from "@ngx-translate/core";

export class WidgetConfigDialogContext extends BSModalContext {
    public widget: FE_Widget;
}

@Component({
    templateUrl: "./widgets.component.html",
    styleUrls: ["./widgets.component.scss"],
})
export class AdminWidgetsComponent {

    public isLoading = true;
    public isUpdating = false;
    public widgets: FE_Widget[];

    constructor(private adminIntegrationsApi: AdminIntegrationsApiService, private toaster: ToasterService, private modal: Modal, public translate: TranslateService) {
        this.adminIntegrationsApi.getAllWidgets().then(widgets => {
            this.isLoading = false;
            this.widgets = widgets;
        }).catch(err => {
            console.error(err);
            let errorMassage: string;
            this.translate.get('Failed to load widgets').subscribe((res: string) => {errorMassage = res});
            this.toaster.pop("error", errorMassage);
        });
    }

    public toggleWidget(widget: FE_Widget) {
        widget.isEnabled = !widget.isEnabled;
        this.isUpdating = true;
        this.adminIntegrationsApi.toggleIntegration(widget.category, widget.type, widget.isEnabled).then(() => {
            this.isUpdating = false;
            let errorMassage: string;
            this.translate.get('Widget updated').subscribe((res: string) => {errorMassage = res});
            this.toaster.pop("success", errorMassage);
        }).catch(err => {
            console.error(err);
            widget.isEnabled = !widget.isEnabled; // revert change
            this.isUpdating = false;
            let errorMassage: string;
            this.translate.get('Error updating widget').subscribe((res: string) => {errorMassage = res});
            this.toaster.pop("error", errorMassage);
        });
    }

    public editWidget(widget: FE_Widget) {
        let component = null;

        if (widget.type === "etherpad") component = AdminWidgetEtherpadConfigComponent;
        if (widget.type === "jitsi") component = AdminWidgetJitsiConfigComponent;
        if (widget.type === "whiteboard") component = AdminWidgetWhiteboardConfigComponent;

        if (!component) {
            console.error("No known dialog component for " + widget.type);
            let errorMassage: string;
            this.translate.get('Error opening configuration page').subscribe((res: string) => {errorMassage = res});
            this.toaster.pop("error", errorMassage);
            return;
        }

        this.modal.open(component, overlayConfigFactory({
            widget: widget,

            isBlocking: true,
            size: 'lg',
        }, WidgetConfigDialogContext));
    }

    public hasConfiguration(widget: FE_Widget) {
        // Currently only Jitsi and Etherpad and whiteboard have additional configuration
        return widget.type === "jitsi" || widget.type === "etherpad" || widget.type === "whiteboard";
    }
}
