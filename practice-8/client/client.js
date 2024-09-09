const PROTO_PATH = "./productlist.proto";

const grps = require("@grpc/grpc-js");

const protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

const ProductService =
    grps.loadPackageDefinition(packageDefinition).ProductService;

const client = new ProductService(
    "localhost:50051",

    grps.credentials.createInsecure()
);

module.exports = client;
