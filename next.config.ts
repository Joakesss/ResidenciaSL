import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export estatico: genera HTML plano en out/. Sin servidor, deploy gratis.
  output: "export",
  // Obligatorio con output:export — no hay servidor que optimice imagenes.
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
