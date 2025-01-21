import jsonwebtoken from "jsonwebtoken";

import type { ConfigurationApiService } from "@/backend/configuration/configuration.service";
import { configurationApiService } from "@/backend/configuration/configuration.service";
import { noop } from "@/shared/lib/noop";
import type { IAccountProfile } from "@/shared/types/user";

import type { ConfigApiService } from "../config/config.service";
import { configApiService, ConfigKeys } from "../config/config.service";

interface IWithJWTMetadataAccountProfile extends IAccountProfile {
  iat: number;
  exp: number;
}

export class AuthTokenApiService {
  private authToken: string;

  constructor(
    private readonly _configApiService: ConfigApiService,
    private readonly _configurationApiService: ConfigurationApiService
  ) {
    this.authToken = this._configApiService.getConfigValue(
      ConfigKeys.AUTH_TOKEN_KEY
    );
  }

  async verify(token: string): Promise<IAccountProfile> {
    return new Promise((resolve, reject) => {
      jsonwebtoken.verify(
        token,
        this.authToken,
        (err, decoded: IWithJWTMetadataAccountProfile) => {
          if (err) {
            return reject(err);
          }

          const { exp, iat, ...decodedToken } = decoded;
          noop(exp, iat);
          return resolve(decodedToken);
        }
      );
    });
  }

  async sign(payload: IAccountProfile): Promise<string> {
    const tokenValidityDurationInDays =
      await this._configurationApiService.getSystemSettings(
        "tokenValidityDurationInDays"
      );

    return jsonwebtoken.sign(payload, this.authToken, {
      expiresIn: `${tokenValidityDurationInDays}d`,
    });
  }
}

export const authTokenApiService = new AuthTokenApiService(
  configApiService,
  configurationApiService
);
