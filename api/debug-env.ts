export default async function handler(_req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

  const candidates = [
    'POSTGRES_URL',
    'DATABASE_URL',
    'POSTGRES_PRISMA_URL',
    'POSTGRES_URL_NON_POOLING',
    'SUPABASE_DB_URL',
    'BLOB_READ_WRITE_TOKEN',
  ];

  const present: Record<string, boolean> = {};
  const shape: Record<string, string> = {};
  for (const key of candidates) {
    const val = process.env[key];
    present[key] = Boolean(val && val.length > 0);
    if (val) {
      const looksLikeUrl = /^postgres(ql)?:\/\//i.test(val.trim());
      const hasLeadingOrTrailingSpace = val !== val.trim();
      shape[key] = `len=${val.length} startsWithPostgresScheme=${looksLikeUrl} hasStrayWhitespace=${hasLeadingOrTrailingSpace} first15="${val.slice(0, 15)}"`;
    }
  }

  // Also list any env var name (not value) that contains these substrings,
  // in case the real name is prefixed/suffixed differently than expected.
  const relatedKeys = Object.keys(process.env).filter((k) =>
    /POSTGRES|DATABASE|PG_|PGHOST|PGUSER|PGPASSWORD|NEON|SUPABASE|BLOB/i.test(k)
  );

  return res.status(200).json({
    exactNamesChecked: present,
    valueShape: shape,
    allRelatedEnvVarNamesFound: relatedKeys.sort(),
  });
}
