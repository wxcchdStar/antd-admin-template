FROM registry.cn-hangzhou.aliyuncs.com/tton/node-8.11.4-alpine:1.0.0
WORKDIR /app
RUN mkdir build
COPY ./build/ build/
EXPOSE 5000
CMD serve -s build