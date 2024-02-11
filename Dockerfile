FROM nodejs:20-alpine

RUN npm install -g pnpm

# Set the working directory
WORKDIR /home/app

# Copy the package.json file
COPY package.json .

COPY pnpm-lock.yaml .

# install deps
RUN pnpm install --frozen-lockfile

# set environment variables
# ENV

# Copy the rest of the files
COPY . .

# Build the app
RUN pnpm build

# Expose the port
EXPOSE 4000



# Start the app
CMD ["pnpm", "start"]
