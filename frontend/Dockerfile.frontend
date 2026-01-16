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

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]















# # -------- Stage 1: Install deps --------
# FROM node:18 AS deps

# WORKDIR /app
# COPY package*.json ./
# RUN npm install   # installs dev deps (vite)


# # -------- Stage 2: Runtime --------
# FROM node:18

# WORKDIR /app

# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# EXPOSE 5173

# CMD ["npm", "run", "dev", "--", "--host"]



# # frontend/Dockerfile.frontend
# FROM node:18

# WORKDIR /app
# COPY package*.json ./
# RUN npm install

# COPY . .

# # Expose port (change if you're using Vite/Next.js)
# EXPOSE 5173

# # Start dev server
# CMD ["npm", "run", "dev", "--", "--host"]
