import { GET, Path, Security } from "typescript-rest";
import { ROLE_ADMIN, ROLE_USER } from "../../../../src/api/security/MatrixSecurity";
import config from "../../../../src/config";

interface DimensionConfigResponse {
    etherpadEndpoint: string;
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
            etherpadEndpoint: config.etherpadEndpoint
        };
    }
}
