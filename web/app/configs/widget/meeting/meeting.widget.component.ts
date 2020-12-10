import { WidgetComponent } from "../widget.component";
import { Component } from "@angular/core";
import { EditableWidget, WIDGET_MEETING } from "../../../shared/models/widget";
import { SessionStorage } from "../../../shared/SessionStorage";
import { FE_MeetingWidget } from "../../../shared/models/integration";

@Component({
    templateUrl: "meeting.widget.component.html",
    styleUrls: ["meeting.widget.component.scss"],
})
export class MeetingWidgetComponent extends WidgetComponent {
    private meetingWidget: FE_MeetingWidget = <FE_MeetingWidget>SessionStorage.editIntegration;

   // constructor(private nameService: NameService) {
    constructor() {
        super(WIDGET_MEETING, "meetings", "generic", "meeting", "");
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
