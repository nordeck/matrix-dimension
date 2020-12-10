import { GET, Path, Security } from "typescript-rest";
import config from "../../config";
import { ROLE_ADMIN, ROLE_USER } from "../security/MatrixSecurity";

interface DimensionConfigResponse {
    etherpadEndPoint: string;
}

/**
 * API for config information about etherpad and whiteboard widgets
 */
@Path("/api/v1/dimension")
export class DimensionConfigService {
    @GET
    @Path("config")
    @Security([ROLE_USER, ROLE_ADMIN])
    public async getConfig(): Promise<DimensionConfigResponse> {
        return {
            etherpadEndPoint: config.etherpadEndPoint
        };
    }
}
