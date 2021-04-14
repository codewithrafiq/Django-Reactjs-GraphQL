import graphene
from todo import schema


class Query(schema.Query, graphene.ObjectType):
    pass


class Mutation(schema.Mutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
