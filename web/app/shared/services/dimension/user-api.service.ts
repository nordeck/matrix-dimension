import { Injectable } from "@angular/core";
import { AuthedApi } from "../authed-api";
import { HttpClient } from "@angular/common/http";
import {FE_DimensionUserConfig} from "../../models/dimension-responses";

@Injectable()
export class UserApiService extends AuthedApi {
    constructor(http: HttpClient) {
        super(http);
    }


    public getConfig(): Promise<FE_DimensionUserConfig> {
        return this.authedGet<FE_DimensionUserConfig>("/api/v1/dimension/config").toPromise();
    }
}
