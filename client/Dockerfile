FROM node:20 AS build

ARG VITE_API_URL
ARG VITE_GEMINI_API_KEY
ARG VITE_SOCKET_API_URL

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

RUN echo "VITE_API_URL=${VITE_API_URL}" > .env
RUN echo "VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY}" > .env
RUN echo "VITE_SOCKET_API_URL=${VITE_SOCKET_API_URL}" > .env

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
