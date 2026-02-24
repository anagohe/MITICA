// studio-mitica/sanity.cli.ts
import React from "react";
(globalThis as any).React = React;

import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "cdstv0qp",
    dataset: "production",
  },
  deployment: {
    autoUpdates: true,
    appId: "lt0oz1lq3xfydlpka8q6kqvp",
  },
});
