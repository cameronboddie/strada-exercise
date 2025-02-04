from app.repositories.invoices_repo import fetch_all_invoices


async def get_all_invoices():
    return await fetch_all_invoices()
