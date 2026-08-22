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

  let liveConnectionTest: any = { attempted: false };
  try {
    const { neon } = await import('@neondatabase/serverless');
    const connString =
      process.env.POSTGRES_URL ||
      process.env.DATABASE_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.SUPABASE_DB_URL;
    liveConnectionTest.attempted = true;
    if (!connString) {
      liveConnectionTest.result = 'no connection string found among candidates';
    } else {
      const sql = neon(connString);
      const rows = await sql`SELECT 1 as ok`;
      liveConnectionTest.result = 'success';
      liveConnectionTest.rows = rows;
    }
  } catch (e: any) {
    liveConnectionTest.result = 'error';
    liveConnectionTest.errorMessage = e?.message || String(e);
    liveConnectionTest.errorName = e?.name;
  }

  return res.status(200).json({
    exactNamesChecked: present,
    valueShape: shape,
    liveConnectionTest,
    allRelatedEnvVarNamesFound: relatedKeys.sort(),
  });
}
