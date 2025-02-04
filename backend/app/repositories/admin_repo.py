from quart import g


async def fetch_roles_by_name(roles):
    placeholders = ", ".join("?" for _ in roles)
    query = f"SELECT name FROM roles WHERE LOWER(name) IN ({placeholders})"
    lowered_roles = [role.lower() for role in roles]
    result = await g.connection.fetch_all(query, lowered_roles)
    return result


async def fetch_teams_by_name(teams):
    placeholders = ", ".join("?" for _ in teams)
    query = f"SELECT id, name FROM teams WHERE LOWER(name) IN ({placeholders})"
    lowered_teams = [team.lower() for team in teams]
    result = await g.connection.fetch_all(query, lowered_teams)
    return result



async def fetch_roles_permissions(roles):
    if not roles:
        return []

    placeholders = ", ".join(f":role_{i}" for i in range(len(roles)))
    query = f"""
        SELECT DISTINCT p.id AS permission_id, p.name AS permission_name
        FROM permissions p
        JOIN roles_permissions rp ON p.id = rp.permission_id
        JOIN roles r ON r.id = rp.role_id
        WHERE LOWER(r.name) IN ({placeholders});
    """

    params = {f"role_{i}": role.lower() for i, role in enumerate(roles)}

    result = await g.connection.fetch_all(query, params)

    return list({row["permission_name"] for row in result})
