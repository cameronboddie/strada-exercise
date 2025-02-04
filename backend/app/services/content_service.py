from app.repositories.content_repo import insert_content, fetch_all_content
import datetime
import re

from app.services.collections_service import (
    get_collection_by_id,
    update_collection_by_id,
)

VALID_DIMENSIONS_UNITS = {"Inches", "Centimeters"}
VALID_CONDITIONS = {"Undamaged", "Damaged"}
VALID_MEDIUMS = {"Art", "Photography"}


def is_valid_url(url):
    """A basic check to see if the URL starts with http:// or https://."""
    return isinstance(url, str) and re.match(r"^https?://", url)


def validate_content_data(data):
    errors = []
    cleaned_data = {}

    if not data.get("title") or not isinstance(data["title"], str):
        errors.append("Title is required and must be a string.")
    else:
        cleaned_data["title"] = data["title"].strip()

    if not data.get("artist") or not isinstance(data["artist"], str):
        errors.append("Artist is required and must be a string.")
    else:
        cleaned_data["artist"] = data["artist"].strip()

    if not data.get("medium") or not isinstance(data["medium"], str):
        errors.append("Medium is required and must be a string.")
    else:
        medium = data["medium"].strip()
        if medium not in VALID_MEDIUMS:
            errors.append("Medium must be either 'Art' or 'Photography'.")
        else:
            cleaned_data["medium"] = medium

    current_year = datetime.datetime.now().year
    try:
        year = int(data.get("year", 0))
        if not (1500 <= year <= current_year):
            errors.append(f"Year must be between 1500 and {current_year}.")
        else:
            cleaned_data["year"] = year
    except ValueError:
        errors.append("Year must be a valid integer.")

    if not data.get("image_url") or not isinstance(data["image_url"], str):
        errors.append("Image URL is required and must be a string.")
    else:
        image_url = data["image_url"].strip()
        if not is_valid_url(image_url):
            errors.append("Image URL must be a valid URL.")
        else:
            cleaned_data["image_url"] = image_url

    for field in ["height", "width", "depth"]:
        if field in data and data[field] is not None:
            try:
                value = float(data[field])
                if value <= 0:
                    errors.append(f"{field.capitalize()} must be a positive number.")
                else:
                    cleaned_data[field] = value
            except (ValueError, TypeError):
                errors.append(f"{field.capitalize()} must be a valid number.")

    # Validate Dimensions Unit (if provided)
    if "dimensions_unit" in data:
        if data["dimensions_unit"] not in VALID_DIMENSIONS_UNITS:
            errors.append("Dimensions unit must be 'Inches' or 'Centimeters'.")
        else:
            cleaned_data["dimensions_unit"] = data["dimensions_unit"]

    # Validate Price (if provided)
    if "price" in data:
        try:
            price = float(data["price"])
            if price < 0:
                errors.append("Price must be a non-negative number.")
            else:
                cleaned_data["price"] = price
        except (ValueError, TypeError):
            errors.append("Price must be a valid number.")

    # Validate Condition (if provided)
    if "condition" in data:
        if data["condition"] not in VALID_CONDITIONS:
            errors.append("Condition must be 'Undamaged' or 'Damaged'.")
        else:
            cleaned_data["condition"] = data["condition"]

    # Validate Edition Number (if present, must be alphanumeric)
    if "edition_number" in data:
        if (
            not isinstance(data["edition_number"], str)
            or not data["edition_number"].isalnum()
        ):
            errors.append("Edition number must be an alphanumeric string.")
        else:
            cleaned_data["edition_number"] = data["edition_number"]

    # Validate Description (optional, limited to 2000 characters)
    if "description" in data:
        if not isinstance(data["description"], str) or len(data["description"]) > 2000:
            errors.append("Description must be a string with at most 2000 characters.")
        else:
            cleaned_data["description"] = data["description"].strip()

    # Validate Collection ID (required field)
    if "collection_id" not in data:
        errors.append("Collection ID is required.")
    else:
        try:
            collection_id = int(data["collection_id"])
            cleaned_data["collection_id"] = collection_id
        except (ValueError, TypeError):
            errors.append("Collection ID must be a valid integer.")

    return cleaned_data, errors


async def add_content(data):
    cleaned_data, errors = validate_content_data(data)
    if errors:
        return {"errors": errors}, 400
    response = await insert_content(cleaned_data)
    collection = await get_collection_by_id(response["collection_id"])
    if not collection["featured_image"]:
        await update_collection_by_id(response["collection_id"], {"featured_image": response["image_url"]})
    return response


async def get_all_content():
    return await fetch_all_content()
