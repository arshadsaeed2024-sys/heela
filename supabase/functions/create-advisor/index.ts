import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const { firstName, lastName, email, password } = await req.json();
    if (!firstName || !lastName || !email || !password) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing required fields' }), {
        headers: { ...cors, 'Content-Type': 'application/json' }, status: 400,
      });
    }

    // 1. Create Supabase auth user via Admin API (bypasses email confirmation)
    const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: 'advisor', first_name: firstName, last_name: lastName },
      }),
    });

    const userData = await createRes.json();
    if (!createRes.ok) {
      return new Response(JSON.stringify({ ok: false, error: userData.message || 'Failed to create user' }), {
        headers: { ...cors, 'Content-Type': 'application/json' }, status: 400,
      });
    }

    const userId = userData.id;

    // 2. Insert into advisors table
    await fetch(`${SUPABASE_URL}/rest/v1/advisors`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ auth_id: userId, first_name: firstName, last_name: lastName, email }),
    });

    // 3. Send welcome email via Resend
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Heela <hello@heela.org>',
        to: email,
        subject: "You've been added as a Heela Program Advisor",
        html: `
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;">
            <div style="padding:32px 0 16px;">
              <span style="font-size:1.5rem;font-weight:700;color:#1B3D2F;">Heela</span>
            </div>
            <h1 style="font-size:1.6rem;color:#1B3D2F;margin:0 0 12px;">Welcome, ${firstName}.</h1>
            <p style="font-size:1rem;line-height:1.6;color:#444;margin:0 0 24px;">
              You've been set up as a Program Advisor on Heela. Your account is ready to go.
            </p>
            <p style="font-size:0.95rem;color:#444;margin:0 0 8px;"><strong>Email:</strong> ${email}</p>
            <p style="font-size:0.95rem;color:#444;margin:0 0 32px;"><strong>Password:</strong> ${password}</p>
            <a href="https://heela.org/login.html" style="display:inline-block;padding:14px 28px;background:#234E3B;color:#fff;border-radius:100px;text-decoration:none;font-weight:600;font-size:1rem;">
              Sign in to Heela →
            </a>
            <p style="font-size:0.8rem;color:#999;margin-top:32px;">Please change your password after your first sign-in. If you have questions, reply to this email.</p>
          </div>`,
      }),
    });

    return new Response(JSON.stringify({ ok: true, id: userId }), {
      headers: { ...cors, 'Content-Type': 'application/json' }, status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      headers: { ...cors, 'Content-Type': 'application/json' }, status: 500,
    });
  }
});
