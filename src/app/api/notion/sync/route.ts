export async function POST() {
  return new Response(JSON.stringify({ message: 'Coming soon' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
