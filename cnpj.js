export const config = { runtime: 'edge' };

export default async function handler(req) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const cnpj = url.searchParams.get('cnpj');

  if (!cnpj) {
    return new Response(JSON.stringify({ error: 'CNPJ não informado' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const raw = cnpj.replace(/\D/g, '');

  if (raw.length !== 14) {
    return new Response(JSON.stringify({ error: 'CNPJ inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    const resp = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${raw}`, {
      headers: {
        'User-Agent': 'FornecedorBR/3.0',
        'Accept': 'application/json',
      },
    });

    const data = await resp.json();

    return new Response(JSON.stringify(data), {
      status: resp.status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}
