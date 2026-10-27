FROM nginx:alpine

# Remove default nginx config and replace with Cloud Run config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static web files
COPY . /usr/share/nginx/html

# Clean up unwanted files from container image
RUN rm -f /usr/share/nginx/html/Dockerfile /usr/share/nginx/html/nginx.conf

# Cloud Run default port
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
