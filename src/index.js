export default {
async fetch(request, env) {
const url = new URL(request.url);

if (url.pathname === "/api/order" && request.method === "OPTIONS") {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

if (url.pathname === "/api/order" && request.method === "POST") {
  try {
    const order = await request.json();

    const message = `🍴 НОВЕ ЗАМОВЛЕННЯ — ШаверMAN
👤 Ім'я: ${order.name}
📞 Телефон: ${order.phone}
🛍 Замовлення: ${order.items}
💰 Сума: ${order.total}
🚚 Отримання: ${order.delivery}`;

    const response = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: message
        })
      }
    );

    if (!response.ok) {
      return new Response("Помилка надсилання в Telegram", { status: 502 });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch {
    return new Response("Помилка замовлення", { status: 400 });
  }
}

return new Response("Not found", { status: 404 });
}
};
