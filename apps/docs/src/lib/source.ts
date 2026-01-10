import type { InferMetaType, InferPageType } from "fumadocs-core/source";

import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { docs, meta } from "fumadocs-mdx:collections/server";

export const source = loader({
  baseUrl: "/docs",
  source: toFumadocsSource(docs, meta),
});

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
