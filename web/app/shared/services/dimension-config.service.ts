import { GET, Path, Security } from "typescript-rest";
import { ROLE_ADMIN, ROLE_USER } from "../../../../src/api/security/MatrixSecurity";

interface DimensionConfigResponse {
    //todo: add etherpad and whiteboard widget endpoints
}

/**
 * API for config information about etherpad and whiteboard widgets
 */
@Path("/api/v1/dimension/config")
export class DimensionConfigService {
    @GET
    @Path("config")
    @Security([ROLE_USER, ROLE_ADMIN])
    public async getConfig(): Promise<DimensionConfigResponse> {
        return {
            //todo: add etherpad and whiteboard widget endpoints
        };
    }
}
