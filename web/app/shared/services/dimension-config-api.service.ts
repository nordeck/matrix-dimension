import { Injectable } from "@angular/core";
import { AuthedApi } from "./authed-api";
import { FE_DimensionConfig } from "../models/dimension-responses";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class DimensionConfigApiService extends AuthedApi {
    constructor(http: HttpClient) {
        super(http);
    }
  
    public getConfig(): Promise<FE_DimensionConfig> {
        return this.authedGet<FE_DimensionConfig>("/api/v1/dimension/config").toPromise();
    }
}
