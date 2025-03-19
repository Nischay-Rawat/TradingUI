import ignore from "rollup-plugin-ignore";

export default {
  plugins: [
    ignore(["src/socket/marketDataFeed.proto"]),
  ],
};
