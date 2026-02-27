import "./src/env";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Ensure Turbopack treats the frontend folder as the workspace root
    root: "./",
  },
};

export default nextConfig;
