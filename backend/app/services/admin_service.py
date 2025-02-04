from firebase_admin import auth

from backend.app.exceptions.api import UserNotVerified, RoleNotFoundError
from backend.app.repositories.admin_repo import (
    fetch_roles_by_name,
    fetch_roles_permissions,
    fetch_teams_by_name,
)


async def validate_set_user_roles_data(roles):
    model_roles = await fetch_roles_by_name(roles)
    if set(roles) != {role["name"].lower() for role in model_roles}:
        raise RoleNotFoundError(f"Not all roles could not be found in RBAC Model")


async def validate_set_user_team_data(teams):
    model_teams = await fetch_teams_by_name(teams)

    if set(teams) != {team["name"].lower() for team in model_teams}:
        raise RoleNotFoundError("Not all Teams could be found in RBAC Model")


async def update_firebase_user(data):
    user_email, roles, teams = data["user_email"], data["roles"], data["teams"]
    permissions = []
    user = auth.get_user_by_email(user_email)

    if not user.email_verified:
        raise UserNotVerified

    if roles:
        await validate_set_user_roles_data(roles)
        permissions = await fetch_roles_permissions(roles)

    if teams:
        await validate_set_user_team_data(teams)

    auth.set_custom_user_claims(
        user.uid, {"roles": roles, "teams": teams, "permissions": permissions}
    )

    return {
        "message": f"User {user_email} updated successfully.",
        "user_id": user.uid,
        "roles": roles,
        "permissions": permissions,
        "teams": teams,
    }
