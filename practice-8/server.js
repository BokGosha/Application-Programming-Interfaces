const PROTO_PATH = "./productlist.proto";

var grpc = require("@grpc/grpc-js");

var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

var productProto = grpc.loadPackageDefinition(packageDefinition);

const { v4: uuidv4 } = require("uuid");

const server = new grpc.Server();

const products = [
    {
        id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
        name: "БигХит Комбо",
        quantity: 3,
        acquired: true,
    },
    {
        id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
        name: "Двойной чизбургер",
        quantity: 20,
        acquired: false,
    },
];

server.addService(productProto.ProductService.service, {
    getAll: (_, callback) => {
        callback(null, { products: products });
    },

    get: (call, callback) => {
        let product = products.find((n) => n.id == call.request.id);

        if (product) {
            callback(null, product);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Не найдено",
            });
        }
    },

    insert: (call, callback) => {
        let product = call.request;

        product.id = uuidv4();

        products.push(product);

        callback(null, product);
    },

    update: (call, callback) => {
        let existingProduct = products.find((n) => n.id == call.request.id);

        if (existingProduct) {
            existingProduct.name = call.request.name;
            existingProduct.quantity = call.request.quantity;
            existingProduct.acquired = call.request.acquired;

            callback(null, existingProduct);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Не найдено",
            });
        }
    },

    remove: (call, callback) => {
        let existingProductIndex = products.findIndex(
            (n) => n.id == call.request.id
        );

        if (existingProductIndex != -1) {
            products.splice(existingProductIndex, 1);
            callback(null, {});
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Не найдено",
            });
        }
    },
});

server.bindAsync(
    "127.0.0.1:50051",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        console.log("Сервер запущен по адресу http://127.0.0.1:50051");
    }
);
