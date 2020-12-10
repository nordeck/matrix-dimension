import { Component } from "@angular/core";
import { ToasterService } from "angular2-toaster";
import { FE_CustomSimpleBot } from "../../shared/models/admin-responses";
import { AdminCustomSimpleBotsApiService } from "../../shared/services/admin/admin-custom-simple-bots-api.service";
import { Modal, overlayConfigFactory } from "ngx-modialog";
import { AddCustomBotDialogContext, AdminAddCustomBotComponent } from "./add/add.component";
import { TranslateService } from "@ngx-translate/core";

@Component({
    templateUrl: "./custom-bots.component.html",
    styleUrls: ["./custom-bots.component.scss"],
})
export class AdminCustomBotsComponent {

    public isLoading = true;
    public bots: FE_CustomSimpleBot[];
    public isUpdating = false;

    constructor(private botApi: AdminCustomSimpleBotsApiService,
                private toaster: ToasterService,
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
        return this.botApi.getBots().then(bots => {
            this.bots = bots;
            this.isLoading = false;
        });
    }

    public addBot() {
        this.modal.open(AdminAddCustomBotComponent, overlayConfigFactory({
            isBlocking: true,
            size: 'lg',
        }, AddCustomBotDialogContext)).result.then(() => {
            this.reload().catch(err => {
                console.error(err);
                let errorMassage: string;
                this.translate.get('Failed to get an updated bot list').subscribe((res: string) => {errorMassage = res});
                this.toaster.pop("error", errorMassage);
            });
        });
    }

    public editBot(bot: FE_CustomSimpleBot) {
        this.modal.open(AdminAddCustomBotComponent, overlayConfigFactory({
            isBlocking: true,
            size: 'lg',

            bot: bot,
        }, AddCustomBotDialogContext)).result.then(() => {
            this.reload().catch(err => {
                console.error(err);
                let errorMassage: string;
                this.translate.get('Failed to get an updated bot list').subscribe((res: string) => {errorMassage = res});
                this.toaster.pop("error", errorMassage);
            });
        });
    }

    public toggleBot(bot: FE_CustomSimpleBot) {
        this.isUpdating = true;
        bot.isEnabled = !bot.isEnabled;
        this.botApi.updateBot(bot.id, bot).then(() => {
            this.isUpdating = false;
            let errorMassage: string;
            let errorMassage1: string;
            this.translate.get('Enabled').subscribe((res: string) => {errorMassage = res});
            this.translate.get('disabled').subscribe((res: string) => {errorMassage1 = res});
            this.toaster.pop("success", "Bot " + (bot.isEnabled ? errorMassage : errorMassage1));
        }).catch(error => {
            console.error(error);
            bot.isEnabled = !bot.isEnabled;
            let errorMassage: string;
            this.translate.get('Error updating bot').subscribe((res: string) => {errorMassage = res});
            this.toaster.pop("error", errorMassage);
        })
    }
}
