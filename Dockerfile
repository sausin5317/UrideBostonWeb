FROM nginx:alpine

# Remove default nginx config and replace with Cloud Run config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static web files
COPY . /usr/share/nginx/html

# Clean up unwanted files from container image
RUN rm -rf /usr/share/nginx/html/Dockerfile /usr/share/nginx/html/nginx.conf /usr/share/nginx/html/cloudbuild.yaml /usr/share/nginx/html/*.md /usr/share/nginx/html/*.ps1

# Cloud Run default port
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
