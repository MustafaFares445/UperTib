import breakpoints from '@ux-tokens/breakpoints.json';
import component from '@ux-tokens/component.json';
import density from '@ux-tokens/density.json';
import motion from '@ux-tokens/motion.json';
import primitiveColor from '@ux-tokens/primitive.color.json';
import primitiveSpace from '@ux-tokens/primitive.space.json';
import primitiveType from '@ux-tokens/primitive.type.json';
import semantic from '@ux-tokens/semantic.json';
import semanticState from '@ux-tokens/semantic.state.json';

/**
 * Canonical token resolver. Reads directly from docs/ux/03-system/design_tokens/ (see
 * tokenSources.ts for the raw imports) and resolves DTCG `{a.b.c}` references into concrete
 * values. Nothing in this file or its callers may hardcode a design value: every colour, space,
 * radius, type style and lifecycle triple must trace back to the canonical JSON.
 *
 * V1 is light-only (docs/ux/03-system/design_tokens/README.md), so only the light `semantic`
 * branch is resolved; the `dark` compatibility map is intentionally not read here.
 */

type TokenNode = Record<string, unknown>;

const REF = /^\{([^{}]+)\}$/;

function isPlainObject(value: unknown): value is TokenNode {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Flattens every DTCG file's top-level keys into one dot-path index of raw `$value`s. */
function flattenIndex(roots: TokenNode[]): Map<string, unknown> {
  const index = new Map<string, unknown>();

  function walk(node: unknown, path: string[]) {
    if (!isPlainObject(node)) {
      return;
    }
    if ('$value' in node) {
      index.set(path.join('.'), node.$value);
      return;
    }
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith('$')) {
        continue;
      }
      walk(child, [...path, key]);
    }
  }

  for (const root of roots) {
    for (const [key, child] of Object.entries(root)) {
      if (key.startsWith('$') || key === 'dark') {
        continue;
      }
      walk(child, [key]);
    }
  }

  return index;
}

const index = flattenIndex([
  primitiveColor,
  primitiveType,
  primitiveSpace,
  semantic,
  component,
  motion,
  density,
  breakpoints,
  semanticState,
]);

const MAX_DEPTH = 12;

/** Resolves a raw token value (string ref, array, composite object) to its final concrete form. */
function resolveValue(value: unknown, depth = 0): unknown {
  if (depth > MAX_DEPTH) {
    throw new Error('Token reference cycle or excessive depth while resolving a design token.');
  }
  if (typeof value === 'string') {
    const match = REF.exec(value.trim());
    if (match) {
      const path = match[1];
      if (!index.has(path)) {
        throw new Error(`Unresolved design token reference: {${path}}`);
      }
      return resolveValue(index.get(path), depth + 1);
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => resolveValue(item, depth + 1));
  }
  if (isPlainObject(value)) {
    const out: TokenNode = {};
    for (const [key, child] of Object.entries(value)) {
      out[key] = resolveValue(child, depth + 1);
    }
    return out;
  }
  return value;
}

/**
 * Resolves any dot-path into the merged token index (e.g. "semantic.color.surface.canvas"), or —
 * when the path names a container rather than a single `$value` leaf (e.g. "semantic.color.tone.
 * success", or a lifecycle status carrying its tone/icon/emphasis as three separate leaves) —
 * reconstructs the nested object from every flat entry under that prefix.
 */
export function resolve(path: string): unknown {
  if (index.has(path)) {
    return resolveValue(index.get(path));
  }
  const prefix = `${path}.`;
  const result: TokenNode = {};
  let found = false;
  for (const [key, raw] of index) {
    if (!key.startsWith(prefix)) {
      continue;
    }
    found = true;
    const rel = key.slice(prefix.length).split('.');
    let node = result;
    for (let i = 0; i < rel.length - 1; i += 1) {
      const segment = rel[i];
      if (!isPlainObject(node[segment])) {
        node[segment] = {};
      }
      node = node[segment] as TokenNode;
    }
    node[rel[rel.length - 1]] = resolveValue(raw);
  }
  if (!found) {
    throw new Error(`Unknown design token path: "${path}". It does not exist in the canonical source.`);
  }
  return result;
}

function parseDimension(value: unknown): number {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    if (value === 'none') {
      return 0;
    }
    const match = /^(-?\d*\.?\d+)px$/.exec(value);
    if (match) {
      return Number.parseFloat(match[1]);
    }
  }
  throw new Error(`Expected a pixel dimension token, got: ${JSON.stringify(value)}`);
}

