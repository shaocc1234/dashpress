/* eslint-disable no-console */
import * as randomstring from "randomstring";

import { checkNodeVersion } from "./checkNodeVersion";

const replaceRandomCharaters = (envContent: string) => {
  return ["CREDENTIALS_ENCRYPTION_KEY", "AUTH_TOKEN_KEY"].reduce(
    (reducedEnvContent, currentKey) => {
      return reducedEnvContent.replace(
        `${currentKey}=RANDOM_CHARACTERS`,
        `${currentKey}=${randomstring.generate(128)}`
      );
    },
    envContent
  );
};

(async () => {
  const path = require("path");
  const fs = require("fs-extra");
  const { default: terminalLink } = await import("terminal-link");
  const { execa } = await import("execa");

  const { default: fetch } = await import("node-fetch");

  const defaultEnv = () => {
    if (fs.existsSync(path.join(process.cwd(), "./.env.local"))) {
      return;
    }

    const envContent: string = fs.readFileSync(
      path.join(__dirname, "../.env.example"),
      "utf8"
    );

    fs.writeFileSync(
      path.join(process.cwd(), "./.env.local"),
      replaceRandomCharaters(envContent)
    );
  };

  const copyEnvHere = () => {
    const envContent: string = fs.readFileSync(
      path.join(process.cwd(), "./.env.local"),
      "utf8"
    );

    fs.writeFileSync(
      path.join(__dirname, "../.env.local"),
      `${envContent}\nCURRENT_WORKING_DIRECTORY=${process.cwd()}`
    );
  };

  const currentPkgJson = require("../../package.json");

  process.stdout.write("\n");
  // https://patorjk.com/software/taag/#p=display&f=Big%20Money-ne&t=dashpress
  console.log(`
       /$$                     /$$
      | $$                    | $$
  /$$$$$$$   /$$$$$$  / $$$$$ | $$$$$$$   /$$$$$$    /$$$$$$  / $$$$$$   / $$$$$  / $$$$$
 /$$__  $$   |____$$ | $$____ | $$__  $$ / $$__ $$  / $$__ $$ | $$___$$ | $$____ | $$____
| $$  | $$  /$$$$$$$ | $$$$$$ | $$  \\ $$ | $$  \\ $$ | $$  \\__ | $$$$$$$ | $$$$$$ | $$$$$$
| $$  | $$ | $$__ $$  \\___ $$ | $$  | $$ | $$  | $$ | $$      | $$____/  \\___ $$  \\___ $$
| $$$$$$$$ | $$$$$$$ | $$$$$$ | $$  | $$ | $$$$$$$/ | $$      | $$$$$$$ | $$$$$$ | $$$$$$
\\_______/  \\______/   \\_____/ |__/  |__/ | $$____/  |__/      \\_______/  \\_____/ \\______/
                                         | $$
                                         | $$
                                         |__/

  `);

  console.log(`🟢 You're about to run DashPress v${currentPkgJson.version}`);

  if (!checkNodeVersion().status) {
    console.log("");
    console.warn(`🟨 ${checkNodeVersion().message}`);
  }

  defaultEnv();

  copyEnvHere();

  const endpoint = `http://localhost:${process.env.PORT || 3000}`;

  console.log(`
- ${terminalLink(
    "💗 Show us support by dropping a ✨ at github.com/dashpresshq/dashpress",
    "https://github.com/dashpresshq/dashpress"
  )}

- ${terminalLink(
    "💬 If you have questions? Join our community",
    "https://discord.gg/aV6DxwXhzN"
  )}
      `);

  const { stdout, stderr } = execa("npm", ["run", "start"], {
    cwd: path.join(__dirname, ".."),
  });

  console.log(
    `🚀 Application started successfully at ${terminalLink(endpoint, endpoint)}`
  );

  process.stdout.write("\n");

  const WAIT_FOR_NEXT_TO_START = 1000;

  /*
    We want to ping the application to bootstrap itself from here
    Else it boostraps on the first request which messes a lot of things up
    We dont want the ping to crash the application if the port is not ready yet
    Hence the catch(() => {});
    */
  setTimeout(() => {
    fetch(`${endpoint}/api/healthcheck`).catch(() => {});
  }, WAIT_FOR_NEXT_TO_START);

  let stdSkip = true;
  let stdCount = 0;
  const STD_SKIP_COUNT = 3;

  stdout.on("data", (chunk) => {
    const data = (chunk || "").toString();

    if (stdSkip) {
      stdCount += 1;

      if (stdCount > STD_SKIP_COUNT) {
        stdSkip = false;
      }

      return;
    }

    process.stdout.write(data);
  });

  stderr.pipe(process.stderr);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

export {};
