from quart import g


async def insert_content(content_data):
    result = await g.connection.fetch_one(
        """
        INSERT INTO content (
            title, artist, medium, year, image_url, height, width, depth, dimensions_unit, 
            price, condition, edition_number, description, collection_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id, title, artist, medium, year, image_url, height, width, depth, dimensions_unit, 
                  price, condition, edition_number, description, collection_id
        """,
        (
            content_data["title"],
            content_data["artist"],
            content_data["medium"],
            content_data["year"],
            content_data["image_url"],
            content_data.get("height"),
            content_data.get("width"),
            content_data.get("depth"),
            content_data.get("dimensions_unit"),
            content_data.get("price"),
            content_data.get("condition"),
            content_data.get("edition_number"),
            content_data.get("description"),
            content_data["collection_id"],
        ),
    )
    return {
        "id": result["id"],
        "title": result["title"],
        "artist": result["artist"],
        "medium": result["medium"],
        "year": result["year"],
        "image_url": result["image_url"],
        "height": result["height"],
        "width": result["width"],
        "depth": result["depth"],
        "dimensions_unit": result["dimensions_unit"],
        "price": result["price"],
        "condition": result["condition"],
        "edition_number": result["edition_number"],
        "description": result["description"],
        "collection_id": result["collection_id"],
    }


async def fetch_all_content():
    results = await g.connection.fetch_all(
        """
        SELECT 
            c.id, c.title, c.artist, c.medium, c.year, c.image_url, c.height, c.width, 
            c.depth, c.dimensions_unit, c.price, c.condition, c.edition_number, 
            c.description, c.collection_id, c.created_at,
            col.name AS collection_name, 
            t.id AS team_id, t.name AS team_name
        FROM content c
        JOIN collections col ON c.collection_id = col.id
        JOIN teams t ON col.team_id = t.id
        ORDER BY c.created_at DESC;
        """
    )

    return [
        {
            "id": row["id"],
            "title": row["title"],
            "artist": row["artist"],
            "medium": row["medium"],
            "year": row["year"],
            "image_url": row["image_url"],
            "height": row["height"],
            "width": row["width"],
            "depth": row["depth"],
            "dimensions_unit": row["dimensions_unit"],
            "price": row["price"],
            "condition": row["condition"],
            "edition_number": row["edition_number"],
            "description": row["description"],
            "collection_id": row["collection_id"],
            "collection_name": row["collection_name"],
            "team_id": row["team_id"],
            "team_name": row["team_name"],
            "created_at": row["created_at"],
        }
        for row in results
    ]
