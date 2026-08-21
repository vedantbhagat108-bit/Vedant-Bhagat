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
  for (const key of candidates) {
    present[key] = Boolean(process.env[key] && process.env[key]!.length > 0);
  }

  // Also list any env var name (not value) that contains these substrings,
  // in case the real name is prefixed/suffixed differently than expected.
  const relatedKeys = Object.keys(process.env).filter((k) =>
    /POSTGRES|DATABASE|PG_|PGHOST|PGUSER|PGPASSWORD|NEON|SUPABASE|BLOB/i.test(k)
  );

  return res.status(200).json({
    exactNamesChecked: present,
    allRelatedEnvVarNamesFound: relatedKeys.sort(),
  });
}
