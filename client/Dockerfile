FROM node:20 AS build

# Define a build argument to receive the content of ai-instructions.js
ARG AI_INSTRUCTIONS_CONTENT 

WORKDIR /app

# Ensure the /app/src/lib directory exists 
RUN mkdir -p src/lib 

RUN echo "$AI_INSTRUCTIONS_CONTENT" > src/lib/ai-instructions.js 

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx

COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]