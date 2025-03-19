import { defineConfig } from "rollup";
import ignore from "rollup-plugin-ignore";

export default defineConfig({
  plugins: [
    ignore(["src/socket/marketDataFeed.proto"]),
  ],
});
