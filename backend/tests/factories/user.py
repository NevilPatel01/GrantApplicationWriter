import factory
from factory.declarations import SubFactory
from app.settings import TestSettings
from app.core.security import get_password_hash
from app.models.user import User
from tests.factories.base import BaseFactory
from tests.factories.organization import OrganizationFactory

class UserFactory(BaseFactory):
    class Meta:
        model = User

    username = factory.faker.Faker('email')
    hashed_password = factory.declarations.LazyFunction(
        lambda: get_password_hash(TestSettings.user_default_password)
    )
    organization_id = SubFactory(OrganizationFactory)


    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        if "password" in kwargs:
            kwargs["hashed_password"] = get_password_hash(kwargs.pop("password"))
        return super()._create(model_class, *args, **kwargs)


