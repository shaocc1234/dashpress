import fs from "fs-extra";
import path from "path";

import { typescriptSafeObjectDotEntries } from "@/shared/lib/objects";

import { ConfigBag } from "./constants";
import { ConfigKeys } from "./types";

export { ConfigKeys };

export class ConfigApiService {
  static isInitialized = false;

  // eslint-disable-next-line no-undef
  getNodeEnvironment(): NodeJS.ProcessEnv["NODE_ENV"] {
    // eslint-disable-next-line no-undef
    return this.processEnv.NODE_ENV as NodeJS.ProcessEnv["NODE_ENV"];
  }

  constructor(protected processEnv: Record<string, unknown>) {
    if (!this.processEnv.DO_NOT_BOOSTRAP_CONFIG) {
      this.assertConfiguration();
    }
  }

  getConfigValue<T>(key: ConfigKeys): T {
    return this.processEnv[key] as unknown as T;
  }

  assertConfiguration() {
    if (ConfigApiService.isInitialized) {
      return;
    }
    ConfigApiService.isInitialized = true;
    const newEnvEntries: { key: ConfigKeys; value: string }[] = [];

    typescriptSafeObjectDotEntries(ConfigBag).forEach(([key, configBag]) => {
      const value = this.processEnv[key];
      if (!value) {
        if (this.getNodeEnvironment() === "production") {
          const message = `ENV variable with key '${key}' is missing`;
          throw new Error(message);
        } else {
          newEnvEntries.push({
            key,
            value: configBag.defaultValue(),
          });
        }
      }
    });

    if (newEnvEntries.length > 0) {
      const envContent: string[] = [
        "\n# AUTOMATICALLY GENERATED ENV CONFIG FOR STARTS HERE",
      ];
      newEnvEntries.forEach((envEntry) => {
        this.processEnv[envEntry.key] = envEntry.value;
        envContent.push(`${envEntry.key}=${envEntry.value}`);
      });
      envContent.push("# GENERATED ENV ENDS HERE");
      fs.appendFileSync(
        path.resolve(
          process.cwd(),
          (this.processEnv.ENV_LOCAL_FILE as string) || ".env.local"
        ),
        envContent.join("\n")
      );
    }
    typescriptSafeObjectDotEntries(ConfigBag).forEach(([key, configBag]) => {
      const value = this.processEnv[key];
      configBag.validate(value);
    });
  }
}

export const configApiService = new ConfigApiService(process.env);
