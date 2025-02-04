from quart import g


async def fetch_all_invoices():
    result = await g.connection.fetch_all(
        "SELECT id, title, recipient, amount, due_date, status, paid_at FROM invoices",
    )
    return result
