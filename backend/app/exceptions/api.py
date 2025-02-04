class UserNotVerified(Exception):
    """Custom exception raised when a User is not email verified."""

    pass


class CollectionNotFoundError(Exception):
    """Custom exception raised when a collection is not found."""

    pass


class RoleNotFoundError(Exception):
    """Custom exception raised when a Role is not found."""

    pass


class TeamNotFoundError(Exception):
    """Custom exception raised when a Team is not found."""

    pass
