import { defineConfig } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import externals from "rollup-plugin-node-externals";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import typescript from "rollup-plugin-typescript2";

export default defineConfig([
  {
    input: { index: "src/index.ts" },
    output: [
      {
        dir: "dist", //输出目录
        format: "cjs", //输出commonjs文件
      },
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      externals({
        devDeps: false, // 排除开发依赖, 比如axios, vue等，不打包到最终的js文件中
      }),
      json(),
      terser(),
      typescript(),
    ],
  },
]);
