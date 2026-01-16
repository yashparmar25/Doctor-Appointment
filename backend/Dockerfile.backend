# -------- Stage 1: Build --------
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .


# -------- Stage 2: Production --------
FROM node:18-alpine

WORKDIR /app

# Install only prod deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy only required folders
COPY --from=builder /app/server.js ./
COPY --from=builder /app/config ./config
COPY --from=builder /app/controllers ./controllers
COPY --from=builder /app/middlewares ./middlewares
COPY --from=builder /app/models ./models
COPY --from=builder /app/routes ./routes

EXPOSE 4000

CMD ["npm", "start"]



# # -------- Stage 1: Build --------
# FROM node:18 AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# # (Optional) If you use TypeScript or build step
# # RUN npm run build


# # -------- Stage 2: Production --------
# FROM node:18-alpine

# WORKDIR /app

# # Copy only required files
# COPY package*.json ./
# RUN npm install --omit=dev

# # Copy app from builder
# COPY --from=builder /app ./

# EXPOSE 4000

# CMD ["npm", "start"]



# # Backend Node.js API
# FROM node:18-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 4000

# CMD ["npm","start"]
