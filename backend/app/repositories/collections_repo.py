from quart import g


async def insert_collection(collection_data):
    result = await g.connection.fetch_one(
        """
        INSERT INTO collections (
            name, description, featured_image, tags, parent_id, team_id
        ) VALUES (?, ?, ?, ?, ?, ?)
        RETURNING id, name, description, featured_image, tags, parent_id, team_id
        """,
        (
            collection_data["name"],
            collection_data["description"],
            collection_data.get("featured_image"),
            ", ".join(collection_data.get("tags", [])),
            collection_data.get("parent_id"),
            collection_data["team_id"],
        ),
    )
    return {
        "id": result["id"],
        "name": result["name"],
        "description": result["description"],
        "featured_image": result["featured_image"],
        "tags": result["tags"].split(", ") if result["tags"] else [],
        "parent_id": result["parent_id"],
        "team_id": result["team_id"],
    }


async def fetch_all_collections():
    result = await g.connection.fetch_all(
        """
        SELECT 
            col.id, 
            col.name, 
            col.description, 
            col.featured_image, 
            col.tags, 
            col.parent_id, 
            col.created_at,
            t.id AS team_id, 
            t.name AS team_name
        FROM collections col
        JOIN teams t ON col.team_id = t.id
        ORDER BY col.created_at DESC;
        """
    )

    return [
        {
            "id": row["id"],
            "name": row["name"],
            "description": row["description"],
            "featured_image": row["featured_image"],
            "tags": row["tags"].split(", ") if row["tags"] else [],
            "parent_id": row["parent_id"],
            "team_id": row["team_id"],
            "team_name": row["team_name"],
            "created_at": row["created_at"],
        }
        for row in result
    ]


async def fetch_collection_by_id(id):
    result = await g.connection.fetch_one(
        """
        SELECT 
            col.id, col.name, col.description, col.featured_image, col.tags, col.parent_id, 
            t.id AS team_id, t.name AS team_name
        FROM collections col
        JOIN teams t ON col.team_id = t.id
        WHERE col.id = ?
        """,
        (id,),
    )

    if not result:
        return None

    return {
        "id": result["id"],
        "name": result["name"],
        "description": result["description"],
        "featured_image": result["featured_image"],
        "tags": result["tags"].split(", ") if result["tags"] else [],
        "parent_id": result["parent_id"],
        "team_id": result["team_id"],
        "team_name": result["team_name"],
    }


async def fetch_sub_collections_by_collection_id(id):
    results = await g.connection.fetch_all(
        """
        SELECT 
            id, name, description, featured_image, tags, parent_id, team_id, created_at
        FROM collections 
        WHERE parent_id = ?
        ORDER BY created_at DESC;
        """,
        (id,),
    )

    return [
        {
            "id": row["id"],
            "name": row["name"],
            "description": row["description"],
            "featured_image": row["featured_image"],
            "tags": row["tags"].split(", ") if row["tags"] else [],
            "parent_id": row["parent_id"],
            "team_id": row["team_id"],
            "created_at": row["created_at"],
        }
        for row in results
    ]


async def fetch_content_by_collection_id(id):
    results = await g.connection.fetch_all(
        """
        SELECT 
            id, title, artist, medium, year, image_url, height, width, depth, 
            dimensions_unit, price, condition, edition_number, description, collection_id, created_at 
        FROM content 
        WHERE collection_id = ?
        ORDER BY created_at DESC;
        """,
        (id,),
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
            "created_at": row["created_at"],
        }
        for row in results
    ]


async def update_collection(id, data):
    existing_collection = await g.connection.fetch_one(
        "SELECT * FROM collections WHERE id = ?", (id,)
    )

    if not existing_collection:
        return {"error": "Collection not found"}, 404

    # Allowed fields for update
    allowed_fields = {"name", "description", "featured_image", "tags", "parent_id"}
    update_data = {key: value for key, value in data.items() if key in allowed_fields}

    if not update_data:
        return {"error": "No valid fields to update"}, 400

    # Handle special cases (tags should be stored as a comma-separated string)
    if "tags" in update_data:
        update_data["tags"] = (
            ", ".join(update_data["tags"])
            if isinstance(update_data["tags"], list)
            else update_data["tags"]
        )

    # Construct SQL query dynamically
    update_fields = ", ".join([f"{key} = ?" for key in update_data.keys()])
    values = list(update_data.values()) + [id]  # Ensure ID is included at the end

    query = f"""
        UPDATE collections
        SET {update_fields}
        WHERE id = ?
        RETURNING id, name, description, featured_image, tags, parent_id, team_id;
    """

    # Execute update query
    result = await g.connection.fetch_one(query, values)

    if not result:
        return {"error": "Failed to update collection"}, 500

    return {
        "id": result["id"],
        "name": result["name"],
        "description": result["description"],
        "featured_image": result["featured_image"],
        "tags": result["tags"].split(", ") if result["tags"] else [],
        "parent_id": result["parent_id"],
        "team_id": result["team_id"],
    }
