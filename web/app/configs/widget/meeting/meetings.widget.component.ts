import { WidgetComponent } from "../widget.component";
import { Component } from "@angular/core";
import { EditableWidget, WIDGET_MEETINGS } from "../../../shared/models/widget";
import { SessionStorage } from "../../../shared/SessionStorage";
import { FE_MeetingsWidget } from "../../../shared/models/integration";

@Component({
    templateUrl: "meetings.widget.component.html",
    styleUrls: ["meetings.widget.component.scss"],
})
export class MeetingsWidgetComponent extends WidgetComponent {
    private meetingWidget: FE_MeetingsWidget = <FE_MeetingsWidget>SessionStorage.editIntegration;

   // constructor(private nameService: NameService) {
    constructor() {
        super(WIDGET_MEETINGS, "meetings", "generic", "", "");
    }
    protected OnWidgetsDiscovered(widgets: EditableWidget[]): void {
        console.log(widgets);
        for (const widget of widgets) {
            if (!widget.dimension.newUrl.startsWith("http://") && !widget.dimension.newUrl.startsWith("https://")) {
                // Set the new URL so that it unpacks correctly
                widget.url = "https://meetings.element-widgets.dev.nordeck.systems";
            }
        }
    }

    protected OnNewWidgetPrepared(widget: EditableWidget): void {
        let template = "https://meetings.element-widgets.dev.nordeck.systems";
        if (this.meetingWidget.options && this.meetingWidget.options.defaultUrl) {
            template = this.meetingWidget.options.defaultUrl;
        }
        widget.dimension.newUrl = template;
    }
}
