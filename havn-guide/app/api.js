const SUPABASE_URL = 'https://dqjnqvbxfwtvrjwnnmns.supabase.co';

export async function lookupReservation(guestName) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/hostaway-lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ guestName }),
  });
  return res.json();
}

export async function fetchGuideContent() {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/guide-content`);
  return res.json();
}

export async function submitFeedback(payload) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/guest-actions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'feedback', ...payload }),
  });
  return res.json();
}

export async function requestService(payload) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/guest-actions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'service_request', ...payload }),
  });
  return res.json();
}
