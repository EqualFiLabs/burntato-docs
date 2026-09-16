import fs from "node:fs";
import path from "node:path";

import { type NextRequest, NextResponse } from "next/server";

import { cleanMarkdown } from "@/lib/clean-md";
import { getStaticDocSlugs } from "@/lib/docs";

const docsDirectory = path.resolve(process.cwd(), "content", "docs");

export const dynamic = "force-static";

export function generateStaticParams() {
  return getStaticDocSlugs().map((slug: string[]) => ({
    slug: [...slug.slice(0, -1), `${slug.at(-1)}.md`],
  }));
}

function resolveDoc(segments: string[]): string | null {
  const finalSegment = segments.at(-1);
  if (!finalSegment?.endsWith(".md")) {
    return null;
  }

  const sourceSegments = [...segments.slice(0, -1), finalSegment.slice(0, -3)];
  const resolved = path.resolve(docsDirectory, ...sourceSegments) + ".mdx";
  const within = resolved.startsWith(`${docsDirectory}${path.sep}`);
  if (!within || !fs.existsSync(resolved)) {
    return null;
  }
  return resolved;
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await context.params;
  const filePath = resolveDoc(slug);
  if (!filePath) {
    return new NextResponse("Not found", { status: 404 });
  }
  const body = cleanMarkdown(fs.readFileSync(filePath, "utf8"));
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
