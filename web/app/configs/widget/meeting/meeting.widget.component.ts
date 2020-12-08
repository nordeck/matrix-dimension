import { WidgetComponent } from "../widget.component";
import { Component } from "@angular/core";
import { EditableWidget, WIDGET_MEETING } from "../../../shared/models/widget";
// import * as url from "url";
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
        super(WIDGET_MEETING, "meeting", "generic", "meeting", "");
    }
    protected OnWidgetsDiscovered(widgets: EditableWidget[]): void {
        console.log(widgets);
        for (const widget of widgets) {
            if (!widget.dimension.newUrl.startsWith("http://") && !widget.dimension.newUrl.startsWith("https://")) {
             //   const parsedUrl = url.parse(widget.url, true);
             //   const boardName = parsedUrl.query["boardName"];

                // Set the new URL so that it unpacks correctly
               // widget.url = `https://dev-whiteboard.nordeck.net/?whiteboardid=${boardName}`;
                widget.url = "https://meetings.element-widgets.dev.nordeck.systems?theme=$theme"
            }
        }
    }

    protected OnNewWidgetPrepared(widget: EditableWidget): void {
      //  const name = this.nameService.getHumanReadableName();

       // let template = "https://dev-whiteboard.nordeck.net/?whiteboardid=$roomId_$boardName";
        let template = "https://meetings.element-widgets.dev.nordeck.systems?theme=$theme";
        if (this.meetingWidget.options && this.meetingWidget.options.defaultUrl) {
            template = this.meetingWidget.options.defaultUrl;
        }

       // template = template.replace("$roomId", encodeURIComponent(SessionStorage.roomId));
       // template = template.replace("$boardName", encodeURIComponent(name));

        widget.dimension.newUrl = template;
      //  widget.dimension.newName = name;
    }
}
