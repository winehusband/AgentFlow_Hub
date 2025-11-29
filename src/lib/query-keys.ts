/**
 * Query key utilities
 *
 * Provides stable serialization for query keys with params objects.
 * Prevents cache fragmentation when object identity changes.
 */

/**
 * Serialize params object to a stable string for query keys
 * Handles undefined/null values consistently
 */
export function serializeParams(params?: Record<string, unknown>): string | undefined {
  if (!params) return undefined;

  // Filter out undefined/null values and sort keys for consistency
  const filtered = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .sort(([a], [b]) => a.localeCompare(b));

  if (filtered.length === 0) return undefined;

  return JSON.stringify(Object.fromEntries(filtered));
}

/**
 * Create a query key with optional serialized params
 * Usage: createQueryKey(["hubs", "list"], params)
 */
export function createQueryKey(
  base: readonly unknown[],
  params?: Record<string, unknown>
): readonly unknown[] {
  const serialized = serializeParams(params);
  return serialized ? [...base, serialized] : base;
}
