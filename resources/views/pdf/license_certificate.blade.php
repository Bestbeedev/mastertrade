<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Certificat de licence</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root { --text:#1f2937; --muted:#6b7280; --border:#d1d5db; --border-2:#e5e7eb; --accent:#d4af37; --bg:#ffffff; --bg-soft:#f8fafc; }
    * { box-sizing: border-box; }
    body { font-family: "Inter", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, "Helvetica Neue", Arial; color: var(--text); margin: 0; padding: 0; background: var(--bg-soft); }
    .container { max-width: 900px; margin: 0 auto; padding: 28px; background: var(--bg); border: 1px solid var(--border-2); }
    .header { display: table; width: 100%; border-bottom: 2px solid var(--border-2); padding-bottom: 14px; margin-bottom: 18px; }
    .header-left { display: table-cell; vertical-align: middle; }
    .header-right { display: table-cell; text-align: right; vertical-align: middle; }
    .brand { font-weight: 800; font-size: 22px; letter-spacing: .5px; }
    .brand-accent { color: var(--accent); }
    .meta { font-size: 12px; color: var(--muted); }
    .title { text-align: center; font-size: 30px; font-weight: 800; margin: 6px 0 2px; letter-spacing: 1px; }
    .subtitle { text-align: center; color: var(--muted); margin-bottom: 18px; }
    .divider { height: 6px; width: 140px; background: var(--accent); margin: 0 auto 16px; border-radius: 3px; }
    .key-badge { text-align: center; margin: 10px 0 22px; }
    .key { display: inline-block; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 20px; letter-spacing: .12em; background: #fff8e1; color: #4b5563; border: 1px solid var(--accent); padding: 12px 16px; border-radius: 8px; }
    .row { display: table; width: 100%; table-layout: fixed; border-spacing: 12px 0; margin: 6px 0 10px; }
    .col { display: table-cell; vertical-align: top; }
    .panel { border: 1px solid var(--border-2); border-radius: 8px; padding: 14px; background: #fff; }
    .label { font-size: 11px; color: var(--muted); margin-bottom: 4px; text-transform: uppercase; letter-spacing: .06em; }
    .value { font-size: 14px; font-weight: 700; color: #111827; }
    .footer { margin-top: 22px; border-top: 1px solid var(--border-2); padding-top: 12px; font-size: 11px; color: var(--muted); }
    .signs { display: table; width: 100%; table-layout: fixed; margin-top: 16px; }
    .sign { display: table-cell; padding-top: 12px; border-top: 1px dashed var(--border-2); text-align: center; font-size: 12px; color: var(--muted); }
    .qr { width: 120px; height: 120px; border: 1px solid var(--border-2); border-radius: 6px; }
    @page { margin: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <div class="brand"><span class="brand-accent">MASTER</span>TRADE</div>
      </div>
      <div class="header-right meta">
        Certificat émis le {{ $issued_at }}<br>
        Réf. licence: {{ \Illuminate\Support\Str::upper(substr($license->id,0,8)) }}
      </div>
    </div>

    <div class="title">CERTIFICAT DE LICENCE</div>
    <div class="divider"></div>
    <div class="subtitle">Preuve officielle d'autorisation d'utilisation du logiciel</div>

    <div class="key-badge">
      <span class="key">{{ $license->key }}</span>
    </div>

    <div class="row">
      <div class="panel col">
        <div class="label">Produit</div>
        <div class="value">{{ $product->name ?? 'Produit' }} @if(!empty($product?->version)) • v{{ $product->version }} @endif</div>
      </div>
      <div class="panel col">
        <div class="label">Titulaire</div>
        <div class="value">{{ $user->name ?? 'Utilisateur' }}</div>
        <div style="font-size:12px;color:var(--muted);">{{ $user->email ?? '' }}</div>
      </div>
    </div>

    <div class="row">
      <div class="panel col">
        <div class="label">Type</div>
        <div class="value">{{ ucfirst($license->type) }}</div>
      </div>
      <div class="panel col">
        <div class="label">Statut</div>
        <div class="value">{{ ucfirst($license->status) }}</div>
      </div>
      <div class="panel col">
        <div class="label">Expiration</div>
        <div class="value">{{ $license->expiry_date ? \Illuminate\Support\Carbon::parse($license->expiry_date)->toDateString() : 'N/A' }}</div>
      </div>
    </div>

    <div class="row">
      <div class="panel col">
        <div class="label">Activations autorisées</div>
        <div class="value">{{ (int)($license->max_activations ?? 1) }}</div>
      </div>
      <div class="panel col">
        <div class="label">Activations utilisées</div>
        <div class="value">{{ (int)($license->activations_count ?? 0) }}</div>
      </div>
      <div class="panel col">
        <div class="label">ID Licence</div>
        <div class="value">{{ $license->id }}</div>
      </div>
    </div>

    <div class="row">
      <div class="panel col" style="text-align:center">
        <div class="label">Vérification</div>
        <div class="value" style="font-weight:600; margin-bottom:6px;">Scannez pour vérifier</div>
        <img class="qr" src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data={{ urlencode($verification_url) }}" alt="QR Code" />
      </div>
    </div>

    <div class="signs">
      <div class="sign">Signature — Représentant MASTERTRADE</div>
      <div class="sign">Signature — Titulaire de la licence</div>
    </div>

    <div class="footer">
      Ce certificat atteste que le titulaire est autorisé à utiliser le logiciel ci-dessus conformément aux termes de la licence. Conservez ce document pour vos archives.
    </div>
  </div>
</body>
</html>
