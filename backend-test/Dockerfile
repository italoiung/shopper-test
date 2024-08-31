FROM node:20.11.1-alpine as base

# Add package file
COPY package.json ./
COPY yarn.lock ./

# Install deps
RUN yarn install

# Copy source
COPY prisma ./prisma
COPY src ./src

# Copy config
COPY .env ./
COPY tsconfig.json ./

RUN npx prisma generate

# Build dist
RUN yarn build

# Start production image build
FROM node:20.11.1-alpine

# Copy node modules and build directory
COPY --from=base node_modules ./node_modules
COPY --from=base dist ./dist
COPY --from=base prisma ./prisma

COPY --from=base package.json ./

# Copy static files
COPY public dist/public

# Expose port 3000
EXPOSE 3000
CMD ["yarn", "migrate:start"]
