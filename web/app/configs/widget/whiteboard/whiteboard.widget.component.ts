import { WidgetComponent } from "../widget.component";
import { Component } from "@angular/core";
import { EditableWidget, WIDGET_WHITEBOARD } from "../../../shared/models/widget";
import * as url from "url";
import { SessionStorage } from "../../../shared/SessionStorage";
import { NameService } from "../../../shared/services/name.service";
import { FE_WhiteBoardWidget } from "../../../shared/models/integration";
import { DimensionConfigApiService } from "../../../shared/services/dimension-config-api.service";

@Component({
    templateUrl: "whiteboard.widget.component.html",
    styleUrls: ["whiteboard.widget.component.scss"],
})
export class WhiteboardWidgetComponent extends WidgetComponent {
    private whiteBoardWidget: FE_WhiteBoardWidget = <FE_WhiteBoardWidget>SessionStorage.editIntegration;

    constructor(private nameService: NameService, private dimensionConfigApiService: DimensionConfigApiService) {
        super(WIDGET_WHITEBOARD, "Whiteboard", "generic", "whiteboard", "boardName");
    }
    protected OnWidgetsDiscovered(widgets: EditableWidget[]): void {
        console.log(widgets);
        for (const widget of widgets) {
            if (!widget.dimension.newUrl.startsWith("http://") && !widget.dimension.newUrl.startsWith("https://")) {
                const parsedUrl = url.parse(widget.url, true);
                const boardName = parsedUrl.query["boardName"];
                this.dimensionConfigApiService.getConfig().then( (config) => {
                    // Set the new URL so that it unpacks correctly
                    widget.url = `${config.whiteboardEndPoint}/?whiteboardid=${boardName}`;
                });
            }
        }
    }

    protected OnNewWidgetPrepared(widget: EditableWidget): void {
        const name = this.nameService.getHumanReadableName();
        this.dimensionConfigApiService.getConfig().then( (config) => {
        let template = `${config.whiteboardEndPoint}/?whiteboardid=$roomId_$boardName`;
        if (!config.whiteboardEndPoint) {
            template = this.whiteBoardWidget.options.defaultUrl;
        }

        template = template.replace("$roomId", encodeURIComponent(SessionStorage.roomId));
        template = template.replace("$boardName", encodeURIComponent(name));

        widget.dimension.newUrl = template;
        widget.dimension.newName = name;
    });
    }
}
