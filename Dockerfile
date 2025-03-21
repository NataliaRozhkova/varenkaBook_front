# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:latest  as build

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app


# Install all the dependencies
RUN npm cache clean --force
RUN rm -rf node_modules
RUN npm install  -g npm@latest

COPY ./ /usr/local/app/

RUN npm install

# Generate the build of the application
RUN npm run build --prod

# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/varenka_front /usr/share/nginx/html

 # Expose port 80
EXPOSE 80  443


