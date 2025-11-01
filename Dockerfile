# 使用官方Node.js镜像作为基础镜像
FROM node:20.19-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json（或yarn.lock）到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目的所有文件到工作目录
COPY . .

# 构建生产环境的代码
RUN npm run build:prod

# 使用Nginx镜像来提供静态文件
FROM nginx:alpine

# 复制构建好的静态文件到Nginx的默认静态文件目录
COPY --from=build /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=build /app/default.conf /etc/nginx/conf.d/

# 可选：复制自定义Nginx配置文件（如果需要）
# COPY nginx.conf /etc/nginx/nginx.conf

# 暴露80端口
EXPOSE 80

# 启动Nginx服务
CMD ["nginx", "-g", "daemon off;"]
