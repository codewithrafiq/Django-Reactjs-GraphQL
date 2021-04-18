import graphene
from .models import Todo
from graphene_django import DjangoObjectType, DjangoListField
from graphql_jwt.decorators import login_required
from django.contrib.auth import get_user_model


class TodoType(DjangoObjectType):
    class Meta:
        model = Todo
        # fields = ("id", "title", "date")


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()


class Query(graphene.ObjectType):
    todos = graphene.List(TodoType, id=graphene.Int())
    user = graphene.Field(UserType)

    @login_required
    def resolve_todos(self, info, id=None):
        user = info.context.user
        if id:
            return Todo.objects.filter(id=id)
        return Todo.objects.filter(user=user).order_by("-id")

    @login_required
    def resolve_user(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Login Required")
        return user


class CreateTodo(graphene.Mutation):
    todo = graphene.Field(TodoType)

    class Arguments:
        title = graphene.String(required=True)

    @login_required
    def mutate(self, info, title):
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Not Loged in ! Login Now")
        todo = Todo(user=user, title=title)
        todo.save()
        return CreateTodo(todo=todo)


class UpdateTodo(graphene.Mutation):
    todo = graphene.Field(TodoType)

    class Arguments:
        id = graphene.Int(required=True)
        title = graphene.String(required=True)

    @login_required
    def mutate(self, info, id, title):
        user = info.context.user
        todo = Todo.objects.get(id=id)
        if user != todo.user:
            raise Exception("It's Not Your Todo Data!!")
        todo.title = title
        todo.save()
        return UpdateTodo(todo=todo)


class DelateTodo(graphene.Mutation):
    message = graphene.String()

    class Arguments:
        id = graphene.Int(required=True)

    @login_required
    def mutate(self, info, id):
        user = info.context.user
        todo = Todo.objects.get(id=id)
        if user != todo.user:
            raise Exception("It's Not Your Todo !!")
        todo.delete()
        return DelateTodo(message=f"ID {id} id Delated")


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    def mutate(self, info, username, password):
        user = get_user_model()(username=username)
        user.set_password(password)
        user.save()
        return CreateUser(user=user)


class Mutation(graphene.ObjectType):
    create_todo = CreateTodo.Field()
    update_todo = UpdateTodo.Field()
    delate_todo = DelateTodo.Field()
    create_user = CreateUser.Field()
