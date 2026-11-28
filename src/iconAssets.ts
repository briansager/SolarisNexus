import { echoDatabase } from './echoData';
import { sonataData } from './sonataData';

export interface AssetIndex {
  urls: Readonly<Record<string, string | undefined>>;
  missingIds: string[];
  unmatchedPaths: string[];
  invalidPaths: string[];
  collisions: { name: string; paths: string[] }[];
}

export function normalizeAssetPath(path: string): string {
  return (path.split(/[\\/]/).pop() || '')
    .replace(/\.(webp|png|jpg|jpeg)$/i, '')
    .replace(/^Icon_/i, '')
    .replace(/_Icon$/i, '')
    .replace(/_/g, '-')
    .toLowerCase();
}

export function buildAssetIndex(
  modules: Record<string, string>,
  databaseIds: readonly string[],
  aliases: Readonly<Record<string, string>> = {},
): AssetIndex {
  const sources = new Map<string, string[]>();
  const invalidPaths: string[] = [];
  // A stable source-path order decides collisions, independently of glob order.
  for (const path of Object.keys(modules).sort()) {
    if (typeof modules[path] !== 'string' || !modules[path]) {
      invalidPaths.push(path);
      continue;
    }
    const name = normalizeAssetPath(path);
    sources.set(name, [...(sources.get(name) || []), path]);
  }

  const urls: Record<string, string | undefined> = Object.create(null);
  const usedPaths = new Set<string>();
  for (const id of databaseIds) {
    // Prefer the canonical name; aliases describe verified exceptions only.
    const paths = sources.get(id) || sources.get(aliases[id]);
    if (paths) {
      urls[id] = modules[paths[0]];
      paths.forEach(path => usedPaths.add(path));
    }
  }

  return {
    urls,
    missingIds: databaseIds.filter(id => !urls[id]),
    unmatchedPaths: [...sources.values()].flat().filter(path => !usedPaths.has(path)),
    invalidPaths,
    collisions: [...sources].filter(([, paths]) => paths.length > 1)
      .map(([name, paths]) => ({ name, paths })),
  };
}

// These paths are relative to this module in src, not to the components folder.
const echoModules = import.meta.glob<string>('./assets/echoes/**/*.{webp,png,jpg,jpeg}', {
  eager: true,
  import: 'default',
});
const sonataModules = import.meta.glob<string>('./assets/sonata/**/*.{webp,png,jpg,jpeg}', {
  eager: true,
  import: 'default',
});

export const echoAssets = buildAssetIndex(echoModules, echoDatabase.map(echo => echo.id), {
  // Database: Devotee's Flesh; repository: Devotee_Flesh_Icon.png.
  'devotees-flesh': 'devotee-flesh',
});
export const sonataAssets = buildAssetIndex(sonataModules, sonataData.map(set => set.id));

export const getEchoIcon = (echoId: string): string | undefined => echoAssets.urls[echoId];
export const getSonataIcon = (setId: string): string | undefined => sonataAssets.urls[setId];

if (import.meta.env.DEV) {
  for (const [kind, index] of [['Echo', echoAssets], ['Sonata', sonataAssets]] as const) {
    if (index.missingIds.length || index.unmatchedPaths.length ||
        index.invalidPaths.length || index.collisions.length) {
      console.warn(`[assets] ${kind} mapping diagnostics`, index);
    }
  }
}
