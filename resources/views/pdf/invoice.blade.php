<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Facture</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root { --text:#1f2937; --muted:#6b7280; --border:#e5e7eb; --accent:#0ea5e9; }
    * { box-sizing: border-box; }
    body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji"; color: var(--text); margin: 0; padding: 0; }
    .container { max-width: 800px; margin: 0 auto; padding: 32px; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--border); padding-bottom: 16px; margin-bottom: 24px; }
    .brand { font-weight: 800; font-size: 20px; letter-spacing: .5px; }
    .brand-accent { color: var(--accent); }
    .meta { text-align: right; font-size: 12px; color: var(--muted); }
    .title { font-size: 26px; font-weight: 800; margin: 4px 0 16px; }
    .row { display: flex; gap: 16px; margin: 10px 0; }
    .col { flex: 1; }
    .panel { border: 1px solid var(--border); border-radius: 8px; padding: 14px; }
    .label { font-size: 12px; color: var(--muted); margin-bottom: 4px; }
    .value { font-size: 14px; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { text-align: left; border-bottom: 1px solid var(--border); padding: 10px 8px; font-size: 14px; }
    tfoot td { border-top: 2px solid var(--border); font-weight: 700; }
    .footer { margin-top: 28px; border-top: 1px solid var(--border); padding-top: 16px; font-size: 11px; color: var(--muted); }
    @page { margin: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand"><span class="brand-accent">MASTER</span>TRADE</div>
      <div class="meta">
        Facture émise le {{ $issued_at }}<br>
        N° commande: {{ \Illuminate\Support\Str::upper(substr($order->id,0,8)) }}
      </div>
    </div>

    <div class="title">Facture</div>

    <div class="row">
      <div class="panel col">
        <div class="label">Facturé à</div>
        <div class="value">{{ $user->name ?? 'Client' }}</div>
        <div style="font-size:12px;color:var(--muted);">{{ $user->email ?? '' }}</div>
      </div>
      <div class="panel col">
        <div class="label">Informations commande</div>
        <div class="value">Statut: {{ ucfirst($order->status ?? '—') }}</div>
        <div class="value" style="font-weight:500">Méthode: {{ $order->payment_method ?? '—' }}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Produit</th>
          <th>SKU</th>
          <th>Version</th>
          <th style="text-align:right">Montant</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ $product->name ?? 'Logiciel' }}</td>
          <td>{{ $product->sku ?? '—' }}</td>
          <td>{{ $product->version ?? '—' }}</td>
          <td style="text-align:right">{{ number_format(($order->amount ?? 0)/100, 2, ',', ' ') }} FCFA</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="text-align:right">Total</td>
          <td style="text-align:right">{{ number_format(($order->amount ?? 0)/100, 2, ',', ' ') }} FCFA</td>
        </tr>
      </tfoot>
    </table>

    <div class="footer">
      Merci pour votre achat. Conservez cette facture pour vos archives. Pour toute question, contactez le support MASTERTRADE.
    </div>
  </div>
</body>
</html>
