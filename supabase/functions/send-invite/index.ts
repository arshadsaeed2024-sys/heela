import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { firstName, toEmail, heelaEmail, inviteUrl } = await req.json();

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Heela <hello@heela.org>',
        to: toEmail,
        subject: "You're accepted — set up your Heela Fellow account",
        html: `
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;">
            <div style="padding:32px 0 16px;">
              <span style="font-size:1.5rem;font-weight:700;color:#1B3D2F;">Heela</span>
            </div>
            <h1 style="font-size:1.6rem;color:#1B3D2F;margin:0 0 12px;">Welcome, ${firstName}.</h1>
            <p style="font-size:1rem;line-height:1.6;color:#444;margin:0 0 24px;">
              Your Heela Fellow application has been approved. We're excited to have you on the team.
            </p>
            <p style="font-size:0.95rem;line-height:1.6;color:#444;margin:0 0 8px;">
              Your Heela email will be: <strong>${heelaEmail}</strong>
            </p>
            <p style="font-size:0.95rem;line-height:1.6;color:#444;margin:0 0 32px;">
              Click the button below to set your password and activate your account:
            </p>
            <a href="${inviteUrl}" style="display:inline-block;padding:14px 28px;background:#234E3B;color:#fff;border-radius:100px;text-decoration:none;font-weight:600;font-size:1rem;">
              Set up my account →
            </a>
            <p style="font-size:0.8rem;color:#999;margin-top:32px;">
              This link expires in 7 days. If you have questions, reply to this email.
            </p>
          </div>`,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify({ ok: res.ok, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: res.ok ? 200 : 400,
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
