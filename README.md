# Taedl

_**Taedl**_ is a fast and lightweight report prototyping tool.

It is designed and developed with speed and simplicity being top priorities. It is not bloated, it is not a multi-tool and it does not require scripting. 

_**Taedl**_ is good at providing you with first insights into your relational database. It figures out the optimal way to join your tables, generates queries based on your drag-and-drop actions, and then displays results in meanungful form. 

Find out [more](https://taedl.io).

## Supported Databases

We are working to increase the number of supported vendors. Below is a currently supported list:

1. Postgresql (primarily tested with 10.4)
2. MySQL (tested with 8.0.13)
3. MS SQL Server (currently with some limitations - MS SQL Server Linux 2017)

## Hosted

Hosted [_**Taedl**_](https://app.taedl.io) is free, and you don't need to register to use it. 

## On premises

You can also run _**Taedl**_ locally:

1. Clone or download the project.
2. Install [npm](https://www.npmjs.com/) [Angular CLI](https://cli.angular.io/).
3. Install [Java 8](https://www.oracle.com/technetwork/java/index.html) and [maven](https://maven.apache.org/).
4. Navigate to `taedl/taedl-api` directory and execute `mvn clean install`.   
5. Navigate to a target directory and start the server by executing `./taedl-api-0.1-RC1.jar`.
6. Navigate to `taedl/taedl` directory and execute `npm install`.
7. Once ready, execute `ng serve` to start the front end application.

## Feature Requests & Bug Reports

You can help by suggesting features, reporting bugs, or just providing your feedback using [GitHub Issues](https://github.com/taedl/taedl/issues).

## Contributing

1. Fork the project.
2. Create a branch for your new feature.
3. Write tests and code that makes the tests pass.
4. Submit a pull request. 

## License:
[MIT](https://github.com/taedl/taedl/blob/master/LICENSE)