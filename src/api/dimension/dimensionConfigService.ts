import { GET, Path, Security } from "typescript-rest";
import config from "../../config";
import { ROLE_ADMIN, ROLE_USER } from "../security/MatrixSecurity";


interface DimensionUserConfigResponse {
        whiteboardEndPoint: string;
}

/**
 * Administrative API for general information about Dimension
 */
@Path("/api/v1/dimension")
export class DimensionConfigService {

    @GET
    @Path("config")
    @Security([ROLE_USER, ROLE_ADMIN])
    public async getConfig(): Promise<DimensionUserConfigResponse> {
        return {
            whiteboardEndPoint: config.whiteboardEndPoint
        };
    }
}
