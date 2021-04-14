import graphene
from .models import Todo
from graphene_django import DjangoObjectType, DjangoListField


class TodoType(DjangoObjectType):
    class Meta:
        model = Todo
        fields = ("id", "title", "date")


class Query(graphene.ObjectType):
    todos = DjangoListField(TodoType)

    def resolve_todos(self, info):
        return Todo.objects.all()
