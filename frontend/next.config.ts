import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin Turbopack root when a parent directory also has a lockfile (e.g. user home).
  turbopack: {
    root: path.join(__dirname),
  },
  // Tree-shake heavy barrel imports (icons, charts) so each page only ships
  // the icons it actually uses instead of the whole library bundle.
  experimental: {
    optimizePackageImports: ["iconsax-reactjs", "lucide-react", "recharts"],
  },
  // Reduce CLS on Image — lock width/height calc and prefer modern formats.
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