/** A resolved semantic colour, e.g. color('surface.canvas') or color('tone.success.fill'). */
export function color(name: string): string {
  return resolve(`semantic.color.${name}`) as string;
}

/** A resolved semantic space/size/radius/border dimension, in device-independent pixels. */
export function space(name: string): number {
  return parseDimension(resolve(`semantic.space.${name}`));
}

/** A resolved component-scoped token, e.g. componentColor('elig-001.border-selected'). */
export function componentColor(path: string): string {
  return resolve(`component.${path}`) as string;
}

export function size(name: string): number {
  return parseDimension(resolve(`semantic.size.${name}`));
}

export function radius(name: string): number {
  return parseDimension(resolve(`semantic.radius.${name}`));
}

export function borderWidth(name: string): number {
  return parseDimension(resolve(`semantic.border.${name}`));
}

/** A resolved semantic.focus.* dimension (width/outer-width/offset) — a sibling of space, not under it. */
export function focusDimension(name: string): number {
  return parseDimension(resolve(`semantic.focus.${name}`));
}

export interface RNTypeStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: '400' | '500' | '600' | '700';
  lineHeight: number;
  letterSpacing: number;
}

function toCssFontFamily(stack: string[]): string {
  return stack.map((name) => (name.includes(' ') ? `"${name}"` : name)).join(', ');
}

/** A resolved composite semantic.type.* style, ready to spread into an RN Text style. */
export function typeStyle(name: string): RNTypeStyle {
  const raw = resolve(`semantic.type.${name}`) as {
    fontFamily: string[];
    fontSize: string;
    fontWeight: number;
    lineHeight: number;
    letterSpacing: string;
  };
  const fontSize = parseDimension(raw.fontSize);
  return {
    fontFamily: toCssFontFamily(raw.fontFamily),
    fontSize,
    fontWeight: String(raw.fontWeight) as RNTypeStyle['fontWeight'],
    lineHeight: Math.round(fontSize * raw.lineHeight),
    letterSpacing: parseDimension(raw.letterSpacing),
  };
}

export interface ToneColors {
  fill: string;
  border: string;
  text: string;
  icon: string;
  emphasis: string;
  onEmphasis: string;
  emphasisBorder: string;
}

export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'restricted';
export type Emphasis = 'muted' | 'subtle' | 'outline' | 'solid';

/** The six governed status tones, each carrying the full fill/border/text/icon/emphasis set. */
export function toneColors(tone: Tone): ToneColors {
  const raw = resolve(`semantic.color.tone.${tone}`) as Record<string, string>;
  return {
    fill: raw.fill,
    border: raw.border,
    text: raw.text,
    icon: raw.icon,
    emphasis: raw.emphasis,
    onEmphasis: raw['on-emphasis'],
    emphasisBorder: raw['emphasis-border'],
  };
}

export interface StateTriple {
  tone: Tone;
  icon: string;
  emphasis: Emphasis;
}

/** A lifecycle status resolved to its governed {tone, icon, emphasis} triple. Never a colour alone. */
export function stateTriple(machine: string, status: string): StateTriple {
  return resolve(`state.${machine}.${status}`) as StateTriple;
}

export interface ChipVisual {
  background: string;
  border: string;
  text: string;
  icon: string;
}

/**
 * Resolves a tone + the semantic.state.json emphasis-scale rule into a renderable style.
 * See CMP-PLATFORM-001's token mapping (component.json component.platform-001) for the four
 * treatments: muted (neutral, no tone colour), subtle (the default), outline (settled/historical),
 * solid (blocking + unrecoverable deadline only).
 */
export function chipVisual(tone: Tone, emphasis: Emphasis): ChipVisual {
  const tones = toneColors(tone);
  switch (emphasis) {
    case 'muted': {
      const neutral = toneColors('neutral');
      return { background: neutral.fill, border: neutral.border, text: neutral.text, icon: neutral.icon };
    }
    case 'outline':
      return { background: 'transparent', border: tones.border, text: tones.text, icon: tones.icon };
    case 'solid':
      return {
        background: tones.emphasis,
        border: tones.emphasisBorder,
        text: tones.onEmphasis,
        icon: tones.onEmphasis,
      };
    case 'subtle':
    default:
      return { background: tones.fill, border: tones.border, text: tones.text, icon: tones.icon };
  }
}

/** The single governed icon set. Every Icon name in the app must be a member of this vocabulary. */
export function iconSet(): string {
  return resolve('icon-set') as string;
}
