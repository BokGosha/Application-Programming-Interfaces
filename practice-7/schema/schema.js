const grapiql = require("graphql");

const {
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
} = grapiql;

const books = [
    {
        id: "1",
        name: "Дюна",
        author: "Фрэнк Герберт",
        genreId: "1",
    },
    {
        id: "2",
        name: "Убийство в 'Восточном экспрессе'",
        author: "Агата Кристи",
        genreId: "2",
    },
    {
        id: "3",
        name: "Война и мир",
        author: "Лев Толстой",
        genreId: "3",
    },
];

const genres = [
    {
        id: "1",
        name: "Фантастика",
    },
    {
        id: "2",
        name: "Детектив",
    },
    {
        id: "3",
        name: "Драма",
    },
];

const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        author: { type: GraphQLString },
        genre: {
            type: GenreType,
            resolve(parent, args) {
                return genres.find((genre) => genre.id === parent.genreId);
            },
        },
    }),
});

const GenreType = new GraphQLObjectType({
    name: "Genre",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books.filter((book) => book.genreId === parent.id);
            },
        },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        info: {
            type: GraphQLString,
            resolve(parent, args) {
                return "Server is running";
            },
        },

        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return books.find((book) => book.id === args.id);
            },
        },

        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books;
            },
        },

        genre: {
            type: GenreType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return genres.find((genre) => genre.id === args.id);
            },
        },

        genres: {
            type: new GraphQLList(GenreType),
            resolve(parent, args) {
                return genres;
            },
        },
    },
});

const Mutations = new GraphQLObjectType({
    name: "Mutations",
    fields: {
        addGenre: {
            type: GenreType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                username: { type: new GraphQLNonNull(GraphQLString) },
                name: { type: GraphQLString },
                surname: { type: GraphQLString },
            },
            resolve(parent, args) {
                const arrLength = genres.push(args);
                return genres[arrLength - 1];
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutations,
});
