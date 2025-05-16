const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const CourseService = require('./courseService');

const packageDef = protoLoader.loadSync('course.proto', {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const coursePackage = grpcObj.course;

const server = new grpc.Server();

server.addService(coursePackage.CourseService.service, CourseService);

const PORT = 50051;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`CourseService gRPC en ligne sur le port ${PORT}`);
  server.start();
});
