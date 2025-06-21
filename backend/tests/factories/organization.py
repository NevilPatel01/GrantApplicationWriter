import factory
from app.models.organization import Organization
from tests.factories.base import BaseFactory


class OrganizationFactory(BaseFactory):
    class Meta:
        model = Organization


    organization_name = factory.faker.Faker("word")
    address = factory.faker.Faker("address")
    contact_info = factory.faker.Faker("phone_number")


    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        return super()._create(model_class, *args, **kwargs)


