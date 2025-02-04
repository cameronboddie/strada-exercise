import re
from backend.app.exceptions.api import CollectionNotFoundError
from backend.app.repositories.collections_repo import (
    insert_collection,
    fetch_collection_by_id,
    fetch_all_collections,
    fetch_sub_collections_by_collection_id,
    fetch_content_by_collection_id,
    update_collection,
)


def is_valid_url(url):
    """A simple URL validation to ensure it starts with http:// or https://."""
    return isinstance(url, str) and re.match(r"^https?://", url)


def validate_collection_data(data):
    cleaned_data = {}
    errors = []

    if not data.get("name") or not isinstance(data["name"], str):
        errors.append("Name is required and must be a string.")
    else:
        cleaned_data["name"] = data["name"].strip()

    if not data.get("description") or not isinstance(data["description"], str):
        errors.append("Description is required and must be a string.")
    else:
        cleaned_data["description"] = data["description"].strip()

    if "featured_image" in data:
        if data["featured_image"]:
            if not isinstance(data["featured_image"], str):
                errors.append("Featured image must be a string.")
            else:
                featured_image = data["featured_image"].strip()
                if not is_valid_url(featured_image):
                    errors.append("Featured image must be a valid URL.")
                else:
                    cleaned_data["featured_image"] = featured_image

    if "assigned_teams" in data:
        if not isinstance(data["assigned_teams"], list) or not all(
            isinstance(team, str) for team in data["assigned_teams"]
        ):
            errors.append("Assigned teams must be a list of strings.")
        else:
            cleaned_data["assigned_teams"] = data["assigned_teams"]

    if "tags" in data:
        if not isinstance(data["tags"], list) or not all(
            isinstance(tag, str) for tag in data["tags"]
        ):
            errors.append("Tags must be a list of strings.")
        else:
            cleaned_data["tags"] = data["tags"]

    if "parent_id" in data:
        try:
            cleaned_data["parent_id"] = int(data["parent_id"])
        except (ValueError, TypeError):
            errors.append("Parent ID must be a valid integer.")

    return cleaned_data, errors


async def add_collection(data):
    cleaned_data, errors = validate_collection_data(data)
    if errors:
        return {"errors": errors}, 400
    return await insert_collection(cleaned_data)


async def get_collections():
    return await fetch_all_collections()


async def get_collection_by_id(id):
    collection = await fetch_collection_by_id(id)
    if collection is None:
        raise CollectionNotFoundError(f"Collection with ID {id} not found.")
    return collection


async def get_sub_collections_by_id(id):
    return await fetch_sub_collections_by_collection_id(id)


async def get_content_by_collection_id(id):
    return await fetch_content_by_collection_id(id)


async def update_collection_by_id(id, data):
    return await update_collection(id, data)
