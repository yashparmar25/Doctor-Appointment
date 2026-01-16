# -------- Stage 1: Build --------
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# -------- Stage 2: Production --------
FROM node:18-alpine

WORKDIR /app
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 5174
CMD ["serve", "-s", "dist", "-l", "5174"]




# # -------- Stage 1: Install deps --------
# FROM node:18 AS deps

# WORKDIR /app
# COPY package*.json ./
# RUN npm install


# # -------- Stage 2: Runtime --------
# FROM node:18

# WORKDIR /app

# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# EXPOSE 5174

# CMD ["npm", "run", "dev", "--", "--host"]








# # admin/Dockerfile.admin
# FROM node:18

# WORKDIR /app
# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 5174
# CMD ["npm", "run", "dev", "--", "--host"]
